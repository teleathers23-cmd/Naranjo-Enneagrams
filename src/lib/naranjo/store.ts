import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { TypeId } from "./catalog";
import { STEP1 } from "./questions";
import {
  pickStage2Types,
  score,
  type Answers,
  type Result,
} from "./scoring";

export type Stage = 1 | 2 | "result";

type TestState = {
  answers: Answers;
  stage: Stage;
  stage2Types: TypeId[];
  result: Result | null;
  consentAt: number | null;
  shuffleSeed: number;
  hydrated: boolean;
  setAnswer: (id: string, value: number) => void;
  goStage2: () => boolean;
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
  result: null as Result | null,
  consentAt: null as number | null,
  shuffleSeed: Math.floor(Math.random() * 1_000_000_000),
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
      finish: () => {
        const { answers, stage2Types } = get();
        const types = stage2Types.length ? stage2Types : pickStage2Types(answers);
        const result = score(answers, types);
        set({ stage: "result", result, stage2Types: types });
        return true;
      },
      back: () => {
        const { stage } = get();
        if (stage === 2) set({ stage: 1 });
        if (stage === "result") set({ stage: 2 });
      },
      reset: () =>
        set({
          ...empty,
          shuffleSeed: Math.floor(Math.random() * 1_000_000_000),
          hydrated: true,
        }),
      markHydrated: () => set({ hydrated: true }),
      hydrateResult: () => {
        const { answers, stage2Types, stage } = get();
        if (stage !== "result") return;
        if (!Object.keys(answers).length) return;
        const types = stage2Types.length ? stage2Types : pickStage2Types(answers);
        set({ result: score(answers, types), stage2Types: types });
      },
    }),
    {
      name: "naranjo-27-v4",
      skipHydration: true,
      partialize: (s) => ({
        answers: s.answers,
        stage: s.stage,
        stage2Types: s.stage2Types,
        result: s.result,
        consentAt: s.consentAt,
        shuffleSeed: s.shuffleSeed,
      }),
    },
  ),
);
