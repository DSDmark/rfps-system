import { SERVER_ERRORS } from "@/constants/index.js";
import { RfpModels } from "@/models/index.js";
import { generateRFP } from "@/services/groqService.service.js";
import { sendResponseUtil } from "@/utils/index.js";
import type { Request, Response } from "express";

export const createRFP = async (req: Request, res: Response) => {
  try {
    const { description } = req.body;
    if (!description) {
      return sendResponseUtil(res, 400, "Description is required");
    }

    const rfpData = await generateRFP(description);
    const rfp = new RfpModels(rfpData);
    await rfp.save();

    sendResponseUtil(res, 201, "RfpModels created successfully", rfp);
  } catch (error) {
    console.error("Error creating RfpModels:", error);
    sendResponseUtil(res, 500, SERVER_ERRORS.internalServer);
  }
};

export const getRFPById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const rfp = await RfpModels.findById(id).populate("proposals");
    if (!rfp) {
      return sendResponseUtil(res, 404, "RfpModels not found");
    }

    sendResponseUtil(res, 200, "RfpModels fetched successfully", rfp);
  } catch (error) {
    console.error("Error fetching RfpModels:", error);
    sendResponseUtil(res, 500, SERVER_ERRORS.internalServer);
  }
};

export const getAllRFPs = async (_: Request, res: Response) => {
  try {
    const rfps = await RfpModels.find().sort({ createdAt: -1 });
    sendResponseUtil(res, 200, "RFPs fetched successfully", rfps);
  } catch (error) {
    console.error("Error listing RFPs:", error);
    sendResponseUtil(res, 500, SERVER_ERRORS.internalServer);
  }
};
