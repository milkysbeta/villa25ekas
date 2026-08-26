/* ============================================================================
   Web-optimise the images in site/public.

     node tools/optimise-images.mjs

   Two separate problems, and only one of them is the photographs.

   THE LOGO. 640x639 and 372 kB to draw a mark 56 px tall in the nav and 72 in
   the footer, on every page of the site. That is the single heaviest asset
   here and the easiest to fix: 192 px covers both at twice the pixel density.

   THE PHOTOGRAPHS. Each background is a 1672x941 JPEG between 200 and 500 kB.
   They are already the right dimensions, so this is re-encoding rather than
   resizing: WebP at quality 76 for a photograph behind a 45-per-cent frosted
   pane is indistinguishable and roughly half the bytes.

   The JPEGs are kept. WebP is safe everywhere that matters in 2026, but a
   fallback costs nothing when the file already exists.
   ========================================================================= */

import { execFileSync } from 'node:child_process';
import { readdirSync, statSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const FF = process.env.FFMPEG ?? 'C:/Users/Milky/AppData/Local/Microsoft/WinGet/Packages/'
  + 'Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-8.1-full_build/bin/ffmpeg';

/* fileURLToPath, not .pathname: this project lives under a directory with a
   space in its name, and .pathname hands back the percent-encoded form. */
const PUBLIC = fileURLToPath(new URL('../site/public/', import.meta.url));
const IMAGES = join(PUBLIC, 'images');

const kb = (p) => Math.round(statSync(p).size / 1024);
const run = (args) => execFileSync(FF, ['-y', '-loglevel', 'error', ...args]);

let before = 0;
let after = 0;

/* -- the logo ------------------------------------------------------------- */
const logo = join(PUBLIC, 'logo.png');
if (existsSync(logo)) {
  const was = kb(logo);
  /* 192 px covers the 72 px footer mark at well over 2x. PNG keeps the
     transparency; the mark is flat colour so it compresses hard. */
  run(['-i', logo, '-vf', 'scale=192:-1', '-c:v', 'png', '-compression_level', '100',
    join(PUBLIC, 'logo-192.png')]);
  const now = kb(join(PUBLIC, 'logo-192.png'));
  console.log(`logo.png        ${String(was).padStart(4)} kB -> ${String(now).padStart(4)} kB  (192 px)`);
  before += was;
  after += now;
}

/* -- the photographs ------------------------------------------------------ */
for (const file of readdirSync(IMAGES).filter((f) => f.endsWith('.jpg')).sort()) {
  const src = join(IMAGES, file);
  const out = src.replace(/\.jpg$/, '.webp');
  const was = kb(src);
  run(['-i', src, '-c:v', 'libwebp', '-quality', '76', '-compression_level', '6', out]);
  const now = kb(out);
  console.log(`${file.padEnd(16)}${String(was).padStart(4)} kB -> ${String(now).padStart(4)} kB  webp`);
  before += was;
  after += now;
}

console.log(`\ntotal ${before} kB -> ${after} kB  (${Math.round((1 - after / before) * 100)}% smaller)`);
