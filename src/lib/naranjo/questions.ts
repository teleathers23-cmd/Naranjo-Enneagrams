import type { CenterId, Instinct, SubtypeId, TypeId } from "./catalog";

export type Load = { key: string; weight: number };

export type Question = {
  id: string;
  stage: 1 | 2;
  text: string;
  help?: string;
  section: string;
  type?: TypeId;
  subtype?: SubtypeId;
  center?: CenterId;
  reverse?: boolean;
  kind?: "content" | "validity";
  facet?: "passion" | "fixation" | "center" | "check";
  pair?: string;
  loads: Load[];
};

const CENTER_OF: Record<TypeId, CenterId> = {
  1: "gut",
  2: "heart",
  3: "heart",
  4: "heart",
  5: "head",
  6: "head",
  7: "head",
  8: "gut",
  9: "gut",
};

function t(
  id: string,
  type: TypeId,
  text: string,
  extra?: Partial<Question>,
): Question {
  const reverse = extra?.reverse;
  const center = CENTER_OF[type];
  return {
    id,
    stage: 1,
    type,
    center,
    text,
    section: "mix",
    facet: extra?.facet ?? "passion",
    pair: extra?.pair ?? `t${type}-core`,
    reverse,
    kind: "content",
    loads: extra?.loads ?? [
      { key: `t${type}`, weight: 1 },
      { key: `c-${center}`, weight: reverse ? 0.25 : 0.35 },
    ],
    help: extra?.help,
  };
}

function s(
  id: string,
  subtype: SubtypeId,
  type: TypeId,
  instinct: Instinct,
  text: string,
  help?: string,
): Question {
  return {
    id,
    stage: 2,
    subtype,
    type,
    text,
    help,
    section: "mix",
    kind: "content",
    loads: [
      { key: subtype, weight: 1 },
      { key: `t${type}`, weight: 0.25 },
      { key: instinct, weight: 0.35 },
    ],
  };
}

function c(id: string, center: CenterId, text: string): Question {
  return {
    id,
    stage: 1,
    center,
    text,
    section: "mix",
    kind: "content",
    facet: "center",
    loads: [{ key: `c-${center}`, weight: 1 }],
  };
}

function v(
  id: string,
  text: string,
  extra: { pair?: string; loads?: Load[]; reverse?: boolean },
): Question {
  return {
    id,
    stage: 1,
    text,
    section: "mix",
    kind: "validity",
    facet: "check",
    pair: extra.pair,
    reverse: extra.reverse,
    loads: extra.loads ?? [{ key: "valid", weight: 1 }],
  };
}

/** 混在情欲题里，不单独成区。测的是注意落点，不是「我是心/脑/腹」。 */
export const STAGE_CENTER: Question[] = [
  c("ch1", "heart", "若一整天没人把我放在眼里，我会觉得自己几乎不存在，哪怕事情都做完了。"),
  c("ch2", "heart", "我先感觉到的是位置、脸面或被对待的方式，对错和危险要稍后才进来。"),
  c("ch3", "heart", "一件事值不值得做，常常取决于它会不会让我被看见、被要、或显得不像我。"),
  c("cd1", "head", "事情一出现，我体内先响起来的是问题、预案或「还没看清」，不是情绪或动作。"),
  c("cd2", "head", "空白、没说法、下一步不清楚，比当场丢脸或被人推着走更让我难受。"),
  c("cd3", "head", "我用想明白、盯住或留退路来感觉自己还在；不先经过脑子，身体像不敢动。"),
  c("cg1", "gut", "我常还没想好，身体已经顶住、沉住或整个人不想动。"),
  c("cg2", "gut", "被人挪走边界、替我做主，比被看轻或想不通更先激怒我。"),
  c("cg3", "gut", "我对事情有一种来自身体的「就是这样」，要靠说服才能改方向会很别扭。"),
];

