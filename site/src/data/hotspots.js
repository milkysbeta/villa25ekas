/* ============================================================================
   HOT SPOTS — what to do, from the front gate outwards.

   Ordered by how far you have to go, because that is the question a guest
   actually asks. "What can I do before lunch" and "what is worth a whole day"
   are different questions and they want different answers.

   ---------------------------------------------------------------------------
   TWO FLAGS THAT MATTER
   ---------------------------------------------------------------------------
   `check: true`  — the distance or drive time is our research, not the owners'.
                    It is not shown to guests, but everything carrying it should
                    be confirmed by someone who has actually driven it. Roads in
                    the south-east are slow and Google is optimistic about them.

                    Entries WITHOUT `check` come from the villa's own Booking.com
                    listing or from John's answers, so they are authoritative.

   `partner`      — null everywhere today, because nothing is agreed yet.
                    Fill one in and a gold "Villa 25 Ekas rate" line appears
                    under that entry. Nothing else needs changing. Leaving it
                    null means the site never promises a discount that a guest
                    then gets turned down for at the counter.

                        partner: {
                          perk: '10% off the food bill',
                          how:  'Mention Villa 25 Ekas when you sit down',
                          from: '2026-09-01',   // optional, informational
                        }

   HONESTY RULE, same as content.js: nothing invented. Where a place has a
   catch — a shark fishery, a beach that is only pink for two hours — it says
   so, because a guest who drives an hour for a disappointment blames us.
   ========================================================================= */

/* Distance bands. The label is the heading; the note sits under it and sets
   the expectation before anyone reads a single entry. */
export const BANDS = {
  bay: {
    label: 'In the bay',
    note: 'On foot, or a few minutes up the road.',
  },
  corner: {
    label: 'The south-east corner',
    note: 'Under an hour and a half, and almost nobody else out there.',
  },
  kuta: {
    label: 'Kuta and Mandalika',
    note: 'The busy end of the island. Good coffee, real restaurants, the circuit.',
  },
  island: {
    label: 'The rest of Lombok',
    note: 'A long day each, or a night away. Worth doing once.',
  },
};

/* What a thing is, shown as a small tag and used by the filter chips. */
export const TYPES = {
  surf: 'Surf',
  water: 'On the water',
  beach: 'Beaches',
  food: 'Food',
  culture: 'Culture',
  nature: 'Nature',
};

