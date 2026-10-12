import { Router } from "express";
import { env } from "../config/env";

const router = Router();

router.get("/", (_req, res) => {
  res.json({ success: true, message: `Plutus Media API v${env.VERSION}` });
});

export default router;
