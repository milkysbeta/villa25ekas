/* ----------------------------------------------------------------------------
   Write a real index.html for every page under /demo.

   GitHub Pages has no server-side routing: a URL only exists if a file exists
   at it. Without this, /demo/stay would 404 on a hard refresh or a shared link
   — it would only work if you had clicked through from another page.

   Each file is a byte-identical copy of the built index.html, with the <title>
   swapped so a link shared into WhatsApp or Slack shows the right name. The
   router reads the path and renders the matching page.

   Safe because the entry bundle has a FIXED name (assets/app.js), so a copied
   page can never point at a hashed bundle that a later build has deleted.
   ------------------------------------------------------------------------- */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PAGES, BASENAME } from '../site/src/lib/routes.js';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'site', 'dist');

const shell = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');
const base = BASENAME.replace(/^\//, '');

let written = 0;
for (const page of PAGES) {
  const dir = path.join(DIST, base, page.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(
    path.join(dir, 'index.html'),
    shell.replace(/<title>[^<]*<\/title>/, `<title>${page.title}</title>`)
  );
  console.log(`  /${base}/${page.slug}`.padEnd(28) + page.title);
  written += 1;
}
console.log(`\n${written} pages written into dist/${base}/`);
