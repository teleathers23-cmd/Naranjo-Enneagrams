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
    <p className="grid min-h-dvh place-items-center bg-bg text-fg">更新中</p>
  ),
  component: () => (
    <html lang="zh-CN" className="antialiased" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <PreviewHostBridge />
        <p className="grid min-h-dvh place-items-center bg-bg text-fg">更新中</p>
        <Scripts />
      </body>
    </html>
  ),
});