export const STAGE1: Question[] = [
  t("t1a", 1, "世界或我自己「不够对」时，注意会粘在那里，松开会像失职。"),
  t("t1b", 1, "不满很少炸开，更多是咬着的纠正：不该这样，必须更好。", { facet: "fixation" }),
  t("t1c", 1, "马虎、含糊、差不多，会在我身体里留下一股长时间的不对劲。"),
  t("t1d", 1, "我很难把「应该」从眼前的人与事上拿开，即使没人要求我当裁判。", { facet: "fixation" }),
  t("t1e", 1, "对错在我这儿过得很快，很少变成内心长期的尺子。", { reverse: true }),

  t("t2a", 2, "不被需要时，自我会瘪下去；被需要时，我才觉得自己是满的。"),
  t("t2b", 2, "我常在别人开口前就补上他们缺的那一块，好让自己站在不可替代的位置。", {
    facet: "fixation",
  }),
  t("t2c", 2, "说「我想要」比说「我能给」更难出口，好像欲望会毁掉我的位置。"),
  t("t2d", 2, "亲密里我盯的是自己特不特别、有没有被放在心上，多于事情本身对不对。"),
  t("t2e", 2, "别人用不用得上我，不怎么动摇我是谁。", { reverse: true }),

  t("t3a", 3, "停下来、没有成果或形象可撑时，我会发慌，好像人不在了。"),
  t("t3b", 3, "面对不同的眼睛，我会自动换成更能被认可的版本，有时连自己都来不及感觉。", {
    facet: "fixation",
  }),
  t("t3c", 3, "失败或出丑不像难堪，更像自我塌了一块。"),
  t("t3d", 3, "我更清楚事情看起来成不成，不清楚当时我真正感觉到什么。"),
  t("t3e", 3, "有没有观众、成不成功，都不怎么决定我是谁。", { reverse: true }),

  t("t4a", 4, "我常觉得别人天然有一块我没有的东西：归属、美、轻松或被爱。"),
  t("t4b", 4, "平淡会让我掉下去。情绪的浓度、失落或特殊感，才能提醒我还在。"),
  t("t4c", 4, "比较几乎是自动的：谁更真、谁更痛、谁更特别。", { facet: "fixation" }),
  t("t4d", 4, "我既想被看见残缺的那面，又怕一被理解就变成普通。"),
  t("t4e", 4, "我很少用「我缺了什么」或情绪浓度来确认自己。", { reverse: true }),

  t("t5a", 5, "投入时间、精力或心情之前，我会先缩回自己的领地，参与像失血。"),
  t("t5b", 5, "被当场要求表态或付出，我会觉得被抢，宁可先看清楚再动。"),
  t("t5c", 5, "内在生活、知识和独处被我看得很紧，随便分享像少了一块自己。", {
    facet: "fixation",
  }),
  t("t5d", 5, "需求能少则少。依赖别人既不安全，也像给出去太多。"),
  t("t5e", 5, "我很愿意随时投入，不觉得把自己给人会空掉。", { reverse: true }),

  t("t6a", 6, "安心总差一步。注意会自动去扫「会出什么岔子」。"),
  t("t6b", 6, "我需要权威或承诺来定位，同时又怀疑它们会不会靠得住。", { facet: "fixation" }),
  t("t6c", 6, "做决定时正反两造会一直辩论，下笔像冒险。"),
  t("t6d", 6, "忠诚一旦给出就很重，同时我一直在确认对方会不会先离开。"),
  t("t6e", 6, "我很少预先担忧，也不靠警惕来组织一天。", { reverse: true }),

  t("t7a", 7, "限制、重复和沉重的情绪一来，注意就会去找下一个出口。"),
  t("t7b", 7, "当下很容易变成跳板：脑子里已经有下一步更好的可能。", { facet: "fixation" }),
  t("t7c", 7, "痛苦出现时，我会很快给它一个说法、一个安排，或把它说成「其实还好」。"),
  t("t7d", 7, "选项一少、被钉在没意思的事上，我会像窒息。"),
  t("t7e", 7, "我可以长时间停在沉闷或不舒服里，不急着换场景。", { reverse: true }),

  t("t8a", 8, "被控、被骗、被当成软弱，会立刻把我推到往前顶的位置。"),
  t("t8b", 8, "欲望是直接的：要，就去拿。绕弯和示弱让我不屑。"),
  t("t8c", 8, "过量才像活着：力气、冲突、胃口、把话推到尽头。"),
  t("t8d", 8, "承认脆弱几乎违反生理。受伤时我宁可变成硬或怒。", { facet: "fixation" }),
  t("t8e", 8, "我不追求强度，谁做主也无所谓。", { reverse: true }),

  t("t9a", 9, "真正属于我的意愿常被推迟。和谐、惯性或别人的优先会先占位。"),
  t("t9b", 9, "冲突来了，我容易走神、同意一下再说；怒气很晚才被我听见。"),
  t("t9c", 9, "我可以很忙，忙的不一定是我想要的那件事。", { facet: "fixation" }),
  t("t9d", 9, "熟悉的节奏一被打乱，比理想被打乱更让我烦。"),
  t("t9e", 9, "我很清楚自己要什么，也会立刻把意愿放到冲突里去。", { reverse: true }),
];

