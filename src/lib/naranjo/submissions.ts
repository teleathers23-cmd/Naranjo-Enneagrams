import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import type { Answers, Result } from "@/lib/naranjo/scoring";

export type SubmissionListRow = {
  id: string;
  created_at: string;
  ip: string | null;
  user_id: string | null;
  triad_code: string;
  primary_subtype: string;
  confidence: string | null;
  flags: string[];
  tester_name: string | null;
};

export type SubmissionDetail = SubmissionListRow & {
  user_agent: string | null;
  result: Result;
  answers: Answers;
};

function parseResult(raw: Result | string): Result {
  return typeof raw === "string" ? (JSON.parse(raw) as Result) : raw;
}

function parseAnswers(raw: Answers | string | null | undefined): Answers {
  if (!raw) return {};
  return typeof raw === "string" ? (JSON.parse(raw) as Answers) : raw;
}

function flagsOf(result: Result): string[] {
  return result.style?.flags ?? [];
}

export const recordSubmission = createServerFn({ method: "POST" })
  .validator((data: { result: Result; answers: Answers; testerName?: string }) => data)
  .handler(async ({ data }) => {
    try {
      const { clientIp, clientUa } = await import("./admin.server");
      const { getSessionUser } = await import("./auth/verify.server");
      const result = data.result;
      if (!result?.triadCode || !result.primary) {
        return { id: null as string | null, error: "incomplete" };
      }
      let userId: string | null = null;
      try {
        const user = await getSessionUser();
        userId = user?.id ?? null;
      } catch {
        userId = null;
      }
      const testerName = (data.testerName ?? "").trim() || null;
      const sql = await getSql();
      const id = crypto.randomUUID();
      const payload = { ...result, testerName: testerName ?? undefined };
      await sql`
        insert into test_submissions (
          id, ip, user_agent, user_id, triad_code, primary_subtype, confidence, result, answers, tester_name
        ) values (
          ${id},
          ${clientIp()},
          ${clientUa()},
          ${userId},
          ${result.triadCode},
          ${result.primary},
          ${result.confidence ?? null},
          ${JSON.stringify(payload)}::jsonb,
          ${JSON.stringify(data.answers ?? {})}::jsonb,
          ${testerName}
        )
      `;
      return { id, error: null as string | null };
    } catch (err) {
      console.error("[submissions] record failed", err);
      return { id: null as string | null, error: "db" };
    }
  });

export const adminLogin = createServerFn({ method: "POST" })
  .validator((data: { username: string; password: string }) => data)
  .handler(async ({ data }) => {
    const { loginAdmin } = await import("./admin.server");
    return loginAdmin(data.username ?? "", data.password ?? "");
  });

export const adminLogout = createServerFn({ method: "POST" }).handler(async () => {
  const { logoutAdmin } = await import("./admin.server");
  logoutAdmin();
  return { ok: true };
});

export const adminMe = createServerFn({ method: "GET" }).handler(async () => {
  const { isAdmin } = await import("./admin.server");
  return { ok: isAdmin() };
});

export const listSubmissions = createServerFn({ method: "GET" }).handler(
  async () => {
    const { requireAdmin } = await import("./admin.server");
    requireAdmin();
    const sql = await getSql();
    const rows = await sql<{
      id: string;
      created_at: string | Date;
      ip: string | null;
      user_id: string | null;
      triad_code: string;
      primary_subtype: string;
      confidence: string | null;
      tester_name: string | null;
      result: Result | string;
    }>`
      select id, created_at, ip, user_id, triad_code, primary_subtype, confidence, tester_name, result
      from test_submissions
      order by created_at desc
      limit 200
    `;
    return rows.map((r): SubmissionListRow => {
      const result = parseResult(r.result);
      return {
        id: r.id,
        created_at:
          r.created_at instanceof Date
            ? r.created_at.toISOString()
            : String(r.created_at),
        ip: r.ip,
        user_id: r.user_id,
        triad_code: r.triad_code,
        primary_subtype: r.primary_subtype,
        confidence: r.confidence,
        flags: flagsOf(result),
        tester_name: r.tester_name,
      };
    });
  },
);

export const getSubmission = createServerFn({ method: "GET" })
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    const { requireAdmin } = await import("./admin.server");
    requireAdmin();
    const sql = await getSql();
    const rows = await sql<{
      id: string;
      created_at: string | Date;
      ip: string | null;
      user_agent: string | null;
      user_id: string | null;
      triad_code: string;
      primary_subtype: string;
      confidence: string | null;
      tester_name: string | null;
      result: Result | string;
      answers: Answers | string | null;
    }>`
      select id, created_at, ip, user_agent, user_id, triad_code, primary_subtype,
             confidence, tester_name, result, answers
      from test_submissions
      where id = ${id}
      limit 1
    `;
    const r = rows[0];
    if (!r) return null;
    const result = parseResult(r.result);
    return {
      id: r.id,
      created_at:
        r.created_at instanceof Date
          ? r.created_at.toISOString()
          : String(r.created_at),
      ip: r.ip,
      user_agent: r.user_agent,
      user_id: r.user_id,
      triad_code: r.triad_code,
      primary_subtype: r.primary_subtype,
      confidence: r.confidence,
      flags: flagsOf(result),
      tester_name: r.tester_name,
      result,
      answers: parseAnswers(r.answers),
    } satisfies SubmissionDetail;
  });
