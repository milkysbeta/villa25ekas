/* ----------------------------------------------------------------------------
   Copies web-ready assets out of the master library into the site's public
   folder. Run after changing anything in images/.

     node tools/sync-assets.js

   images/ is the master library — full-size originals, organised by section.
   site/public/ is what actually ships. Keeping them separate means a 12 MP
   original never accidentally ends up being served to a phone, but it does
   mean the two can drift, which is what this script is for.
   ------------------------------------------------------------------------- */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PUBLIC = path.join(ROOT, 'site', 'public');

/* [source in images/, destination in site/public/] */
const MAP = [
  ['logo/villa-logo-640.png', 'logo.png'],
  ['01-hero/hero.jpg',        'images/hero.jpg'],
  ['02-welcome/welcome.jpg',  'images/welcome.jpg'],
  ['05-offgrid/offgrid.jpg',  'images/offgrid.jpg'],
  ['04-surf/surf.jpg',        'images/surf.jpg'],
  ['07-gallery/closing.jpg',  'images/closing.jpg'],
  ['06-journey/map.png',      'images/map.png'],
  ['03-rooms/garden-rooms.jpg',       'images/garden-rooms.jpg'],
  ['03-rooms/two-bedroom.jpg',        'images/two-bedroom.jpg'],
  ['03-rooms/upstairs-apartment.jpg', 'images/upstairs-apartment.jpg'],
];

let copied = 0;
let missing = 0;

for (const [from, to] of MAP) {
  const src = path.join(ROOT, 'images', from);
  const dest = path.join(PUBLIC, to);

  if (!fs.existsSync(src)) {
    console.log(`  --      ${from}  (not supplied yet)`);
    missing++;
    continue;
  }

  fs.mkdirSync(path.dirname(dest), { recursive: true });
  const same = fs.existsSync(dest) && fs.readFileSync(src).equals(fs.readFileSync(dest));
  fs.copyFileSync(src, dest);
  console.log(`  ${same ? 'same' : 'COPY'}    ${from}  ->  site/public/${to}`);
  if (!same) copied++;
}

console.log(`\n${copied} updated, ${missing} still to come.`);
