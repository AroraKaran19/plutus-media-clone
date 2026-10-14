import { Router } from "express";
import { destroyMedia, signUpload } from "../controllers/media.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.use(requireAuth);

router.post("/signature", signUpload);
router.delete("/", destroyMedia);

export default router;
