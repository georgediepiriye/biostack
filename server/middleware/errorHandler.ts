import { NextFunction, Request, Response } from "express";
export function errorHandler(error: any, _req: Request, res: Response, _next: NextFunction) {
  console.error(error);
  if (error?.code === 11000) return res.status(409).json({ success: false, error: "That value is already in use" });
  return res.status(500).json({ success: false, error: "Something went wrong" });
}
