import {
  SUBTYPE_MAP,
  TYPE_MAP,
  centerOf,
  triadToken,
  type CenterId,
  type SubtypeId,
  type TypeId,
} from "./catalog";

export const COMPARE_BOTH = 8;
export const COMPARE_NEITHER = 9;

export type ComparePole = {
  text: string;
  type?: TypeId;
  subtype?: SubtypeId;
};

export type CompareQuestion = {
  id: string;
  stem: string;
  left: ComparePole;
  right: ComparePole;
  facet: "passion" | "fixation";
  pair: string;
};

export type CompareChoice =
  | "left"
  | "lean-left"
  | "mid"
  | "lean-right"
  | "right"
  | "both"
  | "neither";

export type CompareOutcome = {
  id: string;
  pair: string;
  stem: string;
  choice: CompareChoice;
  leftLabel: string;
  rightLabel: string;
  note: string;
};

export const STAGE3_HELP =
  "这一步只对前面接近的结构做对照。左右是两种不同的内在运作，不是对错。可以滑向更像的一边，也可以选两个都像或两个都不像。不要按你希望自己是谁来选。";

export function pairKey(a: string, b: string): string {
  return [a, b].sort().join("|");
}

function typePair(a: TypeId, b: TypeId): string {
  return pairKey(`t${a}`, `t${b}`);
}

function subPair(a: SubtypeId, b: SubtypeId): string {
  return pairKey(a, b);
}

function poleLabel(p: ComparePole): string {
  if (p.subtype) return triadToken(p.subtype);
  if (p.type) return `${p.type}号${TYPE_MAP[p.type].passion}`;
  return "";
}

function cq(
  id: string,
  stem: string,
  left: ComparePole,
  right: ComparePole,
  facet: "passion" | "fixation" = "passion",
): CompareQuestion {
  const la = left.subtype ?? (left.type ? `t${left.type}` : id);
  const ra = right.subtype ?? (right.type ? `t${right.type}` : `${id}-r`);
  return { id, stem, left, right, facet, pair: pairKey(la, ra) };
}

