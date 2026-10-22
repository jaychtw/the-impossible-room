// All close-ups and scene sprites are derived from these shared compositions.
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
const source = "assets/source/",
  out = "public/art/";
await mkdir(out, { recursive: true });
const macro = source + "bolt.png";
await sharp(macro)
  .webp({ quality: 92 })
  .toFile(out + "bolt.webp");
// Feather only the boundary of the macro patch. The entire brass assembly is opaque.
const patch = await sharp(macro)
  .resize(250, 250)
  .ensureAlpha()
  .raw()
  .toBuffer();
for (let y = 0; y < 250; y++)
  for (let x = 0; x < 250; x++)
    patch[(y * 250 + x) * 4 + 3] = Math.round(
      255 * Math.min(1, Math.min(x, y, 249 - x, 249 - y) / 22),
    );
const patchPng = await sharp(patch, {
  raw: { width: 250, height: 250, channels: 4 },
})
  .png()
  .toBuffer();
const study = await sharp(source + "study.png")
  .resize(1672, 941)
  .composite([{ input: patchPng, left: 390, top: 315 }])
  .png()
  .toBuffer();
await sharp(study)
  .webp({ quality: 88 })
  .toFile(out + "study.webp");
await sharp(study)
  .extract({ left: 200, top: 40, width: 425, height: 770 })
  .webp({ quality: 90 })
  .toFile(out + "door.webp");
const blank = Buffer.from(
  '<svg width="425" height="770"><rect width="425" height="770" fill="#191410"/></svg>',
);
await sharp(study)
  .composite([{ input: blank, left: 200, top: 40 }])
  .webp({ quality: 88 })
  .toFile(out + "study-background.webp");
const crops = {
  note: [study, 1190, 590, 410, 200],
  clock: [study, 630, 50, 235, 730],
  panel: [source + "hall.png", 1005, 285, 140, 260],
  report: [source + "hall.png", 1170, 550, 500, 230],
  hinge: [source + "exterior.png", 180, 265, 295, 530],
  cover: [source + "exterior.png", 1100, 40, 480, 770],
};
for (const [name, [input, left, top, width, height]] of Object.entries(crops))
  await sharp(input)
    .extract({ left, top, width, height })
    .webp({ quality: 92 })
    .toFile(out + name + ".webp");
for (const name of ["hall", "exterior"])
  await sharp(source + name + ".png")
    .resize(1672, 941)
    .webp({ quality: 87 })
    .toFile(out + name + ".webp");
const meta = await sharp(source + "portraits.png").metadata(),
  w = Math.floor(meta.width / 5);
for (const [i, name] of [
  "ari-neutral",
  "ari-curious",
  "ari-realization",
  "mina-neutral",
  "mina-supportive",
].entries())
  await sharp(source + "portraits.png")
    .extract({ left: i * w, top: 0, width: w, height: meta.height })
    .resize(340)
    .webp({ quality: 85 })
    .toFile(out + name + ".webp");
console.log(
  "Built shared scene composites, sprites, close-ups and five character portraits.",
);
