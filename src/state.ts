export type Language = "en" | "zh";
export type EvidenceId =
  "E1" | "E2" | "E3" | "E4" | "E5" | "E6" | "E7" | "E8" | "E9";
export type Hypothesis = "H1" | "H2" | "H3";
export const required: EvidenceId[] = [
  "E1",
  "E2",
  "E3",
  "E4",
  "E5",
  "E6",
  "E7",
  "E8",
];
export const storageKey = "impossible-room:v1";
export type State = {
  version: 1;
  language: Language;
  started: boolean;
  evidence: EvidenceId[];
  hypothesis: Hypothesis | null;
  tests: ("shutter" | "light")[];
  solved: boolean;
  hints: number;
  sound: boolean;
};
export const initialState = (): State => ({
  version: 1,
  language: "en",
  started: false,
  evidence: [],
  hypothesis: null,
  tests: [],
  solved: false,
  hints: 0,
  sound: false,
});
export type Action =
  | { type: "START" }
  | { type: "LANGUAGE"; language: Language }
  | { type: "OBSERVE"; id: EvidenceId }
  | { type: "HYPOTHESIS"; id: Hypothesis }
  | { type: "TEST"; id: "shutter" | "light"; condition: string }
  | { type: "SOLVE"; order: string[]; matches: string[]; answer: string }
  | { type: "HINT" }
  | { type: "SOUND" }
  | { type: "RESET" };
export function canReadReport(s: State) {
  return ["E1", "E2", "E3", "E5", "E7"].every((id) =>
    s.evidence.includes(id as EvidenceId),
  );
}
export function canReconstruct(s: State) {
  return (
    required.every((id) => s.evidence.includes(id)) &&
    s.tests.includes("shutter") &&
    s.tests.includes("light")
  );
}
export function reconstructionError(
  order: string[],
  matches: string[],
  answer: string,
): "order" | "knock" | "figure" | "entry" | "cause" | null {
  if (order.join(",") !== "bolt,medical,signs") return "order";
  if (matches[0] !== "shutter") return "knock";
  if (matches[1] !== "cover") return "figure";
  if (matches[2] !== "panel") return "entry";
  if (answer !== "separate") return "cause";
  return null;
}
export function reduce(s: State, a: Action): State {
  switch (a.type) {
    case "START":
      return { ...s, started: true };
    case "LANGUAGE":
      return { ...s, language: a.language };
    case "HYPOTHESIS":
      return { ...s, hypothesis: a.id };
    case "HINT":
      return { ...s, hints: s.hints + 1 };
    case "SOUND":
      return { ...s, sound: !s.sound };
    case "RESET":
      return { ...initialState(), language: s.language, sound: s.sound };
    case "OBSERVE": {
      if (
        a.id === "E5" ||
        a.id === "E7" ||
        (a.id === "E8" && !canReadReport(s))
      )
        return s;
      if (![...required, "E9"].includes(a.id) || s.evidence.includes(a.id))
        return s;
      return { ...s, evidence: [...s.evidence, a.id] };
    }
    case "TEST": {
      const valid =
        a.id === "shutter"
          ? s.evidence.includes("E4") && a.condition === "gust"
          : s.evidence.includes("E6") && a.condition === "headlights";
      if (!valid) return s;
      const id: EvidenceId = a.id === "shutter" ? "E5" : "E7";
      return {
        ...s,
        evidence: s.evidence.includes(id) ? s.evidence : [...s.evidence, id],
        tests: s.tests.includes(a.id) ? s.tests : [...s.tests, a.id],
      };
    }
    case "SOLVE":
      return canReconstruct(s) &&
        s.hypothesis === "H3" &&
        !reconstructionError(a.order, a.matches, a.answer)
        ? { ...s, solved: true }
        : s;
  }
}
export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}
export function load(storage: StorageLike): State {
  try {
    const raw = storage.getItem(storageKey);
    if (!raw) return initialState();
    const x = JSON.parse(raw);
    if (
      x.version !== 1 ||
      !["en", "zh"].includes(x.language) ||
      !Array.isArray(x.evidence) ||
      !Array.isArray(x.tests)
    )
      return initialState();
    const s: State = {
      version: 1,
      language: x.language,
      started: x.started === true,
      evidence: [
        ...new Set<EvidenceId>(
          x.evidence.filter((id: EvidenceId) =>
            [...required, "E9"].includes(id),
          ),
        ),
      ],
      hypothesis: ["H1", "H2", "H3"].includes(x.hypothesis)
        ? x.hypothesis
        : null,
      tests: [
        ...new Set<"shutter" | "light">(
          x.tests.filter((id: string) => id === "shutter" || id === "light"),
        ),
      ],
      solved: false,
      hints: Number.isSafeInteger(x.hints) && x.hints >= 0 ? x.hints : 0,
      sound: x.sound === true,
    };
    if (!s.tests.includes("shutter"))
      s.evidence = s.evidence.filter((id) => id !== "E5");
    if (!s.tests.includes("light"))
      s.evidence = s.evidence.filter((id) => id !== "E7");
    s.solved = x.solved === true && canReconstruct(s) && s.hypothesis === "H3";
    return s;
  } catch {
    return initialState();
  }
}
export function save(storage: StorageLike, s: State): boolean {
  try {
    storage.setItem(storageKey, JSON.stringify(s));
    return true;
  } catch {
    return false;
  }
}
