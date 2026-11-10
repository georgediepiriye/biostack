import { InferSchemaType, model, models, Schema } from "mongoose";

const nicheSegmentSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  title: { type: String, required: true, trim: true },
  creatorName: { type: String, default: "", trim: true, maxlength: 80 },
  shareSlug: { type: String, trim: true, lowercase: true },
  visitCount: { type: Number, default: 0, min: 0 },
  uniqueVisitorCount: { type: Number, default: 0, min: 0 },
  slug: { type: String, required: true, trim: true, lowercase: true },
  description: { type: String, default: "" },
  displayOrder: { type: Number, default: 0 },
  isPublic: { type: Boolean, default: true },
}, { timestamps: true });
nicheSegmentSchema.index({ userId: 1, slug: 1 }, { unique: true });
nicheSegmentSchema.index({ shareSlug: 1 }, { unique: true, sparse: true });
export type NicheSegmentDocument = InferSchemaType<typeof nicheSegmentSchema>;
export const NicheSegment = models.NicheSegment || model("NicheSegment", nicheSegmentSchema);
