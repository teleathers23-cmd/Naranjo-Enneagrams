import { createFileRoute, Link, Navigate, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FLAG_LABEL } from "@/lib/naranjo/scoring";
import {
  adminLogout,
  adminMe,
  listSubmissions,
  type SubmissionListRow,
} from "@/lib/submissions";

export const Route = createFileRoute("/admin/")({
  component: AdminListPage,
});

function formatTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("zh-CN", { hour12: false });
}

function AdminListPage() {
  const navigate = useNavigate();
  const [ok, setOk] = useState<boolean | null>(null);
  const [rows, setRows] = useState<SubmissionListRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let live = true;
    adminMe()
      .then(async (m) => {
        if (!live) return;
        setOk(m.ok);
        if (!m.ok) return;
        try {
          const list = await listSubmissions();
          if (live) setRows(list);
        } catch {
          if (live) setError("无法读取记录。若刚上线，请确认数据库已迁移。");
        }
      })
      .catch(() => {
        if (live) setOk(false);
      });
    return () => {
      live = false;
    };
  }, []);

  if (ok === false) return <Navigate to="/admin/login" />;

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs tracking-[0.18em] text-muted">ADMIN</p>
          <h1 className="mt-1 font-display text-3xl font-medium">测验记录</h1>
          <p className="mt-2 text-sm text-muted">
            完成测验即写入。点一行查看完整结果。共 {rows?.length ?? "…"} 条。
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            void adminLogout().then(() => navigate({ to: "/admin/login" }));
          }}
        >
          退出
        </Button>
      </div>

      {ok === null && (
        <div className="mt-8 h-40 animate-pulse rounded-xl bg-surface-2" />
      )}
      {error && <p className="mt-6 text-sm text-danger">{error}</p>}
      {rows && rows.length === 0 && (
        <p className="mt-8 text-sm text-muted">还没有人完成测验，或记录尚未写入数据库。</p>
      )}
      {rows && rows.length > 0 && (
        <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-surface">
          <table className="w-full min-w-[44rem] text-left text-sm">
            <thead className="border-b border-border bg-surface-2 text-xs tracking-wide text-subtle">
              <tr>
                <th className="px-3 py-2.5 font-medium">时间</th>
                <th className="px-3 py-2.5 font-medium">测试者</th>
                <th className="px-3 py-2.5 font-medium">来源 IP</th>
                <th className="px-3 py-2.5 font-medium">三元组</th>
                <th className="px-3 py-2.5 font-medium">核验</th>
                <th className="px-3 py-2.5 font-medium">作答风格</th>
                <th className="px-3 py-2.5 font-medium">账户</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-border last:border-0 hover:bg-surface-2">
                  <td className="px-3 py-2.5 whitespace-nowrap">
                    <Link
                      to="/admin/$id"
                      params={{ id: r.id }}
                      className="text-fg underline-offset-4 hover:underline"
                    >
                      {formatTime(r.created_at)}
                    </Link>
                  </td>
                  <td className="px-3 py-2.5">
                    <Link to="/admin/$id" params={{ id: r.id }}>
                      {r.tester_name || "—"}
                    </Link>
                  </td>
                  <td className="px-3 py-2.5 font-mono text-xs">
                    <Link to="/admin/$id" params={{ id: r.id }} className="hover:underline">
                      {r.ip || "—"}
                    </Link>
                  </td>
                  <td className="px-3 py-2.5 font-medium">
                    <Link to="/admin/$id" params={{ id: r.id }}>
                      {r.triad_code}
                    </Link>
                  </td>
                  <td className="px-3 py-2.5 text-muted">{r.confidence ?? "—"}</td>
                  <td className="px-3 py-2.5 text-xs text-muted">
                    {r.flags.length
                      ? r.flags.map((f) => FLAG_LABEL[f as keyof typeof FLAG_LABEL] ?? f).join("、")
                      : "—"}
                  </td>
                  <td className="px-3 py-2.5 text-xs text-subtle">
                    {r.user_id ? "已登录" : "访客"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
