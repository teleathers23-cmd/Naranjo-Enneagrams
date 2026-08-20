import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { EnneagramGlyph } from "@/components/enneagram-glyph";
import { ScoreBar } from "@/components/score-bar";
import { SiteShell } from "@/components/site-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import {
  CENTER_FULL,
  CENTER_LABEL,
  INSTINCTS,
  SUBTYPE_MAP,
  TYPE_MAP,
  shortCode,
  subtypeLabel,
  triadToken,
} from "@/lib/naranjo/catalog";
import {
  INTENSITY_LABEL,
  VERIFY_LABEL,
  type IntensityBand,
  type Result,
  type Verification,
} from "@/lib/naranjo/scoring";
import { useTestStore } from "@/lib/naranjo/store";
import { saveMyResult } from "@/lib/results";

export const Route = createFileRoute("/result")({ component: ResultPage });

function verifyTone(v: Verification): "default" | "accent" | "warn" | "muted" {
  if (v === "clear") return "default";
  if (v === "lean") return "warn";
  return "muted";
}

function intensityTone(b: IntensityBand): "default" | "accent" | "warn" | "muted" {
  if (b === "very-high" || b === "high") return "default";
  if (b === "moderate") return "warn";
  return "muted";
}

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
  const [openCalc, setOpenCalc] = useState(false);

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

  if (stage !== "result" || !result || !result.triad) {
    return (
      <SiteShell>
        <p className="text-muted">还没有结果。</p>
        <Button asChild className="mt-4">
          <Link to="/test">去作答</Link>
        </Button>
      </SiteShell>
    );
  }

  const r = result as Result;
  const lead = SUBTYPE_MAP[r.triad[0].subtype];
  const confidenceLabel =
    r.confidence === "high" ? "倾向明确" : r.confidence === "medium" ? "中等把握" : "候选接近";
  const canSave = Boolean(user) && !user?.isDevFallback;

  const onSave = async () => {
    if (!canSave) {
      void navigate({ to: "/login" });
      return;
    }
    setSaved("saving");
    try {
      await saveMyResult({ data: r });
      setSaved("ok");
    } catch {
      setSaved("err");
    }
  };

  return (
    <SiteShell>
      <p className="text-center text-xs tracking-[0.18em] text-muted">TRIAD</p>
      <h1 className="mt-1 text-center font-display text-2xl font-medium">心脑腹三元组</h1>

      <section className="mt-6 rounded-xl bg-primary px-5 py-6 text-primary-fg">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-display text-3xl font-medium tracking-tight sm:text-4xl">
              {r.triadCode}
            </p>
            <p className="mt-2 text-sm opacity-80">
              {r.triad.map((s) => CENTER_LABEL[s.center]).join(" → ")}
            </p>
            <p className="mt-1 text-xs opacity-70">
              顺序按中心重视，不是按流行「主型」排序
            </p>
          </div>
          <EnneagramGlyph
            className="size-16 shrink-0 text-primary-fg"
            highlight={r.triad.map((s) => s.type)}
          />
        </div>
        <p className="mt-4 text-sm leading-relaxed opacity-90">{lead.oneLiner}</p>
        <p className="mt-3 text-xs opacity-70">
          {confidenceLabel} · {r.confidenceNote}
        </p>
        {r.style?.flags?.length ? (
          <p className="mt-2 text-xs opacity-70">
            作答风格：{r.style.flags.join(" · ")}（详见下方计算）
          </p>
        ) : null}
      </section>

      <section className="mt-6 grid gap-3 sm:grid-cols-3">
        {r.triad.map((slot) => {
          const s = SUBTYPE_MAP[slot.subtype];
          const t = TYPE_MAP[slot.type];
          return (
            <Link
              key={slot.subtype}
              to="/types/$id"
              params={{ id: slot.subtype }}
              className="rounded-xl border border-border bg-surface p-4 hover:border-border-strong"
            >
              <p className="text-xs text-subtle">
                {slot.order === 1 ? "第一区" : slot.order === 2 ? "第二区" : "第三区"} ·{" "}
                {CENTER_LABEL[slot.center]}
              </p>
              <p className="mt-1 font-display text-xl">{triadToken(slot.subtype)}</p>
              <p className="mt-0.5 text-sm font-medium">
                {s.name}
                {s.countertype ? " · 反型" : ""}
              </p>
              <p className="mt-1 text-xs text-muted">
                {t.passion} · {CENTER_FULL[slot.center]}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <Badge tone={intensityTone(slot.intensityBand)}>
                  强度 {INTENSITY_LABEL[slot.intensityBand]} {slot.intensity.toFixed(0)}
                </Badge>
                <Badge tone={verifyTone(slot.verification)}>
                  核验 {VERIFY_LABEL[slot.verification]}
                </Badge>
              </div>
              <ScoreBar value={slot.intensity} className="mt-3" />
            </Link>
          );
        })}
      </section>

      {r.triad.map((slot) => {
        const s = SUBTYPE_MAP[slot.subtype];
        const t = TYPE_MAP[slot.type];
        const runT = TYPE_MAP[slot.runnerUpType];
        const runS = SUBTYPE_MAP[slot.runnerUpSubtype];
        return (
          <article
            key={`p-${slot.subtype}`}
            className="mt-6 rounded-xl border border-border bg-surface p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs tracking-widest text-subtle">
                  {CENTER_LABEL[slot.center]} · {CENTER_FULL[slot.center]}
                </p>
                <h2 className="mt-1 font-display text-lg font-medium">
                  {triadToken(slot.subtype)} {subtypeLabel(slot.subtype)}
                </h2>
                <p className="mt-1 text-xs text-muted">
                  {t.passion} · {s.nameEs}
                  {s.countertype ? " · 反型" : ""}
                </p>
              </div>
              <div className="text-right">
                <p className="font-display text-2xl tabular-nums">{slot.intensity.toFixed(0)}</p>
                <p className="text-[0.7rem] text-subtle">强度</p>
              </div>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted">{s.portrait}</p>
            <ul className="mt-4 space-y-2 text-sm text-fg">
              {s.markers.map((m) => (
                <li key={m} className="flex gap-2">
                  <span className="mt-2 size-1 shrink-0 rounded-full bg-primary" />
                  {m}
                </li>
              ))}
            </ul>
            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              <Stat k="情欲" v={slot.typePct} />
              <Stat k="副型专名" v={slot.specPct} />
              <Stat k="本能" v={slot.instinctPct} />
            </div>
            <p className="mt-3 text-xs leading-relaxed text-muted">
              核验：{VERIFY_LABEL[slot.verification]}。{slot.verificationNote} 次选情欲{" "}
              {slot.runnerUpType}号{runT.passion}
              （差 {slot.typeGap.toFixed(1)}）；次选副型 {triadToken(slot.runnerUpSubtype)}{" "}
              {runS.name}（差 {slot.subtypeGap.toFixed(1)}）。
            </p>
            {s.countertype && (
              <p className="mt-3 rounded-lg bg-surface-2 px-3 py-2 text-xs leading-relaxed text-muted">
                反型：表面不像该号教科书形象，情欲仍在。误判常见于{" "}
                {s.lookalikes.map((id) => shortCode(id)).join("、")}。
              </p>
            )}
            <p className="mt-3">
              <Link
                to="/types/$id"
                params={{ id: slot.subtype }}
                className="text-sm text-primary underline-offset-4 hover:underline"
              >
                阅读完整条目
              </Link>
            </p>
          </article>
        );
      })}

      {r.compare && r.compare.length > 0 && (
        <section className="mt-8 rounded-xl border border-border bg-surface p-5">
          <h2 className="font-display text-lg font-medium">第三步对照</h2>
          <p className="mt-1 text-xs text-muted">
            按你前面的领先/次席与易混副型出题。滑向一边会改该区权重；两个都像不决胜；两个都不像两边降权。
          </p>
          <ul className="mt-4 divide-y divide-border overflow-hidden rounded-lg border border-border">
            {r.compare.map((o) => (
              <li key={o.id} className="px-3 py-2.5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="text-sm">
                    {o.leftLabel} ↔ {o.rightLabel}
                  </span>
                  <span className="text-xs text-muted">{o.note}</span>
                </div>
                <p className="mt-0.5 text-xs leading-relaxed text-subtle">{o.stem}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-8 overflow-hidden rounded-xl border border-border bg-surface">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
          onClick={() => setOpenCalc((v) => !v)}
          aria-expanded={openCalc}
        >
          <span>
            <span className="block font-display text-sm font-medium">专业数据与完整计算</span>
            <span className="mt-0.5 block text-xs text-muted">
              公式、中心排序、情欲差、副型差、强度与核验规则
            </span>
          </span>
          <ChevronDown
            className={`size-4 shrink-0 text-subtle transition-transform duration-200 ${openCalc ? "rotate-0" : "-rotate-90"}`}
          />
        </button>
        {openCalc && (
          <div className="border-t border-border px-5 py-4">
            <p className="text-xs leading-relaxed text-muted">{r.formula}</p>
            {r.calculation.map((step) => (
              <div key={step.title} className="mt-5">
                <h3 className="font-display text-sm font-medium">{step.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted">{step.detail}</p>
                {step.rows && (
                  <ul className="mt-2 divide-y divide-border overflow-hidden rounded-lg border border-border">
                    {step.rows.map((row) => (
                      <li key={row.label} className="px-3 py-2">
                        <div className="flex items-baseline justify-between gap-3">
                          <span className="text-sm">{row.label}</span>
                          <span className="shrink-0 font-display text-sm tabular-nums">
                            {row.value}
                          </span>
                        </div>
                        {row.note && (
                          <p className="mt-0.5 text-[0.7rem] leading-relaxed text-subtle">
                            {row.note}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}

            <h3 className="mt-6 font-display text-sm font-medium">九型情欲全表</h3>
            <ul className="mt-2">
              {r.typeScores.map((row) => {
                const t = TYPE_MAP[row.type];
                return (
                  <li
                    key={row.type}
                    className="flex items-center gap-3 border-b border-border py-2 last:border-0"
                  >
                    <span className="w-28 shrink-0 whitespace-nowrap text-sm">
                      {row.type} {t.passion}
                      <span className="ml-1 text-xs text-subtle">
                        {CENTER_LABEL[t.center]}
                      </span>
                    </span>
                    <ScoreBar value={row.pct} className="flex-1" />
                    <span className="w-12 text-right text-sm tabular-nums text-muted">
                      {row.pct.toFixed(0)}
                    </span>
                  </li>
                );
              })}
            </ul>

            <h3 className="mt-6 font-display text-sm font-medium">本能倾向</h3>
            <ul className="mt-2">
              {r.instinctScores.map((row) => {
                const inst = INSTINCTS.find((i) => i.id === row.instinct)!;
                return (
                  <li
                    key={row.instinct}
                    className="flex items-center gap-3 border-b border-border py-2 last:border-0"
                  >
                    <span className="w-20 shrink-0 text-sm">{inst.name}</span>
                    <ScoreBar value={row.pct} className="flex-1" tone="soft" />
                    <span className="w-12 text-right text-sm tabular-nums text-muted">
                      {row.pct.toFixed(0)}
                    </span>
                  </li>
                );
              })}
            </ul>

            <h3 className="mt-6 font-display text-sm font-medium">二十七副型剖面</h3>
            <ul className="mt-2">
              {r.subtypeScores.map((row, i) => {
                const s = SUBTYPE_MAP[row.id];
                const inTriad = r.triad.some((slot) => slot.subtype === row.id);
                return (
                  <li
                    key={row.id}
                    className="flex items-center gap-2 border-b border-border py-2 last:border-0"
                  >
                    <span className="w-5 text-xs tabular-nums text-subtle">{i + 1}</span>
                    <span className="w-32 shrink-0 truncate text-sm">
                      {shortCode(row.id)} {s.name}
                    </span>
                    <ScoreBar
                      value={row.pct}
                      className="flex-1"
                      tone={inTriad ? "ink" : "soft"}
                    />
                    <span className="w-12 text-right text-sm tabular-nums text-muted">
                      {row.pct.toFixed(0)}
                    </span>
                  </li>
                );
              })}
            </ul>

            {r.evidence.length > 0 && (
              <>
                <h3 className="mt-6 font-display text-sm font-medium">支持作答</h3>
                <ul className="mt-2 divide-y divide-border rounded-lg border border-border">
                  {r.evidence.map((e) => (
                    <li key={e.id} className="px-3 py-2.5 text-sm leading-relaxed text-muted">
                      {e.slot && (
                        <span className="mr-2 text-xs text-subtle">{triadToken(e.slot)}</span>
                      )}
                      {e.text}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}
      </section>

      <p className="mt-6 text-xs leading-relaxed text-subtle">
        纳兰霍的判型落在情欲、固着与本能副型。三元组取自伊查佐以来的三中心：每个中心一个号，顺序是你更从哪一区过日子。问卷不能替代数年自我观察。
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
            if (confirm("清除进度并换一套新的题目顺序重测？")) {
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

function Stat({ k, v }: { k: string; v: number }) {
  return (
    <div className="rounded-lg bg-surface-2 px-3 py-2">
      <p className="text-[0.7rem] text-subtle">{k}</p>
      <p className="font-display text-lg tabular-nums">{v.toFixed(0)}</p>
      <ScoreBar value={v} className="mt-1" tone="soft" />
    </div>
  );
}
