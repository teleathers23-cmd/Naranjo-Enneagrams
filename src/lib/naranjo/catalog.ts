export type Instinct = "sp" | "so" | "sx";
export type TypeId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type SubtypeId = `${TypeId}${Instinct}`;

export const INSTINCTS: {
  id: Instinct;
  name: string;
  nameEs: string;
  brief: string;
}[] = [
  {
    id: "sp",
    name: "自我保存",
    nameEs: "Conservación",
    brief: "生存、领地、身体、资源与舒适。能量向内收束，先问「我能否活下去、稳住」。",
  },
  {
    id: "so",
    name: "社交",
    nameEs: "Social",
    brief: "群体中的位置、归属、适应与声誉。能量向外铺开，先问「我在人群里是谁」。",
  },
  {
    id: "sx",
    name: "性",
    nameEs: "Sexual",
    brief: "一对一的强度、化学吸引、融合与传递。能量聚焦于「那一个人」，先问「能否点燃」。",
  },
];

export const TYPES: {
  id: TypeId;
  passion: string;
  passionEs: string;
  fixation: string;
  virtue: string;
  trap: string;
  center: "gut" | "heart" | "head";
  name: string;
  brief: string;
}[] = [
  {
    id: 1,
    passion: "愤怒",
    passionEs: "Ira",
    fixation: "怨恨",
    virtue: "安详",
    trap: "完美",
    center: "gut",
    name: "完美者",
    brief: "愤怒被压成长期的「应该」。世界不够对，自己也不够对，用批评维持秩序。",
  },
  {
    id: 2,
    passion: "骄傲",
    passionEs: "Orgullo",
    fixation: "谄媚",
    virtue: "谦卑",
    trap: "助人",
    center: "heart",
    name: "给予者",
    brief: "把自己膨胀成「最能爱的人」。需要被需要，以给予换取位置，否认自己的匮乏。",
  },
  {
    id: 3,
    passion: "虚荣",
    passionEs: "Vanidad",
    fixation: "虚荣",
    virtue: "诚实",
    trap: "效率",
    center: "heart",
    name: "成就者",
    brief: "用形象代替存在。做比感受更安全，成功是自我，失败像死亡。",
  },
  {
    id: 4,
    passion: "嫉妒",
    passionEs: "Envidia",
    fixation: "忧郁",
    virtue: "平静",
    trap: "独特",
    center: "heart",
    name: "浪漫者",
    brief: "感到自己缺了别人有的那一块。用失落、特殊与比较来维持自我感。",
  },
  {
    id: 5,
    passion: "贪婪",
    passionEs: "Avaricia",
    fixation: "吝啬",
    virtue: "超脱",
    trap: "观察",
    center: "head",
    name: "观察者",
    brief: "吝啬的不是钱，是自己。能量、时间、内在生活被围起来，先看、后给、很少给。",
  },
  {
    id: 6,
    passion: "恐惧",
    passionEs: "Miedo",
    fixation: "怯懦／指控",
    virtue: "勇气",
    trap: "安全",
    center: "head",
    name: "忠诚者",
    brief: "世界被扫成潜在威胁。怀疑、忠诚、准备与权威纠缠在一起，安心总在下一秒。",
  },
  {
    id: 7,
    passion: "贪食",
    passionEs: "Gula",
    fixation: "计划",
    virtue: "节制",
    trap: "选择",
    center: "head",
    name: "享乐者",
    brief: "对经验的暴食。用计划、选项与未来逃避限制和痛苦，快乐必须「还有更多」。",
  },
  {
    id: 8,
    passion: "情欲",
    passionEs: "Lujuria",
    fixation: "报复",
    virtue: "天真",
    trap: "力量",
    center: "gut",
    name: "挑战者",
    brief: "要更多生命。强度、过量、否认软弱。正义通过力量执行，脆弱等于被吃掉。",
  },
  {
    id: 9,
    passion: "怠惰",
    passionEs: "Pereza",
    fixation: "懒散",
    virtue: "行动",
    trap: "和谐",
    center: "gut",
    name: "调和者",
    brief: "怠惰的是内在生活，不是手脚。自我被麻醉、被合并，重要的事先「以后再说」。",
  },
];

