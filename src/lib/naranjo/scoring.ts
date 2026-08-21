import {
  CENTER_FULL,
  CENTER_LABEL,
  CENTER_TYPES,
  CENTERS,
  INSTINCTS,
  SUBTYPES,
  SUBTYPE_MAP,
  TYPE_MAP,
  TYPES,
  centerOf,
  triadToken,
  type CenterId,
  type Instinct,
  type SubtypeId,
  type TypeId,
} from "./catalog";
import {
  QUESTION_MAP,
  STAGE2,
  STEP1 as STEP1_QUESTIONS,
  VALIDITY,
  interleaveQuestions,
  pickStep1Questions,
  type Question,
} from "./questions";
import {
  compareNudge,
  describeOutcome,
  shownCompareQuestions,
  type CompareOutcome,
  type CompareQuestion,
} from "./compare";

export type Answers = Record<string, number>;

export const LIKERT_MAX = 4;

export type TypeScore = {
  type: TypeId;
  raw: number;
  max: number;
  pct: number;
};

export type InstinctScore = {
  instinct: Instinct;
  raw: number;
  max: number;
  pct: number;
};

export type SubtypeScore = {
  id: SubtypeId;
  raw: number;
  max: number;
  pct: number;
  typePct: number;
  specPct: number;
  instinctPct: number;
};

export type Evidence = {
  id: string;
  text: string;
  value: number;
  contribution: number;
  slot?: SubtypeId;
};

export type IntensityBand = "low" | "moderate" | "high" | "very-high";
export type Verification = "clear" | "lean" | "contested";

export const INTENSITY_LABEL: Record<IntensityBand, string> = {
  "very-high": "极强",
  high: "强",
  moderate: "中",
  low: "弱",
};

export const VERIFY_LABEL: Record<Verification, string> = {
  clear: "通过",
  lean: "倾向",
  contested: "待核",
};

export type CenterScore = {
  center: CenterId;
  dedicatedPct: number;
  typeMean: number;
  typeMax: number;
  pct: number;
  rank: 1 | 2 | 3;
};

export type TriadSlot = {
  order: 1 | 2 | 3;
  center: CenterId;
  type: TypeId;
  subtype: SubtypeId;
  instinct: Instinct;
  typePct: number;
  specPct: number;
  instinctPct: number;
  intensity: number;
  intensityBand: IntensityBand;
  typeGap: number;
  subtypeGap: number;
  verification: Verification;
  verificationNote: string;
  runnerUpType: TypeId;
  runnerUpSubtype: SubtypeId;
  evidence: Evidence[];
};

export type CalcRow = {
  label: string;
  value: string;
  note?: string;
};

export type CalcStep = {
  title: string;
  detail: string;
  rows?: CalcRow[];
};

export type Result = {
  typeScores: TypeScore[];
  instinctScores: InstinctScore[];
  subtypeScores: SubtypeScore[];
  centerScores: CenterScore[];
  triad: [TriadSlot, TriadSlot, TriadSlot];
  triadCode: string;
  primary: SubtypeId;
  secondary: SubtypeId;
  tertiary: SubtypeId;
  confidence: "high" | "medium" | "low";
  confidenceNote: string;
  stage2Types: TypeId[];
  evidence: Evidence[];
  formula: string;
  calculation: CalcStep[];
  style: ResponseStyle;
  compare?: CompareOutcome[];
  answered: number;
  totalShown: number;
};

export type StyleFlag =
  | "random"
  | "exaggeration"
  | "defense"
  | "inconsistency"
  | "yea-saying"
  | "midpoint";

export const FLAG_LABEL: Record<StyleFlag, string> = {
  random: "随机",
  exaggeration: "夸大",
  defense: "防御",
  inconsistency: "冲突",
  "yea-saying": "一律同意",
  midpoint: "中立回避",
};

