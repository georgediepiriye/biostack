import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { NicheSegment } from "../models/NicheSegment";
import { ProductLink } from "../models/ProductLink";
import { User } from "../models/User";
import { NicheVisitor } from "../models/NicheVisitor";
import { createHmac } from "crypto";
import { env } from "../config/env";
const routeParam = (value: string | string[]) => Array.isArray(value) ? value[0] : value;
async function countUniqueVisitor(nicheId: unknown, req: Request) {
  const browserId = req.get("x-visitor-id");
  const identity = browserId && /^[a-f0-9-]{16,64}$/i.test(browserId) ? `browser:${browserId}` : `ip:${req.ip || "unknown"}`;
  const visitorHash = createHmac("sha256", env.jwtSecret).update(identity).digest("hex");
  try {
    await NicheVisitor.create({ nicheId, visitorHash });
    await NicheSegment.updateOne({ _id: nicheId }, { $inc: { uniqueVisitorCount: 1 } });
  } catch (error: any) {
    if (error?.code !== 11000) throw error;
  }
}
export async function currentProfile(req: AuthRequest, res: Response) { const user = await User.findById(req.userId).select("username email profile"); return res.json({ success: true, data: user }); }
export async function updateProfile(req: AuthRequest, res: Response) { const { displayName, bio, avatarUrl, themeColor } = req.body; const user = await User.findByIdAndUpdate(req.userId, { $set: { profile: { displayName, bio, avatarUrl, themeColor } } }, { new: true, runValidators: true }).select("username email profile"); return res.json({ success: true, data: user }); }
export async function publicProfile(req: Request, res: Response) {
  const user = await User.findOne({ username: routeParam(req.params.username).toLowerCase() }).select("username profile");
  if (!user) return res.status(404).json({ success: false, error: "Profile not found" });
  const niches = await NicheSegment.find({ userId: user._id, isPublic: true }).sort({ displayOrder: 1 });
  const links = await ProductLink.find({ userId: user._id, nicheSegmentId: { $in: niches.map((n) => n._id) } }).sort({ displayOrder: 1 });
  return res.json({ success: true, data: { user, niches, links } });
}
export async function publicNiche(req: Request, res: Response) {
  const user = await User.findOne({ username: routeParam(req.params.username).toLowerCase() }).select("username profile");
  if (!user) return res.status(404).json({ success: false, error: "Profile not found" });
  const niche = await NicheSegment.findOne({ userId: user._id, slug: routeParam(req.params.slug).toLowerCase(), isPublic: true });
  if (!niche) return res.status(404).json({ success: false, error: "Collection not found" });
  await countUniqueVisitor(niche._id, req);
  niche.uniqueVisitorCount = (niche.uniqueVisitorCount || 0) + 1;
  const links = await ProductLink.find({ userId: user._id, nicheSegmentId: niche._id }).sort({ createdAt: -1, _id: -1 });
  return res.json({ success: true, data: { user, niche, links } });
}
export async function publicNicheByShareSlug(req: Request, res: Response) {
  const niche = await NicheSegment.findOne({ shareSlug: routeParam(req.params.shareSlug).toLowerCase(), isPublic: true });
  if (!niche) return res.status(404).json({ success: false, error: "Collection not found" });
  await countUniqueVisitor(niche._id, req);
  niche.uniqueVisitorCount = (niche.uniqueVisitorCount || 0) + 1;
  const user = await User.findById(niche.userId).select("username profile");
  if (!user) return res.status(404).json({ success: false, error: "Creator not found" });
  const links = await ProductLink.find({ userId: user._id, nicheSegmentId: niche._id }).sort({ createdAt: -1, _id: -1 });
  return res.json({ success: true, data: { user, niche, links } });
}
export async function publicClick(req: Request, res: Response) { const link = await ProductLink.findByIdAndUpdate(req.params.id, { $inc: { clickCount: 1 } }, { new: true }); if (!link) return res.status(404).json({ success: false, error: "Product link not found" }); return res.json({ success: true, data: { selarUrl: link.selarUrl } }); }
