/* ============================================================================
   Editable content: experiences, journal, guide, gallery.

   Everything the admin portal will eventually manage lives here, in the shape
   the Supabase tables will use. When the database goes in, only the loader in
   lib/store.js changes — no section component has to be touched.

   HONESTY RULE for this file: prices and facts the owners have not confirmed
   are marked `onRequest: true` or carry a `todo` note rather than being
   invented. A guest quoted a made-up price and then charged a different one has
   been lied to, and it is the kind of thing that ends up in a review.
   ========================================================================= */

/* -- Experiences ----------------------------------------------------------
   Transfers are John's confirmed figure. Everything else stays on request
   until the follow-up form comes back.                                     */
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
   Authorship is Alison's call (question 20): "1 by guest, 2 by john, 3 surf
   coach. Not keen to have me on post." Subjects are John's own list — local
   timber, off-grid solar, water back into the gardens, electric bikes, and the
   difficulties of building in a foreign country.

   These are outlines with a real angle, not filler. Nobody's words are being
   invented for them: each says plainly that the piece is coming.            */
export const JOURNAL = [
  {
    id: 'first-morning',
    title: 'The first morning',
    author: 'A guest',
    date: null,
    standfirst:
      'What it is like to arrive after a long road, wake up above the bay, and '
      + 'work out that the break you are looking at is the one you are about to '
      + 'paddle out on.',
    draft: true,
    todo: 'a guest — their own words, with name and country. Ask after the first stay.',
  },
  {
    id: 'building-here',
    title: 'Building it',
    author: 'John',
    date: null,
    standfirst:
      'Local timber and stone, twelve and a half kilowatts of solar with no grid '
      + 'behind it, water going back into the gardens — and the parts of building '
      + 'in someone else’s country that no amount of planning prepares you for.',
    draft: true,
    todo:
      'John — timber species and which mill, confirm fully off-grid vs grid-tied, '
      + 'the water recycling detail, and the electric bikes.',
  },
  {
    id: 'reading-ekas',
    title: 'Reading Ekas',
    author: 'The surf coach',
    date: null,
    standfirst:
      'Which break works on which tide, when the wind turns, and why the bay '
      + 'empties out at exactly the hour it gets good.',
    draft: true,
    todo: 'surf coach — name, and the tide and wind detail for each break.',
  },
];

/* -- Ekas Guide -----------------------------------------------------------
   Breaks and day trips from John (question 18). Drive times are his.

   Note Alison would rather this were a printed folder in each room (question
   23). Both are worth having — a folder cannot be found on Google by someone
   still deciding where to go. See docs/responses/decisions-summary.md.      */
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

/* -- Getting here ---------------------------------------------------------
   John (question 16): "I want to be able to tell them the options, prices and
   times — the 3 major ways to get there. Fast boat if you have lots of boards
   and heavy luggage. Slow boat if you are bringing a bike, or fly, cheaper,
   quicker."

   Senggigi added per question 17. Prices and durations for the boats are still
   missing, and a wrong ferry price strands somebody — so they say so.       */
export const ROUTES = [
  {
    id: 'fly',
    name: 'Fly',
    best: 'Quickest, and usually cheapest once you count the time.',
    legs: [
      { label: 'Flight', detail: 'Into Lombok International (LOP)' },
      { label: 'Road', detail: '40 km · 1 to 1.5 hrs' },
    ],
    price: 'Transfer 450,000 IDR per vehicle',
    known: true,
  },
  {
    id: 'fast-boat',
    name: 'Fast boat',
    best: 'Best with a quiver and heavy bags — most operators carry boards free, but tell them when you book.',
    legs: [
      { label: 'Crossing', detail: 'Padangbai or Sanur to Senggigi · 1.5 to 3 hrs' },
      { label: 'Road', detail: 'Senggigi to Ekas · 79 km · about 1 hr 20' },
    ],
    price: 'From ~400,000 IDR from Padangbai, ~560,000 from Sanur',
    known: true,
    note: 'Luggage 20–25 kg. Cancellations are more common in the wet season.',
  },
  {
    id: 'slow-boat',
    name: 'Slow boat',
    best: 'Cheapest by a distance, and the only way to bring a motorbike.',
    legs: [
      { label: 'Crossing', detail: 'Padangbai to Lembar · 4 to 5 hrs, plus boarding' },
      { label: 'Road', detail: 'Lembar to Ekas · about 2 hrs' },
    ],
    price: '46,000 IDR on foot · about 150,000 with a motorbike',
    known: true,
    note: 'Runs every 60 to 90 minutes, around the clock.',
  },
  {
    id: 'senggigi',
    name: 'Already on Lombok',
    best: 'Coming down from Senggigi, the Gilis or the north of the island.',
    legs: [
      { label: 'Road', detail: 'Senggigi to Ekas · 79 km · about 1 hr 20' },
    ],
    price: null,
    known: true,
  },
];

/* Prices and crossing times are researched rather than quoted by an operator,
   so the page says so. They move with fuel, season and who you book with — and
   a guest who budgets on a stale number and finds it wrong at the harbour has
   been let down by us, not by the ferry. */
export const ROUTES_CAVEAT =
  'Fares and crossing times are a guide, gathered mid-2026. Confirm with the '
  + 'operator when you book — they move with the season.';

/* -- The neighbouring villa -----------------------------------------------
   Alison (question 10): "The neighbouring villa not our" — so it is described
   as a neighbour rather than as part of Villa 25.

   Both owners answered "undecided" on who invoices a combined booking
   (question 09). John is talking to Mitch, whose place is currently managed by
   Ekas Surf Resort. Until that is settled, large groups are an enquiry and
   nothing is promised on someone else's behalf.                             */
export const NEIGHBOUR = {
  show: true,
  heading: 'Larger groups',
  body:
    'There is a neighbouring villa a moment away — not ours, but run by people '
    + 'we know. For a group too big for five rooms, tell us what you need and we '
    + 'will see what can be arranged between us.',
  enquireOnly: true,
};

/* -- Gallery --------------------------------------------------------------
   Populated from the media library once the admin portal is in. Until then it
   reads whatever is in site/public/images, so the layout can be reviewed.

   `source` records where a photo came from: our own shoot, a guest who gave
   permission, or the villa's Instagram. Guest photos must never appear without
   that permission recorded.                                                 */
export const GALLERY = [
  { id: 'hero',    src: 'hero.jpg',    alt: 'The villa at dusk, across the pool', source: 'official', tall: true },
  { id: 'welcome', src: 'welcome.jpg', alt: 'The villa and gardens in the evening', source: 'official' },
];
