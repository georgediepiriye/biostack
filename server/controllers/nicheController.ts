import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { NicheSegment } from "../models/NicheSegment";
import { ProductLink } from "../models/ProductLink";
import { randomBytes } from "crypto";
const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const shareSlugFor = (name: string) => `${slugify(name).slice(0, 24).replace(/-+$/g, "") || "creator"}-${randomBytes(3).toString("hex")}`;
export async function listNiches(req: AuthRequest, res: Response) {
  const niches = await NicheSegment.find({ userId: req.userId }).sort({ displayOrder: 1 });
  for (const niche of niches) {
    if (!niche.shareSlug) {
      niche.shareSlug = shareSlugFor(niche.creatorName || niche.title);
      await niche.save();
    }
  }
  return res.json({ success: true, data: niches });
}
export async function createNiche(req: AuthRequest, res: Response) {
  const { title, description, displayOrder, isPublic } = req.body;
  const creatorName = typeof req.body.creatorName === "string" ? req.body.creatorName.trim() : "";
  if (!title) return res.status(400).json({ success: false, error: "A niche title is required" });
  if (creatorName.length > 80) return res.status(400).json({ success: false, error: "Creator name must be 80 characters or fewer" });
  const niche = await NicheSegment.create({ userId: req.userId, title, creatorName, shareSlug: shareSlugFor(creatorName || title), slug: req.body.slug ? slugify(req.body.slug) : slugify(title), description, displayOrder, isPublic });
  return res.status(201).json({ success: true, data: niche });
}
export async function updateNiche(req: AuthRequest, res: Response) {
  const updates: Record<string, unknown> = {};
  for (const field of ["title", "creatorName", "description", "displayOrder", "isPublic", "slug"]) {
    if (field in req.body) updates[field] = req.body[field];
  }
  if (typeof updates.creatorName === "string") updates.creatorName = updates.creatorName.trim();
  if (typeof updates.creatorName === "string" && updates.creatorName.length > 80) return res.status(400).json({ success: false, error: "Creator name must be 80 characters or fewer" });
  if (typeof updates.slug === "string") updates.slug = slugify(updates.slug);
  const niche = await NicheSegment.findOneAndUpdate({ _id: req.params.id, userId: req.userId }, updates, { new: true, runValidators: true });
  if (!niche) return res.status(404).json({ success: false, error: "Niche not found" });
  return res.json({ success: true, data: niche });
}
export async function deleteNiche(req: AuthRequest, res: Response) {
  try {
    const niche = await NicheSegment.findOne({ _id: req.params.id, userId: req.userId });
    if (!niche) return res.status(404).json({ success: false, error: "Niche not found" });
    await ProductLink.deleteMany({ userId: req.userId, nicheSegmentId: niche._id });
    await niche.deleteOne();
    return res.json({ success: true, data: { id: req.params.id } });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Could not delete niche" });
  }
}
