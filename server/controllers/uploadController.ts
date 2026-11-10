import { createHash } from "crypto";
import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { env } from "../config/env";

export function cloudinarySignature(_req: AuthRequest, res: Response) {
  if (!env.cloudinaryCloudName || !env.cloudinaryApiKey || !env.cloudinaryApiSecret) {
    return res.status(503).json({ success: false, error: "Cloudinary uploads are not configured" });
  }
  const timestamp = Math.floor(Date.now() / 1000);
  const folder = "biostack/covers";
  const signature = createHash("sha1")
    .update(`folder=${folder}&timestamp=${timestamp}${env.cloudinaryApiSecret}`)
    .digest("hex");
  return res.json({
    success: true,
    data: { cloudName: env.cloudinaryCloudName, apiKey: env.cloudinaryApiKey, timestamp, folder, signature },
  });
}
