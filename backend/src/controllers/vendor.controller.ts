import { SERVER_ERRORS } from "@/constants/common.js";
import { RfpModels, VendorModels } from "@/models/index.js";
import { sendRFP } from "@/services/index.js";
import { sendResponseUtil } from "@/utils/response.js";
import type { Request, Response } from "express";

export const sendRFPToVendors = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { vendorIds } = req.body;

    if (!Array.isArray(vendorIds) || vendorIds.length === 0) {
      return sendResponseUtil(res, 400, "Vendor IDs are required");
    }

    const rfp = await RfpModels.findById(id);
    if (!rfp) {
      return sendResponseUtil(res, 404, "RfpModels not found");
    }

    const vendors = await VendorModels.find({ _id: { $in: vendorIds } });
    const vendorEmails = vendors.map((v) => v.email);

    await sendRFP(rfp, vendorEmails);

    sendResponseUtil(res, 200, "RfpModels sent successfully", {
      sentTo: vendorEmails,
    });
  } catch (error) {
    console.error("Error sending RfpModels:", error);
    sendResponseUtil(res, 500, SERVER_ERRORS.internalServer);
  }
};

export const getAllVendors = async (_req: Request, res: Response) => {
  try {
    const vendors = await VendorModels.find().sort({ name: 1 }).lean();
    sendResponseUtil(res, 200, "Vendors fetched successfully", vendors);
  } catch (error) {
    console.error("Error fetching vendors:", error);
    sendResponseUtil(res, 500, SERVER_ERRORS.internalServer);
  }
};

export const createVendor = async (req: Request, res: Response) => {
  try {
    const { name, email, contactInfo } = req.body;

    if (!name || !email) {
      return sendResponseUtil(res, 400, "Name and email are required");
    }

    const existingVendor = await VendorModels.findOne({ email });
    if (existingVendor) {
      return sendResponseUtil(
        res,
        400,
        "Vendor with this email already exists",
      );
    }

    const vendor = await VendorModels.create({
      name,
      email,
      contactInfo,
    });

    sendResponseUtil(res, 201, "Vendor created successfully", vendor);
  } catch (error) {
    console.error("Error creating vendor:", error);
    sendResponseUtil(res, 500, SERVER_ERRORS.internalServer);
  }
};

export const deleteVendor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const vendor = await VendorModels.findByIdAndDelete(id);
    if (!vendor) {
      return sendResponseUtil(res, 404, "Vendor not found");
    }

    sendResponseUtil(res, 200, "Vendor deleted successfully");
  } catch (error) {
    console.error("Error deleting vendor:", error);
    sendResponseUtil(res, 500, SERVER_ERRORS.internalServer);
  }
};
