import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { adminLogin, adminMe } from "@/lib/submissions";

export const Route = createFileRoute("/admin/login")({
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    adminMe()
      .then((m) => {
        if (m.ok) void navigate({ to: "/admin" });
      })
      .catch(() => undefined);
  }, [navigate]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await adminLogin({ data: { username, password } });
      if (res.ok) {
        void navigate({ to: "/admin" });
        return;
      }
      setError(res.error);
    } catch {
      setError("登录失败，请再试。");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-sm">
      <p className="text-xs tracking-[0.18em] text-muted">ADMIN</p>
      <h1 className="mt-2 font-display text-3xl font-medium">管理员登录</h1>
      <p className="mt-3 text-sm text-muted">查看本站完成测验的记录（含来源 IP）。</p>
      <form className="mt-6 space-y-3" onSubmit={(e) => void onSubmit(e)}>
        <label className="block text-sm">
          <span className="text-muted">账号</span>
          <input
            className="mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-fg outline-none focus:border-border-strong"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <label className="block text-sm">
          <span className="text-muted">密码</span>
          <input
            className="mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-fg outline-none focus:border-border-strong"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {error && <p className="text-sm text-danger">{error}</p>}
        <Button type="submit" className="w-full" disabled={busy}>
          {busy ? "登录中…" : "进入后台"}
        </Button>
      </form>
    </div>
  );
}
