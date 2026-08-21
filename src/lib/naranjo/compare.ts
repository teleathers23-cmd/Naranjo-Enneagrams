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
    "自我存在感的主要来源更接近：",
    { type: 2, text: "被他人需要与置于重要位置。若不被需要，则产生存在被抽空之感。" },
    { type: 3, text: "持续产出可见成果与成功形象。一旦停止行动，存在感迅速下降。" },
  ),
  cq(
    "c-t2-t3-f",
    "最具打击性的羞耻体验更接近：",
    { type: 2, text: "发现自己并非对方所需之人，位置被抽离。" },
    { type: 3, text: "发现自己在他人眼中形象崩塌，显得无能或不成功。" },
    "fixation",
  ),
  cq(
    "c-t3-t4-p",
    "自我感的确立更依赖：",
    { type: 3, text: "达成目标、维持合宜形象与被认可的状态。主观感受可被后置。" },
    { type: 4, text: "感受到自身的缺失、与他人的差异，以及足够浓度的情绪。" },
  ),
  cq(
    "c-t3-t4-f",
    "面对他人轻易获得自己所缺之物时，更先出现的反应是：",
    { type: 3, text: "必须追上并证明自身能力，以免显得落后。" },
    { type: 4, text: "确认对方天生拥有自己所缺乏的完整，自身永远差一截。" },
    "fixation",
  ),
  cq(
    "c-t2-t4-p",
    "在亲密关系中更恐惧的是：",
    { type: 2, text: "付出后仍未能成为对方最特殊、最被需要的人。" },
    { type: 4, text: "对方天然完整，而自己始终处于某种本质性的缺失之中。" },
  ),
  cq(
    "c-t2-t4-f",
    "对「爱」的内在信念更接近：",
    { type: 2, text: "必须成为对方所缺的那部分，被需要才配得上被爱。" },
    { type: 4, text: "必须更特殊、更深刻，否则爱将转向他人。" },
    "fixation",
  ),

  // —— 脑区情欲 ——
  cq(
    "c-t5-t6-p",
    "面对不确定时，更优先的应对是：",
    { type: 5, text: "收回自身投入，减少给予，先看清再行动。" },
    { type: 6, text: "寻找同盟、规则或可靠对象，对潜在威胁进行扫描。" },
  ),
  cq(
    "c-t5-t6-f",
    "更难以忍受的是：",
    { type: 5, text: "被当场要求投入、分享或表态，如同储备被直接侵入。" },
    { type: 6, text: "缺乏确认与后路，安心感始终差一步。" },
    "fixation",
  ),
  cq(
    "c-t6-t7-p",
    "压力出现时，更典型的反应是：",
    { type: 6, text: "反复确认、站队、准备最坏情况。" },
    { type: 7, text: "转向新场景、新计划或下一可能性，当下迅速成为跳板。" },
  ),
  cq(
    "c-t6-t7-f",
    "面对痛苦或不适时，更先采取的策略是：",
    { type: 6, text: "盯住最坏可能，寻找可靠对象与规则以获取保护。" },
    { type: 7, text: "以合理化、寻找出口或正面重构来迅速离开痛苦。" },
    "fixation",
  ),
  cq(
    "c-t5-t7-p",
    "面对「还有更多」时，更接近的态度是：",
    { type: 5, text: "将需求与参与降至最低，额外投入被视为消耗。" },
    { type: 7, text: "选项越多越接近活着的状态；被钉在单一沉闷事物上如同窒息。" },
  ),
  cq(
    "c-t5-t7-f",
    "自我保护的主要方式更接近：",
    { type: 5, text: "少开口、少欠、先观察，内在库存不轻易交出。" },
    { type: 7, text: "以计划、下一步与新鲜感来回避限制与沉重。" },
    "fixation",
  ),

  // —— 腹区情欲 ——
  cq(
    "c-t8-t9-p",
    "冲突出现时，更典型的反应是：",
    { type: 8, text: "向前推进，以强度回应，不允许软弱出现。" },
    { type: 9, text: "先麻木、先同意、先维持熟悉节奏，怒气很晚才被感知。" },
  ),
  cq(
    "c-t8-t9-f",
    "自身欲望的位置更接近：",
    { type: 8, text: "直接去取。过量、力量与直言本身即是活着的证明。" },
    { type: 9, text: "经常被后置。为避免冲突，意愿被推迟。" },
    "fixation",
  ),
  cq(
    "c-t9-t1-p",
    "当不适却未发作时，更接近的内在状态是：",
    { type: 9, text: "自身意愿被后置，几乎听不见「我想要」。" },
    { type: 1, text: "怒气转化为长期的「不该如此」，并在内心持续纠正。" },
  ),
  cq(
    "c-t9-t1-f",
    "日常节奏被打乱时，更烦扰的是：",
    { type: 9, text: "熟悉的舒适与惯性消失，如同安神机制被移除。" },
    { type: 1, text: "事物未能落在「应有」的位置，内在张力无法松弛。" },
    "fixation",
  ),
  cq(
    "c-t8-t1-p",
    "面对世界的「不对」时，更优先的反应是：",
    { type: 8, text: "以力量与过量直接夺回控制。绕弯与示弱不被接受。" },
    { type: 1, text: "以「应该」与纠正将事物拉回正轨。不服气可长期存留。" },
  ),
  cq(
    "c-t8-t1-f",
    "软弱显露时，更接近的感受是：",
    { type: 8, text: "危险。软化将导致被占便宜，因此必须先强硬、先占位。" },
    { type: 1, text: "等同于错误与放任。休息与马虎皆构成亏欠。" },
    "fixation",
  ),

  // —— 社交二号 / 社交三号 ——
  cq(
    "c-2so-3so-p",
    "若只能选择一种，更在意的是：",
    { subtype: "2so", text: "成为真正具有影响力、能左右局面，理所当然被尊敬的人。" },
    { subtype: "3so", text: "成为看起来最成功、最有名声的人。" },
  ),
  cq(
    "c-2so-3so-image",
    "成功形象对自身的意义更接近：",
    { subtype: "2so", text: "重要，因为它有助于获得更大影响与主导权。" },
    { subtype: "3so", text: "本身即是目的。被看见成功，自身才得以确立。" },
  ),
  cq(
    "c-2so-3so-f",
    "被边缘化时，更先出现的感受是：",
    { subtype: "2so", text: "无人再需要自己。付出未能换取特殊位置。" },
    { subtype: "3so", text: "无人再看见自己。在此场合中如同未曾成功。" },
    "fixation",
  ),

  // —— 易混副型 ——
  cq(
    "c-2sx-3sx-p",
    "在单一焦点关系中，更在意的是：",
    { subtype: "2sx", text: "是否被该对象选中，是否成为其所缺的那部分。" },
    { subtype: "3sx", text: "是否具有磁性与竞争力，是否被欲求。" },
  ),
  cq(
    "c-1sp-6sp-p",
    "日常中更紧绷的是：",
    { subtype: "1sp", text: "身体、家务、金钱与程序必须正确。稍有松弛即感「不该如此」。" },
    { subtype: "6sp", text: "是否有可靠之人、环境是否会崩塌。先让自己显得无害与好相处。" },
  ),
  cq(
    "c-1so-6so-p",
    "对规则与立场的坚持更接近：",
    { subtype: "1so", text: "原则即自身。众人皆如此，亦不能成为自己行动的理由。" },
    { subtype: "6so", text: "以系统压住恐惧。忠诚与怀疑并存，惧怕自己人破裂。" },
  ),
  cq(
    "c-1sx-8sx-p",
    "对亲近对象的烈度更接近：",
    { subtype: "1sx", text: "要将该对象拉回「应有」的样子。热忱与纠正纠缠。" },
    { subtype: "8sx", text: "要占有、要穿透。虚伪与软弱不被接受，平淡等于未曾发生。" },
  ),
  cq(
    "c-4sp-8sp-p",
    "能承受苦难的内在机制更接近：",
    { subtype: "4sp", text: "将苦往下咽，以更能熬来证明自身不逊于他人，拒绝被可怜。" },
    { subtype: "8sp", text: "胃口与地盘是直接的。承受是为了取得所要，不表演委屈。" },
  ),
  cq(
    "c-4sx-8sx-p",
    "对单一焦点的投入更接近：",
    { subtype: "4sx", text: "竞争，不能居于第二。对方拥有的必须被超越，否则产生恨意。" },
    { subtype: "8sx", text: "占有与烈度。控制与献身纠缠。" },
  ),
  cq(
    "c-5sx-4sx-p",
    "将某人视为极重的懂己者时，更接近的运作是：",
    { subtype: "5sx", text: "仅将内在交给这一条通道，惧怕向众人泄露。" },
    { subtype: "4sx", text: "该焦点拥有的必须被超越，关系与投入用以证明自身特殊。" },
  ),
  cq(
    "c-8so-2so-p",
    "为「自己人」出头时，更接近的动力是：",
    { subtype: "8so", text: "力量用于护场。弱者不可被欺，背叛将引发过量反击。" },
    { subtype: "2so", text: "以慷慨与魅力使众人环绕自身。自身需成为被需要的中心。" },
  ),
  cq(
    "c-9so-3so-p",
    "在群体中忙碌时，更接近的状态是：",
    { subtype: "9so", text: "自我消融于「我们」。单独面对自身意愿时反而空虚。" },
    { subtype: "3so", text: "忙于被看见成功。无观众的忙碌几乎不算。" },
  ),
  cq(
    "c-6sx-8sx-p",
    "让自己显得不好惹，更主要是为了：",
    { subtype: "6sx", text: "避免被吓到或被控制，因此先武装。迎上是为了不当那个害怕的人。" },
    { subtype: "8sx", text: "过量本身即是活着的状态，并非为了防御恐惧。强度即胃口。" },
  ),
  cq(
    "c-5sp-9sp-p",
    "待在自身小空间时，更接近的机制是：",
    { subtype: "5sp", text: "少给、少被看见。外界是消耗，需求能少则少。" },
    { subtype: "9sp", text: "以吃、睡、惯例麻醉真正的意愿。大事以后再说。" },
  ),
  cq(
    "c-3sp-1sp-p",
    "将日子过得稳妥正确，更接近的动力是：",
    { subtype: "3sp", text: "以能干与撑住生活证明自身仍在。一旦停工即慌。" },
    { subtype: "1sp", text: "必须正确，否则即是不该发生的错误。怒气转化为担心与检查。" },
  ),
  cq(
    "c-7sx-4sx-p",
    "平淡难以忍受，更接近的原因是：",
    { subtype: "7sx", text: "需要被下一团火勾走。痛苦一来即转向新体验与新叙述。" },
    { subtype: "4sx", text: "需要张力来确认自身仍在。缺失与特殊感被点燃。" },
  ),
  cq(
    "c-8sx-2sx-p",
    "一对一关系必须浓烈，更接近的是：",
    { subtype: "8sx", text: "该焦点是自身的。占有与献身是同一件事，温水不算。" },
    { subtype: "2sx", text: "必须被该对象选中。付出中藏有隐蔽的独占，可替换会刺痛。" },
  ),
  cq(
    "c-6sp-2sp-p",
    "以好相处、示弱或热络靠近他人，更接近的是：",
    { subtype: "6sp", text: "换取安全与被保护。惧怕被丢下，因此先让自己不具威胁。" },
    { subtype: "2sp", text: "换取优待与被放在前面。骄傲在于「我该被照顾」。" },
  ),
  cq(
    "c-4so-6so-p",
    "在群体中感到格格不入或高度警惕，更接近的是：",
    { subtype: "4so", text: "羞耻与残缺构成身份。既渴望被懂，又惧怕一旦被接纳即沦为普通。" },
    { subtype: "6so", text: "职责与立场压住不确定。惧怕两面与自己人破裂。" },
  ),
  cq(
    "c-9sx-2sx-p",
    "在一对一中容易变成「我们／它怎样就怎样」，更接近的是：",
    { subtype: "9sx", text: "自身意愿入睡。有该焦点才完整，单独时难以发动。" },
    { subtype: "2sx", text: "要成为其所缺的那部分，让对方离不开。此为占领，而非单纯跟随。" },
  ),
  cq(
    "c-3sx-8sx-p",
    "在意自身强弱与被看重，更接近的是：",
    { subtype: "3sx", text: "虚荣落在一对一的磁性上：被选中、被欲求。失败即变得不可欲。" },
    { subtype: "8sx", text: "生命力过量：占有与强度本身，并非演给谁看。" },
  ),

  // —— 同号本能 ——
  cq(
    "c-1sp-1sx",
    "怒气更主要冲着：",
    { subtype: "1sp", text: "日常是否出错、是否足够干净稳妥。表面常呈现为担心。" },
    { subtype: "1sx", text: "该一对一对象是否足够认真。热忱、妒意与纠正纠缠。" },
  ),
  cq(
    "c-1so-1sx",
    "更想改变的是：",
    { subtype: "1so", text: "团体、风气与不公正。常成为提醒规则的人。" },
    { subtype: "1sx", text: "这一个焦点。对方怎可将热忱给错地方。" },
  ),
  cq(
    "c-2sp-2so",
    "骄傲更主要的表现是：",
    { subtype: "2sp", text: "我该被优待、被养育。示弱或可爱比无私更能获取资源。" },
    { subtype: "2so", text: "我要成为人人需要、人人敬畏之人。助人是野心。" },
  ),
  cq(
    "c-2sp-2sx",
    "更想从谁那里被置于前面：",
    { subtype: "2sp", text: "能供养、能照顾自己的人。被忽略即产生委屈。" },
    { subtype: "2sx", text: "那个被自身征服的焦点。被当成可替换会刺痛。" },
  ),
  cq(
    "c-2so-2sx",
    "给予更主要是为了：",
    { subtype: "2so", text: "在圈子里成为中心，使人人环绕自身。" },
    { subtype: "2sx", text: "让这一个对象离不开自己。付出不能给别处。" },
  ),
  cq(
    "c-3sp-3so",
    "成功对自身更意味着：",
    { subtype: "3sp", text: "能养活、有保障、看起来能干。不爱空谈名声。" },
    { subtype: "3so", text: "被公开看见。无观众的成就几乎不算。" },
  ),
  cq(
    "c-3sp-3sx",
    "证明自身更依赖：",
    { subtype: "3sp", text: "工作量、收入、把日子撑住。" },
    { subtype: "3sx", text: "魅力、被选中、在认定的焦点面前发光。" },
  ),
  cq(
    "c-3so-3sx",
    "更在意的观众是：",
    { subtype: "3so", text: "群体、圈子、头衔与比较。" },
    { subtype: "3sx", text: "在这个一对一关系中自身是否具有磁性与竞争力。" },
  ),
  cq(
    "c-4sp-4so",
    "嫉妒更接近：",
    { subtype: "4sp", text: "不表演忧郁。苦往下咽，以更能熬来超过。" },
    { subtype: "4so", text: "在群体中成为局外人。羞耻与残缺被看见，亦因此特殊。" },
  ),
  cq(
    "c-4sp-4sx",
    "「我没有别人有的那块」更被用来：",
    { subtype: "4sp", text: "咬牙硬撑，反感被可怜。" },
    { subtype: "4sx", text: "与这一个焦点较劲。投入与攻击可迅速对调。" },
  ),
  cq(
    "c-4so-4sx",
    "特殊感更主要来自：",
    { subtype: "4so", text: "在社会中放逐自身。既渴求被懂，又轻视一旦融入即沦为普通。" },
    { subtype: "4sx", text: "一对一中的竞争。平淡等于自身被取消。" },
  ),
  cq(
    "c-5sp-5so",
    "守住自身更依赖：",
    { subtype: "5sp", text: "可撤退的房间与时间。少出门、少欠、少被看见。" },
    { subtype: "5so", text: "专家、地图、「我知道」。给出的是蒸馏过的内容，而非自身。" },
  ),
  cq(
    "c-5sp-5sx",
    "吝啬更针对：",
    { subtype: "5sp", text: "全世界。堡垒是具体的，参与如同失血。" },
    { subtype: "5sx", text: "众人。对那一条一对一通道，却可以非常浓。" },
  ),
  cq(
    "c-5so-5sx",
    "对外连接更接近：",
    { subtype: "5so", text: "通过观念与体系，而非体温。" },
    { subtype: "5sx", text: "通过一条秘密通道。那一个焦点几乎是唯一出口。" },
  ),
  cq(
    "c-6sp-6so",
    "安全更主要来自：",
    { subtype: "6sp", text: "亲切、联盟、被放进可靠之人的圈子。惧怕被热络淹没。" },
    { subtype: "6so", text: "义务、立场、程序与「正确的一边」。" },
  ),
  cq(
    "c-6sp-6sx",
    "恐惧浮现时，更接近的反应是：",
    { subtype: "6sp", text: "先让自己温暖、有用、不具威胁，以换取保护。" },
    { subtype: "6sx", text: "先武装成不好惹。宁可迎上，也不停在害怕之中。" },
  ),
  cq(
    "c-6so-6sx",
    "对抗不确定更依赖：",
    { subtype: "6so", text: "集体任务、规则、谁是自己人。" },
    { subtype: "6sx", text: "力量、锋利、一个能扛事也能对打的同盟。" },
  ),
  cq(
    "c-7sp-7so",
    "贪食更落地为：",
    { subtype: "7sp", text: "人脉、享受的基础设施、具体的好吃好喝与退路。" },
    { subtype: "7so", text: "为理想与群体推迟眼前的甜。牺牲仍是一种计划。" },
  ),
  cq(
    "c-7sp-7sx",
    "躲开沉重更依赖：",
    { subtype: "7sp", text: "将其变成可安排之事，或换成有用的朋友与舒服。" },
    { subtype: "7sx", text: "被下一团火勾走。平淡如同死亡，体验必须发光。" },
  ),
  cq(
    "c-7so-7sx",
    "「还有更多」更冲着：",
    { subtype: "7so", text: "更大的愿景、群体的未来。沉闷的义务除非通向意义。" },
    { subtype: "7sx", text: "人、冒险、边缘体验。承诺随兴致来去。" },
  ),
  cq(
    "c-8sp-8so",
    "力量更用在：",
    { subtype: "8sp", text: "地盘、胃口、谁说了算。生存先于演讲。" },
    { subtype: "8so", text: "护自己人。帮派之头，弱者之盾。" },
  ),
  cq(
    "c-8sp-8sx",
    "过量更对着：",
    { subtype: "8sp", text: "物资与边界。挡我者推开即可。" },
    { subtype: "8sx", text: "这一个一对一的焦点。必须有穿透力，温水不算。" },
  ),
  cq(
    "c-8so-8sx",
    "更不能忍的是：",
    { subtype: "8so", text: "自己的人被欺、自己人背叛。" },
    { subtype: "8sx", text: "关系若即若离、虚伪文雅、不够烈。" },
  ),
  cq(
    "c-9sp-9so",
    "怠惰更通过：",
    { subtype: "9sp", text: "吃、睡、惯例与身体舒适。环境被打乱比理想被打乱更烦。" },
    { subtype: "9so", text: "将日程交给团体。看起来很忙，忙的是归属。" },
  ),
  cq(
    "c-9sp-9sx",
    "自身被麻醉更通过：",
    { subtype: "9sp", text: "可重复的舒服。冲突来时溜入身体。" },
    { subtype: "9sx", text: "这个焦点。结合一旦被理想化，自身边界即变薄。" },
  ),
  cq(
    "c-9so-9sx",
    "「我们」对自身更是：",
    { subtype: "9so", text: "群体、会议、家庭或公司文化。自身是其中一员。" },
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