export const VALIDITY: Question[] = [
  v("v-inf1", "过去七天里，我每天都把同一本厚书从头到尾读完两遍，并立刻全部做到。", {
    pair: "infreq",
    loads: [{ key: "valid-infreq", weight: 1 }],
  }),
  v(
    "v-inf2",
    "我可以同时百分之百不在乎任何人，又百分之百活在所有人的目光里，两者毫不打架。",
    { pair: "infreq", loads: [{ key: "valid-infreq", weight: 1 }] },
  ),
  v("v-sd1", "我对自己的动机几乎没有看不清的时候，很少需要事后才承认自己在掩饰。", {
    pair: "defense",
    loads: [{ key: "valid-defense", weight: 1 }],
  }),
  v("v-ex1", "下面这些对我同时「极像」：我从不生气、从不害怕、也从不在乎形象。", {
    pair: "exagg",
    loads: [{ key: "valid-exagg", weight: 1 }],
  }),
];

export const STAGE2: Question[] = [
  s("1sp1", "1sp", 1, "sp", "「必须正确」多半落在身体、钱、住处和别出差错上，而不是改造风气。"),
  s("1sp2", "1sp", 1, "sp", "怒气在我这儿更像担心和烦躁：怕一松就会出事。"),
  s("1sp3", "1sp", 1, "sp", "别人看见我谨慎、爱检查；不大看见我对世界在生气。"),
  s("1so1", "1so", 1, "so", "大家都这样，并不能成为我去做的理由。随俗本身就别扭。"),
  s("1so2", "1so", 1, "so", "我常在团体里成为提醒程序和公正的人，哪怕因此不讨喜。"),
  s("1so3", "1so", 1, "so", "对走捷径和虚伪的不满是公共的，不只是私下洁癖。"),
  s("1sx1", "1sx", 1, "sx", "我会把完美标准加在亲密的人身上，很难放过对方的「不认真」。"),
  s("1sx2", "1sx", 1, "sx", "妒意和义愤会搅在一起：你怎么可以把热忱给错地方。"),
  s("1sx3", "1sx", 1, "sx", "我比多数「讲对错的人」更有火，更像要拯救或改造那一个人。"),

  s("2sp1", "2sp", 2, "sp", "我更想被优待、被照顾，而不是当所有人的照顾者。"),
  s("2sp2", "2sp", 2, "sp", "可爱、可怜或「我特殊」常常比无私更能帮我得到资源。"),
  s("2sp3", "2sp", 2, "sp", "被忽略时我会委屈或发作，内心觉得自己本该被放在前面。"),
  s("2so1", "2so", 2, "so", "我通过张罗和情感劳动在群体里占据显眼位置。"),
  s("2so2", "2so", 2, "so", "谁能抬升我，我有清晰雷达；被晾在边缘很难忍。"),
  s("2so3", "2so", 2, "so", "助人是我的社会野心，而不只是一对一的柔情。"),
  s("2sx1", "2sx", 2, "sx", "我懂得把对方缺少的那一味变成我自己，让他离不开。"),
  s("2sx2", "2sx", 2, "sx", "被当成「只是朋友」或可替代，会刺痛骄傲。"),
  s("2sx3", "2sx", 2, "sx", "我为一个人做的，不能轻易给别人；付出里有隐蔽的独占。"),

  s("3sp1", "3sp", 3, "sp", "我用能干、收入和把生活撑住来证明自己，多于用名声。"),
  s("3sp2", "3sp", 3, "sp", "我不爱空谈形象，但非常在意自己看起来可靠、有效率。"),
  s("3sp3", "3sp", 3, "sp", "一闲下来会发慌，好像人一开始不像自己。"),
  s("3so1", "3so", 3, "so", "没有观众的成就，对我几乎不算成就。"),
  s("3so2", "3so", 3, "so", "头衔、比较、圈子和公开认可，会直接牵动我的自我。"),
  s("3so3", "3so", 3, "so", "我知道一个场要看什么，就能把自己做成那个。"),
  s("3sx1", "3sx", 3, "sx", "我在意自己有没有魅力上的竞争力，而不只是业绩。"),
  s("3sx2", "3sx", 3, "sx", "成功常常是为了在那个人眼前发光，被选中。"),
  s("3sx3", "3sx", 3, "sx", "被当成没有吸引力或无能，比被说道德不好更伤。"),

  s("4sp1", "4sp", 4, "sp", "我把苦往下咽。别人看我能扛，甚至像乐天，其实是咬牙。"),
  s("4sp2", "4sp", 4, "sp", "我反感被可怜。优越来自「我比你们更能熬」。"),
  s("4sp3", "4sp", 4, "sp", "嫉妒在我这儿不表演忧郁，而变成长期的自找苦吃。"),
  s("4so1", "4so", 4, "so", "在团体里我容易感到自己是局外人，差一截，也因此特殊。"),
  s("4so2", "4so", 4, "so", "羞耻和被看见的残缺，是我社会身份的一部分。"),
  s("4so3", "4so", 4, "so", "我既渴求被理解，又轻视一旦融入就会变得普通。"),
  s("4sx1", "4sx", 4, "sx", "亲密里我会较劲：你有的，我必须更好，否则就恨。"),
  s("4sx2", "4sx", 4, "sx", "平淡让我活不了。张力、被放第一，才能感觉自己。"),
  s("4sx3", "4sx", 4, "sx", "爱和攻击可以迅速互换，对象总是那一个重要的人。"),

  s("5sp1", "5sp", 5, "sp", "我需要可撤退的房间和时间，否则会像被侵入。"),
  s("5sp2", "5sp", 5, "sp", "体力、金钱、人情我都精打细算，需求能少则少。"),
  s("5sp3", "5sp", 5, "sp", "我的堡垒是具体的：少出门、少欠、少被看见。"),
  s("5so1", "5so", 5, "so", "我在群体中的位置是专家或地图，不是交心。"),
  s("5so2", "5so", 5, "so", "我可以分享蒸馏过的知识，但不把私人生活交给团体。"),
  s("5so3", "5so", 5, "so", "被当成普通一员而非智识角色时，我会撤离。"),
  s("5sx1", "5sx", 5, "sx", "对多数人封闭，对「那一个懂我的人」可以非常浓。"),
  s("5sx2", "5sx", 5, "sx", "我渴望一个秘密通道式的同盟，而不是广阔社交。"),
  s("5sx3", "5sx", 5, "sx", "一旦信赖被辜负，我会长期封死，比发怒更彻底。"),

  s("6sp1", "6sp", 6, "sp", "我用亲切和好相处来换安全，看起来不像怕。"),
  s("6sp2", "6sp", 6, "sp", "靠得住的人一不在，或关系一松，我会比自己承认的更慌。"),
  s("6sp3", "6sp", 6, "sp", "我害怕成为麻烦，所以先让自己温暖、不具威胁。"),
  s("6so1", "6so", 6, "so", "义务、立场和程序能帮我压住不确定。"),
  s("6so2", "6so", 6, "so", "对不忠、两面派和「自己人」破裂，我非常敏感。"),
  s("6so3", "6so", 6, "so", "我可以勇敢执行集体任务，私下仍充满「万一」。"),
  s("6sx1", "6sx", 6, "sx", "我倾向于先武装自己：力量或不好惹，以免被吓。"),
  s("6sx2", "6sx", 6, "sx", "威胁一出现，我宁可迎上去，也不愿停在害怕里。"),
  s("6sx3", "6sx", 6, "sx", "亲密中我会考验对方够不够强，也需要一个能扛事的同盟。"),

  s("7sp1", "7sp", 7, "sp", "我把机会、关系和享受织成网，务实，不像在飘。"),
  s("7sp2", "7sp", 7, "sp", "享乐对我很具体：吃、走、舒服、有用的朋友和退路。"),
  s("7sp3", "7sp", 7, "sp", "沉重话题一来，我会迅速把它变成可解决的安排或换题。"),
  s("7so1", "7so", 7, "so", "我可以为理想和「大家」推迟眼前的甜，这让我感觉高尚而自由。"),
  s("7so2", "7so", 7, "so", "没有出口的痛苦我受不了，除非它能被讲成更大的愿景。"),
  s("7so3", "7so", 7, "so", "我在群体里常是热情的倡议者，用未来把沉闷抬走。"),
  s("7sx1", "7sx", 7, "sx", "我容易对人、地方和体验一见钟情，也容易转向下一团火。"),
  s("7sx2", "7sx", 7, "sx", "平淡像死。我需要被勾走、被迷住，才感觉生命在发生。"),
  s("7sx3", "7sx", 7, "sx", "正在发生的不适，我会用讲述、计划和下一次盖过去。"),

  s("8sp1", "8sp", 8, "sp", "我要的是实在的满足：地盘、胃口、谁说了算，而不是演讲。"),
  s("8sp2", "8sp", 8, "sp", "欲望直接。挡我的人我会推开，不花时间表演委屈。"),
  s("8sp3", "8sp", 8, "sp", "我尊重能扛事的人，不耐烦把生活说成心理故事。"),
  s("8so1", "8so", 8, "so", "我的力用在「我的人不能被欺」，常因此成为保护者。"),
  s("8so2", "8so", 8, "so", "不公落在所属团体上，比落在抽象原则上更让我出手。"),
  s("8so3", "8so", 8, "so", "对内讲义气，对外可以非常硬；背叛自己人我会过量反击。"),
  s("8sx1", "8sx", 8, "sx", "亲密必须有穿透力。你是我的，平淡等于没有发生。"),
  s("8sx2", "8sx", 8, "sx", "占有和献身缠在一起：我要你，也把自己狠狠给你。"),
  s("8sx3", "8sx", 8, "sx", "我轻蔑虚伪和懦弱，尊重敢顶回来的人。"),

  s("9sp1", "9sp", 9, "sp", "吃、睡、惯例和熟悉的舒适，常被我用来推迟真正要面对的事。"),
  s("9sp2", "9sp", 9, "sp", "环境被打乱比理想被打乱更烦。惯性本身就是安神药。"),
  s("9sp3", "9sp", 9, "sp", "冲突来时我先麻木或溜到身体舒服里，怒气很晚才闷出来。"),
  s("9so1", "9so", 9, "so", "我的日程很容易被团体填满；一个人面对自己时反而空。"),
  s("9so2", "9so", 9, "so", "我擅长配合和调解，难做会让人不悦、却属于我的决定。"),
  s("9so3", "9so", 9, "so", "「我是其中一员」比「我要去哪」更能定义我。看起来很忙，忙的是归属。"),
  s("9sx1", "9sx", 9, "sx", "在亲密里我容易失去自己的偏好和时间，变成「我们」。"),
  s("9sx2", "9sx", 9, "sx", "一个人很难发动；有那个人在，我才感觉完整。"),
  s("9sx3", "9sx", 9, "sx", "我会把结合理想化，摩擦要么被雾盖住，要么突然变成硬墙。"),
];