/** 对照题库：针对核心激情/固着，以及易混副型。作答时不显示型号。 */
export const COMPARE_BANK: CompareQuestion[] = [
  // —— 心区情欲 ——
  cq(
    "c-t2-t3-p",
    "我感觉自己还在、还算数的时候，更像是：",
    { type: 2, text: "人人都需要我、都欠点什么、都敬畏我。这才算我还在。" },
    { type: 3, text: "我无法停止工作和竞赛。生活好不好，跟拿到的成果绑在一起。" },
  ),
  cq(
    "c-t2-t3-f",
    "最刺到我的丢脸，更像是：",
    { type: 2, text: "原来我不是中心里那个最被关注、最被敬畏的人。" },
    { type: 3, text: "没有观众、没有夸奖。对那些有权决定如何待我的人来说，我就不算被认真对待。" },
    "fixation",
  ),
  cq(
    "c-t3-t4-p",
    "自我感更靠的是：",
    { type: 3, text: "看上去最好、被每个群体夸奖。质量其次，观众不能缺。" },
    { type: 4, text: "身上永远缺一块。那一块，是别人比我更好的部分。" },
  ),
  cq(
    "c-t3-t4-f",
    "别人过得轻松时，我更先感到的是：",
    { type: 3, text: "我要做出成绩。小时候长辈只看这个，我一直在追夸奖。" },
    { type: 4, text: "别人轻易拥有我渴望却得不到的，心里那股尖锐的怨怼压不住。" },
    "fixation",
  ),
  cq(
    "c-t2-t4-p",
    "在亲近的人面前，我更怕的是：",
    { type: 2, text: "我凭什么不是ta眼中最重要的那一个？我为ta做了那么多。" },
    { type: 4, text: "我不认为自己能被完全理解。属于我的东西独一无二。" },
  ),
  cq(
    "c-t2-t4-f",
    "爱这件事，我更相信的是：",
    { type: 2, text: "对方只能做我给予的接受者。平等是笑话，爱便是臣服。" },
    { type: 4, text: "平淡人人都能过，我不一样。我拥抱情感的浓烈。" },
    "fixation",
  ),

  // —— 脑区情欲 ——
  cq(
    "c-t5-t6-p",
    "不确定的时候，我更先：",
    { type: 5, text: "不想把时间、心情、物质投给外界。先考虑，再决定给不给。" },
    { type: 6, text: "每一步都要检查。忽略带来的岔子，比没把事情做好更麻烦。" },
  ),
  cq(
    "c-t5-t6-f",
    "我更难忍受的是：",
    { type: 5, text: "当场被要求表态或帮忙。为了不被索要，我主动把需求降下去。" },
    { type: 6, text: "即使表面上安全，仍在查有没有遗漏的威胁。完全放松比时刻准备更难。" },
    "fixation",
  ),
  cq(
    "c-t6-t7-p",
    "压力来了，我更像是：",
    { type: 6, text: "需要权威，但权威只能是暂时的。忠诚很重，我会暗暗审视对方配不配。" },
    { type: 7, text: "限制、重复、沉重让我苦闷。我想突破，轻松地做事。" },
  ),
  cq(
    "c-t6-t7-f",
    "痛苦或不舒服出现时，我更先：",
    { type: 6, text: "提前警惕。小时候身边没有靠得住的人，随时可能出事。" },
    { type: 7, text: "找借口、找道理、找下一件好事盖住它。讨厌一直沉浸在痛苦里。" },
    "fixation",
  ),
  cq(
    "c-t5-t7-p",
    "面对「还有更多」时，我更像是：",
    { type: 5, text: "精力和注意力有限，日常保留几乎是本能。多给出去会耗我。" },
    { type: 7, text: "脑子里的其他可能性让我着迷。被钉在一件没意思或痛苦的事上令我窒息。" },
  ),
  cq(
    "c-t5-t7-f",
    "我保护自己的方式，更像是：",
    { type: 5, text: "小时候被拿走太轻易。我变得内向寡言，不让人知道我有自己的小小宝物。" },
    { type: 7, text: "不舒服就转到好玩的地方。完整做完很难：总觉得还有更好的选择。" },
    "fixation",
  ),

  // —— 腹区情欲 ——
  cq(
    "c-t8-t9-p",
    "冲突来了，我更像是：",
    { type: 8, text: "毫不畏惧。战斗爽就完了。更厌恶有人觉得我像他们一样软弱。" },
    { type: 9, text: "讨厌矛盾，需求可以往后推。走神、点头，负面情绪很滞后。" },
  ),
  cq(
    "c-t8-t9-f",
    "我想要的东西，更像是：",
    { type: 8, text: "想要就会得到。绝不允许落入被摆布。示弱是耻辱。" },
    { type: 9, text: "忙的常常是习惯和别人的安排。要我明确说立场时，我真的不知道该说什么。" },
    "fixation",
  ),
  cq(
    "c-t9-t1-p",
    "我不舒服却不发作的时候，更像是：",
    { type: 9, text: "讨厌矛盾，所以需求往后推。哪怕对方没什么理由。" },
    { type: 1, text: "不该被糊弄过去的事缠在心头，令我辗转难眠。" },
  ),
  cq(
    "c-t9-t1-f",
    "日子被打乱时，我更烦的是：",
    { type: 9, text: "家里人说什么我就做什么。需求被忽视之后，我开始忽视我的需求。" },
    { type: 1, text: "事情按他们不该有的样子发展。这毫无道理。" },
    "fixation",
  ),
  cq(
    "c-t8-t1-p",
    "世界不对的时候，我更先：",
    { type: 8, text: "永远直接。绕弯子、装可怜让人来猜，我不屑。" },
    { type: 1, text: "我心里自有尺子。别人说可以了，并不等于真的可以了。" },
  ),
  cq(
    "c-t8-t1-f",
    "软弱露出来时，我更像是：",
    { type: 8, text: "很小就厌恶被占便宜。只有先强大、先占上风，示弱会丧失主动权。" },
    { type: 1, text: "马虎和混乱令我坐立不安。犯错从很小就让我羞愧。" },
    "fixation",
  ),

  // —— 用户举例：so2 vs so3 ——
  cq(
    "c-2so-3so-p",
    "如果只能选一个，我更在意的是：",
    { subtype: "2so", text: "在群体里站到显眼、被拥戴的位置。这本就应当被我得到。" },
    { subtype: "3so", text: "我在意群体中的排名和名声。竞争是重要的。" },
  ),
  cq(
    "c-2so-3so-image",
    "成功的形象对我来说：",
    { subtype: "2so", text: "「成功形象」固然重要，因为它能帮我更好地统治一切，让崇拜更有说服力。" },
    { subtype: "3so", text: "没人看见的成就，我无法理解那也算「成就」。" },
  ),
  cq(
    "c-2so-3so-f",
    "被晾在边上时，我更先感到的是：",
    { subtype: "2so", text: "所有人一律平等，但有些人比其他人更加平等。" },
    { subtype: "3so", text: "头衔、比较、圈子、别人怎么传我，说了我什么。" },
    "fixation",
  ),

  // —— 易混副型（核心结构对照） ——
  cq(
    "c-2sx-3sx-p",
    "在我认定的那一个一对一焦点面前（人、事或物），我更在意的是：",
    { subtype: "2sx", text: "我必须在ta心里占据极重要的位置。被当成普通或可替换，我无法忍受。" },
    { subtype: "3sx", text: "一对一里有没有磁性、能不能被选中，比任何社会成就都更重要。" },
  ),
  cq(
    "c-1sp-6sp-p",
    "日常里我更紧的是：",
    { subtype: "1sp", text: "比起社会正义，身体、资金、家里不出岔子更实在。哪有多余心思管别人。" },
    { subtype: "6sp", text: "跟着正确的人换安全。旁人看见的是一个总是很好相处的家伙。" },
  ),
  cq(
    "c-1so-6so-p",
    "我坚持规则和立场，更像是：",
    { subtype: "1so", text: "大家都这么做，并不能成为我去做的理由。融入「大家都这样」是一种妥协。" },
    { subtype: "6so", text: "为了团体安全可靠，规则和制度是必须的。模糊的人际关系让我难以安心。" },
  ),
  cq(
    "c-1sx-8sx-p",
    "我对亲近的人很烈，更像是：",
    { subtype: "1sx", text: "认定的焦点有一套「它应该如何」的标准。不认可与漠然会让我非常生气。" },
    { subtype: "8sx", text: "对在乎的事充满热忱甚至穿透力。白开水一般的关系没有意义。" },
  ),
  cq(
    "c-4sp-8sp-p",
    "我能扛、能吃苦，更像是：",
    { subtype: "4sp", text: "我当然可以承受痛苦。不会让人看见我落泪从而幸灾乐祸。" },
    { subtype: "8sp", text: "对地盘和物资有强烈欲望，没有人可以阻拦我的行动。" },
  ),
  cq(
    "c-4sx-8sx-p",
    "对认定的那一个一对一焦点，我更像是：",
    { subtype: "4sx", text: "无法容忍他人比我更好，内心升起强烈恨意。" },
    { subtype: "8sx", text: "控制和献身缠在一起。我占有了它，也会疯狂献上一切。" },
  ),
  cq(
    "c-5sx-4sx-p",
    "我把一个懂我的人看得极重，更像是：",
    { subtype: "5sx", text: "除了那唯一懂我的对象，我不给任何人开放入口。" },
    { subtype: "4sx", text: "爱恨都很极端，可以对一个人或一件事随时对调。" },
  ),
  cq(
    "c-8so-2so-p",
    "我为「自己人」出头，更像是：",
    { subtype: "8so", text: "我是帮派的头，弱者的盾。也只有我能真正保护他们。" },
    { subtype: "2so", text: "对人好，是为了站到显眼、被拥戴的位置。这本就应当被我得到。" },
  ),
  cq(
    "c-9so-3so-p",
    "我在团体里很忙，更像是：",
    { subtype: "9so", text: "「我是群体中的一员」远比「我一个人要干什么」重要。我几乎不会强调个人需求。" },
    { subtype: "3so", text: "没人看见的成就，我无法理解那也算成就。排名和名声才算。" },
  ),
  cq(
    "c-6sx-8sx-p",
    "我让自己看起来不好惹，更是为了：",
    { subtype: "6sx", text: "强硬和对抗是战胜威胁的唯一方式。寻求保护或退缩是无用的。" },
    { subtype: "8sx", text: "追求彻底的占有和强度。半吊子的亲近无法忍受。" },
  ),
  cq(
    "c-5sp-9sp-p",
    "我待在自己的小空间里，更像是：",
    { subtype: "5sp", text: "只想活在自己的格子里。这不是地盘，而只是我的家。" },
    { subtype: "9sp", text: "吃、睡、熟悉的舒适是最好的。如果可以，不想面对它们以外的任何事。" },
  ),
  cq(
    "c-3sp-1sp-p",
    "我把日子过得很稳、很正确，更像是：",
    { subtype: "3sp", text: "出风头毫无意义。只要工作稳定、把日子经营好。本就不该无所事事。" },
    { subtype: "1sp", text: "即使事情已经大致妥当，我还是会反复检查细节。这很重要。" },
  ),
  cq(
    "c-7sx-4sx-p",
    "平淡让我受不了，更像是：",
    { subtype: "7sx", text: "永远无法忍受平淡，最好的永远是下一个。" },
    { subtype: "4sx", text: "张力很重要。爱与恨与痛苦是我生命的支柱。" },
  ),
  cq(
    "c-8sx-2sx-p",
    "一对一必须很浓，更像是：",
    { subtype: "8sx", text: "占有和献身缠在一起。白开水一般的关系没有意义。" },
    { subtype: "2sx", text: "无法忍受被当成普通或可替换。在认定的关系里，我当然是最不可或缺的。" },
  ),
  cq(
    "c-6sp-2sp-p",
    "我用好相处、示弱或热络跟人靠近，更像是：",
    { subtype: "6sp", text: "表现得温暖、有用、不具威胁，就可以被接纳，避开很多麻烦。" },
    { subtype: "2sp", text: "我想被优待、被照顾，我理应得到所有人的关爱。" },
  ),
  cq(
    "c-4so-6so-p",
    "在团体里格格不入或很警惕，更像是：",
    { subtype: "4so", text: "格格不入和明显的缺陷，正是我特殊感的来源。我本就不属于这里。" },
    { subtype: "6so", text: "谁攻击自己人我会特别敏感，因为他们毁坏了群体的稳定和安全。" },
  ),
  cq(
    "c-9sx-2sx-p",
    "在一对一里我容易变成「我们／它怎样就怎样」，更像是：",
    { subtype: "9sx", text: "没有这个一对一的对象，我几乎什么也不想做。有它在，我才觉得完整。" },
    { subtype: "2sx", text: "我的爱如此重要，ta怎敢拒绝一个天神的爱。ta是我的。" },
  ),
  cq(
    "c-3sx-8sx-p",
    "我在意自己强不强、好不好看，更像是：",
    { subtype: "3sx", text: "被当成没有吸引力、在一对一里不被欲求，几乎能要了我的命。" },
    { subtype: "8sx", text: "看不惯温柔和端着的人。真敢打回来的，我反而尊重。" },
  ),
  cq(
    "c-7so-2so-p",
    "我为大家做事、画愿景，更像是：",
    { subtype: "7so", text: "为了理想和大家，我大可以放弃享乐。没什么比奉献更有意义。" },
    { subtype: "2so", text: "成功形象帮我更好地统治一切。所有人一律平等，但有些人更加平等。" },
  ),
  cq(
    "c-7sp-3sp-p",
    "我很会把生活安排得有退路、有效率，更像是：",
    { subtype: "7sp", text: "机会、关系和享受可以是一张网。这些实在的东西令我真正愉悦。" },
    { subtype: "3sp", text: "停工和休息会让我慌张。我本就不该有无所事事的状态。" },
  ),
  cq(
    "c-5sx-9sx-p",
    "我把一个人当成出口，更像是：",
    { subtype: "5sx", text: "一旦被辜负，我会把通道封死很久。几乎所有人最后都辜负了我的信任。" },
    { subtype: "9sx", text: "一旦有了真正喜欢的人，我很容易把边界和意愿交出去，靠对方定义方向。" },
  ),
  cq(
    "c-8so-6so-p",
    "我对「自己人」和规则很硬，更像是：",
    { subtype: "8so", text: "我为「自己人」出头，我来决定谁是自己人。他们品格如何并不重要。" },
    { subtype: "6so", text: "我更信任明确的规则和集体立场。模糊的人际和变化让我难以安心。" },
  ),
  cq(
    "c-9so-6so-p",
    "我跟团体绑在一起，更像是：",
    { subtype: "9so", text: "群体填满了我几乎所有时间。融入群体远比孤立好得多。" },
    { subtype: "6so", text: "对集体任务相当勇敢，但这个团体是否真正值得我付出，一直是挥之不去的阴霾。" },
  ),
  cq(
    "c-4sp-1sp-p",
    "我对自己很严、日子过得很紧，更像是：",
    { subtype: "4sp", text: "苦难不是坏事，它让我感受到坚韧。这不是所有人都能做到的。" },
    { subtype: "1sp", text: "我焦虑又担心。保证自己的事不出纰漏已经够复杂了。" },
  ),
  cq(
    "c-2sp-4sp-p",
    "我觉得自己特殊、该被看见亏欠，更像是：",
    { subtype: "2sp", text: "被忽略时我会委屈或发作。无论如何，我都觉得我应该是更重要的那个人。" },
    { subtype: "4sp", text: "受不了被可怜。如果他们轻松得到我没有的，我的煎熬说明他们并不比我更优越。" },
  ),
  cq(
    "c-5so-1so-p",
    "我在群体里较真、讲一套，更像是：",
    { subtype: "5so", text: "我在群体里站得住，是因为我是师尊，我知道一切，他们自然需要我。" },
    { subtype: "1so", text: "我难以圆滑。不理解为什么团体里那么多人能忽视不公义和房间里的大象。" },
  ),
  cq(
    "c-7sx-8sx-p",
    "我要强度、要被勾走，更像是：",
    { subtype: "7sx", text: "我太容易一见钟情了，对任何事、任何人。无聊了就会去爱下一个。" },
    { subtype: "8sx", text: "追求彻底的占有和强度。半吊子的亲近让我无法忍受。" },
  ),

  // —— 同号三本能（副型未拉开时） ——
  cq(
    "c-1sp-1so",
    "我的「必须正确」更落在：",
    { subtype: "1sp", text: "比起社会正义，自己的身体、资金、家里不出岔子更实在。" },
    { subtype: "1so", text: "大家都这么做，并不能成为我去做的理由。" },
  ),
  cq(
    "c-1sp-1sx",
    "怒气更冲着：",
    { subtype: "1sp", text: "别人觉得我谨慎、爱检查、把日子过得很稳，但我对此没有乐趣，只想让一切行驶在正轨上。" },
    { subtype: "1sx", text: "热忱和纠正经常搅在一起。如果不是热爱，我根本不会管对方怎么样。" },
  ),
  cq(
    "c-1so-1sx",
    "我更想改的是：",
    { subtype: "1so", text: "对走捷径、潜规则和装样子特别受不了。哪怕是家人和熟人也难忍不适。" },
    { subtype: "1sx", text: "我在乎的对象只能被我拉回正轨。真正在乎时，修复的热忱是执着的。" },
  ),
  cq(
    "c-2sp-2so",
    "骄傲更表现成：",
    { subtype: "2sp", text: "我相信撒娇和示弱可以帮我得到更多的关注和宠爱。" },
    { subtype: "2so", text: "对人好，很大一部分是为了在群体里站到显眼、被拥戴的位置。" },
  ),
  cq(
    "c-2sp-2sx",
    "我更想从谁那里被放在前面：",
    { subtype: "2sp", text: "表现出「快来照顾我」的时候，往往真的会有人来帮我。我不觉得这有什么不好。" },
    { subtype: "2sx", text: "我无法忍受被当成普通、甚至可被替换的。ta是我的。" },
  ),
  cq(
    "c-2so-2sx",
    "给予更像是为了：",
    { subtype: "2so", text: "所有人一律平等，但有些人比其他人更加平等。" },
    { subtype: "2sx", text: "在认定的那一个关系里，我当然会是对方最特别、最不可或缺的人。" },
  ),
  cq(
    "c-3sp-3so",
    "成功对我更意味着：",
    { subtype: "3sp", text: "空谈形象太夸张，但我非常在意自己看起来靠谱、有效率、能扛事。" },
    { subtype: "3so", text: "我无法理解竟然有人把没人看见的成就也算作成就。" },
  ),
  cq(
    "c-3sp-3sx",
    "我证明自己，更靠：",
    { subtype: "3sp", text: "被公开夸奖或成名，相比务实的生活稳定，什么都不是。" },
    { subtype: "3sx", text: "我愿意为我心爱的人改变。只要ta能因为享受我而留在我身边。" },
  ),
  cq(
    "c-3so-3sx",
    "我更在意的观众是：",
    { subtype: "3so", text: "我每天都在关注头衔、比较、圈子，别人怎么传我。" },
    { subtype: "3sx", text: "在单一关系里，我最怕失去吸引力或竞争力，对方对我的厌倦。" },
  ),
  cq(
    "c-4sp-4so",
    "嫉妒在我这儿更像：",
    { subtype: "4sp", text: "我当然可以承受痛苦。不会让这些人看到我落泪从而幸灾乐祸。" },
    { subtype: "4so", text: "格格不入和明显的缺陷，正是我特殊感的来源。" },
  ),
  cq(
    "c-4sp-4sx",
    "「我没有别人有的那块」，我更用来：",
    { subtype: "4sp", text: "我受不了被可怜。我的煎熬说明他们并不比我更优越。" },
    { subtype: "4sx", text: "我的爱恨都很极端，完全可以对一个人或一件事随时对调。" },
  ),
  cq(
    "c-4so-4sx",
    "特殊感更来自：",
    { subtype: "4so", text: "内心也渴望被理解，但我的特殊正在于没有人能真正理解我。" },
    { subtype: "4sx", text: "仇恨会让我去讨厌一个几乎没有瓜葛的人，只因为他们比我更优越。" },
  ),
  cq(
    "c-5sp-5so",
    "我守住自己，更靠：",
    { subtype: "5sp", text: "我需要一个能关上门的地方和时间。突然被找、被留，像有人闯进储备。" },
    { subtype: "5so", text: "我更愿意以「专家」或「有独特见解的人」存在，并不在乎情感联结。" },
  ),
  cq(
    "c-5sp-5sx",
    "吝啬更针对：",
    { subtype: "5sp", text: "时间和精力都有限。任何可能消耗它的邀请，我都敬而远之。" },
    { subtype: "5sx", text: "除了那唯一懂我的对象，我不给任何人开放入口。" },
  ),
  cq(
    "c-5so-5sx",
    "我对外连接，更像是：",
    { subtype: "5so", text: "可以分享整理过的知识，分享私生活就越界了。" },
    { subtype: "5sx", text: "我想要一条一对一的秘密通道，不是广阔的社交。那几乎是我对外的唯一出口。" },
  ),
  cq(
    "c-6sp-6so",
    "安全更来自：",
    { subtype: "6sp", text: "用好说话、热络、跟着正确的人来换取安全。" },
    { subtype: "6so", text: "为了保证团体安全可靠，规则和制度是必须的。" },
  ),
  cq(
    "c-6sp-6sx",
    "恐惧翻出来时，我更像：",
    { subtype: "6sp", text: "表现得温暖、有用、不具威胁，就可以被接纳，帮我避开很多麻烦。" },
    { subtype: "6sx", text: "倾向先让自己看起来不好惹。威胁一出现，更有效的是快速反应与进攻。" },
  ),
  cq(
    "c-6so-6sx",
    "我对抗不确定，更靠：",
    { subtype: "6so", text: "对集体任务相当勇敢，但这个团体是否真正值得付出，一直是阴霾。" },
    { subtype: "6sx", text: "对认定的同盟或对手，我会测试他们够不够强、能不能扛。" },
  ),
  cq(
    "c-7sp-7so",
    "贪食更落地为：",
    { subtype: "7sp", text: "我很会给自己留退路。狡兔三窟是一种生存智慧。" },
    { subtype: "7so", text: "为了理想和大家，我大可以放弃享乐。奉献比什么都更有意义。" },
  ),
  cq(
    "c-7sp-7sx",
    "我躲开沉重，更靠：",
    { subtype: "7sp", text: "沉痛的事情也是机遇的开始。我可以建立更多联系，看到更多机会。" },
    { subtype: "7sx", text: "我永远无法忍受平淡，最好的永远是下一个。" },
  ),
  cq(
    "c-7so-7sx",
    "「还有更多」，更冲着：",
    { subtype: "7so", text: "任何人都可以用远大的未来和群体愿景哄骗我工作。" },
    { subtype: "7sx", text: "承诺随兴致来去。没兴致了，就很难再履行。" },
  ),
  cq(
    "c-8sp-8so",
    "力量更用在：",
    { subtype: "8sp", text: "动员他人是出于地盘建设。我对公众意识形态兴趣不大。" },
    { subtype: "8so", text: "我是帮派的头，弱者的盾。力量用于保护我的团体。" },
  ),
  cq(
    "c-8sp-8sx",
    "过量更对着：",
    { subtype: "8sp", text: "对地盘和物资有强烈欲望，没有人可以阻拦我的行动。" },
    { subtype: "8sx", text: "对在乎的事充满热忱甚至穿透力。白开水一般的关系有什么意义。" },
  ),
  cq(
    "c-8so-8sx",
    "我更不能忍的是：",
    { subtype: "8so", text: "最不能忍的是自己的人被欺负、被自己的人背叛。" },
    { subtype: "8sx", text: "看不惯温柔和端着的人。真敢打回来的，我反而尊重。" },
  ),
  cq(
    "c-9sp-9so",
    "怠惰更通过：",
    { subtype: "9sp", text: "我有理想，但跟熟悉的生活节奏比什么都不是。" },
    { subtype: "9so", text: "群体填满我几乎所有时间。我习惯和大家呆在一起了。" },
  ),
  cq(
    "c-9sp-9sx",
    "我把自己麻醉在：",
    { subtype: "9sp", text: "冲突让我烦躁。逃避这些，远比撒一通脾气重要。" },
    { subtype: "9sx", text: "跟认定的焦点在一起，我容易变成「ta想怎么样就怎么样」。" },
  ),
  cq(
    "c-9so-9sx",
    "「我们」对我更是：",
    { subtype: "9so", text: "群体的需求往往覆盖我的需求。我乐意为把群体建设得更好努力。" },
    { subtype: "9sx", text: "没有这个一对一的对象，我几乎什么也不想做。" },
  ),
];

