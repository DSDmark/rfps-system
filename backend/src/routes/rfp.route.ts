import {
  createRFP,
  getAllRFPs,
  getRFPById,
  sendRFPToVendors,
} from "@/controllers/index.js";
import express, { Router } from "express";

const router: Router = express.Router();

router.post("/create", createRFP);
router.get("/:id", getRFPById);
router.get("/", getAllRFPs);
router.post("/:id/send", sendRFPToVendors);

export default router;
