import { SERVER_ERRORS } from "@/constants/common.js";
import { ProposalModels, RfpModels } from "@/models/index.js";
import {
  compareProposals,
  parseProposal,
} from "@/services/groqService.service.js";
import { sendResponseUtil } from "@/utils/response.js";
import type { Request, Response } from "express";

export const getProposalsByRfp = async (req: Request, res: Response) => {
  try {
    const { rfpId } = req.params;

    const rfp = await RfpModels.findById(rfpId).lean();
    if (!rfp) {
      return sendResponseUtil(res, 404, "RFP not found");
    }

    const proposals = await ProposalModels.find({ rfp: rfpId })
      .populate("vendor")
      .lean();

    let comparison = null;
    if (proposals.length > 1) {
      comparison = await compareProposals(proposals, rfpId);
    }

    sendResponseUtil(res, 200, "Proposals fetched successfully", {
      proposals,
      comparison,
    });
  } catch (error) {
    console.error("Error fetching proposals:", error);
    sendResponseUtil(res, 500, SERVER_ERRORS.internalServer);
  }
};

export const parseProposalFromEmail = async (req: Request, res: Response) => {
  try {
    const { emailBody, rfpId } = req.body;

    if (!emailBody || !rfpId) {
      return sendResponseUtil(res, 400, "Email body and RFP ID are required");
    }

    const parsed: any = await parseProposal(emailBody, rfpId);

    const proposal = await ProposalModels.create({
      rfp: rfpId,
      vendor: parsed?.vendor ?? undefined,
      ...parsed,
    });

    sendResponseUtil(res, 201, "Proposal parsed successfully", proposal);
  } catch (error) {
    console.error("Error parsing proposal:", error);
    sendResponseUtil(res, 500, SERVER_ERRORS.internalServer);
  }
};

export const getAllProposals = async (_req: Request, res: Response) => {
  try {
    const proposals = await ProposalModels.find()
      .populate("rfp vendor")
      .sort({ createdAt: -1 })
      .lean();

    sendResponseUtil(res, 200, "Proposals fetched successfully", proposals);
  } catch (error) {
    console.error("Error listing proposals:", error);
    sendResponseUtil(res, 500, SERVER_ERRORS.internalServer);
  }
};
