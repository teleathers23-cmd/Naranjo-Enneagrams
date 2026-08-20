import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { EnneagramGlyph } from "@/components/enneagram-glyph";
import { SiteShell } from "@/components/site-shell";
import { Badge } from "@/components/ui/badge";
import {
  INSTINCTS,
  SUBTYPE_MAP,
  SUBTYPES,
  TYPE_MAP,
  shortCode,
  subtypeLabel,
  type SubtypeId,
} from "@/lib/naranjo/catalog";

export const Route = createFileRoute("/types/$id")({
  component: SubtypePage,
});

function SubtypePage() {
  const { id } = Route.useParams();
  const subtype = SUBTYPE_MAP[id as SubtypeId];
  if (!subtype) throw notFound();
  const type = TYPE_MAP[subtype.type];
  const inst = INSTINCTS.find((i) => i.id === subtype.instinct)!;
  const siblings = SUBTYPES.filter((s) => s.type === subtype.type && s.id !== subtype.id);

  return (
    <SiteShell>
      <p className="text-xs text-muted">
        <Link to="/types" className="hover:text-fg">
          二十七性格
        </Link>
        <span className="mx-1.5">/</span>
        {shortCode(subtype.id)}
      </p>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-3xl font-medium">{subtype.name}</h1>
            {subtype.countertype && <Badge>反型</Badge>}
          </div>
          <p className="mt-2 text-sm text-muted">
            {subtypeLabel(subtype.id)} · {subtype.nameEs} · {subtype.nameEn}
          </p>
        </div>
        <EnneagramGlyph className="size-16 text-primary" highlight={subtype.type} />
      </div>

      <p className="mt-6 text-base leading-relaxed">{subtype.oneLiner}</p>
      <p className="mt-4 text-sm leading-relaxed text-muted">{subtype.portrait}</p>

      <ul className="mt-6 space-y-2 rounded-xl border border-border bg-surface p-5 text-sm">
        {subtype.markers.map((m) => (
          <li key={m} className="flex gap-2">
            <span className="mt-2 size-1 shrink-0 rounded-full bg-primary" />
            {m}
          </li>
        ))}
      </ul>

      <dl className="mt-6 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
        {[
          ["情欲", type.passion],
          ["固着", type.fixation],
          ["美德", type.virtue],
          ["本能", inst.name],
        ].map(([k, v]) => (
          <div key={k} className="rounded-xl border border-border bg-surface px-3 py-3">
            <dt className="text-xs text-subtle">{k}</dt>
            <dd className="mt-1 font-medium">{v}</dd>
          </div>
        ))}
      </dl>

      <section className="mt-8">
        <h2 className="font-display text-lg font-medium">同号另外两副型</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {siblings.map((s) => (
            <Link
              key={s.id}
              to="/types/$id"
              params={{ id: s.id }}
              className="rounded-xl border border-border bg-surface p-4 hover:border-border-strong"
            >
              <p className="text-xs text-subtle">{shortCode(s.id)}</p>
              <p className="mt-1 font-medium">{s.name}</p>
              <p className="mt-1 text-sm text-muted">{s.oneLiner}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-lg font-medium">相邻误判</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {subtype.lookalikes.map((lid) => {
            const s = SUBTYPE_MAP[lid];
            return (
              <Link
                key={lid}
                to="/types/$id"
                params={{ id: lid }}
                className="rounded-full border border-border bg-surface px-3 py-1.5 text-sm hover:border-border-strong"
              >
                {shortCode(lid)} {s.name}
              </Link>
            );
          })}
        </div>
      </section>
    </SiteShell>
  );
}
