import { cn } from "@/lib/utils";

export function ScoreBar({
  value,
  className,
  tone = "ink",
}: {
  value: number;
  className?: string;
  tone?: "ink" | "soft";
}) {
  const w = Math.max(0, Math.min(100, value));
  return (
    <div
      className={cn(
        "h-1.5 overflow-hidden rounded-full bg-surface-2",
        className,
      )}
    >
      <div
        className={cn(
          "h-full rounded-full transition-[width] duration-500 ease-out",
          tone === "ink" ? "bg-primary" : "bg-muted",
        )}
        style={{ width: `${w}%` }}
      />
    </div>
  );
}