export const STEP1: Question[] = [...STAGE_CENTER, ...STAGE1, ...VALIDITY];

export const ALL_QUESTIONS: Question[] = [...STEP1, ...STAGE2];
export const QUESTION_MAP: Record<string, Question> = Object.fromEntries(
  ALL_QUESTIONS.map((q) => [q.id, q]),
);

export const LIKERT_LABELS = [
  "不像",
  "较少",
  "中立",
  "较像",
  "极像",
] as const;

export const TEST_INSTRUCTION =
  "按第一下的体感作答，不要按「我想成为的人」或「别人觉得我怎样」。题目写的是注意如何组织，不是你做了多少好事。没有标准答案，也不按型号分区。";

export const STAGE1_HELP: Record<TypeId, string> = {
  1: "愤怒是否被做成长期的「应该」与怨恨。",
  2: "骄傲：是否靠被需要来维持自我。",
  3: "虚荣：形象与成果是否替代了感受。",
  4: "嫉妒与匮乏感。",
  5: "贪婪：吝啬的是自己与参与。",
  6: "恐惧与怀疑是否在组织注意。",
  7: "对经验的贪食、对痛苦的逃。",
  8: "情欲：过量、强度与否认软弱。",
  9: "怠惰：自我被麻醉、被合并。",
};

