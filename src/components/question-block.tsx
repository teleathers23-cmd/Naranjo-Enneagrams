import { useState } from "react";
import { LikeSlider } from "@/components/likert";
import type { Question } from "@/lib/naranjo/questions";
import { cn } from "@/lib/utils";

export function QuestionBlock({
  question,
  index,
  value,
  onChange,
  highlight,
}: {
  question: Question;
  index: number;
  value: number | undefined;
  onChange: (v: number) => void;
  highlight?: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div
      id={`q-${question.id}`}
      className={cn(
        "scroll-mt-16 rounded-lg border bg-surface-2/40 p-3.5 sm:p-4",
        highlight ? "border-danger/40" : "border-transparent",
      )}
    >
      <p className="text-sm leading-relaxed text-fg">
        <span className="mr-2 font-medium text-subtle">{index + 1}.</span>
        {question.text.includes("秩序一破就危险") ||
        question.text.includes("我很小就会为马虎和乱坐立不安")
          ? "（本题已下线，请清除进度后重测）"
          : question.text}
        {question.help && (
          <button
            type="button"
            className="ml-1.5 inline-flex size-5 items-center justify-center rounded-full border border-border text-xs text-muted"
            aria-label="本题说明"
            onClick={() => setOpen((v) => !v)}
          >
            ?
          </button>
        )}
      </p>
      {open && question.help && (
        <p className="mt-2 border-l-2 border-border-strong pl-3 text-xs leading-relaxed text-muted">
          {question.help}
        </p>
      )}
      <div className="mt-3">
        <LikeSlider name={question.id} value={value} onChange={onChange} />
      </div>
    </div>
  );
}
