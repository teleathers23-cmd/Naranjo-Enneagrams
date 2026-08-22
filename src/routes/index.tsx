import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { EnneagramGlyph } from "@/components/enneagram-glyph";
import { SiteShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { INSTINCTS, TYPES } from "@/lib/naranjo/catalog";
import { STEP1_SHOWN_N } from "@/lib/naranjo/questions";
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
        <div className="mt-3 max-w-3xl space-y-3 text-sm leading-relaxed text-muted">
          <p>
            在纳兰霍（Claudio Naranjo）的类型学体系中，三种本能并不独立决定性格类型。它们与九种基本情欲/激情（pasiones）相互作用，使同一种情欲在不同本能优势的调制下，分化为三种具有明确结构差异的性格表达（即二十七种亚型）。本能在此扮演的是“能量导向与注意焦点”的角色，而非类型本身的决定因素。
          </p>
          <p>
            性本能尤其需要澄清：它并非狭义的情爱或生殖驱力，而是指向一对一关系中的强度、吸引、选择与能量传递。其对象可以是人、事或物，这一焦点具有排他的单一性，并不限于情爱领域。
          </p>
        </div>
        <ul className="mt-5 grid gap-3 sm:grid-cols-3">
          {INSTINCTS.map((i) => (
            <li key={i.id} className="rounded-xl border border-border bg-surface p-4">
              <p className="text-xs tracking-wide text-subtle">{i.nameEs}</p>
              <p className="mt-1 font-medium">{i.name}本能</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">{i.brief}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-lg font-medium">九种情欲</h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted">
          在纳兰霍的性格学体系中，九种情欲（pasiones）构成各类型的核心情绪动力。它们并非短暂的情绪反应，而是长期固化的情绪—认知结构，源于相应美德的缺失，并与主导本能结合后进一步塑造成具体的性格表达。以下依纳兰霍原著中的概念框架予以表述：
        </p>
        <ol className="mt-5 divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface">
          {TYPES.map((t) => (
            <li key={t.id} className="flex items-start gap-4 px-4 py-3.5">
              <span className="font-display w-6 shrink-0 text-lg text-primary">
                {t.id}
              </span>
              <div>
                <p className="text-sm font-medium">
                  {t.passion}（{t.passionEs}）
                  <span className="ml-2 text-xs font-normal text-subtle">
                    · {t.fixation}（{t.fixationEs}）
                  </span>
                </p>
                <p className="mt-1 text-sm leading-relaxed text-muted">{t.brief}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted">
          上述九种情欲构成纳兰霍“情欲—固着—美德”三元组的核心环节。它们与三种本能交互作用后，进一步分化为二十七种具体的亚型结构。
        </p>
      </section>

      <p className="mt-10 text-center text-xs text-subtle">
        第一步约 {STEP1_SHOWN_N}{" "}
        题（每型等权随机抽取，含中心与效度），第二步对筛出的型号出副型题，第三步按易混结构动态对照（含「两个都像我 / 两个都不像我」）。
      </p>
    </SiteShell>
  );
}
