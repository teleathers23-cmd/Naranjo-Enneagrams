import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { EnneagramGlyph } from "@/components/enneagram-glyph";
import { ScoreBar } from "@/components/score-bar";
import { SiteShell } from "@/components/site-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import {
  INSTINCTS,
  SUBTYPE_MAP,
  TYPE_MAP,
  shortCode,
  subtypeLabel,
} from "@/lib/naranjo/catalog";
import { useTestStore } from "@/lib/naranjo/store";
import { saveMyResult } from "@/lib/results";

export const Route = createFileRoute("/result")({ component: ResultPage });

function ResultPage() {
  const navigate = useNavigate();
  const hydrated = useTestStore((s) => s.hydrated);
  const result = useTestStore((s) => s.result);
  const stage = useTestStore((s) => s.stage);
  const hydrateResult = useTestStore((s) => s.hydrateResult);
  const reset = useTestStore((s) => s.reset);
  const back = useTestStore((s) => s.back);
  const { user, isPending } = useCurrentUserState();
  const [saved, setSaved] = useState<"idle" | "saving" | "ok" | "err">("idle");

  useEffect(() => {
    hydrateResult();
  }, [hydrateResult]);

  if (!hydrated) {
    return (
      <SiteShell>
        <div className="h-40 animate-pulse rounded-xl bg-surface-2" />
      </SiteShell>
    );
  }

  if (stage !== "result" || !result) {
    return (
      <SiteShell>
        <p className="text-muted">还没有结果。</p>
        <Button asChild className="mt-4">
          <Link to="/test">去作答</Link>
        </Button>
      </SiteShell>
    );
  }

  const primary = SUBTYPE_MAP[result.primary];
  const type = TYPE_MAP[primary.type];
  const confidenceLabel =
    result.confidence === "high"
      ? "倾向明确"
      : result.confidence === "medium"
        ? "中等把握"
        : "候选接近";

  const canSave = Boolean(user) && !user.isDevFallback;

  const onSave = async () => {
    if (!canSave) {
      void navigate({ to: "/login" });
      return;
    }
    setSaved("saving");
    try {
      await saveMyResult({ data: result });
      setSaved("ok");
    } catch {
      setSaved("err");
    }
  };

  return (
    <SiteShell>
      <p className="text-center text-xs tracking-[0.18em] text-muted">RESULT</p>
      <h1 className="mt-1 text-center font-display text-2xl font-medium">测验结果</h1>

      <section className="mt-6 rounded-xl bg-primary px-5 py-6 text-primary-fg">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs tracking-widest opacity-70">{shortCode(primary.id)}</p>
            <p className="mt-1 font-display text-3xl font-medium">
              {subtypeLabel(primary.id)}
            </p>
            <p className="mt-2 text-sm opacity-80">
              {type.passion} · {primary.nameEs}
              {primary.countertype ? " · 反型" : ""}
            </p>
          </div>
          <EnneagramGlyph
            className="size-16 shrink-0 text-primary-fg"
            highlight={primary.type}
          />
        </div>
        <p className="mt-4 text-sm leading-relaxed opacity-90">{primary.oneLiner}</p>
        <p className="mt-3 text-xs opacity-70">
          {confidenceLabel} · {result.confidenceNote}
        </p>
      </section>

      <section className="mt-6 grid gap-3 sm:grid-cols-3">
        {([result.primary, result.secondary, result.tertiary] as const).map((id, i) => {
          const s = SUBTYPE_MAP[id];
          const row = result.subtypeScores.find((x) => x.id === id)!;
          return (
            <Link
              key={id}
              to="/types/$id"
              params={{ id }}
              className="rounded-xl border border-border bg-surface p-4 hover:border-border-strong"
            >
              <p className="text-xs text-subtle">{i === 0 ? "主导" : `候选 ${i + 1}`}</p>
              <p className="mt-1 font-medium">
                {shortCode(id)} {s.name}
              </p>
              <p className="mt-2 font-display text-xl tabular-nums">
                {row.pct.toFixed(1)}
              </p>
              <ScoreBar value={row.pct} className="mt-2" />
            </Link>
          );
        })}
      </section>

      <article className="mt-8 rounded-xl border border-border bg-surface p-5">
        <h2 className="font-display text-lg font-medium">原典肖像</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">{primary.portrait}</p>
        <ul className="mt-4 space-y-2 text-sm text-fg">
          {primary.markers.map((m) => (
            <li key={m} className="flex gap-2">
              <span className="mt-2 size-1 shrink-0 rounded-full bg-primary" />
              {m}
            </li>
          ))}
        </ul>
        {primary.countertype && (
          <p className="mt-4 rounded-lg bg-surface-2 px-3 py-2 text-xs leading-relaxed text-muted">
            这是纳兰霍所说的反型：表面不像该号的教科书形象，情欲仍在。误判常见于{" "}
            {primary.lookalikes.map((id) => shortCode(id)).join("、")}。
          </p>
        )}
        <p className="mt-4">
          <Link
            to="/types/$id"
            params={{ id: primary.id }}
            className="text-sm text-primary underline-offset-4 hover:underline"
          >
            阅读完整条目
          </Link>
        </p>
      </article>

      <section className="mt-8 rounded-xl border border-border bg-surface">
        <h2 className="border-b border-border px-5 py-3 font-display text-sm font-medium">
          九型情欲
        </h2>
        <ul>
          {result.typeScores.map((row) => {
            const t = TYPE_MAP[row.type];
            return (
              <li
                key={row.type}
                className="flex items-center gap-3 border-b border-border px-4 py-2.5 last:border-0 sm:px-5"
              >
                <span className="w-20 shrink-0 whitespace-nowrap text-sm sm:w-28">
                  {row.type} {t.passion}
                </span>
                <ScoreBar value={row.pct} className="flex-1" />
                <span className="w-12 text-right text-sm tabular-nums text-muted">
                  {row.pct.toFixed(0)}
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mt-4 rounded-xl border border-border bg-surface">
        <h2 className="border-b border-border px-5 py-3 font-display text-sm font-medium">
          本能倾向
        </h2>
        <ul>
          {result.instinctScores.map((row) => {
            const inst = INSTINCTS.find((i) => i.id === row.instinct)!;
            return (
              <li
                key={row.instinct}
                className="flex items-center gap-3 border-b border-border px-4 py-2.5 last:border-0 sm:px-5"
              >
                <span className="w-20 shrink-0 whitespace-nowrap text-sm sm:w-28">{inst.name}</span>
                <ScoreBar value={row.pct} className="flex-1" tone="soft" />
                <span className="w-12 text-right text-sm tabular-nums text-muted">
                  {row.pct.toFixed(0)}
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mt-4 rounded-xl border border-border bg-surface">
        <h2 className="border-b border-border px-5 py-3 font-display text-sm font-medium">
          二十七副型剖面
        </h2>
        <ul>
          {result.subtypeScores.map((row, i) => {
            const s = SUBTYPE_MAP[row.id];
            return (
              <li
                key={row.id}
                className="flex items-center gap-2 border-b border-border px-4 py-2 last:border-0 sm:gap-3 sm:px-5"
              >
                <span className="w-5 text-xs tabular-nums text-subtle">{i + 1}</span>
                <span className="w-28 shrink-0 truncate text-sm sm:w-36">
                  {shortCode(row.id)} {s.name}
                  {s.countertype && (
                    <Badge tone="muted" className="ml-1 hidden sm:inline-flex">
                      反型
                    </Badge>
                  )}
                </span>
                <ScoreBar
                  value={row.pct}
                  className="flex-1"
                  tone={i < 3 ? "ink" : "soft"}
                />
                <span className="w-12 text-right text-sm tabular-nums text-muted">
                  {row.pct.toFixed(0)}
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      {result.evidence.length > 0 && (
        <section className="mt-4 rounded-xl border border-border bg-surface">
          <h2 className="border-b border-border px-5 py-3 font-display text-sm font-medium">
            支持主导副型的作答
          </h2>
          <ul className="divide-y divide-border">
            {result.evidence.map((e) => (
              <li key={e.id} className="px-5 py-3 text-sm leading-relaxed text-muted">
                {e.text}
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="mt-6 text-xs leading-relaxed text-subtle">
        计分将情欲强度、副型专名题与本能倾向加权。未经第二步的类型仅作剖面参考。纳兰霍认为问卷不能替代自我观察。
      </p>

      <div className="mt-8 flex flex-col gap-2 sm:flex-row">
        <Button
          variant="secondary"
          onClick={() => {
            back();
            void navigate({ to: "/test" });
          }}
        >
          返回修改
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            if (confirm("清除进度并重测？")) {
              reset();
              void navigate({ to: "/test" });
            }
          }}
        >
          重新开始
        </Button>
        <Button onClick={() => void onSave()} disabled={saved === "saving" || isPending}>
          {canSave
            ? saved === "ok"
              ? "已保存到账户"
              : saved === "err"
                ? "保存失败，再试一次"
                : saved === "saving"
                  ? "保存中…"
                  : "保存到账户"
            : "登录后保存"}
        </Button>
      </div>
    </SiteShell>
  );
}
