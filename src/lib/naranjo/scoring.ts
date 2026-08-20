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
  STAGE1,
  STAGE2,
  STAGE_CENTER,
  type Question,
} from "./questions";

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
  answered: number;
  totalShown: number;
};

export const STEP1: Question[] = [...STAGE_CENTER, ...STAGE1];

function signedValue(q: Question, raw: number): number {
  const v = Math.max(0, Math.min(LIKERT_MAX, raw));
  return q.reverse ? LIKERT_MAX - v : v;
}

export function accumulate(
  answers: Answers,
  questions: Question[],
): Map<string, { raw: number; max: number }> {
  const map = new Map<string, { raw: number; max: number }>();
  const add = (key: string, raw: number, max: number) => {
    const cur = map.get(key) ?? { raw: 0, max: 0 };
    cur.raw += raw;
    cur.max += max;
    map.set(key, cur);
  };
  for (const q of questions) {
    if (answers[q.id] === undefined) continue;
    const v = signedValue(q, answers[q.id]);
    for (const load of q.loads) {
      const w = Math.abs(load.weight);
      add(load.key, v * w, LIKERT_MAX * w);
    }
  }
  return map;
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

export function pickStage2Types(answers: Answers): TypeId[] {
  const acc = accumulate(answers, STEP1);
  const pcts = typePcts(acc);
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

export function stage2QuestionsFor(types: TypeId[]): Question[] {
  const set = new Set(types);
  return STAGE2.filter((q) => q.type && set.has(q.type));
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

export function score(answers: Answers, stage2Types: TypeId[]): Result {
  const stage2Qs = stage2QuestionsFor(stage2Types);
  const shown = [...STEP1, ...stage2Qs];
  const acc = accumulate(answers, shown);

  const typeScores: TypeScore[] = TYPES.map((t) => {
    const row = acc.get(`t${t.id}`) ?? { raw: 0, max: 1 };
    return { type: t.id, raw: row.raw, max: row.max, pct: pctOf(row.raw, row.max) };
  }).sort((a, b) => b.pct - a.pct);

  const typePctMap = Object.fromEntries(typeScores.map((t) => [t.type, t.pct])) as Record<
    TypeId,
    number
  >;

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
    const pct = dedicatedPct * 0.5 + typeMax * 0.3 + typeMean * 0.2;
    return { center, dedicatedPct, typeMean, typeMax, pct };
  });

  const centerScores: CenterScore[] = [...centerScoresUnranked]
    .sort((a, b) => b.pct - a.pct)
    .map((c, i) => ({ ...c, rank: (i + 1) as 1 | 2 | 3 }));

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
  if (clearCount === 3) {
    confidence = "high";
    confidenceNote = "三个中心都拉开。仍建议阅读相邻副型，测验不能替代自我观察。";
  } else if (contestedCount >= 2 || clearCount === 0) {
    confidence = "low";
    confidenceNote = "至少两个中心接近。把结果当作阅读索引，不要当成标签。";
  }

  const evidence = triad.flatMap((s) => s.evidence).slice(0, 10);

  const formula =
    "中心重视 = 0.50×中心题 + 0.30×该区最高情欲 + 0.20×该区三型均值。每区取情欲最高之型，再取该型三副型最高者。副型强度 = 0.50×情欲 + 0.35×副型专名 + 0.15×本能。三元组顺序 = 中心重视降序。";

  const calculation: CalcStep[] = [
    {
      title: "1. 心脑腹重视",
      detail:
        "中心题直接问你从哪一区过日子；再与该区情欲分数合成。排序决定三元组的前后。",
      rows: centerScores.map((cs) => ({
        label: `${cs.rank}. ${CENTER_LABEL[cs.center]}（${CENTER_FULL[cs.center]}）`,
        value: cs.pct.toFixed(1),
        note: `中心题 ${cs.dedicatedPct.toFixed(0)} · 最高情欲 ${cs.typeMax.toFixed(0)} · 三型均 ${cs.typeMean.toFixed(0)}`,
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
    answered: shown.filter((q) => answers[q.id] !== undefined).length,
    totalShown: shown.length,
  };
}

export function unanswered(questions: Question[], answers: Answers): string[] {
  return questions.filter((q) => answers[q.id] === undefined).map((q) => q.id);
}