export type ResponseStyle = {
  extremePct: number;
  midpointPct: number;
  infreq: number;
  defense: number;
  exaggeration: number;
  inconsistency: number;
  flags: StyleFlag[];
  notes: string[];
  typeScale: Record<TypeId, number>;
  globalScale: number;
  conflicts: { label: string; cut: number }[];
};

export const STEP1: Question[] = STEP1_QUESTIONS;

function signedValue(q: Question, raw: number): number {
  const v = Math.max(0, Math.min(LIKERT_MAX, raw));
  return q.reverse ? LIKERT_MAX - v : v;
}

const ANTITHESIS: Array<[TypeId, TypeId, string]> = [
  [8, 9, "过量与怠惰同时极高"],
  [4, 7, "沉在匮乏与逃入选项同时极高"],
  [2, 5, "靠被需要与收回自己同时极高"],
  [8, 5, "向前顶与缩回领地同时极高"],
];

const OVERLAP: Array<[TypeId, TypeId, string]> = [
  [2, 3, "骄傲与虚荣重叠：都被「被看见」拉高"],
  [1, 6, "怨恨与恐惧重叠：都被「必须盯住」拉高"],
  [5, 9, "吝啬与怠惰重叠：都像不参与"],
  [1, 8, "愤怒的两种出口重叠"],
  [3, 8, "用力做成与过量重叠"],
];

export function analyzeStyle(
  answers: Answers,
  questions: Question[] = STEP1,
): ResponseStyle {
  const content = questions.filter((q) => q.kind !== "validity" && answers[q.id] !== undefined);
  const n = content.length || 1;
  let extreme = 0;
  let mid = 0;
  let highRaw = 0;
  for (const q of content) {
    const v = answers[q.id];
    if (v === 0 || v === 4) extreme += 1;
    if (v === 2) mid += 1;
    if (!q.reverse && v >= 3) highRaw += 1;
    if (q.reverse && v <= 1) highRaw += 1;
  }
  const extremePct = (extreme / n) * 100;
  const midpointPct = (mid / n) * 100;
  const yea = highRaw / n;

  const infreq = meanKey(answers, "valid-infreq");
  const defense = meanKey(answers, "valid-defense");
  const exaggeration = meanKey(answers, "valid-exagg");

  const typeScale = {} as Record<TypeId, number>;
  const pairDis: number[] = [];
  const conflicts: { label: string; cut: number }[] = [];
  for (const t of TYPES) {
    typeScale[t.id] = 1;
    const items = questions.filter((q) => q.type === t.id && answers[q.id] !== undefined);
    const fwd = items.filter((q) => !q.reverse);
    const rev = items.filter((q) => q.reverse);
    if (!fwd.length || !rev.length) continue;
    const fwdM = avg(fwd.map((q) => answers[q.id]));
    const revRaw = avg(rev.map((q) => answers[q.id]));
    const signedFwd = avg(fwd.map((q) => signedValue(q, answers[q.id])));
    const signedRev = avg(rev.map((q) => signedValue(q, answers[q.id])));
    const disagree = Math.abs(signedFwd - signedRev) / LIKERT_MAX;
    pairDis.push(disagree);
    if (fwdM >= 2.7 && revRaw >= 2.7) {
      typeScale[t.id] *= 0.52;
      conflicts.push({
        label: `${t.id}号正向与反向同时高（结构冲突）`,
        cut: 0.52,
      });
    } else if (disagree >= 0.55) {
      typeScale[t.id] *= 0.72;
      conflicts.push({
        label: `${t.id}号内部不一致`,
        cut: 0.72,
      });
    }
    if (fwdM <= 0.8 && revRaw <= 0.8) {
      typeScale[t.id] *= 0.88;
    }
  }
  const inconsistency = pairDis.length ? avg(pairDis) : 0;

  const flags: StyleFlag[] = [];
  const notes: string[] = [];
  let globalScale = 1;

  if (infreq >= 2.5 || inconsistency >= 0.58) {
    flags.push("random");
    globalScale *= 0.72;
    notes.push("作答像随机或破坏：罕见题被点高，或正反向严重打架。相关题已降权。");
  }
  if (exaggeration >= 2.5 || (extremePct >= 72 && yea >= 0.72)) {
    flags.push("exaggeration");
    globalScale *= 0.8;
    notes.push("夸大或全选极端。已压低整体区分度里的「全都像我」。");
  }
  if (defense >= 3 || midpointPct >= 48) {
    flags.push("defense");
    if (midpointPct >= 48) flags.push("midpoint");
    globalScale *= 0.9;
    notes.push("防御或自我美化倾向：动机「完全清楚」，或过多停在中立。");
  }
  if (yea >= 0.78 && extremePct >= 50) {
    flags.push("yea-saying");
    globalScale *= 0.78;
    notes.push("几乎所有句子都往「像我」靠，行为/想法堆叠，不像单一结构。");
  }
  if (inconsistency >= 0.4 && !flags.includes("random")) {
    flags.push("inconsistency");
    notes.push("部分情欲的正反向打架，这些型号的权重已下调。");
  }

  return {
    extremePct,
    midpointPct,
    infreq,
    defense,
    exaggeration,
    inconsistency,
    flags: [...new Set(flags)],
    notes,
    typeScale,
    globalScale,
    conflicts,
  };
}

