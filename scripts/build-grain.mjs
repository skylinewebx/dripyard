// Generates the small film-grain tile used by .grain (pre-rendered noise: no SVG filter evaluation at paint time).
import sharp from "sharp";
const size = 160;
const buf = Buffer.alloc(size * size);
let seed = 20240607;
for (let i = 0; i < buf.length; i++) {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  buf[i] = 128 + (((seed >>> 16) & 255) - 128) * 0.9;
}
await sharp(buf, { raw: { width: size, height: size, channels: 1 } }).png({ compressionLevel: 9 }).toFile("public/images/grain.png");
console.log("grain.png written");