export const STAGE2_HELP =
  "第二步仍混排。请按句子本身的结构作答，不要猜这是哪一号或哪一种本能。";

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

function shuffle<T>(items: T[], rng: () => number): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** 按结构桶打散：同型号不相邻成区，效度题插入中间。 */
export function interleaveQuestions(questions: Question[], seed: number): Question[] {
  const rng = mulberry32(seed || 1);
  const buckets = new Map<string, Question[]>();
  for (const q of questions) {
    const key = q.kind === "validity" ? `v-${q.id}` : q.subtype ?? (q.type ? `t${q.type}` : q.center ?? q.id);
    const list = buckets.get(key) ?? [];
    list.push(q);
    buckets.set(key, list);
  }
  const keys = shuffle([...buckets.keys()], rng);
  for (const k of keys) buckets.set(k, shuffle(buckets.get(k)!, rng));
  const out: Question[] = [];
  let added = true;
  while (added) {
    added = false;
    for (const k of keys) {
      const list = buckets.get(k);
      if (list && list.length) {
        const next = list.shift()!;
        const last = out[out.length - 1];
        if (last && last.type && next.type && last.type === next.type && list.length) {
          list.push(next);
          const alt = list.shift();
          if (alt) {
            out.push(alt);
            added = true;
          }
        } else {
          out.push(next);
          added = true;
        }
      }
    }
  }
  return out;
}

export function chunkQuestions(questions: Question[], size = 9): Question[][] {
  const chunks: Question[][] = [];
  for (let i = 0; i < questions.length; i += size) {
    chunks.push(questions.slice(i, i + size));
  }
  return chunks;
}
