import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import type { Result } from "@/lib/naranjo/scoring";

export const saveMyResult = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { result: Result; testerName?: string }) => data)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const id = crypto.randomUUID();
    const testerName = (data.testerName ?? "").trim() || null;
    const payload = { ...data.result, testerName: testerName ?? undefined };
    await sql`
      insert into test_results (id, user_id, primary_subtype, result, tester_name)
      values (
        ${id},
        ${context.userId},
        ${data.result.triadCode ?? data.result.primary},
        ${JSON.stringify(payload)}::jsonb,
        ${testerName}
      )
    `;
    return { id };
  });

export type SavedResultRow = {
  id: string;
  primary_subtype: string;
  created_at: string;
  result: Result;
  tester_name: string | null;
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
      tester_name: string | null;
    }>`
      select id, primary_subtype, created_at, result, tester_name
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
