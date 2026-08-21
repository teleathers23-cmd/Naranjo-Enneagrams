import {
  createRootRoute,
  HeadContent,
  Link,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import appCss from "../styles.css?url";

const APP_NAME = "二十七副型";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: APP_NAME },
      {
        name: "description",
        content:
          "依克劳迪奥·纳兰霍原典的九型人格二十七本能副型测验。情欲、固着与反型，而非类型加本能的简单叠加。",
      },
      { name: "theme-color", content: "#f4f0e6" },
      { name: "naranjo-bank", content: "20260821f" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;600;700&family=Noto+Serif+SC:wght@500;600;700&display=swap",
      },
    ],
    scripts: [
      {
        children: `(function(){try{if(window.caches)caches.keys().then(function(k){k.forEach(function(x){caches.delete(x)})});if(navigator.serviceWorker)navigator.serviceWorker.getRegistrations().then(function(r){r.forEach(function(x){x.unregister()})});var keys=Object.keys(localStorage);for(var i=0;i<keys.length;i++){if(/^naranjo-27-(v[0-9]+|20260821[a-e])$/.test(keys[i]))localStorage.removeItem(keys[i]);}}catch(e){}})();`,
      },
    ],
  }),
  notFoundComponent: () => (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-3 bg-bg px-6 text-center text-fg">
      <p className="font-display text-lg">没有这一页</p>
      <Link to="/" className="text-sm text-muted underline-offset-4 hover:underline">
        回到首页
      </Link>
    </div>
  ),
  component: () => (
    <html lang="zh-CN" className="antialiased" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <PreviewHostBridge />
        <AuthProvider>
          <Outlet />
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  ),
});
