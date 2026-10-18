// Gentle, deterministic photo enhancement for the supplied sneaker photographs.
// Originals live in assets/originals (never modified). Output: public/images/shoes/shoe-XX.webp
// Processing: Lanczos3 upscale (max 2x, long edge <= 2000px), light exposure correction based on
// measured luminance, slight contrast/saturation lift, and mild unsharp mask. No generative steps:
// the shoes are exactly the ones in the photographs.
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const src = "assets/originals";
const out = "public/images/shoes";
fs.mkdirSync(out, { recursive: true });
const meta = {};

for (const file of fs.readdirSync(src).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)).sort()) {
  const id = path.parse(file).name;
  const input = sharp(path.join(src, file)).rotate();
  const info = await input.metadata();
  const stats = await input.clone().greyscale().stats();
  const mean = stats.channels[0].mean; // 0-255
  const long = Math.max(info.width, info.height);
  const scale = Math.min(2, 2000 / long);
  const w = Math.round(info.width * scale);
  const h = Math.round(info.height * scale);

  // Exposure: lift dark frames slightly, tame very bright ones. Capped so the look stays natural.
  const brightness = mean < 95 ? 1.08 : mean < 120 ? 1.04 : mean > 205 ? 0.97 : 1.0;

  const base = input
    .clone()
    .resize(w, h, { kernel: "lanczos3" })
    .modulate({ brightness, saturation: 1.05 })
    .linear(1.03, -2)
    .sharpen({ sigma: 0.9, m1: 0.7, m2: 1.8 });

  await base.clone().webp({ quality: 90, effort: 5 }).toFile(path.join(out, `${id}.webp`));
  const blur = await base.clone().resize(16).webp({ quality: 40 }).toBuffer();
  meta[id] = {
    width: w,
    height: h,
    source: `${info.width}x${info.height}`,
    blurDataURL: `data:image/webp;base64,${blur.toString("base64")}`,
  };
  console.log(`${id}: ${info.width}x${info.height} -> ${w}x${h} (mean ${mean.toFixed(0)}, brightness ${brightness})`);
}

fs.writeFileSync("data/image-meta.json", JSON.stringify(meta, null, 2));
