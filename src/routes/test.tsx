import { createFileRoute, Navigate, useNavigate } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { TesterNameModal } from "@/components/tester-name-modal";
import { CompareBlock } from "@/components/compare-block";
import { QuestionBlock } from "@/components/question-block";
import { SiteShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import {
  shownCompareQuestions,
  STAGE3_HELP,
  type CompareQuestion,
} from "@/lib/naranjo/compare";
import {
  STEP1,
  STAGE2_HELP,
  TEST_INSTRUCTION,
  BANK_REVISION,
  chunkQuestions,
  interleaveQuestions,
  type Question,
} from "@/lib/naranjo/questions";
import { stage2QuestionsFor, unanswered } from "@/lib/naranjo/scoring";
import { useTestStore } from "@/lib/naranjo/store";

export const Route = createFileRoute("/test")({ component: TestPage });

function TestPage() {
  const navigate = useNavigate();
  const stage = useTestStore((s) => s.stage);
  const hydrated = useTestStore((s) => s.hydrated);
  const answers = useTestStore((s) => s.answers);
  const stage2Types = useTestStore((s) => s.stage2Types);
  const stage3Ids = useTestStore((s) => s.stage3Ids);
  const shuffleSeed = useTestStore((s) => s.shuffleSeed);
  const setAnswer = useTestStore((s) => s.setAnswer);
  const goStage2 = useTestStore((s) => s.goStage2);
  const goStage3 = useTestStore((s) => s.goStage3);
  const finish = useTestStore((s) => s.finish);
  const back = useTestStore((s) => s.back);
  const reset = useTestStore((s) => s.reset);
  const nameAsked = useTestStore((s) => s.nameAsked);
  const testerName = useTestStore((s) => s.testerName);
  const setTesterName = useTestStore((s) => s.setTesterName);

  const [showHelp, setShowHelp] = useState(false);
  const [missing, setMissing] = useState<string[]>([]);

  const questions: Question[] = useMemo(() => {
    if (stage === 1) return interleaveQuestions(STEP1, shuffleSeed || 1);
    if (stage === 2) return stage2QuestionsFor(stage2Types, shuffleSeed || 1);
    return [];
  }, [stage, stage2Types, shuffleSeed]);

  const compareItems: CompareQuestion[] = useMemo(() => {
    if (stage !== 3) return [];
    return shownCompareQuestions(stage3Ids, shuffleSeed || 1);
  }, [stage, stage3Ids, shuffleSeed]);

  const groups = useMemo(
    () =>
      chunkQuestions(questions, 9).map((items, i) => ({
        key: `g${i}`,
        title: `第 ${i + 1} 组`,
        desc:
          stage === 1
            ? "中心注意、激情与固着混排。不要猜这是哪一号。"
            : "副型句子混排。按结构本身作答。",
        items,
      })),
    [questions, stage],
  );

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

  const total = stage === 3 ? compareItems.length : questions.length;
  const done =
    stage === 3
      ? compareItems.filter((q) => answers[q.id] !== undefined).length
      : questions.filter((q) => answers[q.id] !== undefined).length;

  const jumpMissing = () => {
    const ids =
      stage === 3
        ? compareItems.filter((q) => answers[q.id] === undefined).map((q) => q.id)
        : unanswered(questions, answers);
    setMissing(ids);
    if (ids[0]) {
      document.getElementById(`q-${ids[0]}`)?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  const onNext = () => {
    const ids =
      stage === 3
        ? compareItems.filter((q) => answers[q.id] === undefined).map((q) => q.id)
        : unanswered(questions, answers);
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
    if (stage === 2) {
      goStage3();
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    finish();
    void navigate({ to: "/result" });
  };

  const stageTitle =
    stage === 1
      ? "第一步：激情与固着（混排）"
      : stage === 2
        ? "第二步：副型结构（混排）"
        : "第三步：易混结构对照";

  const nextLabel =
    stage === 1 ? "进入第二步" : stage === 2 ? "进入对照" : "查看结果";

  return (
    <SiteShell>
      {hydrated && !nameAsked && (
        <TesterNameModal onConfirm={setTesterName} />
      )}
      <div className="fixed inset-x-0 top-0 z-40 h-0.5 bg-border">
        <div
          className="h-full bg-primary transition-[width] duration-300"
          style={{
            width: `${total ? (done / total) * 100 : 0}%`,
          }}
        />
      </div>

      <header className="text-center">
        <h1 className="font-display text-2xl font-medium">纳兰霍二十七副型测验</h1>
        <p className="mt-1 text-sm text-muted">{stageTitle}</p>
        <p className="mt-1 text-[11px] tracking-wide text-subtle">
          题库 {BANK_REVISION} · 情欲 / 副型 / 对照已全部更换
        </p>
        <p className="mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs font-medium text-muted">
          <span>本步 {total} 题</span>
          <span>已完成 {done} 题</span>
          <span>
            本页 {done}／{total}
          </span>
        </p>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs text-subtle">
            {testerName ? `测试者：${testerName} · ` : ""}
            进度将自动保存在当前浏览器
          </span>
          <button
            type="button"
            className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted hover:text-fg"
            onClick={() => setShowHelp((v) => !v)}
          >
            {showHelp ? "收起说明" : "如何作答"}
          </button>
          <button
            type="button"
            className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-unlike hover:text-fg"
            onClick={() => {
              if (confirm("清除全部进度并换一套新的题目顺序？")) reset();
            }}
          >
            清除进度／重新开始
          </button>
        </div>
        <p className="mx-auto mt-3 max-w-xl rounded-lg border border-border bg-surface px-3 py-2 text-xs leading-relaxed text-subtle">
          {stage === 3 ? STAGE3_HELP : TEST_INSTRUCTION}
        </p>
        {showHelp && (
          <div className="mx-auto mt-4 max-w-xl rounded-xl border border-border bg-surface p-4 text-left text-sm leading-relaxed text-muted">
            {stage === 1 ? (
              <ul className="space-y-2">
                <li>滑动选择：左端是不像我，右端是像我。不要停在正中图省事。</li>
                <li>不要按社会赞许或「我应该是好人」来选。</li>
                <li>不要猜题目属于哪一号。题目已打散，没有型号分区。</li>
                <li>测的是注意如何组织（激情与固着），不是你做了什么事。</li>
                <li>全选极端、全选中立、或正反句子都拉到「像我」，权重会被下调。</li>
              </ul>
            ) : stage === 2 ? (
              <p>{STAGE2_HELP}</p>
            ) : (
              <ul className="space-y-2">
                <li>左右是两种内在运作。滑向更像的一边。</li>
                <li>如果两边写的都是你，选「两个都像我」——这会当作重叠，不决胜。</li>
                <li>如果两边都不是你，选「两个都不像我」——两边都会降权。</li>
                <li>不要猜测这是哪两个副型。</li>
              </ul>
            )}
          </div>
        )}
      </header>

      {stage === 3 ? (
        <div className="mt-8 space-y-4">
          {compareItems.map((q, i) => (
            <CompareBlock
              key={q.id}
              question={q}
              index={i}
              value={answers[q.id]}
              onChange={(v) => setAnswer(q.id, v)}
              highlight={missing.includes(q.id)}
            />
          ))}
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {groups.map((g) => (
            <Section key={g.key} title={g.title} desc={g.desc}>
              {g.items.map((q) => (
                <QuestionBlock
                  key={q.id}
                  question={q}
                  index={questions.findIndex((x) => x.id === q.id)}
                  value={answers[q.id]}
                  onChange={(v) => setAnswer(q.id, v)}
                  highlight={missing.includes(q.id)}
                />
              ))}
            </Section>
          ))}
        </div>
      )}

      <div className="mt-8 flex flex-col items-center gap-3">
        <div className="flex w-full max-w-md gap-2">
          {stage !== 1 && (
            <Button variant="secondary" className="flex-1" onClick={() => back()}>
              返回上一步
            </Button>
          )}
          <Button className="flex-1" onClick={onNext}>
            {nextLabel}
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
