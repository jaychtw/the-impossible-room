# Release QA — The Impossible Room v1

Date: 2026-10-22. This report records release qualification. Hosted CI, deployment, and post-deployment browser results are recorded by the repository's **Validate and deploy game** workflow.

## Environment and results

Linux x86_64, Node **24.19.0**, npm **11.9.0**, Vite **7.3.7**, Playwright **1.64.1**, actual headless Chromium **154.0.8037.57**. Dependency versions are frozen in `package-lock.json`.

| Command | Result |
| --- | --- |
| `npm ci --cache /workspace/.npm-cache --no-audit --no-fund` | Passed; repeatable lockfile install |
| `npm test` | **12 passed**, zero failures or skips |
| `npm run test:assets` | **17 assets passed**; bolt scene/macro mean pixel discrepancy **5.13 / 255** after WebP compression; **1.90 MiB** total artwork, under 3 MiB budget |
| `npm run build` | Passed strict TypeScript and Vite static build; relative asset paths; approximately **2.1 MiB** complete `dist/` |
| `npm run test:browser` | **15 passed, 1 intentionally skipped**, zero failures; latest local release run 54.7 s |
| `git diff-tree --check --root HEAD` | Passed; original handoff Markdown hard breaks are explicitly preserved by `.gitattributes` |

The skipped case is touch-only controls in the desktop project. The identical complete touch playthrough runs and passes in the mobile project. A skipped test is not counted as passed.

## Browser coverage

- Desktop **1440×900** and Chromium iPhone 13 emulation with an explicit **390×844 viewport**, device pixel ratio 3, touch enabled. Screenshots use CSS-pixel scale. Separate **320×740** checks test overflow and dialog layout in both languages.
- Complete English and Traditional Chinese investigations, both experiments, theory selection, all reconstruction steps, six-panel reveal, autosave/reload, reset/replay.
- Both wrong hypotheses remain available. Tests verify causal feedback on incorrect order, an ordinary exterior key, and a shared-cause answer. Hypotheses can be changed without losing observations.
- Report gating, evidence gating, no evidence from lens movement, no duplicate evidence, wrong experiment conditions, optional clock, and live language switching without state loss.
- Complete keyboard-only playthroughs on both viewport projects. Native select and radio keyboard controls, Enter activation, inspection focus, Escape dismissal, and focus return are verified.
- Complete touch playthrough on emulated mobile, plus a genuine CDP touch-start / touch-move / touch-end lens drag. Every visible button and all object targets are checked at a minimum 44×44 CSS px, including compact Traditional Chinese navigation. Keyboard focus is retained when reordering cards and selecting scenes or theories.
- Blocked local storage keeps session play functional and displays a persistence notice. Corrupt/mismatched saved data, language/sound preferences, reset and schema handling are covered by unit tests.
- Three hint levels; sound toggle; reduced-motion media preference. During an actual running shutter test, reduced motion is checked to remove animation while retaining the written result.
- Axe WCAG 2 A/AA and 2.1 AA scans pass on scene, inspection, notebook, theory board and both-language revelations. These scans supplement keyboard tests; they are not a claim of exhaustive accessibility certification.
- Full language playthroughs require zero page exceptions, zero failed asset requests, and zero requests to other hosts. All artwork, styling, code, sound synthesis and text are local.

## Visual evidence and continuity

Twenty screenshots in `screenshots/` cover study, genuine lens, macro inspection, notebook and revelation, each in EN and zh-TW on desktop and mobile. Reveal screenshots capture the full panel sequence. The other captures use the fixed viewport.

See `VISUAL-POC-REVIEW.md` for the optical pipeline gate. The study has a separately composited door sprite with its background copy removed. A refined shared bolt source feeds the macro and room, retaining plate geometry, screw positions and scratch. The lens enlarges the actual background + sprite composite. Other inspections and comic panels reuse their original scene sources. The hallway's erroneous exterior bolt was corrected before release; the panel-only entry explanation and frosted-window continuity were also checked. The responder reveal depicts a removed access plate next to its opening.

The first browser run exposed an ambiguous test selector; the harness now selects the named dialog control. Subsequent browser runs found real initial-focus and touch-release lens issues; these were corrected and the affected tests rerun before the full release suite. Final results above supersede those failing development runs.

