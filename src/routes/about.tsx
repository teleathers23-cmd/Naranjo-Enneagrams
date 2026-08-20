import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";

export const Route = createFileRoute("/about")({ component: About });

function About() {
  return (
    <SiteShell>
      <p className="text-xs tracking-[0.18em] text-muted">ABOUT</p>
      <h1 className="mt-2 font-display text-3xl font-medium">关于本测验</h1>
      <p className="mt-6 rounded-xl border border-border bg-surface px-4 py-3.5 text-sm leading-relaxed text-fg">
        本测试是基于纳兰霍二十七副型制作的。感谢每一位在网站开发阶段参与测试的测试者。测试制作者是西羽（teleathers）。测试反馈可以发送至邮箱
        <a
          href="mailto:teleathers23@gmail.com"
          className="mx-1 text-primary underline-offset-4 hover:underline"
        >
          teleathers23@gmail.com
        </a>
        。
      </p>
      <div className="mt-6 space-y-5 text-sm leading-relaxed text-muted">
        <p>
          本站完全依照克劳迪奥·纳兰霍的性格学来编写：情欲（pasión）、固着（fijación）、三中心，以及他在 SAT
          中展开的二十七种本能副型。它不是里斯－哈德森（Riso–Hudson）的健康层级测验，也不是把「九型 +
          三种本能」简单相乘。
        </p>
        <h2 className="font-display text-lg font-medium text-fg">为何是二十七种性格</h2>
        <p>
          奥斯卡·伊查佐给出二十七个关键词。纳兰霍用数十年临床与 SAT
          小组观察，把每个词写成一种可辨认的性格结构。同一情欲在自我保存、社交、性三种本能里长成不同的人：例如四号的嫉妒，可以是坚忍（反型）、羞耻或竞争。反型尤其容易被问卷误判，因此第二步使用副型专名题目，而不是「你更在意身体还是群体」。
        </p>
        <h2 className="font-display text-lg font-medium text-fg">题目从哪里来</h2>
        <p>
          题目为独立撰写，对情欲与副型结构作操作化，不摘录《Character and
          Neurosis》等著作原文。表述尽量避开流行九型的优点清单（「我追求卓越」「我很忠诚」），对准纳兰霍所说的神经症性格。
        </p>
        <h2 className="font-display text-lg font-medium text-fg">如何计分</h2>
        <p>
          题目全部混排，不按型号分区，以降低猜题、社会赞许和防御。先测九种激情与固着，过程中计算心脑腹三种应对世界方式的重视程度，再进入副型。副型之后有第三步：根据当前领先与次席、以及原典里的易混副型（如社交二号的野心与社交三号的声望），做针对核心激情与固着的左右对照。可以滑向一边，也可以选两个都像或两个都不像。计分会检查正反向冲突、型号重叠、对峙，以及随机、夸大、中立回避；对照题会加权重排。结果是心–脑–腹三元组，例如 sp3-so6-sp8。每个位置给出强度与核验。完整公式在结果页展开。
        </p>
        <h2 className="font-display text-lg font-medium text-fg">隐私</h2>
        <p>
          进度默认只存在当前浏览器。登录后可将完整结果写入你的账户，便于回看。不收集姓名以外的联系方式作营销。纳兰霍认为测验不能替代数年的自我观察——请把结果当作阅读原典的索引。
        </p>
      </div>
    </SiteShell>
  );
}
