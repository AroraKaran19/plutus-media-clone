import { Router } from "express";
import { changePassword, updateProfile } from "../controllers/account.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.use(requireAuth);

router.patch("/", updateProfile);
router.patch("/password", changePassword);

export default router;
