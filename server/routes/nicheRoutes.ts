import { Router } from "express";
import { createNiche, deleteNiche, listNiches, updateNiche } from "../controllers/nicheController";
import { requireAuth } from "../middleware/auth";
const router = Router(); router.use(requireAuth); router.route("/").get(listNiches).post(createNiche); router.route("/:id").patch(updateNiche).delete(deleteNiche); export default router;
