import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const JWT_SECRET =
  process.env.JWT_SECRET ?? "parchi-dev-secret-change-in-prod";

export interface AuthRequest extends Request {
  userId?: string;
  userEmail?: string;
  userName?: string;
}

export function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }
  const token = authHeader.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      email: string;
      name: string;
    };
    req.userId = payload.userId;
    req.userEmail = payload.email;
    req.userName = payload.name;
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}
