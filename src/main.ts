import "./style.css";
import { en, zh } from "./i18n";
import {
  objects,
  evidence,
  hypothesisTitles,
  hypothesisDescriptions,
  cards,
  revealPanels,
  type Text,
  type SceneId,
  type ObjectId,
} from "./content";
import {
  load,
  save,
  reduce,
  canReadReport,
  canReconstruct,
  reconstructionError,
  required,
  type Action,
  type Hypothesis,
  type StorageLike,
} from "./state";

const app = document.querySelector<HTMLDivElement>("#app")!;
let storage: StorageLike;
try {
  storage = window.localStorage;
} catch {
  storage = {
    getItem: () => null,
    setItem: () => {
      throw Error("blocked");
    },
  };
}
let state = load(storage),
  persistence = save(storage, state);
let scene: SceneId = "study",
  view: "investigation" | "theories" | "reconstruct" | "reveal" = state.solved
    ? "reveal"
    : "investigation";
let modal: string | null = null,
  showAreas = false,
  lensEnabled = true,
  lensMoved = false;
let focusReturn = "",
  feedback = "",
  experimentCondition = "still",
  experimentRunning = false;
let order = ["signs", "bolt", "medical"],
  matches = ["", "", ""],
  answer = "";
let soundContext: AudioContext | null = null,
  animationTimers: number[] = [];
const t = (key: keyof typeof en) => (state.language === "en" ? en : zh)[key];
const l = (s: Text) => s[state.language];
const esc = (s: string) =>
  s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
