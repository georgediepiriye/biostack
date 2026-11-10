import "dotenv/config";

const required = ["MONGODB_URI", "JWT_SECRET"] as const;
const production = process.env.NODE_ENV === "production";
for (const key of required) {
  if (!process.env[key]) console.warn(`Missing ${key}; add it to your .env file before starting the API.`);
}
if (production) {
  const missing = [...required, "CLIENT_ORIGIN"].filter((key) => !process.env[key]);
  if (missing.length) throw new Error(`Missing required production environment variables: ${missing.join(", ")}`);
  if ((process.env.JWT_SECRET || "").length < 32) throw new Error("JWT_SECRET must be at least 32 characters in production.");
}

export const env = {
  mongoUri: process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/biostack",
  jwtSecret: process.env.JWT_SECRET ?? "development-only-secret",
  port: Number(process.env.PORT ?? 4000),
  clientOrigin: process.env.CLIENT_ORIGIN ?? "http://localhost:3000",
  googleClientId: process.env.GOOGLE_CLIENT_ID ?? "",
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME ?? "",
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY ?? "",
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET ?? "",
};
