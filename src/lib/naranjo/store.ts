import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { TypeId } from "./catalog";
import { pickCompareQuestions } from "./compare";
import { STEP1 } from "./questions";
import {
  pickStage2Types,
  score,
  stage2QuestionsFor,
  type Answers,
  type Result,
} from "./scoring";

export type Stage = 1 | 2 | 3 | "result";

export function freshSeed(): number {
  let r = (Date.now() >>> 0) ^ Math.floor(Math.random() * 0xffffffff);
  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    r ^= buf[0]!;
  }
  return (r >>> 0) || 1;
}

type TestState = {
  answers: Answers;
  stage: Stage;
  stage2Types: TypeId[];
  stage3Ids: string[];
  result: Result | null;
  consentAt: number | null;
  shuffleSeed: number;
  hydrated: boolean;
  setAnswer: (id: string, value: number) => void;
  goStage2: () => boolean;
  goStage3: () => boolean;
  finish: () => boolean;
  back: () => void;
  reset: () => void;
  hydrateResult: () => void;
  markHydrated: () => void;
};

const empty = {
  answers: {} as Answers,
  stage: 1 as Stage,
  stage2Types: [] as TypeId[],
  stage3Ids: [] as string[],
  result: null as Result | null,
  consentAt: null as number | null,
  shuffleSeed: 0,
  hydrated: false,
};

export const useTestStore = create<TestState>()(
  persist(
    (set, get) => ({
      ...empty,
      setAnswer: (id, value) =>
        set((s) => ({
          answers: { ...s.answers, [id]: value },
          consentAt: s.consentAt ?? Date.now(),
        })),
      goStage2: () => {
        const { answers } = get();
        const missing = STEP1.some((q) => answers[q.id] === undefined);
        if (missing) return false;
        const types = pickStage2Types(answers);
        set({ stage: 2, stage2Types: types });
        return true;
      },
      goStage3: () => {
        const { answers, stage2Types, shuffleSeed } = get();
        const types = stage2Types.length ? stage2Types : pickStage2Types(answers);
        const missing = stage2QuestionsFor(types, shuffleSeed || 1).some(
          (q) => answers[q.id] === undefined,
        );
        if (missing) return false;
        const prelim = score(answers, types);
        const items = pickCompareQuestions(prelim, shuffleSeed || 1);
        set({
          stage: 3,
          stage2Types: types,
          stage3Ids: items.map((q) => q.id),
        });
        return true;
      },
      finish: () => {
        const { answers, stage2Types, stage3Ids, shuffleSeed } = get();
        const types = stage2Types.length ? stage2Types : pickStage2Types(answers);
        const result = score(answers, types, stage3Ids, shuffleSeed || 1);
        set({ stage: "result", result, stage2Types: types });
        return true;
      },
      back: () => {
        const { stage } = get();
        if (stage === 2) set({ stage: 1 });
        if (stage === 3) set({ stage: 2 });
        if (stage === "result") set({ stage: 3 });
      },
      reset: () =>
        set({
          ...empty,
          shuffleSeed: freshSeed(),
          hydrated: true,
        }),
      markHydrated: () => set({ hydrated: true }),
      hydrateResult: () => {
        const { answers, stage2Types, stage3Ids, stage, shuffleSeed } = get();
        if (stage !== "result") return;
        if (!Object.keys(answers).length) return;
        const types = stage2Types.length ? stage2Types : pickStage2Types(answers);
        set({
          result: score(answers, types, stage3Ids, shuffleSeed || 1),
          stage2Types: types,
        });
      },
    }),
    {
      name: "naranjo-27-v6",
      skipHydration: true,
      partialize: (s) => ({
        answers: s.answers,
        stage: s.stage,
        stage2Types: s.stage2Types,
        stage3Ids: s.stage3Ids,
        result: s.result,
        consentAt: s.consentAt,
        shuffleSeed: s.shuffleSeed,
      }),
    },
  ),
);
