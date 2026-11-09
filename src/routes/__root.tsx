import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import appCss from "../styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "更新中" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  notFoundComponent: () => (
    <main className="grid min-h-dvh place-items-center bg-bg px-6 text-center text-fg">
      <div>
        <p>更新中</p>
        <p className="mt-3 text-xs text-muted">下次开放时间：12月1号</p>
      </div>
    </main>
  ),
  component: () => (
    <html lang="zh-CN" className="antialiased" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <PreviewHostBridge />
        <main className="grid min-h-dvh place-items-center bg-bg px-6 text-center text-fg">
          <div>
            <p>更新中</p>
            <p className="mt-3 text-xs text-muted">下次开放时间：12月1号</p>
          </div>
        </main>
        <Scripts />
      </body>
    </html>
  ),
});
