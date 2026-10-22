# The Impossible Room

**The Door That Locked Itself** is a complete, original browser detective case set in rainy Greyhaven. Investigate with Ari Vale and Mina: magnify a bolted study, record observations, reproduce three knocks and a pale silhouette, and reconstruct what actually happened.

English and Traditional Chinese are available throughout, with live switching and local autosave. No account, backend, analytics, remote fonts, or runtime external requests. Sound is optional, with text equivalents. The case contains a non-graphic death; medical conclusions come from an attending professional's report.

## Develop

Node 24 is used in CI (Node 22.12+ supported).

```sh
npm ci
npm run dev
```

Use the existing checkout. Cloud tasks are already isolated; no additional worktree is needed.

```sh
npm test                 # state, evidence gates, persistence, localization
npm run test:assets      # shared-source bolt continuity and asset budget
npm run build            # strict TypeScript + relative-path static output
npm run test:browser     # desktop/mobile playthroughs and accessibility
```

Locally, Playwright uses `/usr/bin/chromium`. On other machines install Chromium with `npx playwright install chromium` and run with `CI=1 npm run test:browser`. CI installs its browser and Linux dependencies explicitly.

## Play

Open the case for the introduction. Move or drag the magnifier to enlarge the actual scene. Select room objects, or choose **Inspect an object** for a list that works with touch and keyboard. Record an observation deliberately. Read the notebook's **Observed / Reported / Tested** entries separately from **Possible meaning**. The theory board accepts tentative, revisable hypotheses. Experiments are outside the window. There is no timer or penalty for retrying.

Keyboard: Tab moves between controls, Enter activates buttons, arrow keys operate native selects/radios, and Escape dismisses an inspection. Dialogs contain focus and return it to the opening control. Use the three scene tabs to visit the study, hallway, and exterior detail. Ask Mina for three levels of optional hints.

## Architecture

- `src/state.ts`: pure state transitions, evidence/test gates, versioned safe persistence.
- `src/content.ts`: authored evidence, objects, normalized coordinates, hypotheses and reveal panels.
- `src/i18n.ts`: complete EN/zh-TW interface dictionaries with compile-time key parity.
- `src/main.ts`: DOM renderer, accessible dialogs, optical lens and experiment orchestration.
- `assets/source/`: original generated paintings and character sheet.
- `scripts/build-art.mjs`: deterministic WebP sprites and inspection crops from shared compositions.
- `tests/`: unit and real-browser validation.

Rebuild artwork with `npm run assets` after intentional source-asset changes. The room's door is removed from its background, then placed as a separate aligned sprite. The close-up bolt is composited into that sprite, so the scene, genuine 1.8× lens, and macro share the same geometry and scratch. Other close-ups reuse their scene sources. All art ships locally.

## Deployment

`.github/workflows/pages.yml` validates the game, runs desktop/mobile Chromium tests, uploads screenshots, and deploys `dist/` to GitHub Pages only after validation passes. It then repeats the browser suite against the public deployed URL and uploads hosted test evidence. Repository **Settings → Pages → Source** must be **GitHub Actions**. Production uses relative asset paths and supports the `/the-impossible-room/` project prefix.

See [visual review](docs/VISUAL-POC-REVIEW.md), [QA report](docs/QA-REPORT.md), and [asset provenance](docs/ASSETS.md). The original supplied handoff is preserved in `docs/handoff/` as design input. Independent-player and physical-device acceptance remain separate from automated validation.
