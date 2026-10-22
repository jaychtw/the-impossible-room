# Codex Implementation Brief — The Impossible Room

Read `GDD.md` fully. Build a **playable browser game**, not a static mockup or a text-only demonstration. Do not claim to have achieved the desired cinematic art quality unless screenshot evidence supports it.

## Priorities, in order
1. Prove the three-layer visual pipeline with realistic graphic-novel environment, aligned controllable object, genuine magnifier, matching high-detail inspection asset.
2. Preserve the authored mystery's causal fairness and the player's agency.
3. Deliver one complete case in English and Traditional Chinese, mobile-first and keyboard-accessible.
4. Test in actual browser contexts and deploy through GitHub Pages if repo access and configuration permit.

## Immediate P0 deliverable
Create study environment with door/bolt interactive sprite and a physically matching macro inspection view. Make lens movement work with pointer and touch; provide keyboard inspect alternative. Save desktop/mobile screenshots. Write a short `docs/VISUAL-POC-REVIEW.md` evaluating geometry, alignment, lighting, magnification, mobile legibility and asset consistency. **If the art is generic, schematic or inconsistent, do not proceed to P2 as if the visual benchmark is met.** Improve asset pipeline or escalate to user with samples and concrete tradeoffs.

## Gameplay requirements
Implement stateful survey, inspect, evidence notebook, hypotheses, two tests (shutter knocks and silhouette recreation), reconstruction ordering, final explanation, replay and reset. Evidence is discovered through meaningful interactions, not collected by random hovering. Wrong answers get specific feedback and retry. Use authored, deterministic case content. Keep professional medical determination as an external report, not a diagnosis made by player.

## Engineering discretion
Choose engine/rendering method, storage schema, UI layout, build system, and asset pipeline. Favor simple maintainable code and extensible case data. Keep source assets and document how they were made. All artwork must be original or appropriately licensed; no direct copying of Sherlock Holmes/Detective Conan visual character traits. No runtime external requests, trackers or accounts.

## Mandatory verification
- Unit tests for game state, evidence gating, hypotheses, reconstruction, local persistence fallback, bilingual key parity.
- Browser tests on desktop and emulated mobile, both languages, including full playthroughs, keyboard-only inspection, touch, reset/replay, and 320px viewport.
- Screenshots for study scene, lens in use, macro inspection, evidence notebook, and revelation, in both languages where UI differs.
- Accessibility checks and reduced-motion behavior; avoid keyboard traps.
- `docs/QA-REPORT.md`: exact commands, pass/fail, browser environments, asset continuity assessment, limitations, and unverified physical-device/user testing.
- Static build with relative paths and CI validation before GitHub Pages deployment.

## Definition of completion
A deployed, tested, complete one-case game with visual evidence and an honest QA report. Do not equate CI success with first-time player satisfaction. Escalate significant visual quality mismatch, case-logic contradictions, or unlicensed asset dependencies; otherwise make routine choices autonomously.

## Suggested handoff prompt
“Implement the attached GDD in stages P0–P3. First prove and document the cinematic visual pipeline, then build the complete playable case. Maintain strict EN/zh-TW and mobile/keyboard acceptance. Test in browsers, capture screenshots, and provide a candid QA report. Escalate only core visual, logical, or licensing blockers.”
