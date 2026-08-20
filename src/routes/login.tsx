import { createFileRoute, Link } from "@tanstack/react-router";
import { GROK_PROVIDERS, authEnabled, signIn } from "@/lib/auth/client";
import { SiteShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  return (
    <SiteShell>
      <div className="mx-auto max-w-sm">
        <p className="text-xs tracking-[0.18em] text-muted">ACCOUNT</p>
        <h1 className="mt-2 font-display text-3xl font-medium">登录</h1>
        <p className="mt-3 text-sm text-muted">
          测验本身不必登录。登录后可以保存历史结果，在其他设备回看。
        </p>
        <div className="mt-6 flex flex-col gap-2">
          {authEnabled ? (
            GROK_PROVIDERS.map((p) => (
              <Button
                key={p.providerId}
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => signIn(p.providerId, { callbackURL: "/" })}
              >
                使用 {p.label} 继续
              </Button>
            ))
          ) : (
            <p className="text-sm text-muted">登录未启用。</p>
          )}
        </div>
        <p className="mt-6 text-center text-sm">
          <Link to="/" className="text-muted underline-offset-4 hover:text-fg hover:underline">
            返回首页
          </Link>
        </p>
      </div>
    </SiteShell>
  );
}
