import { sql } from "drizzle-orm";
import {
  index,
  integer,
  pgEnum,
  pgTableCreator,
  text,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `${name}`);

export const categories = pgEnum("category", ["TypeScript", "Python", "C++"]);

export const posts = createTable(
  "post",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    name: varchar("name", { length: 256 }).notNull(),
    notes: text("notes"),
    category: categories("category").notNull(),
    tags: text("tags").array().notNull(),
    createdAt: integer("createdAt")
      .notNull()
      .default(sql`extract(epoch from now())`),
  },
  (t) => ({
    nameIndex: index("name_idx").on(t.name),
    createdAtIdx: index("post_created_at_idx").on(t.createdAt),
  }),
);
