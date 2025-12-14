import { ProposalModels, VendorModels } from "@/models/index.js";
import "dotenv/config";
import Imap from "imap";
import { Types } from "mongoose";
import cron from "node-cron";
import nodemailer from "nodemailer";
import puppeteer from "puppeteer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const generatePDF = async (html: string): Promise<Buffer> => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfData = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    return Buffer.from(pdfData);
  } finally {
    await browser.close();
  }
};

export const sendRFP = async (
  rfp: any,
  vendorEmails: string[],
): Promise<void> => {
  const html = `
    <h1>RFP: ${rfp.title}</h1>
    <p>${rfp.description}</p>
    <p><strong>RFP ID:</strong> ${rfp._id}</p>
  `;

  const pdfBuffer = await generatePDF(html);

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: vendorEmails.join(", "),
    subject: `RFP - ${rfp.title} (ID: ${rfp._id})`,
    html,
    attachments: [{ filename: "rfp.pdf", content: pdfBuffer }],
  });

  rfp.status = "sent";
  rfp.vendorIds = vendorEmails;
  await rfp.save();
};

const extractVendorEmail = (fromHeader: string): string | null => {
  if (!fromHeader) return null;
  // Try formats: "Name <email@example.com>" or just "email@example.com"
  const angleMatch = fromHeader.match(/<([^>]+)>/);
  if (angleMatch) return angleMatch[1].toLowerCase().trim();
  const addrMatch = fromHeader.match(/([^\s<]+@[^\s>]+)/);
  return addrMatch ? addrMatch[1].toLowerCase().trim() : null;
};

const extractRfpId = (text: string): string | null => {
  // Matches "RFP ID: 693d86b9d9c6df809d825add" or "RFP ID 693d86b9d9c6df809d825add"
  const m = text.match(/RFP ID[:\s]*([a-f0-9]{24})/i);
  return m ? m[1] : null;
};

const extractLine = (text: string, label: string) => {
  const re = new RegExp(`${label}:\\s*(.+)`, "i");
  const m = text.match(re);
  return m ? m[1].trim() : "";
};

const parseProposalFromBody = (body: string) => {
  const pricing: { item: string; price: number; quantity: number }[] = [];

  // Example lines we expect:
  // - Laptop (16GB RAM): 20 units @ $1,200 each
  // - Monitor (27-inch display): 15 units @ $300 each
  // This regex aims to be reasonably flexible.
  const priceRegex =
    /-\s*([^\n():]+)(?:\([^\)]*\))?:\s*([0-9,]+)\s*units\s*@\s*\$([0-9,\.]+)/gi;

  let match;
  while ((match = priceRegex.exec(body))) {
    const item = (match[1] || "").trim();
    const quantity = Number((match[2] || "0").replace(/,/g, ""));
    const price = Number((match[3] || "0").replace(/,/g, ""));
    if (item && !Number.isNaN(quantity) && !Number.isNaN(price)) {
      pricing.push({ item, price, quantity });
    }
  }

  // fallback: try another more permissive pattern if none found
  if (pricing.length === 0) {
    const altRegex =
      /-\s*([^\n:]+):\s*\$?([0-9,\.]+)\s*(?:each)?(?:\s*\/\s*unit)?(?:\s*\(?\s*qty\s*[:=]\s*([0-9,]+)\)?)?/gi;
    while ((match = altRegex.exec(body))) {
      const item = (match[1] || "").trim();
      const price = Number((match[2] || "0").replace(/,/g, ""));
      const quantity = Number((match[3] || "0").replace(/,/g, "")) || 1;
      if (item && !Number.isNaN(price)) {
        pricing.push({ item, price, quantity });
      }
    }
  }

  const terms = extractLine(body, "Terms");
  const conditions = extractLine(body, "Conditions");
  const deliveryEstimate =
    extractLine(body, "Delivery Estimate") || extractLine(body, "Delivery");

  return { pricing, terms, conditions, deliveryEstimate };
};

// -----------------------------
// IMAP polling + model saving
// -----------------------------

