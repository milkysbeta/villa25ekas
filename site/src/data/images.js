/* ============================================================================
   IMAGE SLOTS

   Every photograph on the site is named here. Drop a file into
   site/public/images/ with the matching name and it appears — no code changes.

   Until a file exists the slot renders as a warm empty plate rather than a
   broken image, so the layout can be reviewed before the photography lands.

   Sizes are the minimum that will look sharp on a retina laptop. Bigger is
   fine; anything smaller will look soft on the full-bleed sections.
   ========================================================================= */

export const IMAGES = {
  /* The sunset exterior with the pool in the foreground — the one that opens
     the site. Wants to be wide, and to have some sky. */
  hero: { src: '/images/hero.jpg', min: '2400×1350', alt: 'Villa 25 Ekas at dusk, looking across the pool' },

  /* The second exterior, hung on the right of the welcome section and faded
     into the background on its left edge. Portrait or square works best. */
  welcome: { src: '/images/welcome.jpg', min: '1600×1800', alt: 'The villa and gardens in the evening' },

  /* Section backgrounds — these sit behind text and move on scroll, so they
     want to be calm. Avoid anything with a busy left third. */
  offgrid: { src: '/images/offgrid.jpg', min: '2400×1350', alt: 'Solar panels above the villa' },
  surf:    { src: '/images/surf.jpg',    min: '2400×1350', alt: 'Ekas Bay from the headland' },
  closing: { src: '/images/closing.jpg', min: '2400×1350', alt: 'The pool after dark' },

  /* The rooms. Keys match unit ids in villa.js. */
  'garden-rooms':        { src: '/images/garden-rooms.jpg',        min: '1200×900', alt: 'One of the garden rooms' },
  'two-bedroom':         { src: '/images/two-bedroom.jpg',         min: '1200×900', alt: 'The two-bedroom villa' },
  'upstairs-apartment':  { src: '/images/upstairs-apartment.jpg',  min: '1200×900', alt: 'The upstairs apartment' },
};

export const LOGO = '/logo.png';