export type Subtype = {
  id: SubtypeId;
  type: TypeId;
  instinct: Instinct;
  name: string;
  nameEs: string;
  nameEn: string;
  countertype: boolean;
  oneLiner: string;
  portrait: string;
  markers: string[];
  lookalikes: SubtypeId[];
  naranjoKey: string;
};

export const SUBTYPES: Subtype[] = [
  {
    id: "1sp",
    type: 1,
    instinct: "sp",
    name: "担忧",
    nameEs: "Preocupación",
    nameEn: "Worry",
    countertype: true,
    oneLiner: "愤怒变成对出错、生病、不够干净的慢性焦虑。看起来不像发火，像在预防灾难。",
    portrait:
      "纳兰霍把自我保存一号称为「担忧」。怒气很少外射，而是沉进身体和日常：怕不完美导致真实损失，怕规则一松，生活就垮。他们比别人更像「谨慎的好人」——检查、纠错、存余、把环境调到正确。怒的热度变成烦躁和担心，批评先对着自己，再对着家务、健康、程序。反型之处在于：旁人看见的是焦虑与洁癖，看不见那句「事情本不该这样」。",
    markers: [
      "对身体、金钱、家务和安全有持续的「必须正确」",
      "怒气表现为担心、烦躁、挑剔，而不是爆发",
      "宁可自己扛下责任，也不愿世界显得草率",
    ],
    lookalikes: ["6sp", "3sp", "9sp"],
    naranjoKey: "Preocupación / anxiety of the self-preservation One",
  },
  {
    id: "1so",
    type: 1,
    instinct: "so",
    name: "不适应",
    nameEs: "Inadaptabilidad",
    nameEn: "Non-adaptability",
    countertype: false,
    oneLiner: "社会的改革者。世界应该更公正，自己绝不随波逐流。",
    portrait:
      "社交一号的关键词是「不适应」。愤怒指向公共秩序：学校、机构、风气、别人的马虎。他们以原则自居，难以对「大家都这样」妥协，常成为团体里的教师、监察或道德标尺。纳兰霍强调其僵硬——不是能力不足，而是不肯为归属而弯。他们要的不是被喜欢，而是被承认为对的。怨恨来自：我已经做对了，你们为什么还不改。",
    markers: [
      "在群体中坚持正确程序与公正，难以随俗",
      "对虚伪、走捷径和「潜规则」格外过敏",
      "改革冲动先于圆滑，常被看成古板或好为人师",
    ],
    lookalikes: ["6so", "8so", "3so"],
    naranjoKey: "Inadaptabilidad / rigidity of the social One",
  },
  {
    id: "1sx",
    type: 1,
    instinct: "sx",
    name: "热忱",
    nameEs: "Celos / Zelo",
    nameEn: "Zeal",
    countertype: false,
    oneLiner: "最灼热的一号。要把亲密的他者改造成完美，妒与热混在一起。",
    portrait:
      "性一号是纳兰霍所说的热忱（zelo）与嫉妒（celos）。怒火有了对象：理想伴侣、理想同志、理想事业。他们以激情改革「那一个人」，对分心、不忠、不认真无法容忍。外表比其他一号更强烈、更有性的热度，也更容易显得控制。正确变成爱的条件——你应该成为你能够成为的那个完美的人。其妒不是单纯占有，而是「你怎么可以把热忱给错了地方」。",
    markers: [
      "把完美标准加在亲密关系上，难以放过细节",
      "热情、妒意与道德义愤常同时出现",
      "比其他一号更有火气，更像在「拯救」对方",
    ],
    lookalikes: ["8sx", "4sx", "6sx"],
    naranjoKey: "Zelo / celos of the sexual One",
  },
  {
    id: "2sp",
    type: 2,
    instinct: "sp",
    name: "特权",
    nameEs: "Privilegio",
    nameEn: "Privilege",
    countertype: true,
    oneLiner: "反型。骄傲表现为「我应该被优待」。可爱、孩子气，要人来养。",
    portrait:
      "自我保存二号是纳兰霍明确的反型：不表演博爱，而表演需要被爱。骄傲变成特权感——我特殊，所以规则对我可以松一点；我可爱，所以你该来照顾。他们可以撒娇、示弱、占据资源，看起来像任性的小孩或被宠坏的人，而不像「奉献者」。给予仍在，但更像投资在能供养自己的人身上。否认的不是欲望，而是「我其实在要」。",
    markers: [
      "用可爱、可怜或特殊来换取照顾与优待",
      "对「谁该来满足我」敏感，被忽略就委屈或发作",
      "助人不是名片，被养、被选中才是",
    ],
    lookalikes: ["4sp", "7sp", "6sp"],
    naranjoKey: "Privilegio / childish privilege of the self-preservation Two",
  },
  {
    id: "2so",
    type: 2,
    instinct: "so",
    name: "野心",
    nameEs: "Ambición",
    nameEn: "Ambition",
    countertype: false,
    oneLiner: "通过给予攀升。要在群体里成为不可或缺、被拥戴的那一位。",
    portrait:
      "社交二号的骄傲走野心：在社会场域里成为「最有用、最有影响力的人」。他们组织、引荐、张罗，站在重要人物身旁，用情感劳动换地位。纳兰霍指出其谄媚不是卑微，而是策略性的自我扩张——我让你们需要我，于是我高于你们。看起来像领袖、社交皇后或「团体的妈」，内里是对无足轻重的恐惧。爱被做成履历。",
    markers: [
      "热衷于在组织里占据显眼的助人／连接位置",
      "对地位、人脉和「谁重要」有清晰雷达",
      "被晾在边缘比被批评更难忍",
    ],
    lookalikes: ["3so", "8so", "7so"],
    naranjoKey: "Ambición of the social Two",
  },
  {
    id: "2sx",
    type: 2,
    instinct: "sx",
    name: "诱惑",
    nameEs: "Seduccion",
    nameEn: "Seduction",
    countertype: false,
    oneLiner: "经典二号。用魅力、体贴与被需要，征服那一个人。",
    portrait:
      "性二号是最像「教科书二号」的副型：诱惑。骄傲体现在「我能让你离不开我」。他们读取欲望，调整自己成为对方缺少的那一味，亲密里充满攻势——不是暴力，是情感与身体的占领。给予高度个人化：我为你做的，不能给别人。一旦关系不够热，骄傲受伤，变成责备「我为你付出这么多」。纳兰霍强调其侵略性：诱惑是打猎，不是单纯温柔。",
    markers: [
      "一对一关系里强烈、黏人、善于成为对方的答案",
      "需要被欲望，被当成「只是朋友」会刺痛",
      "付出常带有隐蔽的账单与独占",
    ],
    lookalikes: ["4sx", "8sx", "3sx"],
    naranjoKey: "Seducción / aggression of the sexual Two",
  },
  {
    id: "3sp",
    type: 3,
    instinct: "sp",
    name: "安全",
    nameEs: "Seguridad",
    nameEn: "Security",
    countertype: true,
    oneLiner: "反型。虚荣藏进工作与供养。不炫耀，但必须是能撑住生活的那个人。",
    portrait:
      "自我保存三号被纳兰霍称为「安全」。虚荣不靠舞台，靠资产、职位、家庭被安排得像样。他们常是公司里最能干活的人：高效、可靠、形象整洁但不夸张。成功的证据是「我能养活、我有保障」，失败则是存在性的羞辱。反型在于看起来务实、甚至谦逊，不像虚荣——因为虚荣已经对象化成工作本身。存在被换成产出。",
    markers: [
      "用工作量、收入和靠谱来证明自己",
      "不爱空谈形象，但非常在意「看起来能干」",
      "停下来会恐慌，休息像堕落",
    ],
    lookalikes: ["1sp", "8sp", "6sp"],
    naranjoKey: "Seguridad of the self-preservation Three",
  },
  {
    id: "3so",
    type: 3,
    instinct: "so",
    name: "声望",
    nameEs: "Prestigio",
    nameEn: "Prestige",
    countertype: false,
    oneLiner: "经典三号。要被看见成功。名声、头衔、比较是氧气。",
    portrait:
      "社交三号是虚荣最外露的形式：声望。他们知道群体看什么，就把自己做成那个。奖项、头衔、社交货币、正确的圈子。纳兰霍说三号活在「好像」里——社交三号把「好像很成功」做成公开事实。竞争是社交性的：谁更亮。他们可以极有魅力、极能读场，也可以在无人喝彩时迅速瘪掉。自我是一份不断更新的新闻稿。",
    markers: [
      "对名声、比较和公开认可高度敏感",
      "会随受众调整人格，像换一套衣服",
      "没有观众的成就几乎不算成就",
    ],
    lookalikes: ["2so", "7so", "8so"],
    naranjoKey: "Prestigio of the social Three",
  },
  {
    id: "3sx",
    type: 3,
    instinct: "sx",
    name: "魅力",
    nameEs: "Masculinidad / Feminidad",
    nameEn: "Charisma",
    countertype: false,
    oneLiner: "虚荣在于成为有吸引力的那一位。成功是被欲望、被选中。",
    portrait:
      "性三号的虚荣是性别魅力本身：男性气概／女性气质。他们把自己做成「能被要」的形象——不是社交奖杯，是化学吸引力。事业可以有，但更核心的是在那个人眼前发光。纳兰霍指出其表演性深入身体：姿态、性感、胜利者的气味。失败是变得不可欲。他们可能看起来像八号或二号，驱动仍是形象——「我是那个男人／那个女人」。",
    markers: [
      "在意自己是否有性与魅力上的竞争力",
      "成就常被用来增加吸引力，而非单纯地位",
      "被看扁、被当成无能比被道德批评更伤",
    ],
    lookalikes: ["8sx", "2sx", "7sx"],
    naranjoKey: "Masculinidad/Feminidad of the sexual Three",
  },
  {
    id: "4sp",
    type: 4,
    instinct: "sp",
    name: "坚忍",
    nameEs: "Tenacidad",
    nameEn: "Tenacity",
    countertype: true,
    oneLiner: "反型。嫉妒变成「我比你们更能熬」。苦往下咽，不表演忧郁。",
    portrait:
      "自我保存四号是纳兰霍的「坚忍」，常被误认。他们不把痛苦摊开，而是咬牙证明：我缺得更多，所以我更有资格活。嫉妒内收成耐力竞赛——别人轻松得到的，我用长期的自找苦吃来超过。外表可以像乐天、像八号、像能扛事的人。内里仍是「我没有别人有的那块」，只是拒绝乞求。反型因此常被测成八或九。纳兰霍强调其主动的受苦：不是发生了不幸，是选择扛。",
    markers: [
      "把吃苦、节俭、硬撑当成优越",
      "很少当众哀伤，哀伤被做成沉默的耐力",
      "对「被可怜」反感，对「别人更容易」耿耿于怀",
    ],
    lookalikes: ["8sp", "6sp", "1sp"],
    naranjoKey: "Tenacidad / stoic endurance of the self-preservation Four",
  },
  {
    id: "4so",
    type: 4,
    instinct: "so",
    name: "羞耻",
    nameEs: "Vergüenza",
    nameEn: "Shame",
    countertype: false,
    oneLiner: "经典四号。在群体里是局外人。羞耻、忧郁、被看见的残缺。",
    portrait:
      "社交四号的关键词是羞耻。嫉妒在社会场域比较：别人自然属于，我总差一截。他们把残缺做成身份——艺术家、流浪者、无法融入的人。纳兰霍描述其受难的展示：不是单纯作秀，是真的生活在「我不够好」里，又需要这个不够好来区别于庸众。既渴求被群体承认，又轻视群体的标准。社交生活像一场持续的放逐。",
    markers: [
      "在团体中容易感到格格不入或被看穿",
      "情绪深、表达多愁，身份与「受伤」绑在一起",
      "既想被理解，又怕一被理解就变得普通",
    ],
    lookalikes: ["6so", "9so", "5so"],
    naranjoKey: "Vergüenza of the social Four",
  },
  {
    id: "4sx",
    type: 4,
    instinct: "sx",
    name: "竞争",
    nameEs: "Competitividad",
    nameEn: "Competition",
    countertype: false,
    oneLiner: "愤怒的四号。嫉妒变成「我要超过你，否则我就恨」。",
    portrait:
      "性四号是竞争，有时被称作恨。对象是那一个重要的他者：你有的我必须更好。他们激情、尖锐、容易把关系变成戏剧与较量。纳兰霍强调其攻击性——这是最像八号的四号，但燃料仍是匮乏：如果我不能成为你眼中最特别的，我就摧毁或离开。羡慕是热的，不是忧郁的凉。特殊感通过征服和被征服来证明。",
    markers: [
      "亲密关系里强烈比较、较劲、不能忍受被放第二",
      "情绪来得快而烈，恨与爱可以迅速互换",
      "对平淡无法忍受，需要张力来感觉自己还活着",
    ],
    lookalikes: ["8sx", "2sx", "6sx"],
    naranjoKey: "Competitividad / hate of the sexual Four",
  },
  {
    id: "5sp",
    type: 5,
    instinct: "sp",
    name: "城堡",
    nameEs: "Castillo",
    nameEn: "Castle",
    countertype: false,
    oneLiner: "经典五号。把自己关进堡垒。需求降到最低，外界是消耗。",
    portrait:
      "自我保存五号是城堡。贪婪表现为把生命收缩到可控制的小空间：房间、时间表、信息、金钱、体力。纳兰霍说五号怕被吸干，自我保存五号把这句话字面化——少参与、少依赖、少被看见。他们可以极度节俭，也可以在自己的领域里非常富足，只是不流通。独处不是爱好，是代谢方式。被突然的社交或情感要求会感到侵犯。",
    markers: [
      "强烈需要可撤退的私人领地与不被打扰的时间",
      "对体力、金钱、人情往来精打细算",
      "参与之前先观察，给出去的每一点都像失血",
    ],
    lookalikes: ["9sp", "6sp", "4sp"],
    naranjoKey: "Castillo of the self-preservation Five",
  },
  {
    id: "5so",
    type: 5,
    instinct: "so",
    name: "图腾",
    nameEs: "Tótem",
    nameEn: "Totem",
    countertype: false,
    oneLiner: "用专门知识在群体里占一个图腾位。分享是有限度的展示。",
    portrait:
      "社交五号是图腾。贪婪变成「我掌握系统」。他们以专家、理论、秘密地图在社会中立足，参与通过观念而非体温。可以教书、写、评论、成为小圈子的智囊——但给予的是蒸馏过的内容，不是自己。纳兰霍指出其社会性是象征性的：我属于这个知识共同体，不等于我属于你们这些人。被要求闲聊或表态会退回头脑。",
    markers: [
      "以专业、体系或「我知道」作为社会身份",
      "可以在群体中发言，却很难进行无目的的交心",
      "被当成普通人而非智识角色时会撤离",
    ],
    lookalikes: ["3so", "1so", "6so"],
    naranjoKey: "Tótem of the social Five",
  },
  {
    id: "5sx",
    type: 5,
    instinct: "sx",
    name: "信赖",
    nameEs: "Confianza",
    nameEn: "Confidence",
    countertype: true,
    oneLiner: "反型。把堡垒的钥匙交给一个人。浪漫、秘密、高强度的心灵同盟。",
    portrait:
      "性五号是信赖，纳兰霍的反型五号。他们仍吝啬于世界，却渴望与一个灵魂彻底交换。关系是秘密通道：理想化、精神化、有时色情化的深度。一旦信任建立，五号的冷可以变成热烈的告白与共享幻想。危险是把一个人做成全部的出口，也把背叛做成世界的崩塌。看起来比其他五号更像四号或浪漫者，驱动仍是「我不能把内在洒给众人」。",
    markers: [
      "对「那一个懂我的人」有近乎绝对的投注",
      "多数人面前封闭，少数人面前可以非常浓",
      "被辜负后会长期封死通道，比发怒更彻底",
    ],
    lookalikes: ["4sx", "9sx", "6sx"],
    naranjoKey: "Confianza of the sexual Five",
  },
  {
    id: "6sp",
    type: 6,
    instinct: "sp",
    name: "温暖",
    nameEs: "Calor",
    nameEn: "Warmth",
    countertype: true,
    oneLiner: "反型。用亲切、联盟和被喜爱来换安全。看起来不像怕，像热络。",
    portrait:
      "自我保存六号是温暖。恐惧寻求的是庇护：家庭、可靠的人、可预测的照顾。他们发展出亲和、幽默、忠诚，让别人愿意把他们放进安全圈。纳兰霍称其为反型，因为焦虑被社交温暖盖住——你看见的是好相处，不是扫描。内里仍在确认：这人会不会丢下我，这地方会不会垮。对抗权威的方式常常是依附另一个权威或团体。",
    markers: [
      "用好脾气、热心和联盟换取被保护",
      "对「靠得住的人」极度在意，分离会触发慌",
      "害怕被当成麻烦，所以先让自己好相处",
    ],
    lookalikes: ["2sp", "9sp", "7sp"],
    naranjoKey: "Calor of the self-preservation Six",
  },
  {
    id: "6so",
    type: 6,
    instinct: "so",
    name: "职责",
    nameEs: "Deber",
    nameEn: "Duty",
    countertype: false,
    oneLiner: "经典六号。好士兵、好公民。安全来自规则、意识形态与尽职。",
    portrait:
      "社交六号是职责。恐惧被安放在系统里：法律、党派、公司、理想、师门。他们问「正确的立场是什么」，然后把自己做成可靠的一员。纳兰霍指出其对权威的矛盾——需要权威来定位，又怀疑权威会出卖。忠诚是美德也是锁。焦虑在群体中表现为警惕谁是叛徒、谁破坏规矩。他们可以非常有原则，原则却常是借来的骨架。",
    markers: [
      "用义务、立场和程序来压住不确定",
      "对不忠、两面和「自己人」的破裂非常敏感",
      "可以勇敢执行集体任务，私下仍充满万一",
    ],
    lookalikes: ["1so", "3so", "8so"],
    naranjoKey: "Deber of the social Six",
  },
  {
    id: "6sx",
    type: 6,
    instinct: "sx",
    name: "强壮",
    nameEs: "Fuerza / Intimidación",
    nameEn: "Strength",
    countertype: false,
    oneLiner: "反恐惧的六号。先把自己武装成不好惹，怕被吓所以去吓。",
    portrait:
      "性六号是强壮与威吓。恐惧翻成对抗：我要看起来危险、坚定、有魅力到无法被欺负。纳兰霍描述其反恐惧运动——冲向威胁，选择强的伴侣或强的姿态。外表常被打成八号：尖锐、叛逆、审美上的锋利。内里仍是「如果我不先占领强度，强度就会来占领我」。忠诚一旦给出就很绝对，怀疑一旦升起也绝。",
    markers: [
      "用力量、美或攻击性来预防被控制",
      "对威胁过度警觉，宁可先发制人",
      "亲密中需要一个能扛事的同盟，也考验对方是否够强",
    ],
    lookalikes: ["8sx", "4sx", "1sx"],
    naranjoKey: "Fuerza of the sexual Six",
  },
  {
    id: "7sp",
    type: 7,
    instinct: "sp",
    name: "守家人",
    nameEs: "Conservadores",
    nameEn: "Keepers",
    countertype: true,
    oneLiner: "反型。贪食变成网络、机会与实际好处。看起来像能人，不像玩童。",
    portrait:
      "自我保存七号是守家人。贪食落地为积累：人脉、项目、享受的基础设施、家庭式的好生活。他们务实、会谈、会找捷径，像经销商或大家长——保证自己和亲近的人有得选、有得吃、有退路。纳兰霍的反型在于：不像飘在幻想里的七号，而像精明的享乐工程师。痛苦仍被绕开，只是绕开的工具是交易与安排，不是飞机票。",
    markers: [
      "热衷于把机会、关系和资源织成安全网",
      "享乐很具体：吃、旅行、舒服、有用的朋友",
      "不喜欢沉重对话，会迅速把问题「解决掉」或换题",
    ],
    lookalikes: ["3sp", "8sp", "2sp"],
    naranjoKey: "Familia / keepers of the self-preservation Seven",
  },
  {
    id: "7so",
    type: 7,
    instinct: "so",
    name: "牺牲",
    nameEs: "Sacrificio",
    nameEn: "Sacrifice",
    countertype: false,
    oneLiner: "为群体推迟享乐的七号。理想、愿景、我先为大家。",
    portrait:
      "社交七号是牺牲。贪食披上理想主义：我可以不要眼前的甜，去服务于一个更大的计划、团体或人类。纳兰霍指出这仍是七号——牺牲是另一种计划，痛苦被升华成意义，限制被说成自愿。他们是热情的倡议者、未来的推销员，群体里的开心果兼战略家。一旦理想破灭，贪食会反弹成玩世或不甘。看起来像二号或一号，驱动是逃避平凡的痛。",
    markers: [
      "用理想和「为了大家」组织自己的自由",
      "对沉闷的义务不耐烦，除非它通向更大愿景",
      "可以非常慷慨，但难忍受没有出口的痛苦",
    ],
    lookalikes: ["2so", "9so", "3so"],
    naranjoKey: "Sacrificio of the social Seven",
  },
  {
    id: "7sx",
    type: 7,
    instinct: "sx",
    name: "迷恋",
    nameEs: "Sugestionabilidad",
    nameEn: "Fascination",
    countertype: false,
    oneLiner: "经典七号。易感、着迷、要被生命勾走。经验必须发光。",
    portrait:
      "性七号是迷恋与易感。贪食对着强度本身：人、冒险、幻想、边缘体验。他们容易被点燃，也容易转向下一团火。纳兰霍强调其暗示性——世界是一场可以不断上瘾的演出。魅力十足，承诺随兴致来去。限制、重复、悲伤会被迅速镀金或逃离。这是最「七」的七号：不是算计的享乐，是被可能性拐走。",
    markers: [
      "容易对人和体验一见钟情，也容易冷却",
      "无法忍受平淡，需要刺激来维持存在感",
      "用讲述、计划和下一次来躲开正在发生的不适",
    ],
    lookalikes: ["4sx", "8sx", "3sx"],
    naranjoKey: "Sugestionabilidad of the sexual Seven",
  },
  {
    id: "8sp",
    type: 8,
    instinct: "sp",
    name: "满足",
    nameEs: "Satisfacción",
    nameEn: "Satisfaction",
    countertype: false,
    oneLiner: "最落地的八号。领地、胃口、我拿我要的。生存先于演讲。",
    portrait:
      "自我保存八号是满足。情欲表现为对生命物资的过量：食物、钱、地盘、身体的直接性。他们是生存主义者，少谈正义的抽象，多谈谁说了算、谁吃得饱。纳兰霍描写其直率与胃口——不是形象管理，是占有。保护的是自己的圈和自己的舒适。软弱被看成活该被夺。看起来像纯粹的强人，不需要观众。",
    markers: [
      "对资源、边界和「谁做主」非常现实",
      "欲望直接，不绕弯，被挡会推开障碍",
      "不耐烦心理分析，尊重能扛事的人",
    ],
    lookalikes: ["3sp", "1sp", "7sp"],
    naranjoKey: "Satisfacción of the self-preservation Eight",
  },
  {
    id: "8so",
    type: 8,
    instinct: "so",
    name: "团结",
    nameEs: "Solidaridad",
    nameEn: "Solidarity",
    countertype: true,
    oneLiner: "反型。力量用来护自己人。帮派的头，弱者的盾。",
    portrait:
      "社交八号是团结，纳兰霍的反型八号。过量的力用在群体：我的人不能被欺。他们组织、对抗不公、做保护者，因此常被看成义侠或领袖，而不像自私的霸主。反型之处是社会情感明显——忠诚、义气、为他人出头。内里仍是否认软弱：我可以软，但我的人不能因为我软而受害。权力被道德化为保护。一旦「自己人」背叛，报复同样过量。",
    markers: [
      "对不公敏感，尤其当它落在所属团体上",
      "以保护者自居，讨厌看人被踩",
      "对内讲义气，对外可以非常硬",
    ],
    lookalikes: ["2so", "6so", "1so"],
    naranjoKey: "Solidaridad of the social Eight",
  },
  {
    id: "8sx",
    type: 8,
    instinct: "sx",
    name: "占有",
    nameEs: "Posesión",
    nameEn: "Possession",
    countertype: false,
    oneLiner: "最炽的八号。要融合到占有，也要被同样强度地要。",
    portrait:
      "性八号是占有。情欲集中在那一个人：你是我的，关系必须有穿透力。纳兰霍谈到投降与占有的双面——高强度的性、冲突、忠诚与控制。他们有磁石般的存在感，也难以容忍若即若离。反叛常是为了打破虚伪的文雅，活得更真。看起来像性四或性二，燃料是过量的生命力，不是嫉妒的缺或骄傲的膨胀。软弱只在彻底被信任的人面前偶尔露出。",
    markers: [
      "亲密必须强烈，平淡等于死亡",
      "控制与献身纠缠：我占有你，我也把自己给你",
      "对虚伪和懦弱轻蔑，尊重敢顶的人",
    ],
    lookalikes: ["4sx", "2sx", "6sx"],
    naranjoKey: "Posesión of the sexual Eight",
  },
  {
    id: "9sp",
    type: 9,
    instinct: "sp",
    name: "食欲",
    nameEs: "Apetito",
    nameEn: "Appetite",
    countertype: false,
    oneLiner: "用身体舒适麻醉自己。吃、睡、收藏、惯例。大事以后再说。",
    portrait:
      "自我保存九号是食欲。怠惰通过感官满足实现：食物、被窝、电视、小物件、熟悉的路径。不是没有能力，是自我的火被调小，用舒适代替意愿。纳兰霍指出其惯性——一旦安顿，改变像暴力。怒气在，但被消化成迟缓、固执、「我不想谈这个」。他们可以很能干活，只要那活是习惯的一部分。真正的欲望被推迟到胃口被填满之后，而胃口没有之后。",
    markers: [
      "用吃、睡、重复性舒适推迟自我的要求",
      "冲突来时先麻木或溜走，事后才闷",
      "环境被打乱会比理想被打乱更烦",
    ],
    lookalikes: ["5sp", "6sp", "7sp"],
    naranjoKey: "Apetito of the self-preservation Nine",
  },
  {
    id: "9so",
    type: 9,
    instinct: "so",
    name: "参与",
    nameEs: "Participación",
    nameEn: "Participation",
    countertype: true,
    oneLiner: "反型。为群体很忙。自我融化在「我们」里，看起来最不像懒。",
    portrait:
      "社交九号是参与，反型。怠惰表现为自我遗忘于集体：会议、志愿、家庭、公司文化。他们随和、合群、能协调，常被看成三号或六号——因为手脚并不闲。纳兰霍强调：忙的是归属，不是自己的生命计划。意见跟着场走，怒气变成对破坏和谐者的迟来不满。真正的「我想要」很难从「大家要」里捞出来。停下来面对自己时，空会涌上来。",
    markers: [
      "日程可以被团体填满，独处反而无着",
      "擅长调解、配合，难做让人不悦的决定",
      "身份来自「我是其中一员」，多于来自个人轨迹",
    ],
    lookalikes: ["3so", "6so", "2so"],
    naranjoKey: "Participación of the social Nine",
  },
  {
    id: "9sx",
    type: 9,
    instinct: "sx",
    name: "融合",
    nameEs: "Fusión",
    nameEn: "Fusion",
    countertype: false,
    oneLiner: "在那个人里睡着。理想化结合，自己的边界变薄。",
    portrait:
      "性九号是融合。怠惰通过与他者合并实现：我的欲就是你的欲，我的日程就是我们的。他们浪漫、柔软、容易理想化伴侣或精神性的「一」。纳兰霍描写其梦质——现实的棱角被爱的雾盖住。分离会像自我被撕开。怒很少直接，变成被动、退缩或突然的硬墙。看起来像二号或四号，驱动不是骄傲或嫉妒，而是不愿单独成为一个有意志的人。",
    markers: [
      "在亲密中失去自己的偏好与时间",
      "理想化结合，现实摩擦会被最小化或突然爆发",
      "一个人时难以发动，两个人时才能感觉完整",
    ],
    lookalikes: ["2sx", "4sx", "5sx"],
    naranjoKey: "Fusión of the sexual Nine",
  },
];

export const SUBTYPE_MAP: Record<SubtypeId, Subtype> = Object.fromEntries(
  SUBTYPES.map((s) => [s.id, s]),
) as Record<SubtypeId, Subtype>;

export const TYPE_MAP = Object.fromEntries(TYPES.map((t) => [t.id, t])) as Record<
  TypeId,
  (typeof TYPES)[number]
>;

export function subtypeLabel(id: SubtypeId): string {
  const s = SUBTYPE_MAP[id];
  const inst = INSTINCTS.find((i) => i.id === s.instinct)!;
  return `${inst.name}${numberZh(s.type)}号 · ${s.name}`;
}

export function shortCode(id: SubtypeId): string {
  const s = SUBTYPE_MAP[id];
  return `${s.instinct.toUpperCase()}${s.type}`;
}

export function numberZh(n: number): string {
  return ["", "一", "二", "三", "四", "五", "六", "七", "八", "九"][n] ?? String(n);
}

export const CENTER_LABEL: Record<"gut" | "heart" | "head", string> = {
  gut: "身体中心",
  heart: "情感中心",
  head: "头脑中心",
};
