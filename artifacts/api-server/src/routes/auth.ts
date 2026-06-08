import { Router } from "express";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { JWT_SECRET, requireAuth, type AuthRequest } from "../middleware/authMiddleware";
import { logger } from "../lib/logger";

const router = Router();

function hashPassword(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 64).toString("hex");
}

function verifyPassword(password: string, salt: string, storedHash: string): boolean {
  try {
    const derived = Buffer.from(hashPassword(password, salt), "hex");
    const stored = Buffer.from(storedHash, "hex");
    if (derived.length !== stored.length) return false;
    return crypto.timingSafeEqual(derived, stored);
  } catch {
    return false;
  }
}

router.post("/auth/register", async (req, res): Promise<void> => {
  try {
    const { email, name, password } = req.body as {
      email?: string;
      name?: string;
      password?: string;
    };
    if (!email || !name || !password) {
      res.status(400).json({ error: "Email, name, and password are required" });
      return;
    }
    if (password.length < 8) {
      res.status(400).json({ error: "Password must be at least 8 characters" });
      return;
    }
    const normalizedEmail = email.trim().toLowerCase();
    const existing = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.email, normalizedEmail))
      .limit(1);
    if (existing.length > 0) {
      res.status(409).json({ error: "An account with this email already exists" });
      return;
    }
    const salt = crypto.randomBytes(16).toString("hex");
    const hash = hashPassword(password, salt);
    const passwordHash = `${salt}:${hash}`;
    const [user] = await db
      .insert(usersTable)
      .values({ email: normalizedEmail, name: name.trim(), passwordHash })
      .returning({
        id: usersTable.id,
        email: usersTable.email,
        name: usersTable.name,
      });
    const token = jwt.sign(
      { userId: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: "30d" },
    );
    res.status(201).json({ token, user });
  } catch (err) {
    logger.error(err, "Register error");
    res.status(500).json({ error: "Registration failed. Please try again." });
  }
});

router.post("/auth/login", async (req, res): Promise<void> => {
  try {
    const { email, password } = req.body as {
      email?: string;
      password?: string;
    };
    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email.trim().toLowerCase()))
      .limit(1);
    if (!user) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }
    const [salt, storedHash] = user.passwordHash.split(":");
    if (!verifyPassword(password, salt, storedHash)) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }
    const token = jwt.sign(
      { userId: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: "30d" },
    );
    res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (err) {
    logger.error(err, "Login error");
    res.status(500).json({ error: "Login failed. Please try again." });
  }
});

router.get("/auth/me", requireAuth, (req: AuthRequest, res): void => {
  res.json({ id: req.userId, email: req.userEmail, name: req.userName });
});

export default router;
