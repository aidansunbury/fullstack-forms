import type { Table } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";

// Ensures the id and createdAt columns are automatically set by the database, but all other values may be passed in.
export function safeInsertSchema<TTable extends Table>(table: TTable) {
  return createInsertSchema(table).omit({
    id: true,
    createdAt: true,
  });
}
