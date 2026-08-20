import { createFileRoute, Navigate, useNavigate } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { QuestionBlock } from "@/components/question-block";
import { SiteShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { CENTER_LABEL, numberZh, TYPE_MAP, TYPES } from "@/lib/naranjo/catalog";
import { STAGE1, STAGE1_HELP, STAGE2_HELP, type Question } from "@/lib/naranjo/questions";
import { stage2QuestionsFor, unanswered } from "@/lib/naranjo/scoring";
import { useTestStore } from "@/lib/naranjo/store";

export const Route = createFileRoute("/test")({ component: TestPage });

function TestPage() {
  const navigate = useNavigate();
  const stage = useTestStore((s) => s.stage);
  const hydrated = useTestStore((s) => s.hydrated);
  const answers = useTestStore((s) => s.answers);
  const stage2Types = useTestStore((s) => s.stage2Types);
  const setAnswer = useTestStore((s) => s.setAnswer);
  const goStage2 = useTestStore((s) => s.goStage2);
  const finish = useTestStore((s) => s.finish);
  const back = useTestStore((s) => s.back);
  const reset = useTestStore((s) => s.reset);

  const [showHelp, setShowHelp] = useState(false);
  const [missing, setMissing] = useState<string[]>([]);

  const questions: Question[] = useMemo(
    () => (stage === 1 ? STAGE1 : stage2QuestionsFor(stage2Types)),
    [stage, stage2Types],
  );

  const groups = useMemo(() => {
    if (stage === 1) {
      const order: Array<"gut" | "heart" | "head"> = ["gut", "heart", "head"];
      return order.map((center) => ({
        key: center,
        title: `${CENTER_LABEL[center]} · 情欲`,
        desc: TYPES.filter((t) => t.center === center)
          .map((t) => `${t.id}号${t.passion}`)
          .join("、"),
        items: STAGE1.filter((q) => q.type && TYPE_MAP[q.type].center === center),
      }));
    }
    return stage2Types.map((type) => {
      const t = TYPE_MAP[type];
      return {
        key: `t${type}`,
        title: `${numberZh(type)}号 · ${t.passion}`,
        desc: STAGE1_HELP[type],
        items: questions.filter((q) => q.type === type),
      };
    });
  }, [stage, stage2Types, questions]);

  if (!hydrated) {
    return (
      <SiteShell>
        <div className="mx-auto h-40 max-w-xl animate-pulse rounded-xl bg-surface-2" />
      </SiteShell>
    );
  }

  if (!hydrated) {
    return (
      <SiteShell>
        <div className="mx-auto h-40 max-w-xl animate-pulse rounded-xl bg-surface-2" />
      </SiteShell>
    );
  }

  if (hydrated && stage === "result") {
    return <Navigate to="/result" />;
  }

  const done = questions.filter((q) => answers[q.id] !== undefined).length;
  const estimate = stage === 1 ? STAGE1.length + 27 : questions.length;

  const jumpMissing = () => {
    const ids = unanswered(questions, answers);
    setMissing(ids);
    if (ids[0]) {
      document.getElementById(`q-${ids[0]}`)?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  const onNext = () => {
    const ids = unanswered(questions, answers);
    if (ids.length) {
      setMissing(ids);
      document.getElementById(`q-${ids[0]}`)?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    }
    setMissing([]);
    if (stage === 1) {
      goStage2();
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    finish();
    void navigate({ to: "/result" });
  };

  return (
    <SiteShell>
      <div className="fixed inset-x-0 top-0 z-40 h-0.5 bg-border">
        <div
          className="h-full bg-primary transition-[width] duration-300"
          style={{
            width: `${questions.length ? (done / questions.length) * 100 : 0}%`,
          }}
        />
      </div>

      <header className="text-center">
        <h1 className="font-display text-2xl font-medium">纳兰霍二十七副型测验</h1>
        <p className="mt-1 text-sm text-muted">
          {stage === 1 ? "第一步：九型情欲初筛" : "第二步：副型性格鉴别"}
        </p>
        <p className="mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs font-medium text-muted">
          <span>本步 {questions.length} 题</span>
          <span>已完成 {done} 题</span>
          <span>
            本页 {done}／{questions.length}
          </span>
          {stage === 1 && <span>全程约 {estimate} 题</span>}
        </p>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
          <span className="text-[0.7rem] text-subtle">进度将自动保存在当前浏览器</span>
          <button
            type="button"
            className="rounded-full border border-border bg-surface px-3 py-1 text-[0.7rem] text-muted hover:text-fg"
            onClick={() => setShowHelp((v) => !v)}
          >
            {showHelp ? "收起考察内容" : "查看考察内容"}
          </button>
          <button
            type="button"
            className="rounded-full border border-border bg-surface px-3 py-1 text-[0.7rem] text-unlike hover:text-fg"
            onClick={() => {
              if (confirm("清除全部进度并从头开始？")) reset();
            }}
          >
            清除进度／重新开始
          </button>
        </div>
        <p className="mx-auto mt-3 max-w-xl rounded-lg border border-border bg-surface px-3 py-2 text-[0.72rem] leading-relaxed text-subtle">
          继续作答即表示同意将答案保存在本机；登录后可选择写入账户以便回看。不收集邮箱以外的联系方式。
        </p>
        {showHelp && (
          <div className="mx-auto mt-4 max-w-xl rounded-xl border border-border bg-surface p-4 text-left text-sm leading-relaxed text-muted">
            {stage === 1 ? (
              <ul className="space-y-2">
                {TYPES.map((t) => (
                  <li key={t.id}>
                    <span className="font-medium text-fg">
                      {t.id}号 {t.passion}：
                    </span>
                    {STAGE1_HELP[t.id]}
                  </li>
                ))}
              </ul>
            ) : (
              <p>{STAGE2_HELP}</p>
            )}
          </div>
        )}
      </header>

      <div className="mt-8 space-y-4">
        {groups.map((g) => (
          <Section key={g.key} title={g.title} desc={g.desc}>
            {g.items.map((q, i) => (
              <QuestionBlock
                key={q.id}
                question={q}
                index={i}
                value={answers[q.id]}
                onChange={(v) => setAnswer(q.id, v)}
                highlight={missing.includes(q.id)}
              />
            ))}
          </Section>
        ))}
      </div>

      <div className="mt-8 flex flex-col items-center gap-3">
        <div className="flex w-full max-w-md gap-2">
          {stage === 2 && (
            <Button variant="secondary" className="flex-1" onClick={() => back()}>
              返回上一步
            </Button>
          )}
          <Button className="flex-1" onClick={onNext}>
            {stage === 1 ? "进入第二步" : "查看结果"}
          </Button>
        </div>
        {missing.length > 0 && (
          <button
            type="button"
            className="text-sm text-danger underline-offset-4 hover:underline"
            onClick={jumpMissing}
          >
            还有 {missing.length} 题未作答 · 点击定位
          </button>
        )}
      </div>
    </SiteShell>
  );
}

function Section({
  title,
  desc,
  children,
}: {
  title: string;
  desc: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <section className="overflow-hidden rounded-xl border border-border bg-surface">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-3 bg-surface-2/80 px-4 py-3.5 text-left"
        onClick={() => setOpen((v) => !v)}
      >
        <span>
          <span className="block font-display text-sm font-medium">{title}</span>
          <span className="mt-0.5 block text-xs text-muted">{desc}</span>
        </span>
        <ChevronDown
          className={`size-4 shrink-0 text-subtle transition-transform duration-200 ${open ? "rotate-0" : "-rotate-90"}`}
        />
      </button>
      {open && <div className="space-y-3 p-3 sm:p-4">{children}</div>}
    </section>
  );
}
