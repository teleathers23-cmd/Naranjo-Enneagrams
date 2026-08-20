import { useEffect, type ReactNode } from "react";
import { freshSeed, useTestStore } from "@/lib/naranjo/store";
import { SiteHeader } from "./site-header";

export function SiteShell({ children }: { children: ReactNode }) {
  useEffect(() => {
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
        </div>
      </footer>
    </div>
  );
}