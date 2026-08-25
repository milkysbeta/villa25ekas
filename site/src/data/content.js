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

/* -- The building ---------------------------------------------------------
   John's copy, 25 August 2026, tidied for spelling and kept in his words.

   His positioning line is the sharpest thing anyone has written for this site
   so far — "definitely not a local homestay" — and it is doing real work. It
   sets the expectation that justifies the rates, and it tells the two audiences
   he actually wants (a group taking the whole place, and a traveller who
   expects more) that they are in the right place.                           */
export const POSITIONING =
  'Definitely not a local homestay. Every effort has been made to create a luxury resort — '
  + 'for a larger group wanting to stay together and take the entire villa, or for the '
  + 'discerning traveller who expects a little more.';

export const BUILDING = [
  {
    id: 'light',
    title: 'Light',
    body:
      'Natural light streams in and reflects through all the rooms through meticulously '
      + 'placed coloured glass, to give a feeling of elegance and peace. Blackout curtains '
      + 'add the ultimate in privacy.',
  },
  {
    id: 'gardens',
    title: 'Gardens',
    body:
      'Bathed in sunlight from morning to night. Every effort has gone into creating shade '
      + 'and privacy with lush tropical gardens, fed from recycled water reticulated from '
      + 'waste.',
  },
  {
    id: 'hardwood',
    title: 'Hardwood',
    body:
      'Locally sourced hardwood timber, for colour, strength and durability — much of which '
      + 'is recycled.',
  },
  {
    id: 'kitchens',
    title: 'Eating',
    /* CHECKED, and John was right. The Booking.com listing's "nearest food
       7 km" is about specific named businesses, not about what is actually
       walkable. Mapping the exact address (3FX2+83W) against OpenStreetMap
       finds Warung Rizky 160 m away, three more places to eat inside 280 m,
       and a bar at 310 m — all a two to four minute walk. So his wording
       stands as written, and the hedge that was here has been removed. */
    body:
      'Cook your own locally sourced seafood and market produce in one of the kitchens, or '
      + 'eat at one of the many local warungs and western-style restaurants, all only '
      + 'minutes’ walk away.',
  },
];

/* -- On the water ---------------------------------------------------------
   John's copy, 25 August 2026, lightly tidied for spelling and kept otherwise
   in his words. This is the part of the offer that is genuinely unusual, and
   it had no home on the site before.

   One thing checked rather than repeated: the hammerhead site John means is
   The Magnet, in Belongas Bay on the south-west coast. Scalloped and great
   hammerheads school there roughly June to October, best July to September.
   It is an advanced dive — strong current, downcurrents and surge, and
   operators want 100+ logged dives. So it is written as the serious thing it
   is, next to Pink Beach for beginners, rather than the two being blurred
   into one sentence a novice might book off.                                */
export const WATER = [
  {
    id: 'surf',
    title: 'Surf',
    body:
      'The Beach Break greets you a short walk down the hill. Both Inside and Outside hold '
      + 'left and right handers, and bring the swell that people travel the planet to get to.',
  },
  {
    id: 'kite',
    title: 'Kite surfing',
    body:
      'Kite surfers’ heaven is a few minutes away, and is renowned as one of the best — and '
      + 'most beautiful — spots in the world.',
  },
  {
    id: 'foil',
    title: 'Foiling',
    body:
      'With the new trend in foiling — wing, natural and battery powered — Ekas is becoming a '
      + 'mecca to learn and experience the phenomenon everybody wants to be part of.',
  },
  {
    id: 'dive',
    title: 'Diving',
    body:
      'Our 3 m deep pool is ideal for dive training, and instructors will be available for '
      + 'beginners and advanced divers alike. Nearby Pink Beach offers amazing snorkelling and '
      + 'beginner diving, and trips can be arranged to the best sites in Lombok.',
    footnote:
      'Including the famous hammerhead site at Belongas Bay — an advanced dive, and best '
      + 'between June and October.',
    todo: 'dive instructor name, certification agency, and day rate',
  },
];

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
    id: 'dive-training',
    name: 'Dive training',
    blurb:
      'The big pool is 3 metres deep, which is enough to teach in properly. Instructors for '
      + 'beginners and for divers who already know what they are doing, and trips out to the '
      + 'best sites on the island.',
    onRequest: true,
    todo: 'instructor name, agency (PADI/SSI), course prices and trip rates',
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
      'We will have a driver waiting. Lombok International is about 35 km — an '
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
      { label: 'Road', detail: '35 km · 1 to 1.5 hrs' },
    ],
    price: 'Transfer 450,000 IDR per vehicle',
    links: [
      { label: 'Find flights', href: 'https://www.google.com/travel/flights?q=flights%20to%20LOP' },
      { label: 'Lombok airport', href: 'https://lombok-airport.co.id/' },
    ],
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
    links: [
      { label: 'Compare crossings', href: 'https://www.giliferries.com/fast-boat/bali/senggigi' },
    ],
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
    links: [
      { label: 'Book on Ferizy', href: 'https://trip.ferizy.com/' },
    ],
    known: true,
    /* This is the one thing on the page that will actually strand somebody:
       ASDP closed the ticket windows at Padangbai and Lembar, so a guest who
       turns up expecting to buy a ticket cannot board. */
    warn: 'Book online before you travel — there are no ticket counters at either port.',
    note: 'Runs every 60 to 90 minutes, around the clock. Tickets open 60 days ahead.',
  },
  {
    id: 'senggigi',
    name: 'Already on Lombok',
    best: 'Coming down from Senggigi, the Gilis or the north of the island.',
    legs: [
      { label: 'Road', detail: 'Senggigi to Ekas · 79 km · about 1 hr 20' },
    ],
    price: null,
    links: [],
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