function meanKey(answers: Answers, key: string): number {
  const qs = VALIDITY.filter((q) => q.loads.some((l) => l.key === key));
  const vs = qs.map((q) => answers[q.id]).filter((v) => v !== undefined);
  return vs.length ? avg(vs) : 0;
}

function avg(xs: number[]): number {
  if (!xs.length) return 0;
  return xs.reduce((a, b) => a + b, 0) / xs.length;
}

export function accumulate(
  answers: Answers,
  questions: Question[],
  style?: ResponseStyle,
): Map<string, { raw: number; max: number }> {
  const map = new Map<string, { raw: number; max: number }>();
  const add = (key: string, raw: number, max: number) => {
    const cur = map.get(key) ?? { raw: 0, max: 0 };
    cur.raw += raw;
    cur.max += max;
    map.set(key, cur);
  };
  const g = style?.globalScale ?? 1;
  for (const q of questions) {
    if (answers[q.id] === undefined) continue;
    if (q.kind === "validity") continue;
    const v = signedValue(q, answers[q.id]);
    const typeW = q.type && style ? style.typeScale[q.type] ?? 1 : 1;
    const itemW = g * typeW;
    for (const load of q.loads) {
      const w = Math.abs(load.weight) * itemW;
      add(load.key, v * w, LIKERT_MAX * w);
    }
  }
  return map;
}

function applyTypeConflicts(
  pcts: Record<TypeId, number>,
  style: ResponseStyle,
): Record<TypeId, number> {
  const next = { ...pcts };
  for (const [a, b, label] of ANTITHESIS) {
    if (next[a] >= 66 && next[b] >= 66) {
      next[a] *= 0.7;
      next[b] *= 0.7;
      style.conflicts.push({ label, cut: 0.7 });
    }
  }
  for (const [a, b, label] of OVERLAP) {
    if (next[a] >= 62 && next[b] >= 62) {
      const lo = next[a] <= next[b] ? a : b;
      const hi = lo === a ? b : a;
      next[lo] *= 0.82;
      next[hi] *= 0.94;
      style.conflicts.push({ label, cut: 0.82 });
    }
  }
  return next;
}

function ipsatize(pcts: Record<TypeId, number>): Record<TypeId, number> {
  const vals = TYPES.map((t) => pcts[t.id]);
  const mean = avg(vals);
  const out = {} as Record<TypeId, number>;
  for (const t of TYPES) {
    const mixed = pcts[t.id] * 0.38 + (50 + (pcts[t.id] - mean)) * 0.62;
    out[t.id] = Math.max(0, Math.min(100, mixed));
  }
  return out;
}

export function pctOf(raw: number, max: number): number {
  if (max <= 0) return 0;
  return (raw / max) * 100;
}

