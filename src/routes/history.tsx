import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteShell } from "@/components/site-shell";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { SUBTYPE_MAP, shortCode, subtypeLabel, type SubtypeId } from "@/lib/naranjo/catalog";
import { listMyResults, type SavedResultRow } from "@/lib/results";

export const Route = createFileRoute("/history")({ component: HistoryPage });

function HistoryPage() {
  const { user, isPending } = useCurrentUserState();
  const [rows, setRows] = useState<SavedResultRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isPending || !user || user.isDevFallback) return;
    listMyResults()
      .then(setRows)
      .catch(() => setError("无法读取记录"));
  }, [user, isPending]);

  if (isPending) {
    return (
      <SiteShell>
        <div className="h-24 animate-pulse rounded-xl bg-surface-2" />
      </SiteShell>
    );
  }
  if (!user || user.isDevFallback) return <RedirectToSignIn />;

  return (
    <SiteShell>
      <h1 className="font-display text-3xl font-medium">我的记录</h1>
      <p className="mt-2 text-sm text-muted">保存在账户中的测验结果。</p>
      {error && <p className="mt-4 text-sm text-danger">{error}</p>}
      {rows && rows.length === 0 && (
        <p className="mt-6 text-sm text-muted">
          还没有保存过。完成测验后点「保存到账户」。
        </p>
      )}
      <ul className="mt-6 space-y-3">
        {rows?.map((r) => {
          const triad =
            r.result && typeof r.result === "object" ? r.result.triadCode : undefined;
          const primary =
            r.result && typeof r.result === "object" && r.result.primary
              ? r.result.primary
              : (r.primary_subtype.includes("-") ? undefined : (r.primary_subtype as SubtypeId));
          const s = primary ? SUBTYPE_MAP[primary] : undefined;
          return (
            <li key={r.id} className="rounded-xl border border-border bg-surface p-4">
              <p className="text-xs text-subtle">
                {new Date(r.created_at).toLocaleString("zh-CN")}
              </p>
              <p className="mt-1 font-display text-lg font-medium">
                {triad ?? (s ? `${shortCode(primary!)} ${subtypeLabel(primary!)}` : r.primary_subtype)}
              </p>
              {r.tester_name ? (
                <p className="mt-1 text-xs text-muted">测试者：{r.tester_name}</p>
              ) : null}
              {s && (
                <Link
                  to="/types/$id"
                  params={{ id: primary! }}
                  className="mt-2 inline-block text-sm text-primary underline-offset-4 hover:underline"
                >
                  查看第一区副型
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </SiteShell>
  );
}
