/* ============================================================================
   Editable content: experiences, journal, guide, gallery.

   Everything the admin portal will eventually manage lives here, in the shape
   the Supabase tables will use. When the database goes in, only the loader in
   lib/store.js changes — no section component has to be touched.

   HONESTY RULE for this file: prices and facts the owners have not confirmed
   are marked `onRequest: true` or carry a `todo` note rather than being
   invented. A guest who is quoted a made-up price and then charged a different
   one has been lied to, and it is the kind of thing that ends up in a review.
   ========================================================================= */

/* -- Experiences ----------------------------------------------------------
   Prices from John where given. Everything else is on request until the
   follow-up form comes back.                                              */
export const EXPERIENCES = [
  {
    id: 'surf-guiding',
    name: 'Surf guiding',
    blurb:
      'Someone who knows which break will be working before you have finished '
      + 'breakfast, and can read the tide well enough to put you in the right '
      + 'place at the right hour.',
    onRequest: true,
    todo: 'guide name and day rate',
  },
  {
    id: 'boat-charter',
    name: 'Boat to the outside',
    blurb:
      'Outside Ekas is a short ride across the bay. Bigger, heavier, and empty '
      + 'the moment the day boats turn for home.',
    onRequest: true,
    todo: 'boat cost per trip, and how many it takes',
  },
  {
    id: 'board-hire',
    name: 'Board hire',
    blurb:
      'A quiver on site, so you can travel light or try something you would '
      + 'never buy.',
    onRequest: true,
    todo: 'which boards, daily rate',
  },
  {
    id: 'spearfishing',
    name: 'Spearfishing',
    blurb:
      'Clear water, healthy reef, and someone local who knows where to look. '
      + 'Dinner sorts itself out.',
    onRequest: true,
    todo: 'guide and rate',
  },
  {
    id: 'private-chef',
    name: 'Private chef',
    blurb:
      'Dinner cooked in the villa while you are still in the pool. Local '
      + 'cooking done properly, or whatever the group has been craving.',
    onRequest: true,
    todo: 'chef name, rate per meal, cuisine',
  },
  {
    id: 'massage',
    name: 'Massage',
    blurb:
      'In the villa, in the shade, after a long session. The most requested '
      + 'thing on any surf trip and the easiest to arrange.',
    onRequest: true,
    todo: 'therapist and hourly rate',
  },
  {
    id: 'electric-bikes',
    name: 'Electric bikes',
    blurb:
      'Charged from the same panels that run the villa. Enough range to get '
      + 'along the coast and back without a drop of fuel.',
    onRequest: true,
    todo: 'fleet size, model, daily rate',
  },
  {
    id: 'transfers',
    name: 'Airport transfers',
    blurb:
      'We will have a driver waiting. Lombok International is about 40 km — an '
      + 'hour to an hour and a half, depending on the road.',
    priceIdr: 450_000,
    priceNote: 'per vehicle, each way',
  },
];

/* -- Journal --------------------------------------------------------------
   Three opening posts, from John's own list of subjects. Written as outlines
   with a real angle, not filler — they are placeholders for his words, not a
   substitute for them.                                                     */
export const JOURNAL = [
  {
    id: 'local-timber',
    title: 'The timber came from up the road',
    author: 'John',
    date: null,
    standfirst:
      'Why we milled locally instead of shipping in, and what that cost us in '
      + 'time versus what it gave the building.',
    draft: true,
    todo: 'John — species, which mill, and what the trade-off actually was',
  },
  {
    id: 'off-grid',
    title: 'Running a villa on sunlight',
    author: 'John',
    date: null,
    standfirst:
      'Twelve and a half kilowatts of panels, forty-six kilowatt hours of '
      + 'battery, and no grid connection at all. What it takes to keep the air '
      + 'conditioning on until morning.',
    draft: true,
    todo: 'John — confirm fully off-grid vs grid-tied, and the water recycling detail',
  },
  {
    id: 'building-here',
    title: 'Building in someone else’s country',
    author: 'A guest',
    date: null,
    standfirst:
      'On local trades, neighbours, and the parts of the build that no amount '
      + 'of planning prepares you for.',
    draft: true,
    todo: 'A guest — their first impression of the place. Alison asked not to be an author.',
  },
];

/* -- Ekas Guide -----------------------------------------------------------
   Day trips and breaks from John's list. Drive times are his where given.  */
export const GUIDE = [
  {
    id: 'inside-ekas',
    name: 'Inside Ekas',
    kind: 'surf',
    detail: 'In front of the villa. The one you watch over breakfast.',
  },
  {
    id: 'outside-ekas',
    name: 'Outside Ekas',
    kind: 'surf',
    detail: 'By boat. Bigger, heavier, emptier.',
  },
  {
    id: 'beach-break',
    name: 'The beach break',
    kind: 'surf',
    detail: 'Where you learn, and where you go when it is small.',
  },
  {
    id: 'kura-kura',
    name: 'Kura Kura',
    kind: 'surf',
    detail: '',
  },
  {
    id: 'kite-surfing',
    name: 'Kite surfing',
    kind: 'water',
    detail: 'The bay picks up a reliable cross-shore in season.',
  },
  {
    id: 'pink-beach',
    name: 'Pink Beach',
    kind: 'trip',
    detail: 'Coral sand that genuinely is pink, in the right light.',
  },
  {
    id: 'kuta',
    name: 'Kuta',
    kind: 'trip',
    drive: '1 hr',
    detail: 'Close enough for a day, far enough that you are glad to come back.',
  },
  {
    id: 'selong-belanak',
    name: 'Selong Belanak',
    kind: 'trip',
    drive: '1.5 hrs',
    detail: 'A long, forgiving beach — the best place on the island to learn.',
  },
];

export const GUIDE_KINDS = {
  surf: 'Surf',
  water: 'On the water',
  trip: 'Day trips',
};

/* -- Gallery --------------------------------------------------------------
   Populated from the media library once the admin portal is in. Until then it
   reads whatever is in site/public/images, so the layout can be reviewed.

   `source` records where a photo came from: our own shoot, a guest who gave
   permission, or the villa's Instagram. Guest photos must never appear without
   that permission recorded — see docs/DECISIONS.md C6.                     */
export const GALLERY = [
  { id: 'hero',    src: 'hero.jpg',    alt: 'The villa at dusk, across the pool', source: 'official', tall: true },
  { id: 'welcome', src: 'welcome.jpg', alt: 'The villa and gardens in the evening', source: 'official' },
];