function bandOf(n: number): IntensityBand {
  if (n >= 72) return "very-high";
  if (n >= 58) return "high";
  if (n >= 42) return "moderate";
  return "low";
}

function typePcts(acc: Map<string, { raw: number; max: number }>): Record<TypeId, number> {
  const out = {} as Record<TypeId, number>;
  for (const t of TYPES) {
    const row = acc.get(`t${t.id}`) ?? { raw: 0, max: 1 };
    out[t.id] = pctOf(row.raw, row.max);
  }
  return out;
}

function rankedTypesInCenter(
  pcts: Record<TypeId, number>,
  center: CenterId,
): TypeId[] {
  return [...CENTER_TYPES[center]].sort((a, b) => pcts[b] - pcts[a]);
}

export function pickStage2Types(answers: Answers, seed = 1): TypeId[] {
  const step1 = pickStep1Questions(seed);
  const style = analyzeStyle(answers, step1);
  const acc = accumulate(answers, step1, style);
  const pcts = ipsatize(applyTypeConflicts(typePcts(acc), style));
  const picked: TypeId[] = [];
  for (const center of CENTERS) {
    const ranked = rankedTypesInCenter(pcts, center);
    picked.push(ranked[0]);
    if (ranked[1] && pcts[ranked[0]] - pcts[ranked[1]] <= 6) {
      picked.push(ranked[1]);
    }
  }
  return picked;
}

export function stage2QuestionsFor(types: TypeId[], seed = 1): Question[] {
  const set = new Set(types);
  return interleaveQuestions(
    STAGE2.filter((q) => q.type && set.has(q.type)),
    seed + 91,
  );
}

function verifyOf(typeGap: number, subtypeGap: number, intensity: number): {
  verification: Verification;
  note: string;
} {
  if (typeGap >= 8 && subtypeGap >= 6 && intensity >= 50) {
    return {
      verification: "clear",
      note: "该区情欲与副型都拉开，强度足够，可作为该中心的工作假设。",
    };
  }
  if (typeGap >= 4 || subtypeGap >= 4) {
    return {
      verification: "lean",
      note: "有主导倾向，但第二候选仍近。请对照两份原典肖像，尤其留意反型。",
    };
  }
  return {
    verification: "contested",
    note: "该区两型接近，或副型未拉开。结果只作索引，需用自我观察裁定。",
  };
}

function clampPct(n: number): number {
  return Math.max(0, Math.min(100, n));
}

function recomputeSubtypeBlend(
  subtypeScores: SubtypeScore[],
  typePctMap: Record<TypeId, number>,
  stage2Types: TypeId[],
) {
  for (const row of subtypeScores) {
    const typePct = typePctMap[SUBTYPE_MAP[row.id].type] ?? 0;
    row.typePct = typePct;
    const tested = stage2Types.includes(SUBTYPE_MAP[row.id].type);
    row.pct = tested
      ? typePct * 0.5 + row.specPct * 0.35 + row.instinctPct * 0.15
      : typePct * 0.72 + row.instinctPct * 0.28;
  }
}

function nudgeKey(
  typePctMap: Record<TypeId, number>,
  subtypeScores: SubtypeScore[],
  pole: CompareQuestion["left"],
  factor: number,
) {
  if (pole.type) {
    typePctMap[pole.type] = clampPct(typePctMap[pole.type] * factor);
  }
  if (pole.subtype) {
    const row = subtypeScores.find((s) => s.id === pole.subtype);
    if (row) row.pct = clampPct(row.pct * factor);
    const t = SUBTYPE_MAP[pole.subtype].type;
    typePctMap[t] = clampPct(typePctMap[t] * (1 + (factor - 1) * 0.45));
  }
}

