/* ============================================================================
   IMAGE SLOTS

   Every photograph on the site is named here. Drop a file into
   site/public/images/ with the matching name and it appears — no code changes.

   Until a file exists the slot renders as a warm empty plate rather than a
   broken image, so the layout can be reviewed before the photography lands.

   Sizes are the minimum that will look sharp on a retina laptop. Bigger is
   fine; anything smaller will look soft on the full-bleed sections.
   ========================================================================= */

/* Vite fills this with the deploy base — "/" locally, "/villa25ekas/" on
   GitHub Pages. Without it every image 404s the moment the site is not served
   from the root of a domain. */
const B = import.meta.env.BASE_URL;

export const IMAGES = {
  /* The sunset exterior with the pool in the foreground — the one that opens
     the site. Wants to be wide, and to have some sky. */
  hero: { src: `${B}images/hero.jpg`, min: '2400×1350', alt: 'Villa 25 Ekas at dusk, looking across the pool' },

  /* The second exterior, hung on the right of the welcome section and faded
     into the background on its left edge. Portrait or square works best. */
  welcome: { src: `${B}images/welcome.jpg`, min: '1600×1800', alt: 'The villa and gardens in the evening' },

  /* Section backgrounds — these sit behind text and move on scroll, so they
     want to be calm. Avoid anything with a busy left third. */
  offgrid: { src: `${B}images/offgrid.jpg`, min: '2400×1350', alt: 'Solar panels above the villa' },
  /* Supplied 26 Aug 2026 at 1672×941, which is under the size below. It is
     behind a heavy overlay so the softness does not show much, but a larger
     export would be better on a wide screen — the section is taller than it is
     wide, so `cover` scales this up a long way. */
  surf:    { src: `${B}images/surf.jpg`,    min: '2400×1350', alt: 'A surfer on a right-hander at Ekas, with the sea stack behind' },
  closing: { src: `${B}images/closing.jpg`, min: '2400×1350', alt: 'The pool after dark' },

  /* The rooms. Keys match unit ids in villa.js. */
  'garden-rooms':        { src: `${B}images/garden-rooms.jpg`,        min: '1200×900', alt: 'One of the garden rooms' },
  'two-bedroom':         { src: `${B}images/two-bedroom.jpg`,         min: '1200×900', alt: 'The two-bedroom villa' },
  'upstairs-apartment':  { src: `${B}images/upstairs-apartment.jpg`,  min: '1200×900', alt: 'The upstairs apartment' },
};

export const LOGO = `${B}logo.png`;
