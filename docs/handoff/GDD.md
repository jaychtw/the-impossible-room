# THE IMPOSSIBLE ROOM
## Game Design Document — v1.0
**Status:** Approved creative direction; implementation-ready specification with gated visual proof of concept  
**Genre:** Cinematic graphic-novel detective / point-and-click investigation  
**Platforms:** Mobile browser first; desktop browser  
**Languages:** English and Traditional Chinese (zh-TW), live toggle  
**Release target:** One complete, polished, replayable case, not an episodic promise

## 1. Creative thesis
A seemingly supernatural or impossible incident is investigated through careful observation, physical evidence, hypothesis testing, and reconstruction. The detective is a compelling character, but the player makes the decisive deductions. The world is coherent and the final explanation is rational, without requiring a villain in every future case.

**Player fantasy:** “I noticed what others missed, tested my idea, and explained the impossible.”

**Core promise:** The naked eye sees the mystery. The magnifier reveals its mechanism. The player earns the revelation.

**Guardrail:** Rational explanations must be supported by clues, not accepted by genre convention. The detective must be willing to revise hypotheses.

## 2. Audience and tone
Primary: curious teens and adults, approximately 12+, who enjoy approachable mysteries. Secondary: older children with assistance. No gore, graphic violence, jump scares, or realistic depictions of injury. A death can be established through dialogue and an off-screen silhouette, never shown graphically. Tone: atmospheric, eerie at first, warm and intellectually satisfying by the end; occasional character humor. A case should take approximately 15–25 minutes on first play, subject to playtesting.

## 3. Working identity
**Game title:** The Impossible Room (working; easy to replace).  
**Detective:** **Ari Vale**, original adult investigator, observant, curious, courteous, fallible, lightly dry-witted. Signature visual: dark teal coat, amber scarf, distinctive brass-rimmed magnifier; no deerstalker, child-detective resemblance, red bow tie, or borrowed character iconography.  
**Companion:** **Mina**, local archivist who introduces witnesses, maintains a case notebook, and offers optional hints without solving deductions.  
**Setting:** Contemporary fictional harbor town **Greyhaven**, whose older buildings and weather produce striking but explainable phenomena.

Character portraits and clothing must be consistent across scenes and panels. Original designs only.

## 4. Core loop
1. **Witness the impossible:** short graphic-novel opening establishes a locked room, eerie knocking, and an apparently inexplicable death.
2. **Survey:** examine one room panorama and a hallway view. Important zones are visually legible, not outlined as clues by default.
3. **Magnify:** move an optical lens or tap an object to open a detailed inspection view; discover specific evidence.
4. **Record:** evidence enters a notebook with separate **Observed** and **Possible meaning** labels.
5. **Test:** select a hypothesis and perform a simple in-world check that can support or refute it.
6. **Reconstruct:** place three causal steps in order and answer the decisive question.
7. **Reveal:** short illustrated panel sequence shows how the event actually happened, with citations to evidence the player found.
8. **Reflect:** case summary notes what was observed, what was inferred, and which initial assumptions were wrong. Replay and language switch available.

No countdown or time penalty. Wrong deductions trigger explanatory feedback and another attempt, not a game over.

## 5. Case 01 — “The Door That Locked Itself”
### 5.1 Opening mystery
At 9:15 p.m., during a thunderstorm, antique dealer **Edwin Marsh** is found unresponsive in his private study. The door is bolted from the inside. A neighbor heard three rhythmic knocks after Edwin had stopped answering calls. A pale shape was reportedly seen crossing the frosted window. Town rumor: the old house is haunted.

**Non-graphic truth:** Edwin suffered a sudden fatal medical event while alone. The locked door is ordinary: he habitually slid the interior bolt after entering. The three knocks were caused by a loose wooden shutter repeatedly striking its frame in gusting wind. The pale “figure” was a hanging white rain cover on a hook outside the frosted window, displaced by wind and backlit by a passing vehicle. No intruder, external locking trick, remote control, or murder. The headline and initial witness assumptions created the impossible-crime framing. Medical determination is reported by the attending professional; the player is not asked to diagnose cause of death from visual clues.

**Design intention:** A locked-room setup primes expectations of elaborate foul play. Evidence reveals that the apparent supernatural events and the death are **separate causal chains**. This deliberately avoids teaching players that every suspicious detail is part of one ingenious crime.

