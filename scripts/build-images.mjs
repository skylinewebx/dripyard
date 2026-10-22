// Product photo pipeline. Originals live in assets/originals (never modified).
//
// Rules: keep the photographs exactly as shot. No upscaling (a low-resolution photo is never
// enlarged to look bigger), no sharpening, no colour or exposure changes. Each photo is only
// re-encoded as high-quality WebP at its native size, plus smaller downscaled variants so phones
// and grid cards download what they actually display.
//   shoe-XX.webp          native resolution (q92)
//   shoe-XX-480.webp      downscaled variants, emitted only when smaller than native
//   shoe-XX-800.webp
//   shoe-XX-1200.webp
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const src = "assets/originals";
// Studio renders (maroon backdrop, shoe pixels untouched) are used only where the cut-out is clean;
// every other product keeps its original photograph.
const studioDir = "assets/studio";
const STUDIO = new Set([]); // studio renders disabled: all products use their original photographs
const out = "public/images/shoes";
const VARIANTS = [480, 800, 1200];
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

const WEBP = { quality: 92, effort: 6, smartSubsample: true };
const meta = {};
const variants = {};

for (const file of fs.readdirSync(src).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)).sort()) {
  const id = path.parse(file).name;
  const studioFile = path.join(studioDir, `${id}.webp`);
  const input = STUDIO.has(id) && fs.existsSync(studioFile) ? sharp(studioFile) : sharp(path.join(src, file)).rotate();
  const info = await input.metadata();
  await input.clone().webp(WEBP).toFile(path.join(out, `${id}.webp`));

  const widths = [];
  for (const w of VARIANTS) {
    if (w < info.width) {
      await input.clone().resize({ width: w, kernel: "lanczos3" }).webp(WEBP).toFile(path.join(out, `${id}-${w}.webp`));
      widths.push(w);
    }
  }
  widths.push(info.width);
  variants[id] = widths;
  meta[id] = { width: info.width, height: info.height };
  console.log(`${id}: native ${info.width}x${info.height}, variants ${widths.join("/")}`);
}

fs.writeFileSync("data/image-meta.json", JSON.stringify(meta, null, 2));
fs.writeFileSync("data/image-variants.json", JSON.stringify(variants));
