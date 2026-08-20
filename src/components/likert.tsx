import { LIKERT_LABELS } from "@/lib/naranjo/questions";
import { cn } from "@/lib/utils";

export function Likert({
  name,
  value,
  onChange,
}: {
  name: string;
  value: number | undefined;
  onChange: (v: number) => void;
}) {
  return (
    <div
      className="grid grid-cols-5 gap-1.5"
      role="radiogroup"
      aria-label="符合程度"
    >
      {LIKERT_LABELS.map((label, i) => {
        const selected = value === i;
        return (
          <label
            key={label}
            className={cn(
              "flex min-h-11 cursor-pointer items-center justify-center rounded-md border px-1 py-2 text-center text-[0.68rem] leading-tight transition-[background-color,border-color,color] duration-150 sm:text-xs",
              selected
                ? "border-primary bg-primary text-primary-fg"
                : i < 2
                  ? "border-border bg-surface text-unlike hover:border-border-strong"
                  : i === 2
                    ? "border-border bg-surface text-mid hover:border-border-strong"
                    : "border-border bg-surface text-like hover:border-border-strong",
            )}
          >
            <input
              type="radio"
              className="sr-only"
              name={name}
              value={i}
              checked={selected}
              onChange={() => onChange(i)}
            />
            {label}
          </label>
        );
      })}
    </div>
  );
}
