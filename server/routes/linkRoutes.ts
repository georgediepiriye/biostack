import { Router } from "express";
import { createLink, deleteLink, listLinks, updateLink } from "../controllers/linkController";
import { requireAuth } from "../middleware/auth";
const router = Router(); router.use(requireAuth); router.route("/").get(listLinks).post(createLink); router.route("/:id").patch(updateLink).delete(deleteLink); export default router;
