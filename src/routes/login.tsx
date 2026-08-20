import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { GROK_PROVIDERS, authClient, authEnabled, signIn } from "@/lib/auth/client";
import { accountToEmail } from "@/lib/auth/account";
import { SiteShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const goAfter = () => {
    const next = new URLSearchParams(window.location.search).get("next") || "/";
    if (next.startsWith("/") && !next.startsWith("//")) {
      window.location.assign(next);
      return;
    }
    void navigate({ to: "/" });
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const email = accountToEmail(account);
    if (!email) {
      setBusy(false);
      setError("请填写邮箱，或使用英文字母/数字作为账号。");
      return;
    }
    if (password.length < 8) {
      setBusy(false);
      setError("密码至少 8 位。");
      return;
    }
    try {
      if (mode === "up") {
        const { error: err } = await authClient.signUp.email({
          email,
          password,
          name: name.trim() || account.trim(),
        });
        if (err) {
          setError(
            err.message === "User already exists"
              ? "这个账号已经注册过，请直接登录。"
              : (err.message ?? "注册失败，请再试。"),
          );
          setBusy(false);
          return;
        }
      } else {
        const { error: err } = await authClient.signIn.email({ email, password });
        if (err) {
          setError("账号或密码不对。");
          setBusy(false);
          return;
        }
      }
      goAfter();
    } catch {
      setError("登录失败，请再试。");
    } finally {
      setBusy(false);
    }
  };

  return (
    <SiteShell>
      <div className="mx-auto max-w-sm">
        <p className="text-xs tracking-[0.18em] text-muted">ACCOUNT</p>
        <h1 className="mt-2 font-display text-3xl font-medium">
          {mode === "in" ? "登录" : "注册"}
        </h1>
        <p className="mt-3 text-sm text-muted">
          测验不必登录。登录后可以把完整结果保存在账户里，换设备也能回看。未登录也可以导出 PDF。
        </p>

        <div className="mt-5 flex rounded-full border border-border bg-surface p-1 text-sm">
          <button
            type="button"
            className={`flex-1 rounded-full py-1.5 ${mode === "in" ? "bg-primary text-primary-fg" : "text-muted"}`}
            onClick={() => {
              setMode("in");
              setError(null);
            }}
          >
            登录
          </button>
          <button
            type="button"
            className={`flex-1 rounded-full py-1.5 ${mode === "up" ? "bg-primary text-primary-fg" : "text-muted"}`}
            onClick={() => {
              setMode("up");
              setError(null);
            }}
          >
            注册
          </button>
        </div>

        {authEnabled ? (
          <form className="mt-5 space-y-3" onSubmit={(e) => void onSubmit(e)}>
            {mode === "up" && (
              <label className="block text-sm">
                <span className="text-muted">显示名</span>
                <input
                  className="mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2.5 outline-none focus:border-border-strong"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="可选，用于账户称呼"
                />
              </label>
            )}
            <label className="block text-sm">
              <span className="text-muted">账号</span>
              <input
                className="mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2.5 outline-none focus:border-border-strong"
                autoComplete="username"
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                placeholder="邮箱，或英文字母数字用户名"
                required
              />
            </label>
            <label className="block text-sm">
              <span className="text-muted">密码</span>
              <input
                className="mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2.5 outline-none focus:border-border-strong"
                type="password"
                autoComplete={mode === "up" ? "new-password" : "current-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="至少 8 位"
                required
              />
            </label>
            {error && <p className="text-sm text-danger">{error}</p>}
            <Button type="submit" className="w-full" disabled={busy}>
              {busy ? "请稍候…" : mode === "in" ? "登录" : "创建账号"}
            </Button>
          </form>
        ) : (
          <p className="mt-5 text-sm text-muted">登录未启用。</p>
        )}

        {authEnabled && (
          <>
            <p className="mt-6 text-center text-xs text-subtle">或使用第三方</p>
            <div className="mt-2 flex flex-col gap-2">
              {GROK_PROVIDERS.map((p) => (
                <Button
                  key={p.providerId}
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => signIn(p.providerId, { callbackURL: "/" })}
                >
                  使用 {p.label} 继续
                </Button>
              ))}
            </div>
          </>
        )}

        <p className="mt-6 text-center text-sm">
          <Link to="/" className="text-muted underline-offset-4 hover:text-fg hover:underline">
            返回首页
          </Link>
        </p>
      </div>
    </SiteShell>
  );
}
