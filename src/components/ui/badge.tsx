import { cn } from "@/lib/utils";

export function Badge({
  className,
  tone = "default",
  ...props
}: React.ComponentProps<"span"> & {
  tone?: "default" | "accent" | "warn" | "muted";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[0.7rem] font-medium tracking-wide",
        tone === "default" && "bg-primary text-primary-fg",
        tone === "accent" && "bg-surface-2 text-fg border border-border",
        tone === "warn" && "bg-surface-2 text-mid border border-border",
        tone === "muted" && "bg-transparent text-muted border border-border",
        className,
      )}
      {...props}
    />
  );
}