### 5.2 Ground-truth timeline
- **8:40 p.m.:** Edwin enters study and bolts the door from inside, as is his documented habit.
- **~8:55 p.m.:** A sudden medical emergency occurs while he is alone (specific medical diagnosis is not a player deduction).
- **9:00–9:15 p.m.:** Gusts drive loose shutter into frame, making triple knocks; white rain cover moves behind frosted window when exterior lights sweep across it.
- **9:15 p.m.:** Neighbor alerts caretaker after receiving no reply.
- **9:25 p.m.:** Caretaker and responders open door using authorized emergency access, documenting the bolt's interior position. The room is subsequently secured for investigation.

**Continuity note:** An interior bolt cannot be opened by an ordinary exterior key. The responder entry method must be explicitly depicted as removing a small emergency-access panel adjacent to the bolt, installed for fire safety; there is no intact magically unlocked door. A close-up of panel screws and responder log supports this. Alternatively, the door may be forced with visible damage, but choose exactly one approach before final art. **Chosen for v1: emergency-access panel.**

### 5.3 Investigation scenes and evidence
**Scene A — Study (primary panoramic background):** locked oak door, bolt assembly, grandfather clock, desk, rain-streaked frosted window, coat stand.  
**Scene B — Hallway:** emergency access panel, caretaker notice, witness conversation.  
**Scene C — Exterior window detail:** shutter, hook, rain cover, passing-headlight sightline. This is a focused inspection panel, not a fully navigable third room.

| ID | Discoverable observation | Where / how | Evidentiary role |
|---|---|---|---|
| E1 | Interior bolt shows ordinary wear; no string/fiber or external actuator | Magnify study door | Weakens trick-lock theory; supports routine use |
| E2 | Edwin's handwritten reminder: “Bolt study door before working” | Inspect desk note | Establishes habit; not proof by itself |
| E3 | Emergency panel screws show recent legitimate removal; dated responder entry note | Hallway inspection + caretaker dialogue | Explains how responders entered; no impossible unlocking |
| E4 | Loose shutter hinge and three impact marks in matching positions | Exterior magnifier | Mechanism for rhythmic knocking |
| E5 | Wind gusts produce three audible impacts in a short test | Tap “Test shutter” | Reproducible corroboration, not mere speculation |
| E6 | White rain cover hangs outside frosted window; matching outline | Exterior close-up | Candidate explanation for silhouette |
| E7 | Vehicle headlight sweep through frosted glass reproduces moving pale shape | Tap “Recreate light” | Tests silhouette explanation |
| E8 | Professional incident note: no evidence of assault; medical cause determined separately | Dialogue / notebook after key evidence | Separates death from sounds/shape; avoids amateur diagnosis |
| E9 | Clock stopped at 9:07 due to exhausted battery, documented by close-up | Optional red herring | Demonstrates coincidence; cannot date death |

**Clue fairness:** E1–E8 must be available before final reconstruction. E9 optional. The notebook clearly distinguishes verified observation, reported testimony, and interpretation. Do not label absence of thread as definitive proof no manipulation occurred.

### 5.4 Hypotheses and tests
H1 “An intruder locked the door remotely” → search for actuator, wire, access, and signs of entry; available evidence does not support it.  
H2 “The house produced supernatural knocks and an apparition” → reproduce shutter impacts and silhouette with physical tests.  
H3 “Edwin locked himself in; unrelated environmental effects created the haunting story” → supported by bolt habit, emergency panel, reproduced shutter and lighting effects, professional note.

A hypothesis can be selected early; the game does not penalize exploring wrong theories. A conclusion is accepted only after player has examined E1, E2, E3, E4, E5, E6, E7, E8 and completed two physical tests. Optional hint assistance is not scored as failure.

### 5.5 Reconstruction challenge
Player orders three cards: **Edwin bolts the study** → **Edwin becomes unresponsive while alone** → **Wind and passing lights create apparently paranormal signs**. Player then matches: **knocking → loose shutter**; **figure → rain cover + headlights**; **entry → emergency access panel**. Final question: “What connects the death and the apparent haunting?” Correct answer: **No demonstrated common cause; the events were mistakenly linked**. Multiple incorrect attempts allowed with specific, non-spoiling feedback.

### 5.6 Revelation
5–7 comic panels, each derived from established assets and evidence: Edwin bolts door; shutter strikes frame; white cover swings; passing headlights illuminate frosted glass; responders open access panel; detective explains why the story sounded impossible. No visual reenactment of medical distress or body.

