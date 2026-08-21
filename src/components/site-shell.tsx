import { Link } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { BANK_REVISION } from "@/lib/naranjo/questions";
import { freshSeed, useTestStore } from "@/lib/naranjo/store";
import { SiteHeader } from "./site-header";

function wipeRetiredPersist() {
  if (typeof localStorage === "undefined") return;
  const keep = `naranjo-27-${BANK_REVISION}`;
  for (let i = localStorage.length - 1; i >= 0; i--) {
    const key = localStorage.key(i);
    if (!key) continue;
    if (key.startsWith("naranjo-27-") && key !== keep) {
      localStorage.removeItem(key);
    }
  }
}

export function SiteShell({ children }: { children: ReactNode }) {
  useEffect(() => {
    wipeRetiredPersist();
    if (useTestStore.getState().hydrated) return;
    void Promise.resolve(useTestStore.persist.rehydrate()).then(() => {
      const s = useTestStore.getState();
      if (!s.shuffleSeed) {
        useTestStore.setState({ shuffleSeed: freshSeed() });
      }
      useTestStore.getState().hydrateResult();
      useTestStore.getState().markHydrated();
    });
  }, []);

  return (
    <div className="flex min-h-dvh flex-col bg-bg text-fg">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:py-10">
        {children}
      </main>
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-3xl flex-col gap-1 px-4 py-6 text-center text-xs text-subtle">
          <p>依克劳迪奥·纳兰霍（Claudio Naranjo）性格学原典编制。</p>
          <p>测验只作筛选，不能替代长期自我观察。题目为独立撰写，非原文摘录。</p>
          <p>
            <Link to="/admin" className="hover:text-muted">
              管理
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}