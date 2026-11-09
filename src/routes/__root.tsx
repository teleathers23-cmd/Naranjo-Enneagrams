import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import appCss from "../styles.css?url";

const UPDATES = [
  "调整题目权重。",
  "增加泛用性更高的题目。",
  "百科部分全部整理重写。",
  "网站重新设计，文案修正。",
  "更加全面的、对本能堆叠的比例考察，以及对三元组fix连线更加学术化的计算。",
];

function Notice() {
  return (
    <main className="mx-auto min-h-dvh max-w-xl bg-bg px-6 py-16 text-fg sm:py-24">
      <p className="text-center font-display text-2xl">更新中</p>
      <p className="mt-3 text-center text-xs tracking-wide text-muted">
        下次开放时间：12月1号
      </p>

      <article className="mt-14 space-y-5 text-[15px] leading-8 text-ink">
        <h1 className="font-display text-lg font-medium">制作者说明</h1>
        <p>
          这个项目的起因是我写了一套题库，设计了如何根据作答计算并呈现结果的逻辑和流程。为了让身边的熟人朋友更方便地、娱乐化地试用，我买了一个域名然后用
          Codex 搭建了网站。
        </p>
        <p>
          9
          月，我请几位认识的类型学朋友帮忙邀请少量参与者。此后将近两个月，我几乎没再想起这个项目。目前我无法确认链接是何时、经由谁流出内测范围的。我们曾经有过不外传的口头约定。短短几个小时里，链接被转发到多个群聊，还传到了许多此前没有接触过类型学的网友手中。这已经远远超出了我当初的测试范围。
        </p>
        <p>
          现有版本里，我实际投入精力的是题库和结果计算逻辑、经过初步整理的百科条目。网站其他部分仍有不少排版和内容问题，很多内容是codex的过程中语言模型自行计算的，有事实错误。因为我个人生活缺乏时间，一直没有逐一核查和修正。以目前的完成度，我认为它实际上还达不到面向公众发布的标准。
        </p>
        <p>
          所以我决定暂时关站。因为我收到了来自网友们的很多很好的反馈。我也决定将这个娱乐化产物往更加正式的方向管理。总之，下面是更新预告：
        </p>
        <ul className="space-y-1.5 pl-1 text-[15px]">
          {UPDATES.map((item) => (
            <li key={item}>·{item}</li>
          ))}
        </ul>
        <p>感谢大家！</p>
      </article>
    </main>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "更新中" },
      { name: "robots", content: "noindex" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500&family=Noto+Serif+SC:wght@500;600&display=swap",
      },
    ],
  }),
  notFoundComponent: Notice,
  component: () => (
    <html lang="zh-CN" className="antialiased" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <PreviewHostBridge />
        <Notice />
        <Scripts />
      </body>
    </html>
  ),
});