export const HOTSPOTS = [
  /* -- In the bay -------------------------------------------------------- */
  {
    id: 'inside-ekas',
    name: 'Inside Ekas',
    band: 'bay',
    type: 'surf',
    dist: 'Out the front',
    blurb: 'The one you watch over breakfast. Long right, forgiving, and it holds a crowd of four.',
    partner: null,
  },
  {
    id: 'beach-break',
    name: 'The beach break',
    band: 'bay',
    type: 'surf',
    dist: '4 min walk',
    blurb: 'Where you learn, and where you go when it is small. Sand bottom, no drama.',
    partner: null,
  },
  {
    id: 'outside-ekas',
    name: 'Outside Ekas',
    band: 'bay',
    type: 'surf',
    dist: 'Boat across the bay',
    blurb: 'Bigger, heavier, emptier. It gets better at exactly the hour the day boats turn for home.',
    partner: null,
  },
  {
    id: 'kura-kura',
    name: 'Kura Kura',
    band: 'bay',
    type: 'surf',
    dist: 'Boat',
    blurb: 'The left on the far side of the bay. Ask the guide which tide it wants.',
    partner: null,
  },
  {
    id: 'kite-wing',
    name: 'Kite and wing foil',
    band: 'bay',
    type: 'water',
    dist: 'In the bay',
    blurb:
      'The bay picks up a dependable cross-shore in season and there is a great deal of flat '
      + 'water inside the reef to make mistakes on.',
    partner: null,
  },
  {
    id: 'ekas-village',
    name: 'Ekas village',
    band: 'bay',
    type: 'culture',
    dist: '1.1 km',
    blurb:
      'A fishing village, not a set. Go early, when the boats are in and the warungs are '
      + 'frying. This is the closest place to buy anything at all.',
    partner: null,
  },

  /* -- The south-east corner --------------------------------------------- */
  {
    id: 'kaliantan',
    name: 'Pantai Kaliantan',
    band: 'corner',
    type: 'beach',
    dist: '5 km',
    blurb:
      'A wide, pale, largely empty beach. Once a year it fills up for Bau Nyale, when the sea '
      + 'worms come in and half the island camps on the sand.',
    check: true,
    checkNote: 'Bau Nyale at Kaliantan — confirm with John, dates move with the lunar calendar.',
    partner: null,
  },
  {
    id: 'gubuk-kopi',
    name: 'Gubuk Kopi',
    band: 'corner',
    type: 'food',
    dist: '7 km',
    blurb: 'The nearest coffee to the villa that we did not make ourselves.',
    partner: null,
  },
  {
    id: 'lesehan-cemara',
    name: 'Lesehan Cemara',
    band: 'corner',
    type: 'food',
    dist: '8 km',
    blurb: 'Lesehan means you eat sitting on the floor, which is the correct way to eat grilled fish.',
    partner: null,
  },
  {
    id: 'bakso-arema',
    name: 'Bakso Diagung Arema',
    band: 'corner',
    type: 'food',
    dist: '9 km',
    blurb: 'Meatball soup, done the Malang way. Costs almost nothing and fixes almost anything.',
    partner: null,
  },
  {
    id: 'surga',
    name: 'Pantai Surga',
    band: 'corner',
    type: 'beach',
    dist: 'About 30 min',
    blurb:
      'They named it Heaven Beach and then did nothing else to it. Gold sand under a headland, '
      + 'and a wave at the end of it when the swell is up.',
    check: true,
    partner: null,
  },
  {
    id: 'mangrove',
    name: 'The mangrove park',
    band: 'corner',
    type: 'nature',
    dist: '13 km',
    blurb: 'Boardwalks through the mangroves. Cool, shaded, and full of birds first thing.',
    partner: null,
  },
  {
    id: 'bloam',
    name: 'Tanjung Bloam',
    band: 'corner',
    type: 'beach',
    dist: 'About 1 hr',
    blurb:
      'Cliffs, white sand and water that does not look real. Turtles come ashore to nest on '
      + 'this stretch — if you find a nest, look and leave it alone.',
    check: true,
    partner: null,
  },
  {
    id: 'tanjung-ringgit',
    name: 'Tanjung Ringgit',
    band: 'corner',
    type: 'nature',
    dist: 'About 1 hr 15',
    blurb:
      'The far south-east tip. Sea cliffs, a Japanese wartime cannon still pointing out to sea, '
      + 'and grey macaques that come out in the afternoon.',
    check: true,
    partner: null,
  },
  {
    id: 'pink-beach',
    name: 'Pink Beach',
    band: 'corner',
    type: 'beach',
    dist: 'About 1 hr 15',
    blurb:
      'Broken red coral mixed through white sand. It genuinely is pink — but only before about '
      + 'ten in the morning or after four in the afternoon. In the middle of the day it is just '
      + 'a nice beach with a lot of parked scooters.',
    check: true,
    partner: null,
  },
  {
    id: 'gili-petelu',
    name: 'Gili Petelu',
    band: 'corner',
    type: 'water',
    dist: '10 min by boat from Pink Beach',
    blurb:
      'Three small islands with a proper coral garden between them. The best snorkelling within '
      + 'reach of the villa, and usually combined with Pink Beach in one boat trip.',
    check: true,
    partner: null,
  },
  {
    id: 'tanjung-luar',
    name: 'Tanjung Luar fish market',
    band: 'corner',
    type: 'culture',
    dist: 'About 45 min',
    blurb:
      'A Buginese fishing town that has been landing fish here for generations. It runs from '
      + 'about four in the morning and is finished by ten. Worth knowing before you go: sharks '
      + 'and rays are landed here too, and it is confronting.',
    check: true,
    partner: null,
  },

  /* -- Kuta and Mandalika ------------------------------------------------- */
  {
    id: 'kuta',
    name: 'Kuta',
    band: 'kuta',
    type: 'culture',
    dist: '1 hr',
    blurb:
      'Close enough for a day, far enough that you are glad to come back. Everything the villa '
      + 'deliberately is not — bars, bakeries, board shops, other travellers.',
    partner: null,
  },
  {
    id: 'merese',
    name: 'Tanjung Aan and Bukit Merese',
    band: 'kuta',
    type: 'beach',
    dist: 'About 1 hr 15',
    blurb:
      'A horseshoe bay with sand like peppercorns, and a grass hill at the end of it that is the '
      + 'best sunset on the south coast. Go up an hour before dark.',
    check: true,
    partner: null,
  },
  {
    id: 'selong-belanak',
    name: 'Selong Belanak',
    band: 'kuta',
    type: 'surf',
    dist: '1.5 hrs',
    blurb:
      'A long, forgiving beach — the best place on the island to learn. Boards and an instructor '
      + 'for the price of a coffee at home.',
    partner: null,
  },
  {
    id: 'mandalika-circuit',
    name: 'Mandalika circuit',
    band: 'kuta',
    type: 'culture',
    dist: 'About 1 hr 15',
    blurb:
      'A 4.3 km MotoGP street circuit on the headland. Race weekend turns the whole south of the '
      + 'island upside down — book a long way out, and talk to us first.',
    check: true,
    partner: null,
  },
  {
    id: 'sade',
    name: 'Sade and Ende',
    band: 'kuta',
    type: 'culture',
    dist: 'About 1 hr 15',
    blurb:
      'Two traditional Sasak villages three minutes apart — thatch, bamboo, and floors still '
      + 'finished the old way. Take a guide at the gate; it is how the village is paid.',
    check: true,
    partner: null,
  },
  {
    id: 'ashtari',
    name: 'Ashtari',
    band: 'kuta',
    type: 'food',
    dist: 'Just west of Kuta',
    blurb:
      'Slow food on a cliff above the coast road, with the whole south coast laid out under it. '
      + 'Largely vegetarian, and there is yoga in the loft.',
    check: true,
    partner: null,
  },
  {
    id: 'milk-espresso',
    name: 'Milk Espresso',
    band: 'kuta',
    type: 'food',
    dist: 'Kuta',
    blurb: 'The best coffee in Kuta and a proper breakfast, on a roof. Where a day trip should start.',
    check: true,
    partner: null,
  },
  {
    id: 'nuggets-corner',
    name: 'Nugget’s Corner',
    band: 'kuta',
    type: 'food',
    dist: 'Kuta',
    blurb:
      'Indonesian cooking with some invention in it, at local prices. People go back for the '
      + 'rendang and then keep going back.',
    check: true,
    partner: null,
  },

  /* -- The rest of Lombok -------------------------------------------------- */
  {
    id: 'benang-kelambu',
    name: 'Benang Kelambu falls',
    band: 'island',
    type: 'nature',
    dist: 'About 2 hrs',
    blurb:
      'Water comes through the moss in a hundred separate threads rather than one fall, so it '
      + 'hangs like a curtain. The nearer of Lombok’s two great waterfall days.',
    check: true,
    partner: null,
  },
  {
    id: 'tiu-kelep',
    name: 'Sendang Gile and Tiu Kelep',
    band: 'island',
    type: 'nature',
    dist: 'A long day, or stay over',
    blurb:
      'Senaru, on the north side of Rinjani. Tiu Kelep drops 45 metres into a turquoise pool and '
      + 'you wade a river to reach it.',
    check: true,
    partner: null,
  },
  {
    id: 'rinjani',
    name: 'Rinjani and Sembalun',
    band: 'island',
    type: 'nature',
    dist: 'Two to four days',
    blurb:
      'The volcano, and the green valley you climb it from. The trekking season runs April to '
      + 'December, and the clearest sunrises are May to October. This is a real trek, not a walk.',
    check: true,
    partner: null,
  },
  {
    id: 'gilis',
    name: 'The Gili Islands',
    band: 'island',
    type: 'water',
    dist: 'Road, then a boat',
    blurb:
      'Trawangan for the noise, Air for the balance, Meno for nothing at all. No cars on any of '
      + 'them. Best as an overnight rather than a dash.',
    check: true,
    partner: null,
  },
];

