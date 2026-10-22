import { test } from "node:test";
import assert from "node:assert/strict";
import {
  initialState,
  reduce,
  canReadReport,
  canReconstruct,
  reconstructionError,
  save,
  load,
  required,
  storageKey,
  type State,
  type StorageLike,
} from "../src/state";
import { en, zh } from "../src/i18n";
import { objects, evidence, cards, revealPanels } from "../src/content";
function collect(): State {
  let s = initialState();
  for (const id of ["E1", "E2", "E3", "E4", "E6"] as const)
    s = reduce(s, { type: "OBSERVE", id });
  s = reduce(s, { type: "TEST", id: "shutter", condition: "gust" });
  s = reduce(s, { type: "TEST", id: "light", condition: "headlights" });
  return reduce(s, { type: "OBSERVE", id: "E8" });
}
test("initial case cannot skip to report, experiments or conclusion", () => {
  const s = initialState();
  assert.equal(canReadReport(s), false);
  assert.equal(canReconstruct(s), false);
  assert.deepEqual(reduce(s, { type: "OBSERVE", id: "E8" }), s);
  assert.deepEqual(reduce(s, { type: "OBSERVE", id: "E5" }), s);
  assert.deepEqual(reduce(s, { type: "OBSERVE", id: "E7" }), s);
  assert.deepEqual(
    reduce(s, { type: "TEST", id: "shutter", condition: "gust" }),
    s,
  );
  assert.equal(
    reduce(s, {
      type: "SOLVE",
      order: ["bolt", "medical", "signs"],
      matches: ["shutter", "cover", "panel"],
      answer: "separate",
    }).solved,
    false,
  );
});
test("recording is idempotent and does not accept unknown evidence", () => {
  let s = reduce(initialState(), { type: "OBSERVE", id: "E1" });
  assert.deepEqual(reduce(s, { type: "OBSERVE", id: "E1" }), s);
  assert.deepEqual(reduce(s, { type: "OBSERVE", id: "BAD" as "E1" }), s);
});
test("experiments require observations and correct physical conditions", () => {
  let s = reduce(initialState(), { type: "OBSERVE", id: "E4" });
  assert.deepEqual(
    reduce(s, { type: "TEST", id: "shutter", condition: "still" }),
    s,
  );
  s = reduce(s, { type: "TEST", id: "shutter", condition: "gust" });
  assert.ok(s.evidence.includes("E5"));
  assert.deepEqual(
    reduce(s, { type: "TEST", id: "shutter", condition: "gust" }),
    s,
  );
  assert.equal(s.tests.length, 1);
  assert.deepEqual(
    reduce(s, { type: "TEST", id: "light", condition: "headlights" }),
    s,
  );
  s = reduce(s, { type: "OBSERVE", id: "E6" });
  assert.deepEqual(
    reduce(s, { type: "TEST", id: "light", condition: "lamp" }),
    s,
  );
  assert.ok(
    reduce(s, {
      type: "TEST",
      id: "light",
      condition: "headlights",
    }).evidence.includes("E7"),
  );
});
test("wrong theories remain selectable and reversible", () => {
  let s = reduce(collect(), { type: "HYPOTHESIS", id: "H1" });
  assert.equal(s.hypothesis, "H1");
  s = reduce(s, { type: "HYPOTHESIS", id: "H2" });
  assert.equal(s.hypothesis, "H2");
  s = reduce(s, { type: "HYPOTHESIS", id: "H3" });
  assert.equal(s.hypothesis, "H3");
});
test("report follows independently reproduced effects; optional clock is not needed", () => {
  const s = collect();
  assert.equal(s.evidence.length, 8);
  assert.equal(canReadReport(s), true);
  assert.equal(canReconstruct(s), true);
  assert.ok(!s.evidence.includes("E9"));
  assert.deepEqual([...s.evidence].sort(), required);
});
test("reconstruction returns specific feedback for every causal error", () => {
  assert.equal(
    reconstructionError(["signs", "bolt", "medical"], [], ""),
    "order",
  );
  assert.equal(
    reconstructionError(["bolt", "medical", "signs"], ["intruder"], "separate"),
    "knock",
  );
  assert.equal(
    reconstructionError(
      ["bolt", "medical", "signs"],
      ["shutter", "ghost"],
      "separate",
    ),
    "figure",
  );
  assert.equal(
    reconstructionError(
      ["bolt", "medical", "signs"],
      ["shutter", "cover", "key"],
      "separate",
    ),
    "entry",
  );
  assert.equal(
    reconstructionError(
      ["bolt", "medical", "signs"],
      ["shutter", "cover", "panel"],
      "common",
    ),
    "cause",
  );
  assert.equal(
    reconstructionError(
      ["bolt", "medical", "signs"],
      ["shutter", "cover", "panel"],
      "separate",
    ),
    null,
  );
});
test("complete evidence, both tests, supported theory and reconstruction are required to solve", () => {
  let s = collect();
  const action = {
    type: "SOLVE" as const,
    order: ["bolt", "medical", "signs"],
    matches: ["shutter", "cover", "panel"],
    answer: "separate",
  };
  assert.equal(reduce(s, action).solved, false);
  s = reduce(s, { type: "HYPOTHESIS", id: "H3" });
  assert.equal(reduce(s, { ...action, answer: "common" }).solved, false);
  assert.equal(reduce(s, action).solved, true);
});
test("progress and preferences survive versioned persistence", () => {
  let raw: string | null = null;
  const store: StorageLike = {
    getItem: () => raw,
    setItem: (key, value) => {
      assert.equal(key, storageKey);
      raw = value;
    },
  };
  const s = { ...collect(), language: "zh" as const, sound: true, hints: 2 };
  assert.equal(save(store, s), true);
  assert.deepEqual(load(store), s);
});
test("blocked and corrupt storage fall back safely without losing session state", () => {
  const blocked = {
    getItem: () => {
      throw Error("blocked");
    },
    setItem: () => {
      throw Error("blocked");
    },
  };
  assert.deepEqual(load(blocked), initialState());
  assert.equal(save(blocked, collect()), false);
  for (const raw of [
    "bad",
    "null",
    '{"version":2}',
    JSON.stringify({ ...initialState(), evidence: null }),
  ])
    assert.deepEqual(
      load({ getItem: () => raw, setItem: () => {} }),
      initialState(),
    );
});
test("untrusted persisted shape cannot inject evidence or solved state", () => {
  const x = {
    ...initialState(),
    evidence: ["E5", "E7", "X", "E1", "E1"],
    solved: true,
    hints: -5,
    hypothesis: "malicious",
  };
  const s = load({ getItem: () => JSON.stringify(x), setItem: () => {} });
  assert.deepEqual(s.evidence, ["E1"]);
  assert.equal(s.solved, false);
  assert.equal(s.hints, 0);
  assert.equal(s.hypothesis, null);
});
test("reset clears progress while retaining language and sound; language change preserves evidence", () => {
  const s = { ...collect(), language: "zh" as const, sound: true };
  assert.deepEqual(
    reduce(s, { type: "LANGUAGE", language: "en" }).evidence,
    s.evidence,
  );
  assert.deepEqual(reduce(s, { type: "RESET" }), {
    ...initialState(),
    language: "zh",
    sound: true,
  });
});
test("bilingual key parity and authored data references are complete", () => {
  assert.deepEqual(Object.keys(en).sort(), Object.keys(zh).sort());
  for (const dict of [en, zh])
    assert.ok(Object.values(dict).every((v) => v.length > 0));
  for (const o of Object.values(objects)) {
    assert.ok(evidence[o.id]);
    assert.ok(o.position.every((n) => n >= 0 && n <= 100));
  }
  for (const e of Object.values(evidence))
    for (const field of [e.title, e.observation, e.meaning])
      assert.ok(field.en && field.zh);
  assert.equal(Object.keys(cards).length, 3);
  assert.equal(revealPanels.length, 6);
});
