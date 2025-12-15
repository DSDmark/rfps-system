import express, { Router } from "express";
import proposalsRoutes from "./proposal.route.js";
import rfpsRoutes from "./rfp.route.js";
import vendorsRoutes from "./vendor.route.js";

const router: Router = express.Router();

router.use("/rfps", rfpsRoutes);
router.use("/vendors", vendorsRoutes);
router.use("/proposals", proposalsRoutes);

export default router;
