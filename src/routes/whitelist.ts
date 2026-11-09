import { Router } from "express";
import { z } from "zod";
import { pool } from "../db/pool.js";
import { requireAuth } from "../middleware/requireAuth.js";

export const whitelistRouter = Router();

const applicationSchema = z.object({
  characterName: z.string().trim().min(3).max(48),
  age: z.number().int().min(1).max(99),
  experience: z.string().trim().min(20).max(1200),
  story: z.string().trim().min(80).max(3000),
});

whitelistRouter.post("/apply", requireAuth, async (req, res) => {
  const parsed = applicationSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "validation_error", fields: parsed.error.flatten().fieldErrors });
    return;
  }
  const playerId = req.player!.playerId;
  const existing = await pool.query<{ status: string }>(
    `SELECT status FROM whitelist_applications WHERE player_id = $1
     ORDER BY submitted_at DESC LIMIT 1`, [playerId]
  );
  if (existing.rows[0]?.status === "approved") {
    res.status(409).json({ error: "already_approved" });
    return;
  }
  if (existing.rows[0]?.status === "pending") {
    res.status(409).json({ error: "application_exists" });
    return;
  }
  const { characterName, age, experience, story } = parsed.data;
  await pool.query(
    `INSERT INTO whitelist_applications (player_id, character_name, age, experience, story)
     VALUES ($1, $2, $3, $4, $5)`,
    [playerId, characterName, age, experience, story]
  );
  res.status(201).json({ ok: true });
});

whitelistRouter.get("/me", requireAuth, async (req, res) => {
  const result = await pool.query(
    `SELECT id, character_name AS "characterName", status, submitted_at AS "submittedAt"
     FROM whitelist_applications WHERE player_id = $1
     ORDER BY submitted_at DESC LIMIT 1`, [req.player!.playerId]
  );
  res.json({ application: result.rows[0] ?? null });
});
