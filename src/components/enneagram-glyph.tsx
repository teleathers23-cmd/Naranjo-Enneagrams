import { cn } from "@/lib/utils";

const R = 46;
const CX = 50;
const CY = 50;

function pt(n: number) {
  const step = n === 9 ? 0 : n;
  const angle = ((-90 + step * 40) * Math.PI) / 180;
  return [CX + R * Math.cos(angle), CY + R * Math.sin(angle)] as const;
}

const points = [9, 1, 2, 3, 4, 5, 6, 7, 8].map((n) => ({ n, p: pt(n) }));
const hex = [1, 4, 2, 8, 5, 7, 1].map(pt);
const tri = [9, 3, 6, 9].map(pt);

export function EnneagramGlyph({
  className,
  highlight,
}: {
  className?: string;
  highlight?: number;
}) {
  return (
    <svg viewBox="0 0 100 100" className={cn("text-fg", className)} aria-hidden>
      <circle
        cx={CX}
        cy={CY}
        r={R}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity="0.9"
      />
      <polyline
        points={hex.map((p) => p.join(",")).join(" ")}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.05"
        opacity="0.75"
      />
      <polyline
        points={tri.map((p) => p.join(",")).join(" ")}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      {points.map(({ n, p }) => {
        const on = highlight === n;
        return (
          <circle
            key={n}
            cx={p[0]}
            cy={p[1]}
            r={on ? 3.4 : 2.2}
            fill={on ? "currentColor" : "var(--color-bg)"}
            stroke="currentColor"
            strokeWidth="1.1"
          />
        );
      })}
    </svg>
  );
}