cron.schedule("*/30 * * * * *", () => {
  console.log("📧 Polling IMAP...");

  const imap = new Imap({
    user: process.env.IMAP_USER!,
    password: process.env.IMAP_PASS!,
    host: "imap.gmail.com",
    port: 993,
    tls: true,
    tlsOptions: { rejectUnauthorized: false },
    authTimeout: 15000,
    connTimeout: 15000,
  });

  imap.once("ready", () => {
    imap.openBox("INBOX", false, (err) => {
      if (err) {
        console.error("openBox error", err);
        return imap.end();
      }

      imap.search(["UNSEEN"], (err, results) => {
        if (err) {
          console.error("IMAP search error", err);
          return imap.end();
        }
        if (!results || results.length === 0) {
          return imap.end();
        }

        console.log("📬 Found mails:", results.length);

        const fetcher = imap.fetch(results, {
          bodies: ["HEADER.FIELDS (FROM SUBJECT)", "TEXT"],
          struct: true,
        });

        fetcher.on("message", (msg) => {
          let body = "";
          let subject = "";
          let from = "";
          let uid: number | undefined;

          msg.on("attributes", (attrs: any) => {
            uid = attrs.uid;
          });

          msg.on("body", (stream, info) => {
            let buffer = "";
            stream.on("data", (chunk) => {
              buffer += chunk.toString("utf8");
            });
            stream.once("end", () => {
              if (info.which && info.which.toUpperCase().includes("HEADER")) {
                const parsed = Imap.parseHeader(buffer);
                subject = parsed.subject?.[0] || "";
                from = parsed.from?.[0] || "";
              } else {
                body += buffer;
              }
            });
          });

          msg.once("end", async () => {
            try {
              if (!uid) return;

              // console.log("📨 SUBJECT:", subject);

              if (!/RFP/i.test(subject)) {
                imap.addFlags(uid, "\\Seen", () => {});
                return;
              }

              const content = `${subject}\n${body}`;
              const rfpId = extractRfpId(content);
              if (!rfpId) {
                imap.addFlags(uid, "\\Seen", () => {});
                return;
              }

              const vendorEmail = extractVendorEmail(from);
              if (!vendorEmail) {
                imap.addFlags(uid, "\\Seen", () => {});
                return;
              }

              let vendor = await VendorModels.findOne({
                email: vendorEmail,
              }).exec();

              if (!vendor) {
                vendor = await VendorModels.create({
                  name: vendorEmail.split("@")[0],
                  email: vendorEmail,
                  contactInfo: "",
                  rfpAssignments: [new Types.ObjectId(rfpId)],
                });
              } else {
                const assigned = (vendor.rfpAssignments || []).some(
                  (id: any) => String(id) === String(rfpId),
                );
                if (!assigned) {
                  vendor.rfpAssignments.push(new Types.ObjectId(rfpId));
                  await vendor.save();
                }
              }

              const exists = await ProposalModels.findOne({
                rfp: new Types.ObjectId(rfpId),
                vendor: vendor._id,
              }).exec();

              if (!exists) {
                const parsed = parseProposalFromBody(body);

                await ProposalModels.create({
                  rfp: new Types.ObjectId(rfpId),
                  vendor: vendor._id,
                  pricing: parsed.pricing.map((p) => ({
                    item: p.item,
                    price: p.price,
                    quantity: p.quantity,
                  })),
                  terms: parsed.terms || "",
                  conditions: parsed.conditions || "",
                  deliveryEstimate: parsed.deliveryEstimate || "",
                  score: 0,
                  reasoning: "",
                });

                console.log(
                  `✅ Proposal saved | RFP ${rfpId} | ${vendorEmail}`,
                );
              } else {
                console.log("⚠️ Proposal already exists");
              }

              imap.addFlags(uid, "\\Seen", () => {});
            } catch (err) {
              console.error("Email processing error:", err);
              if (uid) imap.addFlags(uid, "\\Seen", () => {});
            }
          });
        });

        fetcher.once("end", () => {
          console.log("✅ Done processing mails");
          imap.end();
        });

        fetcher.once("error", (err) => {
          console.error("Fetch error", err);
          imap.end();
        });
      });
    });
  });

  imap.once("error", (err) => {
    console.error("IMAP error", err);
  });

  imap.connect();
});