const art = (name: string) => `${import.meta.env.BASE_URL}art/${name}`;
function icon(name: string) {
  const shapes: Record<string, string> = {
    lens: '<circle cx="10" cy="10" r="6.5"/><path d="m15 15 6 6"/>',
    book: '<path d="M3 4h6l3 2 3-2h6v15h-6l-3 2-3-2H3zM12 6v15"/>',
    arrow: '<path d="M4 12h15m-5-5 5 5-5 5"/>',
    check: '<path d="m5 12 4 4L20 5"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
    sound: '<path d="M4 9h4l5-4v14l-5-4H4zM17 8q6 4 0 8"/>',
    mute: '<path d="M4 9h4l5-4v14l-5-4H4zM17 9l5 6m0-6-5 6"/>',
    spark: '<path d="m12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3z"/>',
    eye: '<path d="M2 12q10-14 20 0-10 14-20 0z"/><circle cx="12" cy="12" r="3"/>',
    reset: '<path d="M4 10a8 8 0 1 1 1 8M4 4v6h6"/>',
    up: '<path d="m6 15 6-6 6 6"/>',
    down: '<path d="m6 9 6 6 6-6"/>',
    lock: '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V6a4 4 0 0 1 8 0v4"/>',
  };
  return `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${shapes[name] || shapes.spark}</svg>`;
}
function button(label: string, action: string, cls = "button", extra = "") {
  return `<button class="${cls}" data-action="${action}" ${extra}>${label}</button>`;
}
function dispatch(action: Action) {
  const reportBefore = canReadReport(state);
  state = reduce(state, action);
  persistence = save(storage, state);
  if (!reportBefore && canReadReport(state)) announce(t("reportReady"));
}
function announce(message: string) {
  const live = document.querySelector("#live");
  if (live) live.textContent = message;
}
function activeCount() {
  return state.evidence.filter((id) => required.includes(id)).length;
}
function world() {
  if (scene === "study")
    return `<img class="bg-art" src="${art("study-background.webp")}" alt=""><img class="door-sprite" src="${art("door.webp")}" alt="">`;
  return `<img class="bg-art" src="${art(scene === "hall" ? "hall.webp" : "exterior.webp")}" alt="">`;
}
function sceneMarkup() {
  return `<div class="scene-frame"><div class="scene" id="scene" role="group" aria-label="${t(scene)}">
 <div class="world" aria-hidden="true">${world()}</div><div class="scene-shade" aria-hidden="true"></div>
 <div class="scene-heading"><span class="eyebrow">${t("place")}</span><span>${t(scene)}</span></div>
 ${Object.entries(objects)
   .filter(([, o]) => o.scene === scene)
   .map(
     ([id, o]) =>
       `<button id="object-${id}" class="hotspot ${showAreas ? "show-area" : ""} ${state.evidence.includes(o.id) ? "found" : ""}" style="left:${o.position[0]}%;top:${o.position[1]}%" data-action="object:${id}" aria-label="${l(o.label)}"><span>${l(o.label)}${state.evidence.includes(o.id) ? " ✓" : ""}</span></button>`,
   )
   .join("")}
 <div class="lens ${lensEnabled && lensMoved ? "visible" : ""}" id="lens" aria-hidden="true"><div class="lens-inner" id="lens-inner">${world()}</div><span class="lens-cross"></span><span class="lens-strength">1.8×</span></div>
 <div class="scene-bottom"><span class="scene-marker"></span><span>${t("sceneHelp")}</span><span class="scene-number">0${scene === "study" ? 1 : scene === "hall" ? 2 : 3} / 03</span></div>
 </div><div class="scene-toolbar">${button(icon("lens") + t("inspect"), "chooser", "button primary", 'id="inspect-button"')}${button(icon("lens") + `<span>${t(lensEnabled ? "lensOn" : "lensOff")}</span>`, "lens", "button subtle", `aria-pressed="${lensEnabled}"`)}${button(icon("eye") + `<span>${t(showAreas ? "hideAreas" : "areas")}</span>`, "areas", "button subtle", `aria-pressed="${showAreas}"`)}</div></div>`;
}
function notebookList() {
  return state.evidence.length
    ? `<div class="evidence-list">${state.evidence
        .map((id) => {
          const e = evidence[id];
          return `<article class="evidence-entry"><div class="evidence-heading"><span class="evidence-id">${id}</span><h3>${l(e.title)}</h3><span class="tag">${t(e.kind === "observed" ? "observation" : e.kind)}</span></div><h4>${t(e.kind === "observed" ? "observation" : e.kind)}</h4><p>${l(e.observation)}</p><h4>${t("possible")}</h4><p class="interpretation">${l(e.meaning)}</p></article>`;
        })
        .join("")}</div>`
    : `<div class="empty"><span class="empty-icon">${icon("book")}</span><h3>${t("emptyNotebook")}</h3><p>${t("emptyNotebookBody")}</p></div>`;
}
function sidePanel() {
  const objective = canReconstruct(state)
    ? "objectiveReady"
    : canReadReport(state) && !state.evidence.includes("E8")
      ? "objectiveReport"
      : state.evidence.includes("E4") || state.evidence.includes("E6")
        ? "objectiveTests"
        : "objectiveBody";
  return `<aside class="field-panel"><div class="field-header"><span class="eyebrow">${t("fieldNotes")}</span><span class="small-ornament">✦</span></div><div class="detective"><img src="${art(activeCount() >= 4 ? "ari-curious.webp" : "ari-neutral.webp")}" alt="${t("ari")}" class="portrait"><div><span class="eyebrow">${t("ari")}</span><span class="detective-role">${state.language === "en" ? "Investigator" : "調查員"}</span></div></div><h2>${t("lead")}</h2><p class="quote">${t("leadBody")}</p><div class="objective"><span class="eyebrow">${t("objective")}</span><p>${t(objective)}</p></div><div class="progress-header"><span class="eyebrow">${t("progress")}</span><span><b>${activeCount()}</b> / 8</span></div><div class="progress-bars" role="progressbar" aria-label="${t("progress")}" aria-valuenow="${activeCount()}" aria-valuemin="0" aria-valuemax="8">${required.map((id) => `<span class="${state.evidence.includes(id) ? "complete" : ""}"></span>`).join("")}</div>${button(icon("book") + t("notebook") + `<span class="count">${state.evidence.length}</span>`, "notebook", "button notebook-button", 'id="notebook-button"')}<div class="recent-evidence">${state.evidence
    .slice(-2)
    .reverse()
    .map(
      (id) =>
        `<span class="recent">${icon("check")}<span>${l(evidence[id].title)}</span></span>`,
    )
    .join(
      "",
    )}</div><div class="field-bottom">${button(icon("spark") + t("hint"), "hint", "button subtle")}${button(t("witness"), "witness", "text-button")}</div></aside>`;
}
function investigation() {
  return `<div class="investigation-layout"><section class="scene-column"><nav class="scene-tabs" aria-label="${t("investigate")}">${(["study", "hall", "exterior"] as SceneId[]).map((id, i) => button(`<span class="tab-number">0${i + 1}</span>${t(id)}`, `scene:${id}`, `scene-tab ${scene === id ? "active" : ""}`, `aria-current="${scene === id ? "page" : "false"}"`)).join("")}</nav>${sceneMarkup()}${scene === "exterior" ? `<div class="experiment-links">${button(icon("spark") + t("testShutter"), "experiment:shutter", "button outline")}${button(icon("eye") + t("testLight"), "experiment:light", "button outline")}</div>` : `<div class="scene-caption"><span>${icon("lens")}${t("welcome")}</span><span>${t("shortcut")}</span></div>`}</section>${sidePanel()}</div>`;
}
function theories() {
  return `<section class="board"><div class="section-heading"><span class="eyebrow">${t("theories")}</span><h2>${t("theoryIntro")}</h2><p>${t("theorySub")}</p></div><div class="theory-grid">${(["H1", "H2", "H3"] as Hypothesis[]).map((id, i) => `<article class="theory-card ${state.hypothesis === id ? "selected" : ""}"><span class="theory-number">0${i + 1}</span><h3>${l(hypothesisTitles[id])}</h3><p>${l(hypothesisDescriptions[id])}</p>${button((state.hypothesis === id ? icon("check") : "") + t(state.hypothesis === id ? "selected" : "choose"), `hypothesis:${id}`, `button ${state.hypothesis === id ? "primary" : "outline"}`, `aria-pressed="${state.hypothesis === id}"`)}</article>`).join("")}</div>${state.hypothesis ? `<div class="theory-feedback"><h3>${t("assess")}</h3><p>${t(state.hypothesis === "H1" ? "h1Feedback" : state.hypothesis === "H2" ? "h2Feedback" : canReconstruct(state) ? "h3Feedback" : "theoryMissing")}</p></div>` : ""}<div class="board-actions">${button(icon("arrow") + t("investigate"), "view:investigation", "button outline")}${button(t("reconstruct") + icon("arrow"), "view:reconstruct", "button primary")}</div></section>`;
}
function reconstruction() {
  if (!canReconstruct(state))
    return `<section class="locked-state">${icon("lock")}<h2>${t("gate")}</h2><p>${t("gateBody")}</p><div class="missing-list"><span class="eyebrow">${t("missing")}</span>${required
      .filter((id) => !state.evidence.includes(id))
      .map((id) => `<span><b>${id}</b> ${l(evidence[id].title)}</span>`)
      .join(
        "",
      )}</div>${button(t("investigate") + icon("arrow"), "view:investigation", "button primary")}</section>`;
  return `<section class="reconstruction"><div class="section-heading"><span class="eyebrow">${t("reconstruct")}</span><h2>${t("reconstructionTitle")}</h2><p>${t("reconstructionSub")}</p></div><div class="reconstruction-columns"><div><h3 class="step-heading">${t("orderLabel")}</h3><ol class="order-list">${order.map((id, i) => `<li><span class="order-index">${i + 1}</span><span>${l(cards[id as keyof typeof cards])}</span><div class="order-buttons">${button(icon("up"), `up:${i}`, "icon-button", `aria-label="${t("moveUp")}: ${l(cards[id as keyof typeof cards])}" ${i === 0 ? "disabled" : ""}`)}${button(icon("down"), `down:${i}`, "icon-button", `aria-label="${t("moveDown")}: ${l(cards[id as keyof typeof cards])}" ${i === 2 ? "disabled" : ""}`)}</div></li>`).join("")}</ol></div><div><h3 class="step-heading">${t("matchLabel")}</h3>${(["knocks", "figure", "entry"] as const).map((label, i) => `<label class="match-label" for="match-${i}">${t(label)}</label><select id="match-${i}" data-match="${i}"><option value="">${t("pick")}</option>${(["shutter", "cover", "panel", "intruder", "key", "ghost"] as const).map((id) => `<option value="${id}" ${matches[i] === id ? "selected" : ""}>${t(id)}</option>`).join("")}</select>`).join("")}</div></div><fieldset><legend class="step-heading">${t("questionLabel")}</legend><h3>${t("question")}</h3>${(["separate", "common", "haunting"] as const).map((id) => `<label class="radio-option"><input type="radio" name="answer" value="${id}" ${answer === id ? "checked" : ""}><span>${t(id)}</span></label>`).join("")}</fieldset><p class="feedback" role="status">${feedback}</p><div class="board-actions">${button(t("theories"), "view:theories", "button outline")}${button(t("submit") + icon("arrow"), "solve", "button primary", 'id="solve-button"')}</div></section>`;
}
function reveal() {
  return `<section class="revelation"><div class="reveal-intro"><span class="eyebrow">${icon("check")}${t("solved")}</span><h2>${t("revealTitle")}</h2><p>${t("revealSub")}</p></div><div class="comic-grid">${revealPanels.map((p) => `<article class="comic-panel"><div class="comic-art"><img src="${art(p.image)}" alt="" style="object-position:${p.position}" loading="lazy">${p.image === "hall.webp" ? `<span class="access-opening"></span><img class="removed-panel" src="${art("panel.webp")}" alt="">` : ""}</div><div class="comic-copy"><span class="eyebrow">${l(p.title)}</span><p>${l(p.body)}</p><span class="citation">${p.cite}</span></div></article>`).join("")}</div><div class="reflection"><img class="portrait" src="${art("ari-realization.webp")}" alt="${t("ari")}"><h3>${t("reflectionTitle")}</h3><p>${t("reflectionBody")}</p><ul><li>${t("observedSummary")}</li><li>${t("inferredSummary")}</li><li>${t("reportSummary")}</li></ul><div class="board-actions">${button(icon("book") + t("reviewNotebook"), "notebook", "button outline")}${button(icon("reset") + t("replay"), "reset", "button primary")}</div></div></section>`;
}
function modalContent() {
  if (!modal) return "";
  let content = "",
    wide = false;
  if (modal.startsWith("object:")) {
    const id = modal.slice(7) as ObjectId,
      o = objects[id],
      e = evidence[o.id];
    const locked = id === "report" && !canReadReport(state);
    wide = true;
    content = `<div class="inspection-art ${id === "clock" ? "clock-art" : ""}"><img src="${art(o.image)}" alt="${l(o.label)}">${id === "note" ? `<div class="paper-note"><p>${t("noteQuote")}</p><span>${t("noteBy")}</span></div>` : ""}${id === "clock" ? `<div class="battery-note"><span>${t("battery")}</span><strong>9:07</strong><p>${t("clockNote")}</p></div>` : ""}</div><div class="inspection-copy"><span class="eyebrow">${t("detail")} / ${o.id}</span><h2 id="dialog-title">${l(o.label)}</h2><p>${l(o.description)}</p>${id === "bolt" ? `<p class="detail-tip">${icon("lens")}${t("mark")}</p>` : ""}${id === "panel" ? `<blockquote>${t("responderLog")}</blockquote>` : ""}${locked ? `<p class="notice">${t("reportLocked")}</p>` : `<div class="observation-card"><span class="eyebrow">${t(e.kind === "observed" ? "observation" : e.kind)}</span><p>${l(e.observation)}</p></div>${state.evidence.includes(o.id) ? `<p class="recorded">${icon("check")}${t("recorded")}</p>` : button(t(id === "panel" ? "readLog" : "record") + icon("arrow"), `record:${o.id}`, "button primary", 'id="record-button"')}`}${button(t("back"), "close", "button subtle")}</div>`;
  } else if (modal === "chooser")
    content = `<span class="eyebrow">${t(scene)}</span><h2 id="dialog-title">${t("inspectTitle")}</h2><p>${t("inspectHelp")}</p><div class="object-list">${Object.entries(
      objects,
    )
      .filter(([, o]) => o.scene === scene)
      .map(([id, o]) =>
        button(
          `<span>${l(o.label)}${o.id === "E9" ? ` <small>(${t("optional")})</small>` : ""}</span>${icon(state.evidence.includes(o.id) ? "check" : "arrow")}`,
          `object:${id}`,
          "object-choice",
        ),
      )
      .join("")}</div>`;
  else if (modal === "notebook") {
    wide = true;
    content = `<div class="notebook-content"><span class="eyebrow">${t("caseNo")}</span><h2 id="dialog-title">${t("notebook")}</h2><p>${activeCount()} / 8 ${t("evidenceCount")}</p>${notebookList()}</div>`;
  } else if (modal === "intro")
    content = `<span class="eyebrow">${t("caseNo")} / ${t("place")}</span><h2 id="dialog-title">${t("introTitle")}</h2><div class="opening-panels"><img src="${art("study.webp")}" alt="${t("study")}"><p>${t("introText")}</p><p>${t("introSecond")}</p></div><blockquote>${t("introThird")}</blockquote>${button(t("enter") + icon("arrow"), "start", "button primary")}`;
  else if (modal === "tutorial")
    content = `${icon("lens")}<h2 id="dialog-title">${t("tutorialTitle")}</h2><p>${t("tutorialBody")}</p>${button(t("tutorialButton"), "close", "button primary")}`;
  else if (modal === "hint") {
    const key =
      state.hints <= 1
        ? "hint1"
        : state.hints === 2
          ? "hint2"
          : state.hints === 3
            ? "hint3"
            : "hintLater";
    content = `<div class="detective"><img class="portrait" src="${art("mina-supportive.webp")}" alt="${t("mina")}"><span class="eyebrow">${t("mina")}</span></div><h2 id="dialog-title">${t("hintTitle")}</h2><p class="hint-text">${t(key)}</p><p class="muted">${t("hintLevel")} ${Math.min(state.hints, 3)} / 3</p>${button(t("anotherHint"), "hint", "button outline")}`;
  } else if (modal === "witness")
    content = `<span class="eyebrow">${t("reported")}</span><h2 id="dialog-title">${t("witness")}</h2><p>${t("witnessBody")}</p>`;
  else if (modal === "reset")
    content = `${icon("reset")}<h2 id="dialog-title">${t("resetTitle")}</h2><p>${t("resetBody")}</p><div class="board-actions">${button(t("cancel"), "close", "button outline")}${button(t("confirmReset"), "confirm-reset", "button primary")}</div>`;
  else if (modal.startsWith("experiment:")) {
    const test = modal.slice(11),
      shutter = test === "shutter",
      ready = state.evidence.includes(shutter ? "E4" : "E6");
    wide = true;
    content = `<div class="experiment-visual ${shutter ? "shutter-visual" : "light-visual"} ${experimentRunning ? "running" : ""}" id="experiment-visual"><img class="experiment-base" src="${art(shutter ? "hinge.webp" : "exterior.webp")}" alt="${t(shutter ? "testShutter" : "testLight")}">${shutter ? `<img class="shutter-leaf" src="${art("hinge.webp")}" alt="">` : ""}<div class="headlight-sweep"></div><div class="silhouette"></div><div class="impact-pulse"></div></div><div class="inspection-copy"><span class="eyebrow">${t("experiment")}</span><h2 id="dialog-title">${t(shutter ? "shutterTitle" : "lightTitle")}</h2><p>${t(shutter ? "shutterBody" : "lightBody")}</p>${ready ? `<label for="condition">${t("condition")}</label><select id="condition" ${experimentRunning ? "disabled" : ""}><option value="${shutter ? "still" : "lamp"}" ${["still", "lamp"].includes(experimentCondition) ? "selected" : ""}>${t(shutter ? "still" : "lamp")}</option><option value="${shutter ? "gust" : "headlights"}" ${["gust", "headlights"].includes(experimentCondition) ? "selected" : ""}>${t(shutter ? "gust" : "headlights")}</option></select>${button(t("run") + icon("arrow"), "run-test", "button primary", `id="run-test" ${experimentRunning ? "disabled" : ""}`)}` : `<p class="notice">${t(shutter ? "testNeedsShutter" : "testNeedsCover")}</p>${button(t("inspect"), `object:${shutter ? "hinge" : "cover"}`, "button primary")}`}<p class="feedback" role="status">${feedback}</p><p class="fine-print">${t("repeatTest")} ${t("caption")}</p></div>`;
  }
  return `<dialog id="dialog" class="${wide ? "wide-dialog" : ""} ${modal.startsWith("object:") || modal.startsWith("experiment:") ? "split-dialog" : ""}" aria-labelledby="dialog-title"><div class="dialog-tools">${button(state.language === "en" ? "繁中" : "EN", "language", "button subtle compact", `aria-label="${t("language")}"`)}${button(icon("close"), "close", "icon-button", `aria-label="${t("close")}" id="dialog-close"`)}</div><div class="dialog-content">${content}</div></dialog>`;
}
function render() {
  const focused = document.activeElement?.id;
  document.documentElement.lang = state.language === "en" ? "en" : "zh-Hant";
  document.title = `${t("brand")} — ${t("caseTitle")}`;
  app.innerHTML = `<a class="skip-link" href="#main">${t("investigate")}</a><header class="site-header"><a class="brand" href="./" aria-label="${t("brand")}"><span class="brand-symbol">${icon("lens")}</span><span>${t("brand")}<small>${state.language === "en" ? "A GREYHAVEN MYSTERY" : "灰港鎮謎案"}</small></span></a><div class="header-controls"><span class="header-case">${t("caseNo")}</span>${button(icon(state.sound ? "sound" : "mute"), "sound", "icon-button", `id="sound-button" aria-label="${t(state.sound ? "soundOn" : "soundOff")}" aria-pressed="${state.sound}"`)}${button(`<span class="language-en ${state.language === "en" ? "chosen" : ""}">EN</span><span class="lang-divider">/</span><span class="${state.language === "zh" ? "chosen" : ""}">繁中</span>`, "language", "language-button", `id="language-button" aria-label="${t("language")}"`)}</div></header><main id="main" tabindex="-1"><div class="case-heading"><div><div class="eyebrow case-eyebrow"><span class="tiny-line"></span>${t("caseNo")}<span class="status-dot"></span>${state.solved ? t("solved") : state.language === "en" ? "INVESTIGATION OPEN" : "調查進行中"}</div><h1>${t("caseTitle")}</h1><p>${t("tagline")}</p></div>${!state.started ? button(t("begin") + icon("arrow"), "intro", "button primary start-button") : ""}</div><nav class="main-tabs" aria-label="${t("menu")}">${(["investigation", "theories", "reconstruct"] as const).map((id, i) => button(`<span class="main-tab-number">0${i + 1}</span>${t(id === "investigation" ? "investigate" : id)}${id === "reconstruct" && !canReconstruct(state) ? icon("lock") : ""}`, `view:${id}`, `main-tab ${view === id ? "active" : ""}`, `aria-current="${view === id ? "page" : "false"}"`)).join("")}${state.solved ? button(icon("check") + t("solved"), "view:reveal", `main-tab ${view === "reveal" ? "active" : ""}`) : ""}</nav>${view === "investigation" ? investigation() : view === "theories" ? theories() : view === "reconstruct" ? reconstruction() : reveal()}</main><footer><span>${t("footer")}</span><div><span class="save-status ${persistence ? "" : "storage-warning"}">${persistence ? "◦" : "!"} ${t(persistence ? "saved" : "unsaved")}</span>${button(icon("reset") + t("reset"), "reset", "text-button")}</div></footer><div id="live" class="sr-only" role="status" aria-live="polite"></div>${modalContent()}`;
  if (modal) {
    const dialog = document.querySelector<HTMLDialogElement>("#dialog")!;
    dialog.showModal();
    dialog.addEventListener("cancel", (e) => {
      e.preventDefault();
      closeModal();
    });
    dialog.addEventListener("click", (e) => {
      if (e.target === dialog) {
        const b = dialog.getBoundingClientRect();
        if (
          e.clientX < b.left ||
          e.clientX > b.right ||
          e.clientY < b.top ||
          e.clientY > b.bottom
        )
          closeModal();
      }
    });
    if (
      focused &&
      document.getElementById(focused) &&
      dialog.contains(document.getElementById(focused))
    )
      document.getElementById(focused)?.focus();
    else
      (
        dialog.querySelector<HTMLElement>("#record-button") ||
        dialog.querySelector<HTMLElement>("#condition") ||
        dialog.querySelector<HTMLElement>(".object-choice") ||
        dialog.querySelector<HTMLElement>(".dialog-content button") ||
        dialog.querySelector<HTMLElement>("#dialog-close")
      )?.focus();
  } else if (focused)
    document.getElementById(focused)?.focus({ preventScroll: true });
  bindLens();
}
function openModal(name: string) {
  if (!modal) focusReturn = document.activeElement?.id || "inspect-button";
  modal = name;
  feedback = "";
  render();
}
function closeModal() {
  animationTimers.forEach(clearTimeout);
  animationTimers = [];
  experimentRunning = false;
  modal = null;
  feedback = "";
  render();
  document.getElementById(focusReturn)?.focus({ preventScroll: true });
}
function bindLens() {
  const stage = document.querySelector<HTMLElement>("#scene"),
    lens = document.querySelector<HTMLElement>("#lens"),
    inner = document.querySelector<HTMLElement>("#lens-inner");
  if (!stage || !lens || !inner) return;
  const move = (clientX: number, clientY: number, touch = false) => {
    if (!lensEnabled) return;
    const box = stage.getBoundingClientRect(),
      size = window.innerWidth < 600 ? 116 : 148,
      r = size / 2;
    const x = Math.max(
        r / 1.8,
        Math.min(box.width - r / 1.8, clientX - box.left),
      ),
      y = Math.max(
        r / 1.8,
        Math.min(box.height - r / 1.8, clientY - box.top - (touch ? 48 : 0)),
      );
    lensMoved = true;
    lens.classList.add("visible");
    lens.style.left = `${x}px`;
    lens.style.top = `${y}px`;
    inner.style.width = `${box.width}px`;
    inner.style.height = `${box.height}px`;
    inner.style.transform = `translate(${r - 1.8 * x}px,${r - 1.8 * y}px) scale(1.8)`;
  };
  stage.addEventListener("pointermove", (e) =>
    move(e.clientX, e.clientY, e.pointerType === "touch"),
  );
  stage.addEventListener("pointerdown", (e) => {
    if (e.target instanceof Element && e.target.closest("button")) return;
    if (lensEnabled) {
      stage.setPointerCapture(e.pointerId);
      move(e.clientX, e.clientY, e.pointerType === "touch");
    }
  });
  stage.addEventListener("pointerleave", (e) => {
    if (e.pointerType === "mouse" && !stage.hasPointerCapture(e.pointerId))
      lens.classList.remove("visible");
  });
  if (lensMoved) {
    const box = stage.getBoundingClientRect();
    move(box.left + box.width * 0.315, box.top + box.height * 0.46);
  }
}
function playKnock(delay: number) {
  if (!state.sound) return;
  try {
    soundContext ??= new AudioContext();
    void soundContext.resume();
    const osc = soundContext.createOscillator(),
      gain = soundContext.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(155, soundContext.currentTime + delay);
    osc.frequency.exponentialRampToValueAtTime(
      55,
      soundContext.currentTime + delay + 0.08,
    );
    gain.gain.setValueAtTime(0.0001, soundContext.currentTime + delay);
    gain.gain.exponentialRampToValueAtTime(
      0.32,
      soundContext.currentTime + delay + 0.005,
    );
    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      soundContext.currentTime + delay + 0.13,
    );
    osc.connect(gain);
    gain.connect(soundContext.destination);
    osc.start(soundContext.currentTime + delay);
    osc.stop(soundContext.currentTime + delay + 0.15);
  } catch {
    /* Captions are always available. */
  }
}
function runTest() {
  if (!modal?.startsWith("experiment:") || experimentRunning) return;
  const id = modal.slice(11) as "shutter" | "light",
    correct =
      id === "shutter"
        ? experimentCondition === "gust"
        : experimentCondition === "headlights";
  if (!correct) {
    feedback = t(id === "shutter" ? "testFailShutter" : "testFailLight");
    render();
    return;
  }
  const condition = experimentCondition;
  experimentRunning = true;
  feedback = "";
  render();
  if (id === "shutter") [0, 0.65, 1.3].forEach(playKnock);
  const currentModal = modal;
  animationTimers.push(
    window.setTimeout(() => {
      if (modal !== currentModal) return;
      experimentRunning = false;
      dispatch({ type: "TEST", id, condition });
      feedback = t(
        id === "shutter" ? "testSuccessShutter" : "testSuccessLight",
      );
      render();
    }, 2200),
  );
}
app.addEventListener("click", (e) => {
  const target = (e.target as Element).closest<HTMLButtonElement>(
    "[data-action]",
  );
  if (!target || target.disabled) return;
  const action = target.dataset.action!;
  if (action === "language") {
    dispatch({
      type: "LANGUAGE",
      language: state.language === "en" ? "zh" : "en",
    });
    feedback = "";
    render();
    return;
  }
  if (action === "sound") {
    dispatch({ type: "SOUND" });
    render();
    return;
  }
  if (action === "close") {
    closeModal();
    return;
  }
  if (action === "intro") {
    openModal("intro");
    return;
  }
  if (action === "start") {
    dispatch({ type: "START" });
    modal = "tutorial";
    render();
    return;
  }
  if (action === "hint") {
    dispatch({ type: "HINT" });
    openModal("hint");
    return;
  }
  if (["notebook", "chooser", "reset", "witness"].includes(action)) {
    openModal(action);
    return;
  }
  if (action === "confirm-reset") {
    dispatch({ type: "RESET" });
    scene = "study";
    view = "investigation";
    order = ["signs", "bolt", "medical"];
    matches = ["", "", ""];
    answer = "";
    lensMoved = false;
    closeModal();
    return;
  }
  if (action === "lens") {
    lensEnabled = !lensEnabled;
    lensMoved = lensEnabled;
    render();
    return;
  }
  if (action === "areas") {
    showAreas = !showAreas;
    render();
    return;
  }
  if (action.startsWith("object:")) {
    if (!state.started) dispatch({ type: "START" });
    openModal(action);
    return;
  }
  if (action.startsWith("record:")) {
    const id = action.slice(7) as keyof typeof evidence;
    dispatch({ type: "OBSERVE", id });
    closeModal();
    announce(t("evidenceToast"));
    return;
  }
  if (action.startsWith("scene:")) {
    scene = action.slice(6) as SceneId;
    lensMoved = false;
    render();
    return;
  }
  if (action.startsWith("view:")) {
    view = action.slice(5) as typeof view;
    feedback = "";
    render();
    document
      .querySelector<HTMLElement>("#main")
      ?.focus({ preventScroll: true });
    return;
  }
  if (action.startsWith("hypothesis:")) {
    dispatch({ type: "HYPOTHESIS", id: action.slice(11) as Hypothesis });
    render();
    return;
  }
  if (action.startsWith("experiment:")) {
    experimentCondition = action.endsWith("shutter") ? "still" : "lamp";
    openModal(action);
    return;
  }
  if (action === "run-test") {
    runTest();
    return;
  }
  if (action.startsWith("up:") || action.startsWith("down:")) {
    const i = Number(action.split(":")[1]),
      j = i + (action.startsWith("up") ? -1 : 1);
    if (j >= 0 && j < 3) [order[i], order[j]] = [order[j], order[i]];
    render();
    return;
  }
  if (action === "solve") {
    const error = reconstructionError(order, matches, answer);
    feedback = error
      ? t(
          (
            {
              order: "errorOrder",
              knock: "errorKnock",
              figure: "errorFigure",
              entry: "errorEntry",
              cause: "errorCause",
            } as const
          )[error],
        )
      : state.hypothesis !== "H3"
        ? t("chooseH3")
        : "";
    dispatch({ type: "SOLVE", order, matches, answer });
    if (state.solved) {
      view = "reveal";
      window.scrollTo({ top: 0, behavior: "instant" });
    }
    render();
    return;
  }
});
app.addEventListener("change", (e) => {
  const target = e.target as HTMLSelectElement | HTMLInputElement;
  if (target.id === "condition") experimentCondition = target.value;
  if (target.dataset.match)
    matches[Number(target.dataset.match)] = target.value;
  if (target instanceof HTMLInputElement && target.name === "answer")
    answer = target.value;
});
render();
