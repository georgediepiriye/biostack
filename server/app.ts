import cors from "cors";
import express from "express";
import { env } from "./config/env";
import { errorHandler } from "./middleware/errorHandler";
import authRoutes from "./routes/authRoutes";
import linkRoutes from "./routes/linkRoutes";
import nicheRoutes from "./routes/nicheRoutes";
import profileRoutes from "./routes/profileRoutes";
import uploadRoutes from "./routes/uploadRoutes";

const app = express();
app.use(cors({ origin: env.clientOrigin }));
app.use(express.json());
app.get("/api/health", (_req, res) => res.json({ success: true, data: { status: "ok" } }));
app.use("/api/auth", authRoutes);
app.use("/api/niches", nicheRoutes);
app.use("/api/links", linkRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/uploads", uploadRoutes);
app.use(errorHandler);

export default app;
