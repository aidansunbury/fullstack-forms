import { TRPCError } from "@trpc/server";
import { desc } from "drizzle-orm";
import { z } from "zod";
import { safeInsertSchema } from "~/lib/safeInsertSchema";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import { posts } from "~/server/db/schema";

export const postRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      safeInsertSchema(posts).extend({
        // This is needed because of a bug in drizzle-zod
        // https://github.com/drizzle-team/drizzle-orm/issues/1110
        tags: z.string().array(),
      }),
    )
    .mutation(async ({ input }) => {
      const randomError = Math.random() < 0.33;
      if (randomError) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Random 1/3 chance server error, try again",
        });
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const [post] = await db.insert(posts).values(input).returning();
      return post;
    }),

  list: publicProcedure.query(async () => {
    const recentPosts = await db
      .select()
      .from(posts)
      .orderBy(desc(posts.createdAt))
      .limit(10);
    return recentPosts;
  }),
});
