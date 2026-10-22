import sharp from "sharp";
import assert from "node:assert/strict";
import { stat } from "node:fs/promises";
const files = [
  "study",
  "study-background",
  "door",
  "bolt",
  "hall",
  "exterior",
  "panel",
  "report",
  "hinge",
  "cover",
  "note",
  "clock",
  "ari-neutral",
  "ari-curious",
  "ari-realization",
  "mina-neutral",
  "mina-supportive",
];
let bytes = 0;
for (const name of files) {
  const p = `public/art/${name}.webp`,
    meta = await sharp(p).metadata();
  assert.ok(
    meta.width > 100 && meta.height > 100,
    `${name}: nontrivial dimensions`,
  );
  bytes += (await stat(p)).size;
}
const scene = await sharp("public/art/study.webp")
  .extract({ left: 470, top: 410, width: 90, height: 40 })
  .removeAlpha()
  .raw()
  .toBuffer();
const macro = await sharp("assets/source/bolt.png")
  .resize(250, 250)
  .extract({ left: 80, top: 95, width: 90, height: 40 })
  .removeAlpha()
  .raw()
  .toBuffer();
let error = 0;
for (let i = 0; i < scene.length; i++) error += Math.abs(scene[i] - macro[i]);
assert.ok(
  error / scene.length < 12,
  `Bolt scene/macro pixel discrepancy: ${error / scene.length}`,
);
const bg = await sharp("public/art/study-background.webp")
  .extract({ left: 250, top: 200, width: 250, height: 500 })
  .raw()
  .toBuffer();
let max = 0;
for (const p of bg) max = Math.max(p, max);
assert.ok(
  max < 40,
  "The door has been removed from the background, not doubled under the sprite.",
);
assert.ok(bytes < 3 * 1024 * 1024, "All production artwork stays below 3 MiB");
console.log(
  `${files.length} assets validated; bolt continuity mean error ${(error / scene.length).toFixed(2)}/255; ${(bytes / 1024 / 1024).toFixed(2)} MiB total.`,
);