## Causal and content checks

E1–E8 and both tests gate the conclusion; E9 is optional. No visible wire is treated as weakened support, not proof of impossibility. The responder log uses the fire-safety access panel, never an exterior key. Edwin's medical determination is a professional report, not a diagnosis earned by inspecting the clock or reproducing environmental effects. No body, distress reenactment, gore, jump scare, external-lock trick or villain was introduced. The final answer requires separating causation from coincidental timing.

## Known limits / acceptance still needed

- **Not tested on physical phones or tablets.** No claim of measured ordinary-phone GPU/memory/thermal performance, touch comfort or readability under daylight. Emulation and a small asset budget reduce risk but do not replace device testing.
- **No independent first-time player test.** The intended 15–25 minute duration, clue fairness in practice, and satisfaction with the non-murder revelation remain unverified. The creator should play without reading the solution, then optionally test with family/players.
- **Safari / WebKit and Firefox are unrun.** The release qualification and CI target actual Chromium. Native dialog, pointer events and local storage are used with standard web APIs; cross-browser behavior is not asserted without testing.
- The experiments are short authored demonstrations, not a physics or optics simulation. Comic panels reuse source artwork with localized explanatory captions rather than fully animated reenactments. Cross-scene illustration is not a measured 3D set.
- The low-key palette is intentional. Inspection copy, macro views, optional area markers and an explicit object list provide alternatives to finding tiny marks in a dark panorama. Screen-reader wording and Traditional Chinese phrasing have not received independent human review.

## Deployment procedure

Push to `main` triggers `.github/workflows/pages.yml`: frozen install → unit tests → asset continuity → static build → browser tests → artifact → GitHub Pages → full browser tests against the hosted URL. Deploy depends on successful pre-deployment validation. Pages must use **GitHub Actions** as source, which was verified through the repository API before pushing. No secrets are shipped in the game. The existing platform Git/GitHub authentication is used for delivery.

The same browser suite can target the hosted release with:

```sh
GAME_TEST_URL=https://jaychtw.github.io/the-impossible-room/ npm run test:browser
```

That command uses the deployed project prefix, does not launch Vite, and retains the same assertions and same-host runtime request checks. The post-deployment job runs it on GitHub's runner and publishes `hosted-browser-evidence` separately from pre-deployment screenshots.

The first published release, commit `657d39a`, passed [hosted CI and Pages deployment](https://github.com/jaychtw/the-impossible-room/actions/runs/39790560287). A TLS-verified HTTP request confirmed the live document and its matching release bundle. Serving the production artifact locally under `/the-impossible-room/` also passed real-browser entry, inspection, evidence-recording and language-switch checks with zero failed requests.

Direct hosted-browser requests from this cloud machine initially failed with `ERR_CERT_AUTHORITY_INVALID` before loading the application (15 failed navigation attempts, one desktop-touch skip). The platform's existing CA was checked against Chromium's NSS trust database using the upstream documented process; verification was not disabled. The machine's browser trust issue remained, so post-deployment browser testing runs on GitHub's runner, whose normal HTTPS trust is independent of this cloud proxy. This failure is distinct from the passing local game tests and passing deployment.


## Hosted release evidence

[Run 39791693232](https://github.com/jaychtw/the-impossible-room/actions/runs/39791693232) completed successfully: pre-deployment validation, Pages deployment, and **Verify full case on the deployed site** all passed. The hosted browser-evidence artifact was uploaded successfully. Verified HTTPS downloads of all **21 production files** matched the tested local build byte-for-byte. The cloud proxy restricts downloads from GitHub's log-storage host, so hosted test outcomes were confirmed through job/step conclusions; the detailed artifact remains available through the Actions page.

A final accessibility patch enforces a 44×44 CSS px minimum for all buttons and preserves focus on scene/theory/reconstruction controls. Its six targeted desktop/mobile keyboard and 320px checks passed, followed by a fresh full local run: 15 passed, one intentional desktop-touch skip, in 54.7 s. Screenshots were refreshed from this final run. Physical-device and independent-player testing remain unperformed.
