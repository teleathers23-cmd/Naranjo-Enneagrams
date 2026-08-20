import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { SiteHeader } from "./site-header";

export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-bg text-fg">
      <SiteHeader />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:py-10">
        {children}
      </main>
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-5 text-xs text-subtle">
          <p>管理员后台 · 不作公开测验用途</p>
          <Link to="/" className="hover:text-fg">
            回首页
          </Link>
        </div>
      </footer>
    </div>
  );
}