function applyCompare(
  typePctMap: Record<TypeId, number>,
  subtypeScores: SubtypeScore[],
  answers: Answers,
  items: CompareQuestion[],
  style: ResponseStyle,
  stage2Types: TypeId[],
): CompareOutcome[] {
  const typeItems = items.filter((q) => !q.left.subtype && !q.right.subtype);
  const subItems = items.filter((q) => q.left.subtype || q.right.subtype);
  const outcomes: CompareOutcome[] = [];
  let bothCount = 0;
  let neitherCount = 0;

  const run = (list: CompareQuestion[], afterTypes: boolean) => {
    for (const q of list) {
      const raw = answers[q.id];
      const out = describeOutcome(q, raw);
      if (out) outcomes.push(out);
      if (raw === undefined) continue;
      const nudge = compareNudge(raw);
      if (nudge.kind === "both") {
        bothCount += 1;
        const lt = q.left.subtype ? SUBTYPE_MAP[q.left.subtype].type : q.left.type;
        const rt = q.right.subtype ? SUBTYPE_MAP[q.right.subtype].type : q.right.type;
        if (lt && rt) {
          const mean = ((typePctMap[lt] ?? 0) + (typePctMap[rt] ?? 0)) / 2;
          typePctMap[lt] = clampPct((typePctMap[lt] ?? 0) * 0.72 + mean * 0.28);
          typePctMap[rt] = clampPct((typePctMap[rt] ?? 0) * 0.72 + mean * 0.28);
        }
        style.conflicts.push({
          label: `对照「两个都像」：${out?.leftLabel ?? ""} / ${out?.rightLabel ?? ""}`,
          cut: 1,
        });
        continue;
      }
      if (nudge.kind === "neither") {
        neitherCount += 1;
        nudgeKey(typePctMap, subtypeScores, q.left, 0.86);
        nudgeKey(typePctMap, subtypeScores, q.right, 0.86);
        style.conflicts.push({
          label: `对照「两个都不像」：${out?.leftLabel ?? ""} / ${out?.rightLabel ?? ""}`,
          cut: 0.86,
        });
        continue;
      }
      if (nudge.toward === 0) continue;
      const win = nudge.toward < 0 ? q.left : q.right;
      const lose = nudge.toward < 0 ? q.right : q.left;
      const boost = 1 + nudge.mag * (afterTypes ? 0.24 : 0.2);
      const cut = 1 - nudge.mag * (afterTypes ? 0.18 : 0.16);
      nudgeKey(typePctMap, subtypeScores, win, boost);
      nudgeKey(typePctMap, subtypeScores, lose, cut);
    }
  };

  run(typeItems, false);
  recomputeSubtypeBlend(subtypeScores, typePctMap, stage2Types);
  run(subItems, true);

  if (bothCount >= 2) {
    style.notes.push("第三步多次「两个都像」：易混结构未拉开，重叠已写入核验。");
  }
  if (neitherCount >= 2) {
    style.notes.push("第三步多次「两个都不像」：当前候选可能都不是该区结构，把握下调。");
    style.globalScale *= 0.92;
  }

  subtypeScores.sort((a, b) => b.pct - a.pct);
  return outcomes;
}

