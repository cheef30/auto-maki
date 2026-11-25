// Pretvara sve slike iz slike/ u WebP (800 i 1600 px širine) u assets/img/.
// Pokretanje iz korena projekta:  node alati/slike.mjs
// Potreban je ffmpeg (winget install ffmpeg). Postojeće WebP fajlove preskače, osim uz --sve.
import { readdirSync, existsSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, parse } from 'node:path';

const SRC = 'slike';
const OUT = join('assets', 'img');
const SIZES = [800, 1600];
const force = process.argv.includes('--sve');

mkdirSync(OUT, { recursive: true });
const files = readdirSync(SRC).filter(f => /\.(jpe?g|png|webp)$/i.test(f));
let made = 0;
for (const f of files) {
  const name = parse(f).name.toLowerCase().replace(/[^a-z0-9-]+/g, '-');
  for (const w of SIZES) {
    const out = join(OUT, `${name}-${w}.webp`);
    if (!force && existsSync(out)) continue;
    execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-i', join(SRC, f),
      '-vf', `scale='min(${w},iw)':-2`, '-c:v', 'libwebp', '-quality', w > 800 ? '74' : '78', out]);
    made++;
  }
  console.log('✓', name);
}
console.log(`Gotovo: ${made} novih WebP fajlova u ${OUT}/`);
