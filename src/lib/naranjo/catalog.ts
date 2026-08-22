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
    brief:
      "指向个体生存、身体维系、领地保卫、资源积累与日常稳定。注意焦点集中于“能否维持下去”，也就是如何确保自身在物质、身体与环境层面的存续与安全。能量倾向于向内收束，强调保护、积累与稳态。",
  },
  {
    id: "so",
    name: "社交",
    nameEs: "Social",
    brief:
      "指向个体在群体结构中的位置、归属、适应与声誉。注意焦点集中于“我在结构里是谁”——即如何在群体中确立身份、获得认可或维持关系网络。能量倾向于向外铺展，涉及层级、角色与集体适应。",
  },
  {
    id: "sx",
    name: "性",
    nameEs: "Sexual",
    brief:
      "指向一对一关系中的强度、吸引、选择与传递。注意焦点具有单一性与排他性：集中于某一个体、某一事物或某一对象。它追求的是强度与融合，而不是群体归属或单纯生存保障，对象范围一般超越狭义的情爱，可延伸至任何能引发强烈联结或传递的领域。",
  },
];

export const TYPES: {
  id: TypeId;
  passion: string;
  passionEs: string;
  fixation: string;
  fixationEs: string;
  virtue: string;
  virtueEs: string;
  trap: string;
  trapEs: string;
  center: "gut" | "heart" | "head";
  name: string;
  brief: string;
  neurosis: string;
}[] = [
  {
    id: 1,
    passion: "愤怒",
    passionEs: "Ira",
    fixation: "怨恨",
    fixationEs: "Resentimiento",
    virtue: "安详",
    virtueEs: "Serenity",
    trap: "完美",
    trapEs: "Perfection",
    center: "gut",
    name: "怨恨",
    brief:
      "情欲为愤怒：对不完美现实的持续抗议与纠正冲动。他们的怒气极少以直接爆发的形式出现，而是固着为长期的怨恨与“这件事应该如何”的强迫性判断。无论是世界还是自我，一般都被视作没有达到应有的状态。",
    neurosis:
      "一号的神经症核心是情欲「愤怒」（Ira），固着为「怨恨」（Resentimiento）。伊查佐最初以「怨恨」描述其自我观。主体无法容忍存在的缺陷，将怒转化为道德正确、批评与自我强制。怒被体验为不正当而遭压抑，于是沉淀为长期不满、身体紧张、对他人与自身的苛责。\n\n美德是「安详」（Serenity）：允许世界与自己不必被持续纠正。这并非「追求卓越」，而是无法停止对不完美的抗议。",
  },
  {
    id: 2,
    passion: "骄傲",
    passionEs: "Orgullo",
    fixation: "谄媚",
    fixationEs: "Adulación",
    virtue: "谦卑",
    virtueEs: "Humility",
    trap: "自由",
    trapEs: "Freedom",
    center: "heart",
    name: "谄媚",
    brief:
      "情欲为骄傲：否认自身真实需要，同时将自我膨胀为“被爱、被需要、享有特权的人”。其本质并非助人倾向，而是以给予或者“讨好”维持被放大的自我形象，回避自身的匮乏。",
    neurosis:
      "二号的神经症核心是骄傲（orgullo），固着是谄媚（lisonja）。骄傲意味着不承认匮乏：我没有需要，我是那个给予、被选中或应被优待的人。需要一旦出现，便以操控情感、责备、撒娇或特权要求的方式索取，并继续否认「我在要」。纳兰霍将其写入歇斯底里性格：情感表演、诱惑、自恋受伤。流行九型的「助人者」是误读——给予、可爱、野心都是骄傲的策略，不是利他。美德是谦卑：看见自己的需要而不膨胀。",
  },
  {
    id: 3,
    passion: "虚荣",
    passionEs: "Vanidad",
    fixation: "虚荣／欺骗",
    fixationEs: "Mentira",
    virtue: "诚实",
    virtueEs: "Honesty",
    trap: "效率",
    trapEs: "Efficiency",
    center: "heart",
    name: "虚荣",
    brief:
      "情欲为虚荣：以形象、成果与表演代替真实的心灵存在。自我欺骗机制使内在感受从属于外在认可与效率，自我价值被等同于“看起来如何”而非“实际如何”。",
    neurosis:
      "三号的神经症核心是虚荣（vanidad），并与自我欺骗相连。主体认同被看见的自我，用做事、效率与成功维持自体感。感受、失败、无观众的存在被当作无价值而切断。神经症状态是自我异化：不知道自己是谁，只知道自己「看起来是谁」。停工、出丑、不被认可会触发羞耻与空洞，而非单纯挫折。美德是诚实：停止为形象而活。",
  },
  {
    id: 4,
    passion: "嫉妒",
    passionEs: "Envidia",
    fixation: "忧郁",
    fixationEs: "Melancolía",
    virtue: "平静",
    virtueEs: "Equanimity",
    trap: "真实",
    trapEs: "Authenticity",
    center: "heart",
    name: "忧郁",
    brief:
      "情欲为嫉妒：认定他人拥有自己所缺乏的本质、爱或位置。通过持续的匮乏感与“特殊”身份的建构来维持自体感，失落与比较是他们自我确认的主要途径。",
    neurosis:
      "四号的神经症核心是嫉妒（envidia），固着是忧郁。嫉妒不是偶尔羡慕，而是结构性的匮乏感：好的东西在别人那里，自己被放逐在缺失里。主体用痛苦、比较、被弃感来证明自己的深度，从而把不满变成身份。神经症状态包括自我贬低与自我特殊化的交替、对平淡的不耐受、以及把关系变成「谁更被爱」的较量。美德是平静：不再靠缺失来存在。",
  },
  {
    id: 5,
    passion: "贪婪",
    passionEs: "Avaricia",
    fixation: "吝啬",
    fixationEs: "Retención",
    virtue: "超脱",
    virtueEs: "Detachment",
    trap: "观察",
    trapEs: "Observer",
    center: "head",
    name: "吝啬",
    brief:
      "情欲为贪婪：吝啬的对象并非物质，而是自身——时间、精力、情感与参与。因恐惧被耗尽或被入侵，而退回观察与保留的姿态，能量被主动地严格围护。",
    neurosis:
      "五号的神经症核心是贪婪（avaricia），固着是吝啬。纳兰霍强调：贪婪在此不是贪得无厌地占有，而是扣留。主体把自我当作有限库存，参与、依赖、情感支出被体验为流失。神经症状态是退缩、情感隔离、用认知替代接触，以及在关系中的计时与记账。与分裂样防卫相关。美德是超脱：不再因害怕被吸干而拒绝生命。",
  },
  {
    id: 6,
    passion: "恐惧",
    passionEs: "Miedo",
    fixation: "怯懦／指控",
    fixationEs: "Cobardía／Acusación",
    virtue: "勇气",
    virtueEs: "Courage",
    trap: "安全",
    trapEs: "Security",
    center: "head",
    name: "怯懦",
    brief:
      "情欲为恐惧：他们将世界持续扫描为潜在威胁。固着在怯懦退缩与指控攻击之间摆动，有时候，权威被他们依赖以获取安全，有时候又被怀疑为不可信。",
    neurosis:
      "六号的神经症核心是恐惧（miedo），固着在怯懦与指控之间。主体不能安于不确定，必须预见危险、寻找靠山或反过来攻击威胁。投射使敌意落在外界：权威会出卖，同伴会背叛，自己会出错。神经症状态是怀疑、过度准备、忠诚与反抗的矛盾、以及把焦虑当作现实感。恐惧症与反恐惧症是同一情欲的两种姿态。美德是勇气：在没有保证时行动。",
  },
  {
    id: 7,
    passion: "贪食",
    passionEs: "Gula",
    fixation: "计划",
    fixationEs: "Planificación",
    virtue: "节制",
    virtueEs: "Sobriety",
    trap: "理想",
    trapEs: "Idealism",
    center: "head",
    name: "计划",
    brief:
      "情欲为贪食：对经验、可能性与未来的永不满足。通过不断规划、合理化与追求新选项来逃避限制、痛苦与当下的空虚，快乐被置于“还有更多”的延宕之中。",
    neurosis:
      "七号的神经症核心是贪食（gula），固着是计划。贪食是对刺激、选项与「还有更好」的病理性饥渴。痛苦、限制、重复被体验为不可忍受，于是被合理化、升华或换成下一个计划。神经症状态是浅表化、承诺不稳、对悲伤的过敏、以及把逃避说成自由与理想。未来侵占现在。美德是节制：留下，承受限度。",
  },
  {
    id: 8,
    passion: "情欲／过量",
    passionEs: "Lujuria",
    fixation: "报复",
    fixationEs: "Venganza",
    virtue: "天真",
    virtueEs: "Innocence",
    trap: "正义",
    trapEs: "Justice",
    center: "gut",
    name: "报复",
    brief:
      "情欲为过量（lujuria）：对强度、生命力与掌控的渴求。他们否认软弱与脆弱，将痛苦转化为扩张与对抗；固着为报复性的力量姿态，拒绝被限制或被侵犯。",
    neurosis:
      "八号的神经症核心是情欲（lujuria），即过量：更多控制、更多刺激、更多占有、对挫折的零容忍。固着是报复。软弱、依赖、被控被体验为将被吞噬，于是先发制人。神经症状态包括攻击性、犬儒、对限度的爆破、以及把正义等同于力量。纳兰霍将其与施虐性格相连。美德是天真：不必靠过量来感觉活着。",
  },
  {
    id: 9,
    passion: "怠惰",
    passionEs: "Pereza",
    fixation: "懒散／自我遗忘",
    fixationEs: "Indolencia",
    virtue: "行动",
    virtueEs: "Action",
    trap: "寻求",
    trapEs: "Seeker",
    center: "gut",
    name: "懒散",
    brief:
      "情欲为怠惰：被麻醉的是内在生活、真实意愿与自我主张，而非外在手脚是否忙碌。自我被合并于环境、习惯或他人之中，而真正的欲望被持续推迟甚至消解。",
    neurosis:
      "九号的神经症核心是怠惰（pereza），固着是懒散：不是躯体懒惰，而是对自身存在的忽视。主体用舒适、习惯、他人的议程或「我们」来替代自己的欲望与怒。怒被消化为迟缓、固执和回避冲突。神经症状态是自我遗忘、决策麻痹、对改变的被动抵抗，以及事后才感到的怨。美德是行动：从麻醉中起来，成为有意志的人。",
  },
];

