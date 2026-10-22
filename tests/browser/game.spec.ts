import { test, expect, type Page, type TestInfo } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs/promises";
const action = (page: Page, id: string) =>
  id === "close"
    ? page.locator("#dialog-close")
    : id === "hint"
      ? page.locator('[data-action="hint"]').last()
      : page.locator(`[data-action="${id}"]`);
async function screenshot(
  page: Page,
  info: TestInfo,
  name: string,
  lang: string,
) {
  await page.evaluate(async () => {
    await Promise.all(
      [...document.images].map((i) => i.decode().catch(() => {})),
    );
  });
  await fs.mkdir("docs/screenshots", { recursive: true });
  await page.screenshot({
    path: `docs/screenshots/${name}-${lang}-${info.project.name}.jpg`,
    type: "jpeg",
    quality: 84,
    scale: "css",
    fullPage: name === "revelation",
  });
}
async function start(page: Page) {
  await page.goto("./");
  await action(page, "intro").click();
  await action(page, "start").click();
  await action(page, "close").click();
}
async function inspect(page: Page, id: string) {
  await action(page, "chooser").click();
  await page.locator(`#dialog [data-action="object:${id}"]`).click();
}
async function record(page: Page, id: string, evidence: string) {
  await inspect(page, id);
  await action(page, `record:${evidence}`).click();
  await expect(page.locator("#dialog")).toHaveCount(0);
}
async function experiment(page: Page, id: string, condition: string) {
  await action(page, `experiment:${id}`).click();
  await page.locator("#condition").selectOption(condition);
  await action(page, "run-test").click();
  await expect(action(page, "run-test")).toBeEnabled();
  await expect(page.locator("#dialog .feedback")).toContainText(
    id === "shutter" ? /KNOCK|叩/ : /pale outline|蒼白輪廓/,
  );
  await action(page, "close").click();
}
async function readProgress(page: Page) {
  return page.evaluate(() =>
    JSON.parse(localStorage.getItem("impossible-room:v1")!),
  );
}
for (const lang of ["en", "zh"]) {
  test(`complete authored case in ${lang}`, async ({ page }, info) => {
    const errors: string[] = [],
      external: string[] = [],
      failures: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("request", (r) => {
      if (
        new URL(r.url()).host !==
        new URL(info.project.use.baseURL || "http://127.0.0.1:5173").host
      )
        external.push(r.url());
    });
    page.on("response", (r) => {
      if (r.status() >= 400) failures.push(`${r.status()} ${r.url()}`);
    });
    await start(page);
    if (lang === "zh") await action(page, "language").click();
    await expect(page.locator("html")).toHaveAttribute(
      "lang",
      lang === "en" ? "en" : "zh-Hant",
    );
    await screenshot(page, info, "study", lang);
    const box = (await page.locator("#scene").boundingBox())!;
    await page.mouse.move(box.x + box.width * 0.315, box.y + box.height * 0.46);
    await expect(page.locator("#lens")).toHaveClass(/visible/);
    await expect(page.locator("#lens-inner")).toHaveCSS(
      "transform",
      /matrix\(1.8/,
    );
    expect((await readProgress(page)).evidence).toHaveLength(0);
    await screenshot(page, info, "lens", lang);
    await inspect(page, "bolt");
    await screenshot(page, info, "macro", lang);
    await action(page, "record:E1").click();
    await record(page, "note", "E2");
    await record(page, "clock", "E9");
    await action(page, "scene:hall").click();
    await inspect(page, "report");
    await expect(action(page, "record:E8")).toHaveCount(0);
    await action(page, "close").click();
    await record(page, "panel", "E3");
    await action(page, "view:reconstruct").click();
    await expect(page.locator(".locked-state")).toBeVisible();
    await action(page, "view:theories").first().click();
    await action(page, "hypothesis:H1").click();
    await expect(page.locator(".theory-feedback")).toContainText(
      /actuator|致動/,
    );
    await action(page, "hypothesis:H2").click();
    await expect(page.locator(".theory-feedback")).toContainText(
      /reproduced|重現/,
    );
    await action(page, "view:investigation").first().click();
    await action(page, "scene:exterior").click();
    await action(page, "experiment:shutter").click();
    await expect(page.locator("#condition")).toHaveCount(0);
    await action(page, "close").click();
    await record(page, "hinge", "E4");
    await record(page, "cover", "E6");
    await action(page, "experiment:shutter").click();
    await action(page, "run-test").click();
    await expect(page.locator("#dialog .feedback")).toContainText(
      /Still air|無風/,
    );
    await action(page, "close").click();
    await experiment(page, "shutter", "gust");
    await action(page, "experiment:light").click();
    await action(page, "run-test").click();
    await expect(page.locator("#dialog .feedback")).toContainText(
      /steady|穩定/,
    );
    await action(page, "close").click();
    await experiment(page, "light", "headlights");
    await action(page, "scene:hall").click();
    await record(page, "report", "E8");
    expect((await readProgress(page)).evidence).toHaveLength(9);
    await action(page, "notebook").click();
    await expect(page.locator(".evidence-entry")).toHaveCount(9);
    await screenshot(page, info, "notebook", lang);
    await action(page, "close").click();
    const before = await readProgress(page);
    await page.locator("#language-button").click();
    await page.locator("#language-button").click();
    expect((await readProgress(page)).evidence).toEqual(before.evidence);
    await action(page, "view:theories").first().click();
    await action(page, "hypothesis:H3").click();
    await action(page, "view:reconstruct").first().click();
    await action(page, "solve").click();
    await expect(page.locator(".feedback")).toContainText(/sequence|順序/);
    await action(page, "down:0").click();
    await action(page, "down:1").click();
    await page.locator("#match-0").selectOption("shutter");
    await page.locator("#match-1").selectOption("cover");
    await page.locator("#match-2").selectOption("key");
    await page.locator('input[value="separate"]').check();
    await action(page, "solve").click();
    await expect(page.locator(".feedback")).toContainText(
      /exterior key|外側鑰匙/,
    );
    await page.locator("#match-2").selectOption("panel");
    await page.locator('input[value="common"]').check();
    await action(page, "solve").click();
    await expect(page.locator(".feedback")).toContainText(/medical|醫療/);
    await page.locator('input[value="separate"]').check();
    await action(page, "solve").click();
    await expect(page.locator(".revelation")).toBeVisible();
    await expect(page.locator(".comic-panel")).toHaveCount(6);
    expect((await readProgress(page)).solved).toBe(true);
    await screenshot(page, info, "revelation", lang);
    const accessibility = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(accessibility.violations).toEqual([]);
    await page.reload();
    await expect(page.locator(".revelation")).toBeVisible();
    await action(page, "reset").first().click();
    await action(page, "confirm-reset").click();
    expect((await readProgress(page)).evidence).toHaveLength(0);
    expect((await readProgress(page)).solved).toBe(false);
    await expect(action(page, "intro")).toBeVisible();
    expect(errors).toEqual([]);
    expect(external).toEqual([]);
    expect(failures).toEqual([]);
  });
}
test("keyboard inspection, focus restoration and modal dismissal", async ({
  page,
}) => {
  await start(page);
  await page.locator("#inspect-button").focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#dialog")).toBeVisible();
  await page.keyboard.press("Enter");
  await expect(page.locator("#record-button")).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#inspect-button")).toBeFocused();
  expect((await readProgress(page)).evidence).toEqual(["E1"]);
  await page.keyboard.press("Enter");
  await page.keyboard.press("Escape");
  await expect(page.locator("#inspect-button")).toBeFocused();
  await page.locator("#object-note").focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#record-button")).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.locator("#object-note")).toBeFocused();
});
test("320px layout, bilingual dialogs and interactive target sizes", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await start(page);
  for (const lang of ["en", "zh"]) {
    if (lang === "zh") await page.locator("#language-button").click();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    for (const id of ["bolt", "note", "clock"]) {
      const box = (await page.locator(`#object-${id}`).boundingBox())!;
      expect(box.width).toBeGreaterThanOrEqual(44);
      expect(box.height).toBeGreaterThanOrEqual(44);
    }
    await inspect(page, "bolt");
    expect(
      await page.evaluate(
        () =>
          document.querySelector("dialog")!.scrollWidth <=
          document.querySelector("dialog")!.clientWidth,
      ),
    ).toBe(true);
    await action(page, "close").click();
    await action(page, "notebook").click();
    expect(
      await page.evaluate(
        () =>
          document.querySelector("dialog")!.scrollWidth <=
          document.querySelector("dialog")!.clientWidth,
      ),
    ).toBe(true);
    await action(page, "close").click();
  }
});
test("accessibility in scene, object inspection, notebook and theory board", async ({
  page,
}) => {
  await start(page);
  for (const view of ["scene", "object", "notebook", "theory"]) {
    if (view === "object") await inspect(page, "bolt");
    if (view === "notebook") {
      await action(page, "close").click();
      await action(page, "notebook").click();
    }
    if (view === "theory") {
      await action(page, "close").click();
      await action(page, "view:theories").first().click();
    }
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(
      results.violations,
      JSON.stringify(results.violations, null, 2),
    ).toEqual([]);
  }
});
test("blocked local storage, hints, sound, reduced motion and touch", async ({
  page,
  context,
}, info) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new Error("blocked");
      },
    });
  });
  await start(page);
  await expect(page.locator(".storage-warning")).toBeVisible();
  await record(page, "bolt", "E1");
  await expect(page.locator(".progress-header")).toContainText("1");
  await action(page, "hint").click();
  await expect(page.locator("#dialog")).toContainText("Hint level 1");
  await action(page, "hint").click();
  await expect(page.locator("#dialog")).toContainText("Hint level 2");
  await action(page, "hint").click();
  await expect(page.locator("#dialog")).toContainText("Hint level 3");
  await action(page, "close").click();
  await action(page, "sound").click();
  await expect(action(page, "sound")).toHaveAttribute("aria-pressed", "true");
  await page.emulateMedia({ reducedMotion: "reduce" });
  expect(
    await page.evaluate(
      () => matchMedia("(prefers-reduced-motion: reduce)").matches,
    ),
  ).toBe(true);
  await action(page, "scene:exterior").click();
  await record(page, "hinge", "E4");
  await action(page, "experiment:shutter").click();
  await page.locator("#condition").selectOption("gust");
  await action(page, "run-test").click();
  await expect(page.locator(".impact-pulse")).toHaveCSS(
    "animation-name",
    "none",
  );
  await expect(action(page, "run-test")).toBeEnabled();
  await expect(page.locator("#dialog .feedback")).toContainText("KNOCK");
  await action(page, "close").click();
  await action(page, "scene:study").click();
  if (info.project.name === "mobile") {
    await page.locator("#scene").scrollIntoViewIfNeeded();
    const box = (await page.locator("#scene").boundingBox())!,
      cdp = await context.newCDPSession(page);
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [
        { x: box.x + box.width * 0.5, y: box.y + box.height * 0.5 },
      ],
    });
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [
        { x: box.x + box.width * 0.6, y: box.y + box.height * 0.6 },
      ],
    });
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
    await expect(page.locator("#lens")).toHaveClass(/visible/);
  }
});