## 6. Magnifier and interaction design
**Default:** On desktop, mouse/touchpad moves lens; on mobile, drag lens with one finger or tap a large object zone to inspect. A persistent **Inspect** button offers accessible non-drag navigation. Lens diameter ~140 CSS px desktop, ~120 mobile, tuned in testing; large pointer offset on touch so finger does not obscure detail. Keyboard: Tab cycles inspectable zones; Enter opens inspection; Escape closes; arrow keys may move lens as enhancement.

**Two-tier optical system:**
- **Live lens:** Enlarges actual underlying room composite (~1.6–2.0×) via a synchronized crop/transform, including aligned object sprites. Never fabricate detail only inside lens.
- **Inspection close-up:** On selecting an object, show a separate high-resolution authored asset of the **same object**, with matching geometry, lighting, marks, and clue placement. Close-ups can reveal small marks that are not legible at scene scale; their location must map to the scene object.

Hotspots must be forgiving (minimum ~44×44 CSS px), keyboard accessible, and not require pixel hunting. A subtle optional “areas to inspect” mode may identify objects, not specific evidence. Evidence must be found by intentional inspection, not auto-collected when lens sweeps nearby. Decorative details may exist, but avoid fake critical clues that create unsolvable ambiguity.

## 7. Visual system — non-negotiable production architecture
**Layer 1: Background** — high-resolution cinematic realistic graphic-novel illustration; atmospheric rain, warm lamplight, wood grain, deep shadows. Mostly static; never baked-in versions of movable props that cause double images.  
**Layer 2: Objects** — individually positioned interactive sprites/overlays with states (normal, selected, inspected, tested). Prioritize hit-area clarity, stable alignment, responsiveness; match background palette, perspective, and lighting.  
**Layer 3: Interface** — lens, notebook, hypothesis board, dialogue, touch targets, hints, language switch. UI never relies solely on color.

**Inspection art:** premium macro illustrations (e.g. antique brass lock and tiny surface detail) with exact continuity from scene objects. **Narrative panels:** reuse same objects and environments, crop and stage them rather than generate unrelated scenes. Avoid full-frame animation; restrained panel motion, parallax, rain and lighting are sufficient. Reduced-motion mode removes nonessential movement.

### 7.1 Asset manifest (minimum)
- BG01 study 16:9 master, BG02 hallway, EXT01 exterior window close-up.
- Object sprites: door+bolt, desk note, clock, emergency panel, shutter hinge, rain cover, window lighting overlay.
- Inspection images: bolt/door, note, access panel, hinge/marks, rain cover/window, clock.
- Ari Vale: neutral, curious, realization portraits; Mina: neutral, supportive.
- 5–7 reveal panel compositions and responsive crops.
- Localization text and optional sound effects (all local, captions/text equivalents).

### 7.2 Visual acceptance gate (before full production)
Build a **vertical slice** containing one polished study background, aligned door sprite, real lens magnification, and a high-detail keyhole/bolt close-up with a small mark. Require screenshots at desktop 1440×900 and mobile 390×844, including lens and close-up. Compare room/close-up geometry, lighting, texture, mark position and legibility. If mismatched, revise asset pipeline before authoring other scenes. A beautiful unrelated macro image does **not** pass.

### 7.3 Feasibility and alternatives
High-resolution background plus sprites and optical crop is feasible in HTML Canvas or layered DOM/SVG. Exact matching of independently AI-generated macro art is **unproven**; preferred mitigation: derive close-ups from shared source composition, repaint/refine in place, or use manually aligned overpainting. If matching fails, use carefully painted zoom assets from the same base rather than pretending consistency. Browser performance and asset budgets must be measured on an ordinary mobile device/emulator. Art reference images from discussions are inspiration, not licensed production assets; generate or author original assets.

## 8. User experience and accessibility
- Bilingual strings in one localization source, live toggle without losing case state; English and zh-TW complete, including dialogue, notebook, evidence, hints, controls, results and captions.
- Responsive layout for 320px+ viewport; touch targets >=44 CSS px, high contrast, scalable text, no hover-only functionality.
- Full keyboard operation including inspection via zone list; semantic controls, focus management, screen-reader evidence descriptions; no puzzle requires distinguishing only subtle colors.
- Optional sound with captions, mute persistence, reduced motion, no flashing effects, no timer.
- Autosave only non-sensitive case progress and preferences in local storage; versioned schema, safe fallback if blocked; no accounts, tracking, backend, or ads.
- Hints in three levels: (1) remind objective, (2) name area/object, (3) describe what observation could distinguish hypotheses. Hints never solve final reconstruction automatically.

