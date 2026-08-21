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
    { subtype: "2so", text: "成为那个真正有影响力、能左右局面的人。" },
    { subtype: "3so", text: "成为那个看起来最成功、最有名声的人。" },
  ),
  cq(
    "c-2so-3so-image",
    "成功的形象对我来说：",
    { subtype: "2so", text: "固然重要——因为它能帮我更好地统治一切。" },
    { subtype: "3so", text: "本身就是目的。被看见成功，我才像还在。" },
  ),
  cq(
    "c-2so-3so-f",
    "被晾在边上时，我更先感到的是：",
    { subtype: "2so", text: "没人来臣服、来需要我了。我的慷慨没有换到称帝的位置。" },
    { subtype: "3so", text: "没人看见我了，这场里我像没做成。" },
    "fixation",
  ),

  // —— 易混副型（核心结构对照） ——
  cq(
    "c-2sx-3sx-p",
    "在我认定的那一个一对一焦点面前（人、事或物），我更在意的是：",
    { subtype: "2sx", text: "我是否被这个对象选中、是否成为它所缺的那一味。" },
    { subtype: "3sx", text: "我有没有磁性、能不能赢、看起来是否被要。" },
  ),
  cq(
    "c-1sp-6sp-p",
    "日常里我更紧的是：",
    { subtype: "1sp", text: "身体、家务、钱和程序必须正确。一松就觉得不该这样。" },
    { subtype: "6sp", text: "有没有靠得住的人、这个地方会不会垮。我先让自己好相处。" },
  ),
  cq(
    "c-1so-6so-p",
    "我坚持规则和立场，更像是：",
    { subtype: "1so", text: "原则就是我。大家都这样，也不能成为我去做的理由。" },
    { subtype: "6so", text: "借系统压住怕。忠诚和怀疑缠在一起，怕自己人破裂。" },
  ),
  cq(
    "c-1sx-8sx-p",
    "我对亲近的人很烈，更像是：",
    { subtype: "1sx", text: "要把这个一对一的对象改成对的样子。妒和义愤搅在一起。" },
    { subtype: "8sx", text: "要占有、要穿透。虚伪和软都不许，平淡等于没发生。" },
  ),
  cq(
    "c-4sp-8sp-p",
    "我能扛、能吃苦，更像是：",
    { subtype: "4sp", text: "苦往下咽，证明我比你们更能熬，不求可怜。" },
    { subtype: "8sp", text: "胃口和地盘是直接的。扛是为了拿我要的，不演委屈。" },
  ),
  cq(
    "c-4sx-8sx-p",
    "对认定的那一个一对一焦点，我更像是：",
    { subtype: "4sx", text: "较劲、不能当第二。它有的我必须更好，否则就恨。" },
    { subtype: "8sx", text: "要占有、要烈。控制和献身缠在一起。" },
  ),
  cq(
    "c-5sx-4sx-p",
    "我把一个懂我的人看得极重，更像是：",
    { subtype: "5sx", text: "只把内在交给这一条一对一通道，怕洒给众人。" },
    { subtype: "4sx", text: "这个焦点有的我必须更好，关系或投入是证明我特不特殊。" },
  ),
  cq(
    "c-8so-2so-p",
    "我为「自己人」出头，更像是：",
    { subtype: "8so", text: "力量用来护场。弱者不能被欺，背叛会过量反击。" },
    { subtype: "2so", text: "用慷慨和魅力让所有人围着我转。爱是臣服，我来称帝。" },
  ),
  cq(
    "c-9so-3so-p",
    "我在团体里很忙，更像是：",
    { subtype: "9so", text: "自我融化在「我们」里。一个人面对自己时反而空。" },
    { subtype: "3so", text: "忙着被看见成功。没有观众的忙不算。" },
  ),
  cq(
    "c-6sx-8sx-p",
    "我让自己看起来不好惹，更是为了：",
    { subtype: "6sx", text: "怕被吓、被控，所以先武装。迎上去是为了不当那个怕的人。" },
    { subtype: "8sx", text: "过量本身就是活着，不是为了防怕。强度是胃口。" },
  ),
  cq(
    "c-5sp-9sp-p",
    "我待在自己的小空间里，更像是：",
    { subtype: "5sp", text: "少给、少被看见。外界是消耗，需求能少则少。" },
    { subtype: "9sp", text: "用吃、睡、惯例把真正的意愿麻醉掉。大事以后再说。" },
  ),
  cq(
    "c-3sp-1sp-p",
    "我把日子过得很稳、很正确，更像是：",
    { subtype: "3sp", text: "用能干和撑住生活证明自己还在。一停工就慌。" },
    { subtype: "1sp", text: "必须正确，否则就是不该发生的错。怒气变成担心和检查。" },
  ),
  cq(
    "c-7sx-4sx-p",
    "平淡让我受不了，更像是：",
    { subtype: "7sx", text: "要被下一团火勾走。痛一来就换体验、换讲述。" },
    { subtype: "4sx", text: "要张力来感觉自己还在。缺和特殊被点燃。" },
  ),
  cq(
    "c-8sx-2sx-p",
    "一对一必须很浓，更像是：",
    { subtype: "8sx", text: "这个焦点是我的。占有和献身是同一件事，温水不算。" },
    { subtype: "2sx", text: "我要被这个对象选中。付出里有隐蔽的独占，可替换会刺痛。" },
  ),
  cq(
    "c-6sp-2sp-p",
    "我用好相处、示弱或热络跟人靠近，更像是：",
    { subtype: "6sp", text: "换安全、换被护着。怕被丢下，所以先让自己不具威胁。" },
    { subtype: "2sp", text: "换优待、换被放在前面。骄傲在「我该被照顾」。" },
  ),
  cq(
    "c-4so-6so-p",
    "在团体里格格不入或很警惕，更像是：",
    { subtype: "4so", text: "羞耻和残缺是我的身份。既想被懂，又怕一被接纳就变普通。" },
    { subtype: "6so", text: "职责和立场压住不确定。怕两面、怕自己人破裂。" },
  ),
  cq(
    "c-9sx-2sx-p",
    "在一对一里我容易变成「我们／它怎样就怎样」，更像是：",
    { subtype: "9sx", text: "自己的意愿睡着了。有这个焦点才完整，单独就发动不起来。" },
    { subtype: "2sx", text: "我要成为它所缺的那一味，让它离不开。这是占领，不只是跟着走。" },
  ),
  cq(
    "c-3sx-8sx-p",
    "我在意自己强不强、好不好看，更像是：",
    { subtype: "3sx", text: "虚荣在一对一的磁性上：被选中、被要。失败是变得不可欲。" },
    { subtype: "8sx", text: "生命力过量：占有和强度本身，不是演给谁看。" },
  ),
  cq(
    "c-7so-2so-p",
    "我为大家做事、画愿景，更像是：",
    { subtype: "7so", text: "用理想把沉闷和痛苦抬走。牺牲也是一种计划，痛必须有出口。" },
    { subtype: "2so", text: "让自己成为不可或缺、人人都欠我的存在。情感劳动是称帝的台阶。" },
  ),
  cq(
    "c-7sp-3sp-p",
    "我很会把生活安排得有退路、有效率，更像是：",
    { subtype: "7sp", text: "机会和享受织成网。沉重一来就换成可解决的安排。" },
    { subtype: "3sp", text: "用产出和靠谱证明自己。休息像堕落。" },
  ),
  cq(
    "c-5sx-9sx-p",
    "我把一个人当成出口，更像是：",
    { subtype: "5sx", text: "世界仍吝啬，只把钥匙交给这一条通道。被辜负会封死。" },
    { subtype: "9sx", text: "在这个焦点里面睡着。边界变薄，自己的欲跟着它走。" },
  ),
  cq(
    "c-8so-6so-p",
    "我对「自己人」和规则很硬，更像是：",
    { subtype: "8so", text: "护场、出头、义气。不公落在所属团体上才会出手。" },
    { subtype: "6so", text: "职责、立场、谁是叛徒。安全来自系统和忠诚。" },
  ),
  cq(
    "c-9so-6so-p",
    "我跟团体绑在一起，更像是：",
    { subtype: "9so", text: "日程被大家填满，意见跟着场走。难做会让人不悦的决定。" },
    { subtype: "6so", text: "用义务和正确立场压住万一。对不忠非常敏感。" },
  ),
  cq(
    "c-4sp-1sp-p",
    "我对自己很严、日子过得很紧，更像是：",
    { subtype: "4sp", text: "自找苦吃是优越。不表演忧郁，苦往下咽。" },
    { subtype: "1sp", text: "正确是安全。怒气变成担心、检查、把环境调对。" },
  ),
  cq(
    "c-2sp-4sp-p",
    "我觉得自己特殊、该被看见亏欠，更像是：",
    { subtype: "2sp", text: "我该被优待、被照顾。被忽略就委屈或发作。" },
    { subtype: "4sp", text: "我缺得更多所以更有资格活。反感被可怜，用更能熬来超过。" },
  ),
  cq(
    "c-5so-1so-p",
    "我在群体里较真、讲一套，更像是：",
    { subtype: "5so", text: "用「我知道」占一个图腾位。可以发言，却很难无目的交心。" },
    { subtype: "1so", text: "世界应该更公正。我绝不随俗，改革先于圆滑。" },
  ),
  cq(
    "c-7sx-8sx-p",
    "我要强度、要被勾走，更像是：",
    { subtype: "7sx", text: "对人、地方、体验一见钟情，也容易转向下一团火。" },
    { subtype: "8sx", text: "要融合到占有。强度对着这一个一对一的焦点，不是下一场演出。" },
  ),

  // —— 同号三本能（副型未拉开时） ——
  cq(
    "c-1sp-1so",
    "我的「必须正确」更落在：",
    { subtype: "1sp", text: "身体、家务、钱和安全。怕一松就出事。" },
    { subtype: "1so", text: "公共的公正和程序。随大流像背叛自己的尺子。" },
  ),
  cq(
    "c-1sp-1sx",
    "怒气更冲着：",
    { subtype: "1sp", text: "日常会不会出错、够不够干净稳妥。看起来像担心。" },
    { subtype: "1sx", text: "这个一对一的对象够不够认真。热忱、妒和纠正搅在一起。" },
  ),
  cq(
    "c-1so-1sx",
    "我更想改的是：",
    { subtype: "1so", text: "团体、风气、不公正。我常成为提醒规则的人。" },
    { subtype: "1sx", text: "这一个焦点。你怎么可以把热忱给错地方。" },
  ),
  cq(
    "c-2sp-2so",
    "骄傲更表现成：",
    { subtype: "2sp", text: "我该被优待、被养。可爱或示弱比无私更能拿到资源。" },
    { subtype: "2so", text: "我要成为人人都需要、都敬畏的那个人。助人是野心，爱是臣服。" },
  ),
  cq(
    "c-2sp-2sx",
    "我更想从谁那里被放在前面：",
    { subtype: "2sp", text: "能供养、能照顾我的人。被忽略就委屈。" },
    { subtype: "2sx", text: "那一个被我征服的焦点。被当成可替换会刺痛。" },
  ),
  cq(
    "c-2so-2sx",
    "给予更像是为了：",
    { subtype: "2so", text: "在圈子里称帝：人人都围着我转。平等是笑话。" },
    { subtype: "2sx", text: "让这一个对象离不开我。付出不能给别处。" },
  ),
  cq(
    "c-3sp-3so",
    "成功对我更意味着：",
    { subtype: "3sp", text: "能养活、有保障、看起来能干。不爱空谈名声。" },
    { subtype: "3so", text: "被公开看见。没观众的成就几乎不算。" },
  ),
  cq(
    "c-3sp-3sx",
    "我证明自己，更靠：",
    { subtype: "3sp", text: "工作量、收入、把日子撑住。" },
    { subtype: "3sx", text: "魅力、被选中、在认定的焦点面前发光。" },
  ),
  cq(
    "c-3so-3sx",
    "我更在意的观众是：",
    { subtype: "3so", text: "群体、圈子、头衔和比较。" },
    { subtype: "3sx", text: "在这个一对一里我有没有磁性与竞争力。" },
  ),
  cq(
    "c-4sp-4so",
    "嫉妒在我这儿更像：",
    { subtype: "4sp", text: "不表演忧郁。苦往下咽，用更能熬来超过。" },
    { subtype: "4so", text: "在群体里是局外人。羞耻、残缺被看见，也因此特殊。" },
  ),
  cq(
    "c-4sp-4sx",
    "「我没有别人有的那块」，我更用来：",
    { subtype: "4sp", text: "咬牙硬撑，反感被可怜。" },
    { subtype: "4sx", text: "跟这一个焦点较劲。投入和攻击可以迅速对调。" },
  ),
  cq(
    "c-4so-4sx",
    "特殊感更来自：",
    { subtype: "4so", text: "在社会里放逐自己。既渴求被懂，又轻视一融入就普通。" },
    { subtype: "4sx", text: "一对一里的竞争。平淡等于我被取消。" },
  ),
  cq(
    "c-5sp-5so",
    "我守住自己，更靠：",
    { subtype: "5sp", text: "可撤退的房间和时间。少出门、少欠、少被看见。" },
    { subtype: "5so", text: "专家、地图、「我知道」。给的是蒸馏过的内容，不是自己。" },
  ),
  cq(
    "c-5sp-5sx",
    "吝啬更针对：",
    { subtype: "5sp", text: "全世界。堡垒是具体的，参与像失血。" },
    { subtype: "5sx", text: "众人。对那一条一对一通道，却可以非常浓。" },
  ),
  cq(
    "c-5so-5sx",
    "我对外连接，更像是：",
    { subtype: "5so", text: "通过观念和体系，而不是体温。" },
    { subtype: "5sx", text: "通过一条秘密通道。那一个焦点几乎是唯一出口。" },
  ),
  cq(
    "c-6sp-6so",
    "安全更来自：",
    { subtype: "6sp", text: "亲切、联盟、被放进可靠的人的圈子。怕被盖在热络下面。" },
    { subtype: "6so", text: "义务、立场、程序和「正确的一边」。" },
  ),
  cq(
    "c-6sp-6sx",
    "恐惧翻出来时，我更像：",
    { subtype: "6sp", text: "先让自己温暖、有用、不具威胁，换被保护。" },
    { subtype: "6sx", text: "先武装成不好惹。宁可迎上去，也不停在怕里。" },
  ),
  cq(
    "c-6so-6sx",
    "我对抗不确定，更靠：",
    { subtype: "6so", text: "集体任务、规则、谁是自己人。" },
    { subtype: "6sx", text: "力量、锋利、一个能扛事也能对打的同盟。" },
  ),
  cq(
    "c-7sp-7so",
    "贪食更落地为：",
    { subtype: "7sp", text: "人脉、享受的基础设施、具体的好吃好喝和退路。" },
    { subtype: "7so", text: "为理想和大家推迟眼前的甜。牺牲仍是一种计划。" },
  ),
  cq(
    "c-7sp-7sx",
    "我躲开沉重，更靠：",
    { subtype: "7sp", text: "把它变成可安排的事，或换成有用的朋友和舒服。" },
    { subtype: "7sx", text: "被下一团火勾走。平淡像死，体验必须发光。" },
  ),
  cq(
    "c-7so-7sx",
    "「还有更多」，更冲着：",
    { subtype: "7so", text: "更大的愿景、群体的未来。沉闷的义务除非通向意义。" },
    { subtype: "7sx", text: "人、冒险、边缘体验。承诺随兴致来去。" },
  ),
  cq(
    "c-8sp-8so",
    "力量更用在：",
    { subtype: "8sp", text: "地盘、胃口、谁说了算。生存先于演讲。" },
    { subtype: "8so", text: "护自己人。帮派的头，弱者的盾。" },
  ),
  cq(
    "c-8sp-8sx",
    "过量更对着：",
    { subtype: "8sp", text: "物资和边界。挡我的人推开就完。" },
    { subtype: "8sx", text: "这一个一对一的焦点。必须有穿透力，温水不算。" },
  ),
  cq(
    "c-8so-8sx",
    "我更不能忍的是：",
    { subtype: "8so", text: "我的人被欺、自己人背叛。" },
    { subtype: "8sx", text: "关系若即若离、虚伪文雅、不够烈。" },
  ),
  cq(
    "c-9sp-9so",
    "怠惰更通过：",
    { subtype: "9sp", text: "吃、睡、惯例和身体舒适。环境被打乱比理想被打乱更烦。" },
    { subtype: "9so", text: "把日程交给团体。看起来很忙，忙的是归属。" },
  ),
  cq(
    "c-9sp-9sx",
    "我把自己麻醉在：",
    { subtype: "9sp", text: "可重复的舒服里。冲突来时溜到身体里。" },
    { subtype: "9sx", text: "这个焦点里。结合一理想化，自己的边界就变薄。" },
  ),
  cq(
    "c-9so-9sx",
    "「我们」对我更是：",
    { subtype: "9so", text: "群体、会议、家庭或公司文化。我是其中一员。" },
    { subtype: "9sx", text: "那一个一对一的对象。单独时难以发动。" },
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