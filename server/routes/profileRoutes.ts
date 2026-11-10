import { Router } from "express";
import { currentProfile, publicClick, publicNiche, publicNicheByShareSlug, publicProfile, updateProfile } from "../controllers/profileController";
import { requireAuth } from "../middleware/auth";
const router = Router(); router.get("/me/profile", requireAuth, currentProfile); router.patch("/me/profile", requireAuth, updateProfile); router.post("/links/:id/click", publicClick); router.get("/n/:shareSlug", publicNicheByShareSlug); router.get("/:username/n/:slug", publicNiche); router.get("/:username", publicProfile); export default router;
