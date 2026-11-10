import { InferSchemaType, model, models, Schema } from "mongoose";

const userSchema = new Schema({
  username: { type: String, required: true, unique: true, index: true, trim: true, lowercase: true, match: /^[a-z0-9_]{3,30}$/ },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  passwordHash: { type: String, required: true },
  profile: { displayName: { type: String, default: "" }, bio: { type: String, default: "" }, avatarUrl: { type: String, default: "" }, themeColor: { type: String, default: "#7c3aed" } },
}, { timestamps: true });

export type UserDocument = InferSchemaType<typeof userSchema>;
export const User = models.User || model("User", userSchema);