/* -- Getting around -------------------------------------------------------
   Prices are the going rate across the island in 2026, quoted as ranges
   because that is honestly how they are quoted on the ground. They are here
   so nobody arrives without a plan for the 35 km of road — not as a promise
   of what we will charge. Villa hire rates come from EXPERIENCES.           */
export const HIRE = [
  {
    id: 'scooter',
    name: 'Scooter',
    price: '60,000 – 100,000 IDR a day',
    blurb: 'Add about 5,000 a day for a board rack. Cheapest in Kuta, where everyone competes.',
    check: true,
    partner: null,
  },
  {
    id: 'car-driver',
    name: 'Car and driver',
    price: '600,000 – 800,000 IDR a day',
    blurb: 'The right answer for a family, a long day trip, or the north of the island.',
    check: true,
    partner: null,
  },
  {
    id: 'car-self',
    name: 'Car, driving yourself',
    price: '400,000 – 750,000 IDR a day',
    blurb: 'Possible, and cheaper. The roads down here will make you work for it.',
    check: true,
    partner: null,
  },
];

/* Shown once at the foot of the section. This is how a partner list actually
   gets built — the places that matter are the ones that come to you. */
export const PARTNER_PITCH = {
  eyebrow: 'For local businesses',
  title: 'Run somewhere our guests should know about?',
  body:
    'We are putting together a short list of places near Ekas that will look after Villa 25 '
    + 'guests properly — restaurants, boats, guides, hire. If that is you, get in touch and we '
    + 'will talk.',
  cta: 'Talk to us',
};

/* Drive times to anywhere past the mangroves are estimates on roads that are
   not always in a hurry. Said once, plainly, rather than hedged on every line. */
export const HOTSPOTS_CAVEAT =
  'Distances inside the bay are measured. Everything further is an honest estimate on roads '
  + 'that are not always in a hurry — ask us before you commit a day to one.';
