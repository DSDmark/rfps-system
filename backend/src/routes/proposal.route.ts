import {
  getAllProposals,
  getProposalsByRfp,
  parseProposalFromEmail,
} from "@/controllers/proposal.controller.js";
import express, { Router } from "express";

const router: Router = express.Router();

router.get("/", getAllProposals);
router.get("/:rfpId", getProposalsByRfp);
router.post("/parse", parseProposalFromEmail);

export default router;