export const COMPARE_MAP: Record<string, CompareQuestion> = Object.fromEntries(
  COMPARE_BANK.map((q) => [q.id, q]),
);

function hashId(id: string): number {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function maybeFlip(q: CompareQuestion, seed: number): CompareQuestion {
  const rng = mulberry32((seed >>> 0) ^ hashId(q.id));
  if (rng() < 0.5) return q;
  return { ...q, left: q.right, right: q.left };
}

export function shownCompareQuestions(
  ids: string[],
  seed: number,
): CompareQuestion[] {
  return ids
    .map((id) => COMPARE_MAP[id])
    .filter((q): q is CompareQuestion => Boolean(q))
    .map((q) => maybeFlip(q, seed));
}

function itemsForPair(pair: string): CompareQuestion[] {
  return COMPARE_BANK.filter((q) => q.pair === pair);
}

export type ComparePreview = {
  triad: Array<{
    center: CenterId;
    type: TypeId;
    subtype: SubtypeId;
    runnerUpType: TypeId;
    runnerUpSubtype: SubtypeId;
    typeGap: number;
    subtypeGap: number;
  }>;
  stage2Types: TypeId[];
};

/**
 * 根据第二步后的三元组挑易混对照。
 * 情欲接近、副型接近、原典 lookalike 优先；至少每区一题，至多 8 题。
 */
export function pickCompareQuestions(result: ComparePreview, seed: number): CompareQuestion[] {
  type Want = { pair: string; weight: number };
  const wanted: Want[] = [];

  for (const slot of result.triad) {
    wanted.push({
      pair: typePair(slot.type, slot.runnerUpType),
      weight: slot.typeGap <= 6 ? 4 : slot.typeGap <= 12 ? 2 : 1,
    });
    if (slot.subtype !== slot.runnerUpSubtype) {
      wanted.push({
        pair: subPair(slot.subtype, slot.runnerUpSubtype),
        weight: slot.subtypeGap <= 6 ? 4 : slot.subtypeGap <= 12 ? 2 : 1,
      });
    }
    for (const look of SUBTYPE_MAP[slot.subtype].lookalikes) {
      const lookType = SUBTYPE_MAP[look].type;
      const sameCenter = centerOf(lookType) === slot.center;
      if (!sameCenter && !result.stage2Types.includes(lookType)) continue;
      wanted.push({
        pair: subPair(slot.subtype, look),
        weight: sameCenter ? 2 : 1,
      });
    }
  }

  wanted.sort((a, b) => b.weight - a.weight);

  const picked: CompareQuestion[] = [];
  const used = new Set<string>();
  const usedPair = new Set<string>();

  const take = (pair: string, max: number) => {
    if (picked.length >= 8) return;
    const list = itemsForPair(pair);
    let n = 0;
    for (const q of list) {
      if (used.has(q.id)) continue;
      if (n >= max) break;
      picked.push(q);
      used.add(q.id);
      usedPair.add(pair);
      n += 1;
      if (picked.length >= 8) return;
    }
  };

  for (const w of wanted) {
    if (w.weight >= 3) take(w.pair, 2);
  }
  for (const w of wanted) {
    if (!usedPair.has(w.pair)) take(w.pair, 1);
  }

  // 每区至少一题：用该区领先情欲 vs 次席
  if (picked.length < 3) {
    for (const slot of result.triad) {
      take(typePair(slot.type, slot.runnerUpType), 1);
    }
  }

  const rng = mulberry32(seed + 17);
  const shuffled = [...picked];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, 8);
}

