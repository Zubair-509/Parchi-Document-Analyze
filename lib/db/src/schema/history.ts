import { pgTable, text, timestamp, uuid, jsonb, index } from "drizzle-orm/pg-core";
import { usersTable } from "./users";

export const historyTable = pgTable(
  "history",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    type: text("type").notNull().$type<"prescription" | "testreport">(),
    fileName: text("file_name").notNull(),
    preview: text("preview").notNull(),
    result: jsonb("result").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("history_user_id_idx").on(table.userId)],
);

export type HistoryRow = typeof historyTable.$inferSelect;