## 9. Progression and feedback
Opening comic → guided magnifier interaction (one small demonstration on a harmless object) → free investigation → notebook/hypothesis board → two environmental tests → reconstruction → reveal → case solved summary → replay. Progress meter counts evidence found, not correctness or intelligence. No stars based on speed; optional badge for solving without hints is acceptable only if non-shaming and does not suppress help.

## 10. Engineering structure
Content-driven case schema (`scenes`, `objects`, `hotspots`, `evidence`, `tests`, `hypotheses`, `reconstruction`, `dialogue`, `revealPanels`) separate from renderer and game engine. Explicit state transitions; no hidden mutation in UI. Asset coordinate system based on scene-local normalized coordinates so room, objects and hotspots scale together. A rendering pipeline must keep lens crop and overlays in sync. Tests validate referential integrity and bilingual parity. Avoid complex physics or AI-generated runtime reasoning; case logic is authored, deterministic and testable.

**Suggested stack:** Vite + TypeScript + Canvas/SVG/DOM hybrid; Codex may choose simpler architecture with rationale. No runtime network dependencies. Static deployment to GitHub Pages using relative paths and CI.

## 11. Acceptance criteria
### Functional
- Entire case playable start to finish on desktop and emulated mobile, both languages.
- Player can inspect every required clue without precision clicking; accessible alternative to dragging.
- Lens genuinely enlarges aligned artwork; close-ups are consistent with corresponding objects.
- Two experiments visibly reproduce knocking and silhouette.
- Wrong hypotheses remain investigable; final reconstruction requires causal understanding, not only collection.
- Progress, language, hints, sound, reset, replay function; safe persistence fallback.
- Automated unit/integration/browser tests pass; no fatal console errors or unexpected network calls.

### Experiential
- First-time player understands magnifier interaction without external explanation.
- Clues feel discoverable rather than arbitrary; key solution can be inferred before reveal.
- Revelation is satisfying and consistent with all earlier evidence.
- Art achieves a coherent realistic graphic-novel mood, especially lock close-up.
- Actual physical-device and independent-player usability observations are **not** implied by automated test success; record separately.

## 12. Production stages and stop/go gates
**P0 — Visual POC:** background + aligned lock sprite + real magnifier + matching macro close-up; screenshots and art consistency review. **Stop if visual continuity fails.**  
**P1 — Investigation vertical slice:** one room, notebook, two clues, bilingual/mobile controls, keyboard alternative.  
**P2 — Full case:** scenes, all clues, physical tests, hypothesis and reconstruction, revelation panels.  
**P3 — Polish/QA:** accessibility, responsive testing, performance, localization, CI, deploy.  
**P4 — Human acceptance:** creator plays without reading solution, then optional family/player test; log unclear interactions, unfair deductions and physical-device issues.

Codex owns routine implementation choices, testing and iteration. Escalate only: inability to reach the visual benchmark, physically implausible core solution, significant change in case identity, third-party asset licensing risk, or major scope increase. Do not silently replace the realistic graphic-novel direction with generic vector art to meet a deadline.

## 13. Explicit non-goals for v1
No open-world town, episodic content pipeline beyond extensible schema, branching story tree, inventory-combination labyrinth, procedural mystery generation, true crime, graphic murder depiction, forensic medical diagnosis mini-game, live AI dialogue, subscriptions, accounts, multiplayer, or polished animation beyond short comic-panel sequences.

## 14. Open validation risks
1. Visual consistency between environment and independently produced close-ups (highest risk).
2. Readable lens on small screens without finger occlusion.
3. Fairness of an intentionally non-murder solution to a murder-framed opening; dialogue must not falsely establish homicide as fact. Use “suspected murder” in rumors, not official certainty.
4. Quality of the causal reveal; user may expect a mechanical locked-room trick. Playtest whether the deliberate subversion feels earned rather than anticlimactic.
5. Asset weight and performance on ordinary mobile hardware.

## 15. Definition of done
A deployed, self-contained, bilingual one-case game that passes automated validation, contains screenshot evidence for desktop/mobile and both languages, offers a coherent high-quality visual experience, and allows a first-time player to reach and understand the rational solution. Document what was and was not tested on physical devices and with actual players. Completion is not contingent on speculative additional cases.