export function choiceOf(value: number | undefined): CompareChoice | undefined {
  if (value === undefined) return undefined;
  if (value === COMPARE_BOTH) return "both";
  if (value === COMPARE_NEITHER) return "neither";
  if (value <= 0) return "left";
  if (value === 1) return "lean-left";
  if (value === 2) return "mid";
  if (value === 3) return "lean-right";
  return "right";
}

export function isCompareValue(v: number | undefined): boolean {
  return v === COMPARE_BOTH || v === COMPARE_NEITHER || (v !== undefined && v >= 0 && v <= 4);
}

const CHOICE_NOTE: Record<CompareChoice, string> = {
  left: "明确偏左",
  "lean-left": "略偏左",
  mid: "居中，未拉开",
  "lean-right": "略偏右",
  right: "明确偏右",
  both: "两个都像：结构重叠，不作决胜",
  neither: "两个都不像：两边同时降权",
};

export function describeOutcome(
  q: CompareQuestion,
  value: number | undefined,
): CompareOutcome | null {
  const choice = choiceOf(value);
  if (!choice) return null;
  return {
    id: q.id,
    pair: q.pair,
    stem: q.stem,
    choice,
    leftLabel: poleLabel(q.left),
    rightLabel: poleLabel(q.right),
    note: CHOICE_NOTE[choice],
  };
}

/** 给计分用：一边加分、一边减分的系数。both/neither 走特殊路径。 */
export function compareNudge(value: number): {
  kind: "slider" | "both" | "neither";
  toward: -1 | 0 | 1;
  mag: number;
} {
  if (value === COMPARE_BOTH) return { kind: "both", toward: 0, mag: 0 };
  if (value === COMPARE_NEITHER) return { kind: "neither", toward: 0, mag: 0 };
  const t = (Math.max(0, Math.min(4, value)) - 2) / 2;
  const mag = Math.abs(t);
  const toward = mag < 0.2 ? 0 : t < 0 ? -1 : 1;
  return { kind: "slider", toward: toward as -1 | 0 | 1, mag };
}

export function centerOfPole(p: ComparePole) {
  const type = p.subtype ? SUBTYPE_MAP[p.subtype].type : p.type;
  return type ? centerOf(type) : undefined;
}