for (const mode of ["keyboard", "touch"] as const) {
  test(`complete case with ${mode} controls`, async ({ page }, info) => {
    test.skip(
      mode === "touch" && info.project.name !== "mobile",
      "Touch is exercised on the mobile touch-capable context.",
    );
    await page.goto("./");
    const activate = async (id: string, inside = false) => {
      const node = inside
        ? page.locator(`#dialog [data-action="${id}"]`)
        : action(page, id).first();
      if (mode === "touch") await node.tap();
      else await node.press("Enter");
    };
    const observe = async (id: string, e: string) => {
      await activate("chooser");
      await activate(`object:${id}`, true);
      await activate(`record:${e}`);
    };
    await activate("intro");
    await activate("start");
    await activate("close");
    await observe("bolt", "E1");
    await observe("note", "E2");
    await activate("scene:hall");
    await observe("panel", "E3");
    await activate("scene:exterior");
    await observe("hinge", "E4");
    await observe("cover", "E6");
    for (const id of ["shutter", "light"]) {
      await activate(`experiment:${id}`);
      if (mode === "keyboard") {
        await page.locator("#condition").focus();
        await page.keyboard.press("End");
        await page.keyboard.press("Enter");
      } else
        await page
          .locator("#condition")
          .selectOption(id === "shutter" ? "gust" : "headlights");
      await activate("run-test");
      await expect(action(page, "run-test")).toBeEnabled();
      await expect(page.locator("#dialog .feedback")).not.toBeEmpty();
      await activate("close");
    }
    await activate("scene:hall");
    await observe("report", "E8");
    await activate("view:theories");
    await activate("hypothesis:H3");
    await activate("view:reconstruct");
    await activate("down:0");
    await activate("down:1");
    for (let i = 0; i < 3; i++) {
      const select = page.locator(`#match-${i}`);
      if (mode === "keyboard") {
        await select.focus();
        await page.keyboard.press("Home");
        for (let step = 0; step <= i; step++)
          await page.keyboard.press("ArrowDown");
        await page.keyboard.press("Enter");
      } else await select.selectOption(["shutter", "cover", "panel"][i]);
    }
    if (mode === "keyboard")
      await page.locator('input[value="separate"]').press("Space");
    else await page.locator('input[value="separate"]').tap();
    await activate("solve");
    await expect(page.locator(".revelation")).toBeVisible();
    expect((await readProgress(page)).solved).toBe(true);
  });
}
