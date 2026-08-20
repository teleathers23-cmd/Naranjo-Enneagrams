import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ScoreBar } from "@/components/score-bar";
import {
  INSTINCTS,
  SUBTYPE_MAP,
  TYPE_MAP,
  subtypeLabel,
} from "@/lib/naranjo/catalog";
import {
  FLAG_LABEL,
  INTENSITY_LABEL,
  VERIFY_LABEL,
  type StyleFlag,
} from "@/lib/naranjo/scoring";
import { QUESTION_MAP } from "@/lib/naranjo/questions";
import { adminMe, getSubmission, type SubmissionDetail } from "@/lib/submissions";

export const Route = createFileRoute("/admin/$id")({
  component: AdminDetailPage,
});

function formatTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("zh-CN", { hour12: false });
}

function AdminDetailPage() {
  const { id } = Route.useParams();
  const [ok, setOk] = useState<boolean | null>(null);
  const [row, setRow] = useState<SubmissionDetail | null | undefined>(undefined);

  useEffect(() => {
    let live = true;
    adminMe()
      .then(async (m) => {
        if (!live) return;
        setOk(m.ok);
        if (!m.ok) return;
        const data = await getSubmission({ data: id });
        if (live) setRow(data);
      })
      .catch(() => {
        if (live) setOk(false);
      });
    return () => {
      live = false;
    };
  }, [id]);

  if (ok === false) return <Navigate to="/admin/login" />;
  if (ok === null || row === undefined) {
    return <div className="h-40 animate-pulse rounded-xl bg-surface-2" />;
  }
  if (!row) {
    return (
      <p className="text-sm text-muted">
        没有这条记录。
        <Link to="/admin" className="ml-2 underline">
          返回列表
        </Link>
      </p>
    );
  }

  const r = row.result;
  const answerEntries = Object.entries(row.answers);

  return (
    <div>
      <p className="text-xs text-muted">
        <Link to="/admin" className="hover:text-fg">
          测验记录
        </Link>
        <span className="mx-1.5">/</span>
        {row.id.slice(0, 8)}
      </p>
      <h1 className="mt-2 font-display text-3xl font-medium">{row.triad_code}</h1>
      <p className="mt-2 text-sm text-muted">{formatTime(row.created_at)}</p>

      <dl className="mt-6 grid gap-3 sm:grid-cols-2">
        {[
          ["来源 IP", row.ip || "未能读取"],
          ["浏览器", row.user_agent || "—"],
          ["账户", row.user_id ? `已登录 · ${row.user_id}` : "访客（未登录）"],
          ["核验", row.confidence ?? "—"],
        ].map(([k, v]) => (
          <div key={k} className="rounded-xl border border-border bg-surface px-4 py-3">
            <dt className="text-xs text-subtle">{k}</dt>
            <dd className="mt-1 break-all text-sm">{v}</dd>
          </div>
        ))}
      </dl>

      {row.flags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {row.flags.map((f) => (
            <Badge key={f} tone="warn">
              {FLAG_LABEL[f as StyleFlag] ?? f}
            </Badge>
          ))}
        </div>
      )}

      <section className="mt-8">
        <h2 className="font-display text-lg font-medium">三元组</h2>
        <ol className="mt-3 space-y-3">
          {r.triad.map((slot) => {
            const s = SUBTYPE_MAP[slot.subtype];
            return (
              <li
                key={slot.center}
                className="rounded-xl border border-border bg-surface px-4 py-3"
              >
                <p className="text-xs text-subtle">
                  {slot.center} · {INTENSITY_LABEL[slot.intensityBand]} ·{" "}
                  {VERIFY_LABEL[slot.verification]}
                </p>
                <p className="mt-1 font-medium">
                  {slot.subtype} {s ? subtypeLabel(slot.subtype) : ""} · {s?.name}
                </p>
                <p className="mt-1 text-sm text-muted">{s?.oneLiner}</p>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-lg font-medium">九型比例</h2>
        <ul className="mt-3 space-y-2">
          {[...r.typeScores]
            .sort((a, b) => b.pct - a.pct)
            .map((t) => (
              <li key={t.type}>
                <div className="mb-1 flex justify-between text-sm">
                  <span>
                    {t.type}号 {TYPE_MAP[t.type].passion}
                  </span>
                  <span className="text-muted">{t.pct.toFixed(1)}</span>
                </div>
                <ScoreBar value={t.pct} />
              </li>
            ))}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-lg font-medium">本能</h2>
        <ul className="mt-3 space-y-2">
          {r.instinctScores.map((rowI) => (
            <li key={rowI.instinct}>
              <div className="mb-1 flex justify-between text-sm">
                <span>{INSTINCTS.find((i) => i.id === rowI.instinct)?.name}</span>
                <span className="text-muted">{rowI.pct.toFixed(1)}</span>
              </div>
              <ScoreBar value={rowI.pct} />
            </li>
          ))}
        </ul>
      </section>

      {r.compare && r.compare.length > 0 && (
        <section className="mt-8">
          <h2 className="font-display text-lg font-medium">第三步对照</h2>
          <ul className="mt-3 divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface">
            {r.compare.map((c) => (
              <li key={c.id} className="px-4 py-3 text-sm">
                <p className="text-muted">{c.stem}</p>
                <p className="mt-1">
                  {c.leftLabel} / {c.rightLabel} → {c.choice}
                </p>
                <p className="mt-1 text-xs text-subtle">{c.note}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-8">
        <h2 className="font-display text-lg font-medium">
          作答明细（{answerEntries.length} 题）
        </h2>
        <ul className="mt-3 max-h-[32rem] overflow-auto rounded-xl border border-border bg-surface text-sm">
          {answerEntries.map(([qid, val]) => {
            const q = QUESTION_MAP[qid];
            return (
              <li key={qid} className="border-b border-border px-4 py-2.5 last:border-0">
                <p className="text-xs text-subtle">
                  {qid}
                  {q?.reverse ? " · 反向" : ""} · {val}
                </p>
                <p className="mt-1 leading-relaxed text-muted">
                  {q?.text ?? "（题库中已无此题）"}
                </p>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
