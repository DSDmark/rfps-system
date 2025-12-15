import { RfpModels } from "@/models/index.js";
import "dotenv/config";
import Groq from "groq-sdk";
import { Types } from "mongoose";

const groq = new Groq({
  apiKey: `${process.env.GROQ_API_KEY}`,
});

export interface RFPItem {
  name: string;
  quantity: number;
  specs: string;
}

export interface GeneratedRFP {
  title: string;
  description: string;
  items: RFPItem[];
  budget: number;
  deliveryTimeline: string;
  paymentTerms: string;
  warranty: string;
}

export interface ParsedProposal {
  pricing: {
    item: string;
    price: number;
    quantity?: number;
  }[];
  terms?: string;
  conditions?: string;
  deliveryEstimate?: string;
  score?: number;
  reasoning?: string;
}

export interface ProposalComparisonResult {
  summary: string;
  recommendation: {
    vendor: string;
    why: string;
  };
  scores: Record<string, number>;
}

const parseJSON = <T>(content: string): T => {
  try {
    return JSON.parse(content);
  } catch {
    throw new Error("Invalid JSON returned from Groq");
  }
};

// Generate RFP from natural language
export const generateRFP = async (
  description: string,
): Promise<GeneratedRFP> => {
  const prompt = `
Turn this natural language into a structured RFP JSON:
"${description}"

Output ONLY valid JSON in this format:
{
  "title": string,
  "description": string,
  "items": [{ "name": string, "quantity": number, "specs": string }],
  "budget": number,
  "deliveryTimeline": string,
  "paymentTerms": string,
  "warranty": string
}
`;

  const response = await groq.chat.completions.create({
    model: "openai/gpt-oss-120b",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.1,
  });

  return parseJSON<GeneratedRFP>(response.choices[0].message?.content || "{}");
};

// Parse proposal from vendor email
export const parseProposal = async (
  emailBody: string,
  rfpId: Types.ObjectId | string,
): Promise<ParsedProposal> => {
  const rfp = await RfpModels.findById(rfpId).lean();
  if (!rfp) throw new Error("RFP not found");

  const extractPrompt = `
Extract proposal details from this email:
"${emailBody}"

Reference RFP:
${JSON.stringify(rfp)}

Output ONLY valid JSON:
{
  "pricing": [{ "item": string, "price": number, "quantity": number }],
  "terms": string,
  "conditions": string,
  "deliveryEstimate": string
}
`;

  const extractResponse = await groq.chat.completions.create({
    model: "openai/gpt-oss-120b",
    messages: [{ role: "user", content: extractPrompt }],
    temperature: 0.1,
  });

  const extracted = parseJSON<ParsedProposal>(
    extractResponse.choices[0].message?.content || "{}",
  );

  const scorePrompt = `
Score this proposal from 0 to 100 against the RFP.
Factors:
- Price within budget
- Terms alignment
- Delivery under 30 days

Explain your reasoning.

Output ONLY JSON:
{
  "score": number,
  "reasoning": string
}
`;

  const scoreResponse = await groq.chat.completions.create({
    model: "openai/gpt-oss-120b",
    messages: [{ role: "user", content: scorePrompt }],
    temperature: 0.1,
  });

  const scoreData = parseJSON<{ score: number; reasoning: string }>(
    scoreResponse.choices[0].message?.content || "{}",
  );

  return {
    ...extracted,
    ...scoreData,
  };
};

export const compareProposals = async (
  proposals: ParsedProposal[],
  rfpId: Types.ObjectId | string,
): Promise<ProposalComparisonResult> => {
  const rfp = await RfpModels.findById(rfpId).lean();
  if (!rfp) throw new Error("RFP not found");

  const prompt = `
Compare these proposals:
${JSON.stringify(proposals)}

Against RFP:
${JSON.stringify(rfp)}

Output ONLY valid JSON:
{
  "summary": string,
  "recommendation": {
    "vendor": string,
    "why": string
  },
  "scores": { "vendorId": number }
}
`;

  const response = await groq.chat.completions.create({
    model: "openai/gpt-oss-120b",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.1,
  });

  return parseJSON<ProposalComparisonResult>(
    response.choices[0].message?.content || "{}",
  );
};
