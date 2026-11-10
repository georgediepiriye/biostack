import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { User } from "../models/User";
const safeUser = (user: any) => ({ id: user._id, username: user.username, email: user.email, profile: user.profile });
// Keep creator sessions active for 30 days so they don't need to sign in every week.
const tokenFor = (userId: string) => jwt.sign({ userId }, env.jwtSecret, { expiresIn: "30d" });
const generatedUsername = () => `creator_${randomBytes(6).toString("hex")}`;

export async function register(req: Request, res: Response) {
  const { email, password } = req.body;
  if (!email || !password || password.length < 8) return res.status(400).json({ success: false, error: "A valid email and password of at least 8 characters are required" });
  try {
    const normalizedEmail = email.trim().toLowerCase();
    const displayName = normalizedEmail.split("@")[0].replace(/[._-]+/g, " ").trim();
    const user = await User.create({ username: generatedUsername(), email: normalizedEmail, passwordHash: await bcrypt.hash(password, 12), profile: { displayName, themeColor: "#245b43" } });
    return res.status(201).json({ success: true, data: { user: safeUser(user), token: tokenFor(user.id) } });
  } catch (error: any) {
    // Express 4 does not forward rejected async route handlers to error middleware.
    // Handle duplicate-key errors here so a repeated username/email cannot crash the API.
    if (error?.code === 11000) {
      const duplicateField = Object.keys(error.keyPattern || {})[0];
      const label = duplicateField === "email" ? "Email" : "That value";
      return res.status(409).json({ success: false, error: `${label} is already in use` });
    }
    console.error(error);
    return res.status(500).json({ success: false, error: "Could not create your account" });
  }
}

export async function googleAuth(req: Request, res: Response) {
  if (!env.googleClientId) return res.status(503).json({ success: false, error: "Google sign-in is not configured yet" });
  const { credential } = req.body;
  if (typeof credential !== "string" || !credential) return res.status(400).json({ success: false, error: "Google credential is required" });
  try {
    const verification = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`);
    if (!verification.ok) return res.status(401).json({ success: false, error: "Google sign-in could not be verified" });
    const identity = await verification.json() as { aud?: string; iss?: string; email?: string; email_verified?: boolean | string; name?: string; picture?: string };
    if (identity.aud !== env.googleClientId || !["accounts.google.com", "https://accounts.google.com"].includes(identity.iss || "") || !identity.email || ![true, "true"].includes(identity.email_verified || false)) {
      return res.status(401).json({ success: false, error: "Google sign-in could not be verified" });
    }
    const email = identity.email.toLowerCase();
    let user = await User.findOne({ email });
    if (!user) {
      try {
        user = await User.create({
          username: generatedUsername(),
          email,
          passwordHash: await bcrypt.hash(randomBytes(32).toString("hex"), 12),
          profile: { displayName: identity.name || email.split("@")[0], avatarUrl: identity.picture || "", themeColor: "#245b43" },
        });
      } catch (error: any) {
        if (error?.code !== 11000) throw error;
        user = await User.findOne({ email });
        if (!user) throw error;
      }
    }
    return res.json({ success: true, data: { user: safeUser(user), token: tokenFor(user.id) } });
  } catch (error) {
    console.error("Google sign-in failed", error);
    return res.status(500).json({ success: false, error: "Could not sign in with Google" });
  }
}
export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email?.toLowerCase() });
  if (!user || !(await bcrypt.compare(password || "", user.passwordHash))) return res.status(401).json({ success: false, error: "Invalid email or password" });
  return res.json({ success: true, data: { user: safeUser(user), token: tokenFor(user.id) } });
}
