import { InferSchemaType, model, models, Schema } from "mongoose";

const productLinkSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  nicheSegmentId: { type: Schema.Types.ObjectId, ref: "NicheSegment", required: true, index: true },
  title: { type: String, required: true, trim: true }, description: { type: String, default: "" },
  selarUrl: { type: String, required: true, trim: true }, coverImageUrl: { type: String, default: "" },
  price: { type: Number }, currency: { type: String, default: "NGN", uppercase: true }, badgeText: { type: String, default: "" },
  displayOrder: { type: Number, default: 0 }, clickCount: { type: Number, default: 0 },
}, { timestamps: true });
export type ProductLinkDocument = InferSchemaType<typeof productLinkSchema>;
export const ProductLink = models.ProductLink || model("ProductLink", productLinkSchema);
