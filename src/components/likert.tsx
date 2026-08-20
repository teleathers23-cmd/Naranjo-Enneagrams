import { cn } from "@/lib/utils";

const STEPS = [0, 1, 2, 3, 4] as const;

export function LikeSlider({
  name,
  value,
  onChange,
  leftLabel = "不像我",
  rightLabel = "像我",
  disabled = false,
}: {
  name: string;
  value: number | undefined;
  onChange: (v: number) => void;
  leftLabel?: string;
  rightLabel?: string;
  disabled?: boolean;
}) {
  const set = value !== undefined && !disabled;
  return (
    <div className="pt-1">
      <div className="mb-1 flex justify-between text-xs text-muted">
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>
      <input
        type="range"
        min={0}
        max={4}
        step={1}
        name={name}
        aria-label={`${leftLabel}到${rightLabel}`}
        aria-valuemin={0}
        aria-valuemax={4}
        aria-valuenow={value ?? 2}
        aria-valuetext={set ? String(value) : "未选择"}
        value={value ?? 2}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className={cn(
          "range-slider",
          !set && "is-unset",
          disabled && "is-disabled",
        )}
      />
      <div className="mt-0.5 flex justify-between px-1">
        {STEPS.map((i) => (
          <button
            key={i}
            type="button"
            disabled={disabled}
            aria-label={`位置 ${i + 1}`}
            className={cn(
              "flex h-6 w-6 items-center justify-center",
              disabled && "opacity-40",
            )}
            onClick={() => onChange(i)}
          >
            <span
              className={cn(
                "block h-1.5 w-1.5 rounded-full",
                set && value === i ? "bg-fg" : "bg-border-strong",
              )}
            />
          </button>
        ))}
      </div>
      {!set && !disabled && (
        <p className="mt-1 text-center text-xs text-subtle">滑动选择</p>
      )}
    </div>
  );
}

/** @deprecated 五键量表已改为滑动条，保留别名以免旧引用报错 */
export function Likert(props: {
  name: string;
  value: number | undefined;
  onChange: (v: number) => void;
}) {
  return <LikeSlider {...props} />;
}
