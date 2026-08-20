import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { EnneagramGlyph } from "@/components/enneagram-glyph";
import { SiteShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { INSTINCTS, TYPES } from "@/lib/naranjo/catalog";
import { STAGE2, STEP1 } from "@/lib/naranjo/questions";
import { useTestStore } from "@/lib/naranjo/store";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const navigate = useNavigate();
  const stage = useTestStore((s) => s.stage);
  const answers = useTestStore((s) => s.answers);
  const reset = useTestStore((s) => s.reset);
  const hasProgress = Object.keys(answers).length > 0;
  const inProgress = hasProgress && stage !== "result";

  const startFresh = () => {
    if (hasProgress && !confirm("清除全部进度，并换一套新的题目顺序？")) return;
    reset();
    void navigate({ to: "/test" });
  };

  return (
    <SiteShell>
      <section className="flex flex-col items-center text-center">
        <EnneagramGlyph className="mb-6 size-28 text-primary sm:size-32" />
        <p className="mb-2 text-xs tracking-[0.22em] text-muted">
          CLAUDIO NARANJO · SAT
        </p>
        <h1 className="font-display text-[1.7rem] font-medium tracking-tight sm:text-4xl">
          27 Subtypes-The Enneagram
        </h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-muted sm:text-[0.95rem]">
          纳兰霍体系。结果是心–脑–腹三元组（如 sp3-so6-sp8）。完成后可导出 PDF；登录后能把结果保存在账户里。
        </p>
        <div className="mt-8 flex w-full max-w-sm flex-col gap-2 sm:flex-row sm:justify-center">
          {stage === "result" ? (
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link to="/result">查看结果</Link>
            </Button>
          ) : (
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link to="/test">{inProgress ? "继续作答" : "开始测验"}</Link>
            </Button>
          )}
          {hasProgress ? (
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto"
              onClick={startFresh}
            >
              重新开始
            </Button>
          ) : (
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
              <Link to="/types">阅读二十七性格</Link>
            </Button>
          )}
        </div>
        {hasProgress ? (
          <div className="mt-2">
            <Button asChild variant="ghost" size="sm">
              <Link to="/types">阅读二十七性格</Link>
            </Button>
          </div>
        ) : null}
        <p className="mt-4 text-xs text-subtle">
          三步混排 · 每次重新开始会打乱题目顺序 · 进度保存在本机浏览器
        </p>
        <p className="mt-2 text-xs text-muted">
          <Link to="/login" className="underline-offset-4 hover:underline">
            登录 / 注册
          </Link>
          后可把结果存进账户；不登录也能做完并导出 PDF。
        </p>
      </section>

      <section className="mt-14 grid gap-3 sm:grid-cols-3">
        {[
          {
            k: "01",
            t: "先定心脑腹，再定副型，最后对照",
            d: "题目打散混排，先测激情与固着，同时计算心脑腹重视。副型之后会按你的作答挑易混结构做强迫对照（例如社交二号与社交三号）。结果如 sp3-so6-sp8。",
          },
          {
            k: "02",
            t: "副型是性格，不是标签相加",
            d: "纳兰霍的二十七副型各有专名：担忧、坚忍、图腾、融合……反型看起来会不像该号。",
          },
          {
            k: "03",
            t: "强度与核验可展开",
            d: "每个位置给出强度（弱/中/强/极强）和核验（通过/倾向/待核）。完整公式在结果页展开。",
          },
        ].map((c) => (
          <article
            key={c.k}
            className="rounded-xl border border-border bg-surface p-5 text-left"
          >
            <p className="font-display text-xs tracking-widest text-subtle">{c.k}</p>
            <h2 className="mt-2 font-display text-base font-medium">{c.t}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{c.d}</p>
          </article>
        ))}
      </section>

      <section className="mt-12">
        <h2 className="font-display text-lg font-medium">三种本能</h2>
        <p className="mt-1 text-sm text-muted">
          本能不单独决定类型。它使同一情欲长成三种不同性格。性本能是一对一的强度，对象可以是人、事或物，不限于情爱。
        </p>
        <ul className="mt-4 grid gap-3 sm:grid-cols-3">
          {INSTINCTS.map((i) => (
            <li key={i.id} className="rounded-xl border border-border bg-surface p-4">
              <p className="text-xs tracking-wide text-subtle">{i.nameEs}</p>
              <p className="mt-1 font-medium">{i.name}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">{i.brief}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-lg font-medium">九种情欲</h2>
        <ol className="mt-4 divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface">
          {TYPES.map((t) => (
            <li key={t.id} className="flex items-start gap-4 px-4 py-3.5">
              <span className="font-display w-6 shrink-0 text-lg text-primary">
                {t.id}
              </span>
              <div>
                <p className="text-sm font-medium">
                  {t.passion}
                  <span className="ml-2 text-xs font-normal text-subtle">
                    {t.passionEs} · {t.fixation}
                  </span>
                </p>
                <p className="mt-1 text-sm leading-relaxed text-muted">{t.brief}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <p className="mt-10 text-center text-xs text-subtle">
        第一步 {STEP1.length} 题混排（含效度题），第二步每个中心的领先类型 × {STAGE2.length / 9}{" "}
        题，第三步按易混结构动态对照（含「两个都像我 / 两个都不像我」）。
      </p>
    </SiteShell>
  );
}
