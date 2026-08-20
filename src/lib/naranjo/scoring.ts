import {
  INSTINCTS,
  SUBTYPES,
  SUBTYPE_MAP,
  TYPES,
  type Instinct,
  type SubtypeId,
  type TypeId,
} from "./catalog";
import { QUESTION_MAP, STAGE1, STAGE2, type Question } from "./questions";

export type Answers = Record<string, number>;

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
};

export type Result = {
  typeScores: TypeScore[];
  instinctScores: InstinctScore[];
  subtypeScores: SubtypeScore[];
  primary: SubtypeId;
  secondary: SubtypeId;
  tertiary: SubtypeId;
  confidence: "high" | "medium" | "low";
  confidenceNote: string;
  stage2Types: TypeId[];
  evidence: Evidence[];
  answered: number;
  totalShown: number;
};

export const LIKERT_MAX = 4;

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

export function pickStage2Types(answers: Answers): TypeId[] {
  const acc = accumulate(answers, STAGE1);
  const ranked = TYPES.map((t) => ({
    type: t.id,
    pct: pctOf(acc.get(`t${t.id}`)?.raw ?? 0, acc.get(`t${t.id}`)?.max ?? 1),
  })).sort((a, b) => b.pct - a.pct);

  const picked: TypeId[] = ranked.slice(0, 3).map((r) => r.type);
  const fourth = ranked[3];
  if (fourth && ranked[2].pct - fourth.pct <= 6) {
    picked.push(fourth.type);
  }
  return picked;
}

export function stage2QuestionsFor(types: TypeId[]): Question[] {
  const set = new Set(types);
  return STAGE2.filter((q) => q.type && set.has(q.type));
}

export function score(answers: Answers, stage2Types: TypeId[]): Result {
  const stage2Qs = stage2QuestionsFor(stage2Types);
  const shown = [...STAGE1, ...stage2Qs];
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
      ? typePct * 0.48 + specPct * 0.4 + instinctPct * 0.12
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

  const [primary, secondary, tertiary] = subtypeScores;
  const gap1 = primary.pct - secondary.pct;
  const gap2 = secondary.pct - tertiary.pct;
  let confidence: Result["confidence"] = "low";
  let confidenceNote = "前两名接近。请对照原典描述，尤其留意反型。";
  if (gap1 >= 8 && primary.specPct >= 55) {
    confidence = "high";
    confidenceNote = "主导副型与第二名拉开，题目证据较集中。仍建议阅读相邻描述。";
  } else if (gap1 >= 4 || (gap1 >= 2.5 && gap2 >= 3)) {
    confidence = "medium";
    confidenceNote = "有主导倾向，但第二候选仍值得对照。纳兰霍强调自我观察先于测验。";
  }

  const evidence: Evidence[] = Object.entries(answers)
    .map(([id, value]) => {
      const q = QUESTION_MAP[id];
      if (!q) return null;
      const signed = q.reverse ? LIKERT_MAX - value : value;
      const aligned =
        q.subtype === primary.id ||
        q.type === SUBTYPE_MAP[primary.id].type;
      if (!aligned || signed < 3) return null;
      return {
        id,
        text: q.text,
        value,
        contribution: signed,
      };
    })
    .filter((x): x is Evidence => x !== null)
    .sort((a, b) => b.contribution - a.contribution)
    .slice(0, 8);

  return {
    typeScores,
    instinctScores,
    subtypeScores,
    primary: primary.id,
    secondary: secondary.id,
    tertiary: tertiary.id,
    confidence,
    confidenceNote,
    stage2Types,
    evidence,
    answered: shown.filter((q) => answers[q.id] !== undefined).length,
    totalShown: shown.length,
  };
}

export function unanswered(questions: Question[], answers: Answers): string[] {
  return questions.filter((q) => answers[q.id] === undefined).map((q) => q.id);
}
