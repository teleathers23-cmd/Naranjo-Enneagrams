import { LikeSlider } from "@/components/likert";
import {
  COMPARE_BOTH,
  COMPARE_NEITHER,
  type CompareQuestion,
} from "@/lib/naranjo/compare";
import { cn } from "@/lib/utils";

export function CompareBlock({
  question,
  index,
  value,
  onChange,
  highlight,
}: {
  question: CompareQuestion;
  index: number;
  value: number | undefined;
  onChange: (v: number) => void;
  highlight?: boolean;
}) {
  const both = value === COMPARE_BOTH;
  const neither = value === COMPARE_NEITHER;
  const sliderOn = value !== undefined && value >= 0 && value <= 4;
  const leanLeft = sliderOn && value <= 1;
  const leanRight = sliderOn && value >= 3;

  return (
    <div
      id={`q-${question.id}`}
      className={cn(
        "scroll-mt-16 rounded-xl border bg-surface p-4 sm:p-5",
        highlight ? "border-danger/40" : "border-border",
      )}
    >
      <p className="text-sm leading-relaxed text-fg">
        <span className="mr-2 font-medium text-subtle">{index + 1}.</span>
        {question.stem}
      </p>

      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => onChange(0)}
          className={cn(
            "rounded-lg border px-3 py-3 text-left text-sm leading-relaxed transition-[background-color,border-color] duration-150",
            leanLeft
              ? "border-unlike bg-pole-left text-fg"
              : "border-border bg-pole-left/70 text-fg hover:border-border-strong",
          )}
        >
          <span className="mb-1 block text-xs text-muted">左</span>
          {question.left.text}
        </button>
        <button
          type="button"
          onClick={() => onChange(4)}
          className={cn(
            "rounded-lg border px-3 py-3 text-left text-sm leading-relaxed transition-[background-color,border-color] duration-150",
            leanRight
              ? "border-like bg-pole-right text-fg"
              : "border-border bg-pole-right/70 text-fg hover:border-border-strong",
          )}
        >
          <span className="mb-1 block text-xs text-muted">右</span>
          {question.right.text}
        </button>
      </div>

      <div className="mt-4">
        <LikeSlider
          name={question.id}
          value={sliderOn ? value : undefined}
          onChange={onChange}
          leftLabel="更像左边"
          rightLabel="更像右边"
        />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onChange(COMPARE_BOTH)}
          className={cn(
            "rounded-full border px-3 py-2.5 text-center text-sm transition-[background-color,border-color] duration-150",
            both
              ? "border-like bg-pole-both text-fg"
              : "border-border bg-pole-both/80 text-muted hover:text-fg",
          )}
        >
          两个都像我
        </button>
        <button
          type="button"
          onClick={() => onChange(COMPARE_NEITHER)}
          className={cn(
            "rounded-full border px-3 py-2.5 text-center text-sm transition-[background-color,border-color] duration-150",
            neither
              ? "border-unlike bg-pole-none text-fg"
              : "border-border bg-pole-none/80 text-muted hover:text-fg",
          )}
        >
          两个都不像我
        </button>
      </div>
    </div>
  );
}