export function score(
  answers: Answers,
  stage2Types: TypeId[],
  stage3Ids: string[] = [],
  seed = 1,
): Result {
  const stage2Qs = stage2QuestionsFor(stage2Types, seed);
  const shown = [...pickStep1Questions(seed), ...stage2Qs];
  const style = analyzeStyle(answers, shown);
  const acc = accumulate(answers, shown, style);

  const rawTypePct = typePcts(acc);
  const typePctMap = ipsatize(applyTypeConflicts(rawTypePct, style));

  const typeScores: TypeScore[] = TYPES.map((t) => {
    const row = acc.get(`t${t.id}`) ?? { raw: 0, max: 1 };
    return { type: t.id, raw: row.raw, max: row.max, pct: typePctMap[t.id] };
  }).sort((a, b) => b.pct - a.pct);

  const instinctScores: InstinctScore[] = INSTINCTS.map((i) => {
    const row = acc.get(i.id) ?? { raw: 0, max: 1 };
    return {
      instinct: i.id,
      raw: row.raw,
      max: row.max,
      pct: pctOf(row.raw, row.max),
    };
  }).sort((a, b) => b.pct - a.pct);

  const instPctMap = Object.fromEntries(
    instinctScores.map((i) => [i.instinct, i.pct]),
  ) as Record<Instinct, number>;

  const subtypeScores: SubtypeScore[] = SUBTYPES.map((s) => {
    const spec = acc.get(s.id) ?? { raw: 0, max: 0 };
    const specPct = spec.max > 0 ? pctOf(spec.raw, spec.max) : 0;
    const typePct = typePctMap[s.type] ?? 0;
    const instinctPct = instPctMap[s.instinct] ?? 0;
    const tested = stage2Types.includes(s.type);
    const pct = tested
      ? typePct * 0.5 + specPct * 0.35 + instinctPct * 0.15
      : typePct * 0.72 + instinctPct * 0.28;
    return {
      id: s.id,
      raw: spec.raw,
      max: spec.max,
      pct,
      typePct,
      specPct,
      instinctPct,
    };
  }).sort((a, b) => b.pct - a.pct);

  const centerScoresUnranked: Omit<CenterScore, "rank">[] = CENTERS.map((center) => {
    const dedicated = acc.get(`c-${center}`) ?? { raw: 0, max: 1 };
    const dedicatedPct = pctOf(dedicated.raw, dedicated.max);
    const ids = CENTER_TYPES[center];
    const tPcts = ids.map((id) => typePctMap[id] ?? 0);
    const typeMean = tPcts.reduce((a, b) => a + b, 0) / tPcts.length;
    const typeMax = Math.max(...tPcts);
    const pct = dedicatedPct * 0.28 + typeMax * 0.45 + typeMean * 0.27;
    return { center, dedicatedPct, typeMean, typeMax, pct };
  });

  const centerScores: CenterScore[] = [...centerScoresUnranked]
    .sort((a, b) => b.pct - a.pct)
    .map((c, i) => ({ ...c, rank: (i + 1) as 1 | 2 | 3 }));

  const shownCompare = shownCompareQuestions(stage3Ids, seed);
  const compare = applyCompare(
    typePctMap,
    subtypeScores,
    answers,
    shownCompare,
    style,
    stage2Types,
  );
  compare.sort(
    (a, b) => stage3Ids.indexOf(a.id) - stage3Ids.indexOf(b.id),
  );

  for (const row of typeScores) {
    row.pct = typePctMap[row.type] ?? row.pct;
  }
  typeScores.sort((a, b) => b.pct - a.pct);

  const slots: TriadSlot[] = centerScores.map((cs, i) => {
    const rankedTypes = rankedTypesInCenter(typePctMap, cs.center);
    const type = rankedTypes[0];
    const runnerUpType = rankedTypes[1];
    const typeGap = (typePctMap[type] ?? 0) - (typePctMap[runnerUpType] ?? 0);
    const ofType = subtypeScores
      .filter((s) => SUBTYPE_MAP[s.id].type === type)
      .sort((a, b) => b.pct - a.pct);
    const best = ofType[0];
    const runner = ofType[1];
    const subtypeGap = best.pct - (runner?.pct ?? 0);
    const intensity = best.pct;
    const { verification, note } = verifyOf(typeGap, subtypeGap, intensity);
    const evidence: Evidence[] = [];
    for (const [id, value] of Object.entries(answers)) {
      const q = QUESTION_MAP[id];
      if (!q) continue;
      const signed = q.reverse ? LIKERT_MAX - value : value;
      const aligned = q.subtype === best.id || q.type === type;
      if (!aligned || signed < 3) continue;
      evidence.push({
        id,
        text: q.text,
        value,
        contribution: signed,
        slot: best.id,
      });
    }
    evidence.sort((a, b) => b.contribution - a.contribution);
    const topEvidence = evidence.slice(0, 4);
    return {
      order: (i + 1) as 1 | 2 | 3,
      center: cs.center,
      type,
      subtype: best.id,
      instinct: SUBTYPE_MAP[best.id].instinct,
      typePct: typePctMap[type] ?? 0,
      specPct: best.specPct,
      instinctPct: best.instinctPct,
      intensity,
      intensityBand: bandOf(intensity),
      typeGap,
      subtypeGap,
      verification,
      verificationNote: note,
      runnerUpType,
      runnerUpSubtype: runner?.id ?? best.id,
      evidence: topEvidence,
    };
  }) as [TriadSlot, TriadSlot, TriadSlot];

  const [a, b, c] = slots;
  const triad = [a, b, c] as [TriadSlot, TriadSlot, TriadSlot];
  const triadCode = triad.map((s) => triadToken(s.subtype)).join("-");

  const clearCount = triad.filter((s) => s.verification === "clear").length;
  const contestedCount = triad.filter((s) => s.verification === "contested").length;
  let confidence: Result["confidence"] = "medium";
  let confidenceNote =
    "三元组按中心重视排序。请用原典肖像核对每一区，尤其是反型。";
  if (style.flags.includes("random") || style.flags.includes("exaggeration")) {
    confidence = "low";
    confidenceNote =
      "作答风格提示随机、破坏或夸大，三元组仅作弱索引。请对照原典，不要当标签。";
  } else if (clearCount === 3) {
    confidence = "high";
    confidenceNote = "三个中心都拉开。仍建议阅读相邻副型，测验不能替代自我观察。";
  } else if (contestedCount >= 2 || clearCount === 0) {
    confidence = "low";
    confidenceNote = "至少两个中心接近。把结果当作阅读索引，不要当成标签。";
  }
  const neitherHits = compare.filter((o) => o.choice === "neither").length;
  if (style.flags.includes("defense") && confidence === "high") {
    confidence = "medium";
    confidenceNote = "有防御或自我美化痕迹，把握下调一档。仍建议对照原典。";
  }
  if (neitherHits >= 2 && confidence === "high") {
    confidence = "medium";
    confidenceNote = "第三步多次两个都不像，把握下调。请用原典肖像核对。";
  }

  const evidence = triad.flatMap((s) => s.evidence).slice(0, 10);

  const formula =
    "先混排测激情与固着，顺带合成心脑腹重视（0.28×中心题 + 0.45×该区最高情欲 + 0.27×三型均）。正反向打架、重叠、对峙的型号降权；极端/随机/防御作答再乘风格系数。每区取情欲最高之型，再取该型三副型最高者。副型强度 = 0.50×情欲 + 0.35×副型专名 + 0.15×本能。第三步对易混结构做强迫对照：滑向一边则加分/减分；两个都像则拉近差距；两个都不像则两边降权。";

  const calculation: CalcStep[] = [
    {
      title: "0. 作答风格",
      detail:
        "检测随机、夸大、防御、中立回避，以及同一结构正反向打架。冲突型号降权，不按表面行为加分。",
      rows: [
        {
          label: "风格标记",
          value: style.flags.length ? style.flags.join("、") : "未见明显异常",
        },
        {
          label: "极端作答％",
          value: style.extremePct.toFixed(0),
        },
        {
          label: "中立％",
          value: style.midpointPct.toFixed(0),
        },
        {
          label: "正反向不一致",
          value: style.inconsistency.toFixed(2),
        },
        {
          label: "全局权重",
          value: style.globalScale.toFixed(2),
        },
        ...style.conflicts.map((c) => ({
          label: c.label,
          value: `×${c.cut}`,
        })),
        ...style.notes.map((n, i) => ({
          label: `说明 ${i + 1}`,
          value: n,
        })),
      ],
    },
    {
      title: "1. 心脑腹重视",
      detail:
        "不单独开「腹区测验」。中心重视由混排的激情/固着 + 少量注意落点题合成，排序决定三元组前后。",
      rows: centerScores.map((cs) => ({
        label: `${cs.rank}. ${CENTER_LABEL[cs.center]}（${CENTER_FULL[cs.center]}）`,
        value: cs.pct.toFixed(1),
        note: `注意落点 ${cs.dedicatedPct.toFixed(0)} · 最高情欲 ${cs.typeMax.toFixed(0)} · 三型均 ${cs.typeMean.toFixed(0)}`,
      })),
    },
    {
      title: "2. 每区情欲",
      detail: "九种情欲先在各自中心内排名，不与其他中心的号直接争第一。",
      rows: CENTERS.flatMap((center) =>
        rankedTypesInCenter(typePctMap, center).map((type, i) => {
          const t = TYPE_MAP[type];
          return {
            label: `${CENTER_LABEL[center]} ${i === 0 ? "领先" : "次"} · ${type}号${t.passion}`,
            value: (typePctMap[type] ?? 0).toFixed(1),
          };
        }),
      ),
    },
    {
      title: "3. 每区副型",
      detail: "在该区领先情欲的三个本能变体里取最高。专名题只对进入第二步的类型计满权。",
      rows: triad.map((s) => {
        const sub = SUBTYPE_MAP[s.subtype];
        const run = SUBTYPE_MAP[s.runnerUpSubtype];
        return {
          label: `${CENTER_LABEL[s.center]} → ${triadToken(s.subtype)} ${sub.name}`,
          value: s.intensity.toFixed(1),
          note: `情欲 ${s.typePct.toFixed(0)} · 专名 ${s.specPct.toFixed(0)} · 本能 ${s.instinctPct.toFixed(0)} · 次选 ${triadToken(s.runnerUpSubtype)} ${run.name}（差 ${s.subtypeGap.toFixed(1)}）`,
        };
      }),
    },
    {
      title: "4. 强度与核验",
      detail:
        "强度即该副型加权分。核验：情欲差≥8 且副型差≥6 且强度≥50 为通过；有一项达到中等差为倾向；否则待核。",
      rows: triad.map((s) => ({
        label: `${triadToken(s.subtype)} ${CENTER_LABEL[s.center]}`,
        value: `${INTENSITY_LABEL[s.intensityBand]} / ${VERIFY_LABEL[s.verification]}`,
        note: `情欲差 ${s.typeGap.toFixed(1)} · 副型差 ${s.subtypeGap.toFixed(1)}。${s.verificationNote}`,
      })),
    },
    {
      title: "5. 本能剖面",
      detail: "三种本能的整体倾向，参与副型加权，但不单独决定类型。",
      rows: instinctScores.map((row) => ({
        label: INSTINCTS.find((i) => i.id === row.instinct)!.name,
        value: row.pct.toFixed(1),
      })),
    },
    {
      title: "6. 第三步易混对照",
      detail:
        "按当前领先/次席与原典易混副型出题。滑向一边给胜方加权、负方降权；两个都像不决胜；两个都不像两边降权。型号在作答时不显示。",
      rows: compare.length
        ? compare.map((o) => ({
            label: `${o.leftLabel} ↔ ${o.rightLabel}`,
            value: o.note,
            note: o.stem,
          }))
        : [{ label: "未作对照", value: "—" }],
    },
  ];

  return {
    typeScores,
    instinctScores,
    subtypeScores,
    centerScores,
    triad,
    triadCode,
    primary: a.subtype,
    secondary: b.subtype,
    tertiary: c.subtype,
    confidence,
    confidenceNote,
    stage2Types,
    evidence,
    formula,
    calculation,
    style,
    compare,
    answered: shown.filter((q) => answers[q.id] !== undefined).length +
      shownCompare.filter((q) => answers[q.id] !== undefined).length,
    totalShown: shown.length + shownCompare.length,
  };
}

export function unanswered(questions: Question[], answers: Answers): string[] {
  return questions.filter((q) => answers[q.id] === undefined).map((q) => q.id);
}
