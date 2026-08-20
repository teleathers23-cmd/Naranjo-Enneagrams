import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { Badge } from "@/components/ui/badge";
import {
  INSTINCTS,
  SUBTYPES,
  TYPES,
  numberZh,
  shortCode,
} from "@/lib/naranjo/catalog";

export const Route = createFileRoute("/types/")({ component: TypesIndex });

function TypesIndex() {
  return (
    <SiteShell>
      <p className="text-xs tracking-[0.18em] text-muted">NARANJO · 27</p>
      <h1 className="mt-2 font-display text-3xl font-medium">二十七性格</h1>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
        按纳兰霍：九种情欲，各三种本能变体。专名来自 SAT。反型是同一情欲的相反姿态。条目写的是神经症结构，不是流行九型的优点清单。
      </p>

      <div className="mt-8 space-y-10">
        {TYPES.map((t) => (
          <section key={t.id}>
            <div className="mb-3 flex items-end justify-between gap-3">
              <h2 className="font-display text-xl font-medium">
                {numberZh(t.id)}号 · {t.passion}
              </h2>
              <span className="text-xs text-subtle">{t.passionEs}</span>
            </div>
            <p className="mb-4 text-sm text-muted">{t.brief}</p>
            <div className="grid gap-3 sm:grid-cols-3">
              {SUBTYPES.filter((s) => s.type === t.id).map((s) => {
                const inst = INSTINCTS.find((i) => i.id === s.instinct)!;
                return (
                  <Link
                    key={s.id}
                    to="/types/$id"
                    params={{ id: s.id }}
                    className="rounded-xl border border-border bg-surface p-4 hover:border-border-strong"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs tracking-wide text-subtle">
                        {shortCode(s.id)} · {inst.name}
                      </span>
                      {s.countertype && <Badge tone="muted">反型</Badge>}
                    </div>
                    <p className="mt-2 font-display text-lg font-medium">{s.name}</p>
                    <p className="mt-1 text-xs text-subtle">{s.nameEs}</p>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{s.oneLiner}</p>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </SiteShell>
  );
}
