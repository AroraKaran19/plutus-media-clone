import { Router } from "express";
import { env } from "../config/env";
import accountRoutes from "./account.routes";
import authRoutes from "./auth.routes";
import contentRoutes from "./content.routes";
import mediaRoutes from "./media.routes";

const router = Router();

router.get("/", (_req, res) => {
  res.json({ success: true, message: `Plutus Media API v${env.VERSION}` });
});

router.use("/auth", authRoutes);
router.use("/account", accountRoutes);
router.use("/content", contentRoutes);
router.use("/media", mediaRoutes);

export default router;
