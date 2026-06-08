import { Router } from "express";
import { db, historyTable } from "@workspace/db";
import { eq, and, desc } from "drizzle-orm";
import { requireAuth, type AuthRequest } from "../middleware/authMiddleware";
import { logger } from "../lib/logger";

const router = Router();

router.get("/user/history", requireAuth, async (req: AuthRequest, res): Promise<void> => {
  try {
    const rows = await db
      .select()
      .from(historyTable)
      .where(eq(historyTable.userId, req.userId!))
      .orderBy(desc(historyTable.createdAt))
      .limit(50);
    res.json(rows);
  } catch (err) {
    logger.error(err, "Get history error");
    res.status(500).json({ error: "Could not load history" });
  }
});

router.post("/user/history", requireAuth, async (req: AuthRequest, res): Promise<void> => {
  try {
    const { type, fileName, preview, result } = req.body as {
      type?: string;
      fileName?: string;
      preview?: string;
      result?: unknown;
    };
    if (!type || !fileName || !preview || !result) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }
    const [row] = await db
      .insert(historyTable)
      .values({
        userId: req.userId!,
        type: type as "prescription" | "testreport",
        fileName,
        preview,
        result,
      })
      .returning();
    res.status(201).json(row);
  } catch (err) {
    logger.error(err, "Add history error");
    res.status(500).json({ error: "Could not save history" });
  }
});

router.delete("/user/history/:id", requireAuth, async (req: AuthRequest, res): Promise<void> => {
  try {
    await db
      .delete(historyTable)
      .where(
        and(
          eq(historyTable.id, req.params.id),
          eq(historyTable.userId, req.userId!),
        ),
      );
    res.json({ ok: true });
  } catch (err) {
    logger.error(err, "Delete history entry error");
    res.status(500).json({ error: "Could not delete entry" });
  }
});

router.delete("/user/history", requireAuth, async (req: AuthRequest, res): Promise<void> => {
  try {
    await db.delete(historyTable).where(eq(historyTable.userId, req.userId!));
    res.json({ ok: true });
  } catch (err) {
    logger.error(err, "Clear history error");
    res.status(500).json({ error: "Could not clear history" });
  }
});

export default router;