export type Subtype = {
  id: SubtypeId;
  type: TypeId;
  instinct: Instinct;
  name: string;
  nameEs: string;
  nameEn: string;
  aka?: string;
  countertype: boolean;
  oneLiner: string;
  portrait: string;
  childhood?: string;
  neurosis: string;
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
    oneLiner: "愤怒内转为对身体、秩序、健康、资源与潜在损失的慢性焦虑。反型：看起来不像怒，像担心。",
    portrait:
      "纳兰霍将自我保存一号命名为「担忧」（preocupación），并明确标示其为反型。在此亚型中，愤怒极少外泄，而是内转为对身体、秩序、健康、资源与潜在损失的慢性焦虑与过度控制。不完美被体验为将直接危及具体存续。他们的批评首先指向自身，其次指向环境。旁人所见多为谨慎、烦躁与强迫性检查，而非直接的「事情不该如此」。",
    childhood:
      "自我保存一号常在早期家庭环境中扮演「最负责任的人」角色。家庭氛围往往存在混乱、不可预测或高要求因素，使年幼的主体感到自身存续受到威胁。愤怒作为对这种过早负担的原始反应，因被视为危险（既威胁外部关系，也威胁内部控制）而被压抑。结果是，儿童将批评与纠正内化，形成持续的自我监视与对「出错即损失」的预警机制。放松与自发性被体验为对安全的潜在威胁。",
    neurosis:
      "在自我保存领域，被压抑的怒进一步转化为焦虑与躯体化表现：持续紧张、失眠式警戒、对出错的反复预演。洁癖、节制、自我苛责与程序控制成为维持「我是正确的」的屏障，以免怒气直接浮现。放松被体验为危险。怨恨同时指向马虎的他人与不够完美的自己。\n\n纳兰霍指出：此亚型的担忧已成为真正的情欲。它不仅表现为「过度担心」，更表现为对已经完好之事的持续干预，有时因试图「修复」本不需修复之物而反而造成损害。其动机是夸张的预见与控制需要，根植于对生存或保存受威胁的恐惧。自我形象被体验为「过于不完美」，因此活动转化为对自身的持续、强迫性改进。愤怒则被善意与服务态度所掩盖，转化为「好意愿」。",
    markers: [
      "愤怒主要表现为担心、烦躁与挑剔，而非爆发。",
      "身体、金钱、家务、程序与安全必须处于「正确」状态。",
      "自我强制与对环境的控制，替代了直接的怒气表达。",
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
    aka: "优越（Superioridad）",
    countertype: false,
    oneLiner: "愤怒指向公共秩序。僵硬、不随俗，以原则自居；又称优越。",
    portrait:
      "纳兰霍将社交一号命名为「不适应」（inadaptabilidad），并长期亦以「僵硬」（rigidez）描述之，指向一种类似「学校教师心态」或赖希（Wilhelm Reich）所谓「贵族性格」的姿态。愤怒在此指向公共秩序与集体中的不公、马虎与虚伪。主体以原则自居，拒绝为归属而妥协。其核心并非无能，而是不肯弯曲：要求被承认为正确，而非被喜欢。怨恨源于「我已做对，你们仍不改」。",
    childhood:
      "根据纳兰霍原著及相关观察，社交一号常在早期即拒绝被当作「孩子」对待，倾向于与成人为伍而非同龄玩伴，并采取反内投态度。家庭氛围往往使主体感到父母所能提供的不足，于是过早宣称自主、承担责任，或以「小大人」姿态避免制造麻烦。原则与正确性成为区别自身、维持优越感的早期策略，归属与随俗则被体验为潜在的堕落。",
    neurosis:
      "在社交领域，神经症状态表现为道德化的攻击与社会性怨恨：好为人师、弹劾、无法忍受潜规则。对群体的适应本身被体验为堕落。怒以改革、谴责、孤立的方式维持优越的正确，常伴随对他人缺陷的持续记账。\n\n纳兰霍强调：社交一号已自感完美（不同于自我保存一号的慢性不完美意识），因此其「我正确、你错误」的激情赋予其支配情境的权利。僵硬在此是真正的神经症需要，而非单纯行为风格。",
    markers: [
      "在群体中坚持程序与公正，难以随俗。",
      "对虚伪、捷径与「大家都这样」高度过敏。",
      "改革与谴责先于归属，僵硬被体验为对原则的忠诚。",
      "愤怒多以冷静、疏离或贵族式优越呈现，而非直接爆发；「以不动声色掩盖怒火」。",
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
    oneLiner: "愤怒有了一对一的焦点。热忱与嫉妒：要把认定的那一个人、事或物改造成正确。",
    portrait:
      "性一号是热忱（zelo）与嫉妒（celos）。怒集中于理想化的单一对象：可以是人，也可以是一项事业、一件作品。主体以激情改革这个焦点，不能容忍分心、不忠、不认真。正确成为投入的条件。妒不是单纯情爱占有，而是「热忱被给错了地方」。外表比其他一号更强、更有热度，也更控制。",
    neurosis:
      "神经症状态是对选定对象的道德化控制、妒与义愤的融合、以及「为你好／为它好」的攻击。对象的独立或转向被体验为堕落。一对一关系——无论对人还是对事——充满纠正、理想化与贬低的循环。怒有了出口，但出口是改造这个焦点，不是承认自己的怒。",
    markers: [
      "完美标准加诸一对一的单一对象（人、事或物），难以放过",
      "热情、妒意与道德义愤同时出现",
      "比其他一号更有火气，改革指向这个被选定的焦点",
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
    oneLiner: "反型。骄傲表现为特权：我应被优待、被供养。不是奉献者。",
    portrait:
      "自我保存二号是「特权」（privilegio），纳兰霍明确的反型。骄傲不表现为博爱，而表现为幼儿式权利要求：我特殊，规则应对我宽松；我可爱，你应来照顾。需要以撒娇、示弱、占据资源的方式被满足，同时否认「我在要」。看起来像被宠坏或任性，而不像给予者。给予若发生，也投资于能供养自己的人。",
    neurosis:
      "神经症状态是自恋性特权、被忽略时的委屈与暴怒、以及对依赖的否认。主体不把自己体验为有需要的成人，而体验为应被优先满足的孩子。愤怒在得不到优待时出现，并迅速被重新包装成「你不爱我」。与流行的二号助人形象相反。",
    markers: [
      "以可爱、可怜或特殊换取照顾与例外",
      "对谁应满足自己敏感；被忽略即自恋受伤",
      "被供养、被选中先于任何「为他人」的自我形象",
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
    oneLiner: "骄傲表现为社会野心。以被需要换取显要，谄媚是向上扩张。",
    portrait:
      "社交二号的专名是「野心」（ambición）。骄傲在群体中膨胀为影响力：成为不可缺少的人。组织、引荐、情感劳动使他人依赖自己，从而居于其上。纳兰霍指出谄媚不是卑微，是策略性自我扩张。核心恐惧是无足轻重。这不是助人性格，而是以「被需要」为货币的社会自恋。",
    neurosis:
      "神经症状态是对地位的饥渴、对边缘化的不能忍受、以及把关系工具化为晋升。给予带有账单。接近重要人物、控制信息与人情，维持「没有我就不转」。被晾在一边触发的是骄傲崩溃，不是单纯寂寞。表面的热心覆盖着对无足轻重的恐惧。",
    markers: [
      "在组织里占据显要的连接或情感枢纽",
      "对地位、人脉和「谁重要」高度定向",
      "被边缘化比被道德批评更难忍",
    ],
    lookalikes: ["3so", "8so", "7so"],
    naranjoKey: "Ambición of the social Two",
  },
  {
    id: "2sx",
    type: 2,
    instinct: "sx",
    name: "诱惑",
    nameEs: "Seducción",
    nameEn: "Seduction",
    countertype: false,
    oneLiner: "骄傲表现为一对一的征服：成为某个单一对象所不可缺的。诱惑是攻击，不限于情爱。",
    portrait:
      "性二号的专名是「诱惑」（seducción）。纳兰霍强调侵略性：诱惑是打猎。骄傲体现在「我能让这个焦点离不开我」——对象可以是一个人，也可以是我要拿下的那件事。主体读取其匮乏并填入自己，给予高度专属并带有所有权。热度下降时，骄傲以责备与纠缠受伤。不是温柔助人，而是一对一的占领。",
    neurosis:
      "神经症状态是对单一对象的操控、不能忍受不被选中、以及付出后的隐性债务。被当成可替换的、普通的，会刺伤骄傲并转为追讨。需要被否认，索取通过成为不可缺来完成。占有与「我为你／它做了这么多」同属骄傲，对象不限于情人。",
    markers: [
      "一对一里强烈，旨在成为某个单一对象的答案",
      "需要被这个焦点选中；可替代即骄傲受伤",
      "给予带有独占与事后追讨，不限于情爱",
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
    oneLiner: "反型。虚荣对象化到工作与供养。不炫耀，但必须是能撑住的人。",
    portrait:
      "自我保存三号是「安全」（seguridad），反型。虚荣不靠舞台，而靠资产、职位、家庭被安排得像样。高效、可靠、形象整洁但不夸张。成功的证据是「我能养活、我有保障」。失败是存在性羞辱。看起来务实甚至谦逊，因为虚荣已等同于工作本身。存在被换成产出。",
    neurosis:
      "神经症状态是工作强迫、休息时的恐慌、以及把自我价值等同于供养能力。停下来即面对没有形象的空洞。感受被推迟到「做成以后」，而做成没有以后。羞耻围绕无能、破产、看起来撑不住，而非道德过错。",
    markers: [
      "以工作量、收入和可靠性证明自己",
      "不空谈名声，但必须「看起来能干」",
      "停工触发恐慌；休息被体验为堕落",
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
    oneLiner: "虚荣的经典形式：要被看见成功。名声与比较维持自我。",
    portrait:
      "社交三号是「声望」（prestigio）。主体识别群体的成功标准并把自我做成该标准。头衔、奖项、圈子、可见度。纳兰霍指出三号活在「好像」（como si）中；社交三号把「好像成功」做成公开事实。竞争是社会性的。无观众时自我迅速瘪缩。",
    neurosis:
      "神经症状态是自我的不断改妆、对比较的成瘾、以及无人喝彩时的崩溃。人格随受众切换。失败、落后、被看穿「只是表演」会触发羞耻与攻击性防御。诚实的感受被当作对事业的威胁而剔除。",
    markers: [
      "对名声、比较和公开认可高度敏感",
      "随场域调整自我呈现",
      "没有观众的成就几乎不计入自体",
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
    oneLiner: "虚荣落在一对一的磁性：成为被选定的那个。失败是失去吸引力，不限于情爱。",
    portrait:
      "性三号的虚荣是男性气概／女性气质（masculinidad/feminidad），即一对一场域里的磁性与被选中。形象的核心是「在这个单一焦点面前我是否发光」，不限于性关系，也可以是唯一的观众、对手或事业对象。纳兰霍指出表演深入身体：姿态、魅力、胜利者的呈现。被看扁、被当成无能或不可欲，比道德指责更伤。",
    neurosis:
      "神经症状态是把自体等同于是否在一对一中被选中、是否有竞争力。失败、被无视会体验为存在取消。魅力是被管理的。看起来可像八号或二号，驱动仍是虚荣：我是那个能被要的人——要的可以是爱、目光或那个位置。",
    markers: [
      "在意一对一的吸引力与被选中，不限于情爱",
      "成就用于增加磁性，多于单纯群体地位",
      "被当成无能或不可欲，比被道德批评更伤",
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
    oneLiner: "反型。嫉妒转为「我比你们更能熬」。不表演忧郁，主动承担苦。",
    portrait:
      "自我保存四号是「坚忍」（tenacidad），反型，常被误判。痛苦不外露，而转化为耐力竞赛：别人轻易得到的，我用长期自找苦吃来超过。外表可像乐天、像八号。内里仍是「我没有别人有的那块」，只是拒绝乞求。纳兰霍强调主动的受苦：不是遭逢不幸，是选择扛。",
    neurosis:
      "神经症状态是受虐性的自我剥夺、对「被可怜」的憎恶、以及把吃苦做成优越。嫉妒不说「我没有」，而说「我更能忍」。抑郁被躯体化或纪律化。常被测成八、一、六。哀伤被禁止公开，却组织着整个生活水准。",
    markers: [
      "把吃苦、节俭、硬撑当作优越",
      "很少当众哀伤；哀伤转为沉默的耐力",
      "反感被可怜；对「别人更容易」积怨",
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
    oneLiner: "嫉妒在社会场域成为羞耻：局外人、残缺被看见，也因此特殊。",
    portrait:
      "社交四号是「羞耻」（vergüenza）。嫉妒的比较在群体中进行：别人自然属于，我总差一截。残缺被做成身份。纳兰霍描述受难的展示：并非单纯作秀，是生活在「我不够好」之中，又需要这不够好来区别于庸众。渴求被承认，又轻视群体标准。",
    neurosis:
      "神经症状态是羞耻、自我放逐、情绪的公开化与对平凡的蔑视。被理解的渴望与「一被理解就普通」的恐惧互相加强。抑郁、被弃感、社会比较是日常。身份依赖受伤，痊愈反而威胁特殊性。",
    markers: [
      "在团体中感到格格不入或被看穿",
      "身份与残缺、受伤绑在一起",
      "既要被理解，又怕理解取消其特殊",
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
    oneLiner: "嫉妒转为恨与竞争：在单一焦点上你有的我必须更好，否则摧毁或离开。",
    portrait:
      "性四号是竞争（competitividad），亦称恨。对象是一对一的重要焦点：可以是人，也可以是位置、作品、被认定的那件事。你拥有的，我必须胜过。纳兰霍强调攻击性——最像八号的四号，燃料却是匮乏。不能占据这个焦点上的第一，就攻击或切断。羡慕是热的。特殊感通过征服与被征服证明，不限于情爱。",
    neurosis:
      "神经症状态是一对一中的较量、爱恨速转、对第二位的不能忍受。平淡被体验为取消。把这个单一关系或事业变成戏剧以确认自己还存在。摧毁所爱所迷（若不能独占其优越位置）是嫉妒的主动形式，不是八号的过量。",
    markers: [
      "一对一中强烈比较，不能被放第二",
      "投入与攻击迅速互换，对象是单一的人、事或物",
      "需要张力来维持自体感；平淡不可忍",
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
    oneLiner: "贪婪表现为收缩生命：少参与、少依赖、少被看见。外界是消耗。",
    portrait:
      "自我保存五号是「城堡」（castillo）。贪婪落实为把生命减到可控制的单元：空间、时间、金钱、体力、信息。纳兰霍所说「怕被吸干」在此具体化。可以节俭到贫乏，也可以在私域富足但不流通。独处是代谢，不是爱好。突然的情感或社交要求被体验为侵入。",
    neurosis:
      "神经症状态是退缩、需求最小化、对人情的记账、以及被接触时的被剥夺感。身体与情绪被当作会漏的容器。孤立维持自给的幻想，同时加深贫乏。给予每一点都伴随悔意与计算。",
    markers: [
      "需要可撤退的私域与不被打扰的时间",
      "对体力、金钱、人情精打细算",
      "参与之前先观察；支出被体验为流失",
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
    oneLiner: "贪婪表现为以专门知识占社会位置。给内容，不给自己。",
    portrait:
      "社交五号是「图腾」（tótem）。吝啬转为「我掌握系统」。以专家、理论、地图在群体中立足，参与通过观念而非情感接触。给予的是蒸馏过的知识。纳兰霍指出其社会性是象征的：属于知识共同体，不等于属于这些人。闲聊与表态使其退回头脑。",
    neurosis:
      "神经症状态是用智识角色替代人的在场、对无目的交心的不能忍受、以及被当成普通人时的撤离。掌握成为防耗尽的甲胄。可以发言、教学、评论，同时保持情感不流通。优越感与贫乏感并存。",
    markers: [
      "以专业或「我知道」作为社会身份",
      "可分享整理过的内容，不交出私生活",
      "失去智识角色即失去在场理由",
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
    oneLiner: "反型。对众人吝啬，把钥匙交给一条一对一的通道：一个人、一件隐秘的事或一个物。",
    portrait:
      "性五号是「信赖」（confianza），反型。仍吝啬于世界，却寻求与一个单一焦点彻底交换——可以是一个人，也可以是秘密的工作、研究或私藏。关系被理想化、精神化，有时高度投注。信任一旦成立，冷可转为高强度交付。被辜负或通道断裂则长期封闭。驱动仍是：内在不能洒给众人。",
    neurosis:
      "神经症状态是把一条一对一通道做成唯一出口、理想化与突然的彻底切断。对众人贫乏，对这一个过密。通道破裂等于世界崩塌。仍是贪婪：扣留对所有人，一次性透支给一个焦点，不限于情人。",
    markers: [
      "对「那一个通道」近乎绝对投注：人、事或物",
      "对众人封闭，对单一焦点可以过密",
      "通道被辜负后封死，比发作更彻底",
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
    countertype: false,
    oneLiner: "恐惧寻求庇护：用亲和与联盟换安全。焦虑被温暖盖住。",
    portrait:
      "自我保存六号是「温暖」（calor）。恐惧求的是庇护——可靠的人、可预测的照顾、家庭式圈子。发展出亲和、幽默、忠诚，使自己被纳入安全圈。焦虑被温暖盖住。内里仍在确认：这人会不会丢下我。对权威的反抗常表现为改投另一个权威。这不是反型：怕仍以依附和讨好的姿态出现，而不是翻转到攻击。",
    neurosis:
      "神经症状态是讨好式依附、分离焦虑、以及把好相处当作生存策略。怕成为麻烦，故先消除自己的威胁性。敌意被否认，转向对「靠得住」的反复测试。表面热络，实为恐惧的结盟。",
    markers: [
      "以好脾气和联盟换取被保护",
      "对可靠对象极度在意，分离触发恐慌",
      "害怕成为麻烦，故先让自己不具威胁",
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
    oneLiner: "恐惧安放在系统里：规则、意识形态、尽职。忠诚与怀疑并存。",
    portrait:
      "社交六号是「职责」（deber）。恐惧被交给法律、组织、理想、师门。主体问正确立场是什么，然后成为可靠的一员。纳兰霍指出对权威的矛盾：需要它定位，又怀疑它出卖。忠诚是锁。焦虑表现为警惕叛徒与破坏规矩者。原则常是借来的骨架。",
    neurosis:
      "神经症状态是义务强迫、告发与站队、对不忠的过敏、以及把不确定交给程序。可以勇敢执行集体任务，私下仍充满灾难预演。指控（别人是威胁）与怯懦（自己不能没有系统）轮流执政。",
    markers: [
      "用义务、立场和程序压住不确定",
      "对两面、不忠和自己人破裂过敏",
      "集体任务中可表现勇敢，私下仍是「万一」",
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
    countertype: true,
    oneLiner: "反型。恐惧翻转为反恐惧：先武装、先威吓，以免被占。看起来不像怕。",
    portrait:
      "性六号是强壮与威吓（fuerza / intimidación），纳兰霍标为六号的反型。恐惧变成对抗：使自己危险、坚定、无法被欺。反恐惧运动——冲向威胁，选择强的对象或姿态。外表常被判为八号。内里是：若不先占领强度，强度就会来占领我。忠诚与怀疑都绝对。反型在于怕以攻击性出现，而不以怯懦或讨好出现。",
    neurosis:
      "神经症状态是先发制人、对威胁的过度读取、以及用攻击性覆盖怕。在一对一的同盟或对手关系里考验对方是否够强。美、锋利、叛逆可作为武装。被控、被吓是核心恐惧。反型使其看起来不像「胆小的六号」，情欲仍是恐惧。",
    markers: [
      "以力量、锋利或攻击性预防被控制",
      "威胁出现时倾向迎上，而非停留在怕中",
      "一对一中需要能扛事的同盟或对手，并考验其强度",
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
    countertype: false,
    oneLiner: "贪食落实为机会、网络与具体好处。务实，像享乐的安排者。",
    portrait:
      "自我保存七号是「守家人／机会网络」（conservadores）。贪食落地为积累：人脉、项目、享受的基础设施、有退路的好生活。务实、会谈、找捷径。不像幻想型七号，而像享乐的安排者。痛苦仍被绕开，工具是交易与安排，不是下一场兴奋本身。这不是反型：贪食仍指向具体的甜与退路。",
    neurosis:
      "神经症状态是把沉重情感迅速问题化、解决掉或换题，以及对限制的不能忍受。享乐很具体，同时承担着麻醉功能。承诺跟随机会。焦虑被活动与计划盖住。看起来像三号或八号，驱动仍是避开痛。",
    markers: [
      "把机会、关系和资源织成可调用的网",
      "享乐具体：吃、走、舒服、有用的联系与退路",
      "沉重话题被迅速变成安排或被切换",
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
    countertype: true,
    oneLiner: "反型。贪食披上理想：为更大计划推迟眼前的甜。看起来不像享乐，像牺牲。",
    portrait:
      "社交七号是「牺牲」（sacrificio），纳兰霍标为七号的反型。贪食采取理想主义形式：可以放弃眼前享乐，服务于更大计划、团体或人类。这仍是七号——牺牲是另一种计划，痛苦被升华为意义，限制被说成自愿。理想破灭则反弹为玩世或不甘。反型在于表面像尽责、奉献或理想主义，不像贪食的享乐者。驱动是逃避平凡的痛，不是一号的原则或二号的骄傲。",
    neurosis:
      "神经症状态是以愿景逃避沉闷与悲伤、把不自由说成高尚、以及对无出口痛苦的不能忍受。慷慨与倡议维持「我是自由而有意义的」。一旦理想塌陷，贪食失去掩护。反型使其看起来可像二号、一号或九号，情欲仍是贪食。",
    markers: [
      "用理想和「为了大家」组织自己的活动",
      "沉闷的义务只有通向更大愿景才可忍",
      "难留在没有出口、不能被讲成意义的痛苦里",
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
    oneLiner: "贪食对着一对一的强度：易感、着迷，要被下一个单一焦点勾走。",
    portrait:
      "性七号是迷恋与易感（sugestionabilidad）。贪食指向连续的单一强刺激：人、事、物、冒险、幻想。易被点燃，也易转向。纳兰霍强调暗示性：世界是可上瘾的刺激序列。限制、重复、悲伤被迅速镀金或逃离。不是精于算计的享乐，是被可能性拐走。不限于情爱。",
    neurosis:
      "神经症状态是对正在发生的不适的立即逃离、承诺随兴致作废、以及用讲述和下一次覆盖现在。平淡被体验为死。不能停在一个一对一的对象里把痛喝完——无论那是人、项目还是体验。",
    markers: [
      "对人与体验迅速着迷，也迅速冷却",
      "不能忍受平淡，需要刺激维持存在感",
      "用计划、讲述和下一次躲开当前不适",
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
    oneLiner: "情欲表现为对物资与控制的过量：地盘、胃口、谁说了算。",
    portrait:
      "自我保存八号是「满足」（satisfacción）。lujuria 指向生命物资的过量：食物、钱、领地、身体的直接性。少谈抽象正义，多谈谁做主、谁吃得饱。直率与占有，不是形象管理。软弱被看成活该被夺。不需要观众。",
    neurosis:
      "神经症状态是对挫折的零容忍、以力量解决边界问题、以及把依赖体验为可被掠夺。过量（吃、花钱、压人）维持「我活着而且没被控」。对心理化不耐烦。报复具体而迅速。",
    markers: [
      "对资源、边界和主导权非常现实",
      "欲望直接；被挡则推开障碍",
      "尊重能扛事者；否认软弱，不绕弯",
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
    oneLiner: "反型。过量的力用于护场：自己人不能被欺。权力被说成保护。",
    portrait:
      "社交八号是「团结」（solidaridad），反型。力用在群体：我的人不能被欺。组织、对抗不公，常被看成义侠。反型在于社会情感明显。内里仍是否认软弱：我可以受伤，但我的人不能因我弱而受害。自己人背叛，报复同样过量。",
    neurosis:
      "神经症状态是把攻击道德化为保护、对背叛的过量报复、以及不能承认自己的怕。保护者位置维持强大自体。不公若落在「自己人」以外，动员力下降——正义从属于领地。看起来像六号或二号，燃料是情欲而非恐惧或骄傲。",
    markers: [
      "不公落在所属团体上才最能动员",
      "以保护者自居；看人被踩不可忍",
      "对内讲义气，对外硬；背叛则过量反击",
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
    oneLiner: "情欲集中于一对一的单一对象：占有与投降。平淡等于没有发生。不限于情爱。",
    portrait:
      "性八号是「占有」（posesión）。过量指向选定的单一焦点：可以是一个人，也可以是一件必须拿下的事或物。关系或投入必须有穿透力。纳兰霍谈投降与占有并存——高强度、冲突、忠诚与控制。不能容忍若即若离。反叛常为打破虚伪文雅。燃料是过量的生命力，不是四号的缺或二号的骄傲。",
    neurosis:
      "神经症状态是控制与融合的交织、对暧昧的爆破、以及对软弱的蔑视。占有这个焦点，也要求被同样强度地要。若即若离被体验为羞辱。犬儒与烈度维持「这是真的」。对象不限于情人。",
    markers: [
      "一对一必须强烈；平淡被判为未发生",
      "占有与献身纠缠：要这个焦点，也把自己交出去",
      "轻蔑虚伪与懦弱；尊重敢顶回来的强度",
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
    oneLiner: "怠惰通过感官舒适实现：吃、睡、惯例。意愿被推迟。",
    portrait:
      "自我保存九号是「食欲」（apetito）。怠惰经口欲与惯性完成：食物、睡眠、重复路径、熟悉环境。不是无能，是自我的意志被调低，用舒适代替欲望。纳兰霍指出惯性——安顿之后，改变被体验为暴力。怒消化为迟缓、固执、「不想谈」。可干活，若那活属于习惯。",
    neurosis:
      "神经症状态是用填饱与重复推迟自我面对、冲突时的麻木或溜走、以及对环境被打乱的烦躁超过对理想破裂的反应。胃口没有「之后」。重要的事先麻醉。事后闷气，当时不在场。",
    markers: [
      "以吃、睡、重复性舒适推迟自身要求",
      "冲突来时先麻木或溜走，怒很晚才出现",
      "环境惯性被打乱，比原则被打乱更受扰",
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
    oneLiner: "反型。怠惰表现为自我遗忘于集体。忙的是归属，不是自己的意志。",
    portrait:
      "社交九号是「参与」（participación），反型。怠惰是自我消融于会议、家庭、组织、志愿。随和、能协调，常被看成三号或六号，因为手脚不闲。纳兰霍强调：忙的是「我们」，不是个人生命计划。意见随场，怒变成对破坏和谐者的迟来不满。「我想要」难以从「大家要」中分离。",
    neurosis:
      "神经症状态是日程被集体填满、独处时的空洞、以及不能做令人不悦却属于自己的决定。身份来自成员资格。停下来面对自己时，空与怒一齐上来。看起来最不像怠惰，结构上是最彻底的自我遗忘。",
    markers: [
      "日程可被团体填满；独处反而无着",
      "长于配合、调解，难作让人不悦的决定",
      "「我是其中一员」先于「我要去哪」",
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
    oneLiner: "怠惰通过与单一对象合并实现。理想化结合，自己的意志变薄。对象可以是人、事或物。",
    portrait:
      "性九号是「融合」（fusión）。怠惰经合并完成：我的欲即这个焦点的欲。对象可以是人，也可以是一条路、一种信念、一件事。理想化合一。现实摩擦被最小化，或突然变成硬墙。分离像自我被撕开。怒很少直接。看起来像二号或四号，驱动不是骄傲或嫉妒，而是不愿单独成为有意志的人。",
    neurosis:
      "神经症状态是边界消失、没有这个一对一对象时不能发动、以及把结合理想化到否认冲突。被动攻击与突然切断是被推迟的怒。需要这个人、事或物来感觉完整，同时怨恨自己的消失。融合是麻醉，不是八号的占有或二号的诱惑。",
    markers: [
      "在一对一中失去自身偏好与时间",
      "理想化结合；摩擦被抹平或突然变成墙",
      "单独难以发动；与这个焦点在一起才感觉完整",
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

export type CenterId = "heart" | "head" | "gut";

export const CENTERS: CenterId[] = ["heart", "head", "gut"];

export const CENTER_TYPES: Record<CenterId, readonly TypeId[]> = {
  heart: [2, 3, 4],
  head: [5, 6, 7],
  gut: [8, 9, 1],
};

export const CENTER_LABEL: Record<CenterId, string> = {
  heart: "心区",
  head: "脑区",
  gut: "腹区",
};

export const CENTER_FULL: Record<CenterId, string> = {
  heart: "形象 / 被看见的位置",
  head: "不确定 / 预先解释",
  gut: "意志 / 身体边界",
};

export const CENTER_PASSION: Record<CenterId, string> = {
  heart: "羞耻与形象",
  head: "恐惧与预期",
  gut: "愤怒与意志",
};

export function centerOf(type: TypeId): CenterId {
  return TYPE_MAP[type].center;
}

/** Result token, e.g. sp3 */
export function triadToken(id: SubtypeId): string {
  const s = SUBTYPE_MAP[id];
  return `${s.instinct}${s.type}`;
}

export function shortCode(id: SubtypeId): string {
  return triadToken(id);
}

export function numberZh(n: number): string {
  return ["", "一", "二", "三", "四", "五", "六", "七", "八", "九"][n] ?? String(n);
}
