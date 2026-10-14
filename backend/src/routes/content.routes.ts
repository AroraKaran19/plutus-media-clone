import { Router } from "express";
import { getContent, patchContentArea } from "../controllers/content.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

// Public: the site reads this.
router.get("/", getContent);
router.patch("/:area", requireAuth, patchContentArea);

export default router;
