import { model, models, Schema } from "mongoose";

const nicheVisitorSchema = new Schema({
  nicheId: { type: Schema.Types.ObjectId, ref: "NicheSegment", required: true },
  visitorHash: { type: String, required: true },
}, { timestamps: { createdAt: true, updatedAt: false } });

nicheVisitorSchema.index({ nicheId: 1, visitorHash: 1 }, { unique: true });
export const NicheVisitor = models.NicheVisitor || model("NicheVisitor", nicheVisitorSchema);
