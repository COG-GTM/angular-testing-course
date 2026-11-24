// Composes baseline (left) and upgraded (right) screenshots side by side with a pixel-diff %
// and writes report/side-by-side/*.png plus report/diff.json.
import fs from 'node:fs';
import path from 'node:path';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

const root = path.dirname(new URL(import.meta.url).pathname);
const shots = path.join(root, 'report', 'shots');
const out = path.join(root, 'report', 'side-by-side');
fs.mkdirSync(out, { recursive: true });

const read = (p) => PNG.sync.read(fs.readFileSync(p));
const pad = (img, w, h) => {
  const o = new PNG({ width: w, height: h });
  o.data.fill(255);
  PNG.bitblt(img, o, 0, 0, img.width, img.height, 0, 0);
  return o;
};

const names = fs.readdirSync(path.join(shots, 'baseline')).filter((f) => f.endsWith('.png')).sort();
const results = [];
for (const name of names) {
  const up = path.join(shots, 'upgraded', name);
  if (!fs.existsSync(up)) { results.push({ page: name, diffPct: null }); continue; }
  const a0 = read(path.join(shots, 'baseline', name));
  const b0 = read(up);
  const w = Math.max(a0.width, b0.width), h = Math.max(a0.height, b0.height);
  const a = pad(a0, w, h), b = pad(b0, w, h);
  const diff = new PNG({ width: w, height: h });
  const px = pixelmatch(a.data, b.data, diff.data, w, h, { threshold: 0.1 });
  const pct = +(100 * px / (w * h)).toFixed(3);
  const gap = 16;
  const combo = new PNG({ width: w * 2 + gap, height: h });
  combo.data.fill(0);
  for (let i = 3; i < combo.data.length; i += 4) combo.data[i] = 255;
  PNG.bitblt(a, combo, 0, 0, w, h, 0, 0);
  PNG.bitblt(b, combo, 0, 0, w, h, w + gap, 0);
  fs.writeFileSync(path.join(out, name), PNG.sync.write(combo));
  results.push({ page: name.replace('.png', ''), diffPct: pct, sizeBaseline: `${a0.width}x${a0.height}`, sizeUpgraded: `${b0.width}x${b0.height}` });
}
fs.writeFileSync(path.join(root, 'report', 'diff.json'), JSON.stringify(results, null, 2));
console.table(results);
