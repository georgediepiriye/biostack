import { Router } from "express";
import { cloudinarySignature } from "../controllers/uploadController";
import { requireAuth } from "../middleware/auth";

const router = Router();
router.post("/cloudinary-signature", requireAuth, cloudinarySignature);
export default router;
