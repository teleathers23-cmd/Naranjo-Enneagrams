import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import type { Result } from "@/lib/naranjo/scoring";

export const saveMyResult = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((result: Result) => result)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const id = crypto.randomUUID();
    await sql`
      insert into test_results (id, user_id, primary_subtype, result)
      values (${id}, ${context.userId}, ${data.triadCode ?? data.primary}, ${JSON.stringify(data)}::jsonb)
    `;
    return { id };
  });

export type SavedResultRow = {
  id: string;
  primary_subtype: string;
  created_at: string;
  result: Result;
};

export const listMyResults = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql<{
      id: string;
      primary_subtype: string;
      created_at: string;
      result: Result | string;
    }>`
      select id, primary_subtype, created_at, result
      from test_results
      where user_id = ${context.userId}
      order by created_at desc
      limit 20
    `;
    return rows.map((r) => ({
      ...r,
      result: typeof r.result === "string" ? (JSON.parse(r.result) as Result) : r.result,
    }));
  });
