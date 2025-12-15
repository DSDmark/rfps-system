import {
  createVendor,
  deleteVendor,
  getAllVendors,
} from "@/controllers/index.js";
import express, { Router } from "express";

const router: Router = express.Router();

router.delete("/:id", deleteVendor);
router.get("/", getAllVendors);
router.post("/", createVendor);

export default router;
