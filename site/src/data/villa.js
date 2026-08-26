/* ============================================================================
   Every fact about the property lives here.

   This is deliberately a plain file rather than a database: it is the content
   the admin portal will eventually edit, and keeping it in one shape now means
   moving it to Supabase later is a swap, not a rewrite.

   ANY number marked TODO is unconfirmed — do not put it in front of a guest.
   ========================================================================= */

export const CONTACT = {
  email: 'villa25ekas@gmail.com',
  whatsapp: '628213103303',
  whatsappText: 'Bookings Villa 25 Ekas',
  /* Same line as the WhatsApp number. Kept as two fields: `phone` must stay in
     full international form for tel: and sms: to work from abroad, `phoneShow`
     is spaced for reading. */
  phone: '+628213103303',
  phoneShow: '+62 821 3103 303',
  instagram: 'villa_25_ekas',
  /* EAST Lombok, not southern. Owner's correction, 25 Aug 2026, and confirmed
     against the coordinates below: Jerowaru district, Kabupaten Lombok Timur.
     The site said "southern Lombok" in three places and it was simply wrong —
     Ekas sits on the south coast OF East Lombok, which is a different claim. */
  location: 'Ekas Bay, East Lombok, Indonesia',
  /* Exact address as given by the owner, 25 Aug 2026. Supersedes the earlier
     "Lendrang Terak, Ekas Buana" line. The leading token is a Google Plus Code;
     decoding it gives -8.901637, 116.450203, which agrees with `coords` below
     to within about half a metre — so the two are consistent, not competing. */
  address: '3FX2+83W, Pemongkong, Jerowaru, Kabupaten Lombok Timur, Nusa Tenggara Barat 83672',
  plusCode: '3FX2+83W Pemongkong',
  /* Booking.com licence numbers — required on listings in Indonesia. */
  licence: '1000000010678606, 55103',
  coords: { lat: -8.901632, lng: 116.450201 },
};

export const whatsappLink = (msg = CONTACT.whatsappText) =>
  `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(msg)}`;

/* -- the rooms -------------------------------------------------------------
   Rates in IDR per night, as set by John. Displayed in IDR always, with an
   optional converted price alongside (see lib/currency.js).                */
export const UNITS = [
  {
    id: 'garden-rooms',
    name: 'Garden Rooms',
    kind: 'room',
    count: 3,
    rate: 1_600_000,
    sleeps: 2,          // TODO confirm
    pool: 'small',
    blurb:
      'Three rooms on the lower level, opening onto a shared kitchen and the small pool. ' +
      'The simplest way to stay, and the closest to the water.',
    features: ['Shared kitchen', 'Small pool', 'Garden outlook'],
    bookable: true,
  },
  {
    id: 'two-bedroom',
    name: 'The Two-Bedroom Villa',
    kind: 'villa',
    count: 1,
    rate: 3_500_000,      // John, 25 Aug 2026
    sleeps: 4,          // TODO confirm
    pool: 'big',
    blurb:
      'Two bedrooms with the run of the big pool. Room enough for a family, or two ' +
      'couples who want their own space at the end of the day.',
    features: ['Two bedrooms', 'Big pool', 'Living area'],
    bookable: true,
  },
  {
    id: 'upstairs-apartment',
    name: 'The Upstairs Apartment',
    kind: 'apartment',
    count: 1,
    rate: 3_000_000,      // John, 25 Aug 2026
    sleeps: 2,          // TODO confirm
    pool: 'big',
    blurb:
      'One bedroom on the top floor, looking out over the bay. Available only when the ' +
      'owners are away, and in blocks of two or three weeks when they are here.',
    features: ['Bay view', 'Own kitchen', 'Top floor'],
    restricted: true,
    minNightsWhenOwnersHome: 14,
    bookable: true,
  },
];

/* -- pricing rules ---------------------------------------------------------
   Decided by John, 28 July 2026. See docs/responses/john-2026-07-28.md.     */
export const PRICING = {
  currency: 'IDR',
  introductory: true,          // both agreed: "introductory rates — opening 2026"
  minNights: { standard: 2, high: 3, buyout: 3 },

  /* NO DEPOSIT. John deferred question 01 to Alison — "she'll be better at
     this one" — and Alison's comment overrides the box she ticked:
       "30% is too complicated for most. Usually no deposit. Free cancellation
        up until 21 days then full payment taken."
     So: nothing up front, free cancellation until 21 days out, full payment
     then. This supersedes both the 30/70 tick and her separate "Moderate"
     answer on question 02, which cannot both be true. */
  deposit: 0,
  freeCancellationDays: 21,
  fullPaymentDays: 21,

  /* RESOLVED, 25 Aug 2026. John: "No discounts for bigger bookings." That
     settles it in Alison's favour and closes the conflict — he had wanted 25%
     ("maybe 20%"), she said "25% is far too much... could be a special price
     but not encouraged". Nothing is published; a buyout price is quoted per
     enquiry, so a special price stays a choice rather than an expectation. */
  buyoutDiscount: 0,
  longStayDiscount: null,

  /* Left off, and now consistent with the line above rather than being a
     standing disagreement. John had wanted automatic discounts on orphaned
     nights; "no discounts for bigger bookings" covers this too. */
  gapFill: { enabled: false, maxGapNights: 3, discount: 0.2 },

  /* Holds are moot while there is no deposit to take, and Alison questions
     whether the calendar should exist at all (question 25). See
     docs/responses/decisions-summary.md. */
  holdHours: 0,

  // TODO: MotoGP week. John confirmed rates rise; dates and multiplier pending.
  events: [],
};

export const totalRackRate = () =>
  UNITS.reduce((sum, u) => sum + u.rate * u.count, 0);

export const buyoutRate = () =>
  Math.round(totalRackRate() * (1 - PRICING.buyoutDiscount));

/* -- the off-grid system ---------------------------------------------------
   Specification from John, 29 July 2026. Roughly 12.6 kW of panels and a very
   large battery by domestic standards. The "fully off-grid vs grid-tied"
   question is still out with him.                                          */
export const POWER = {
  inverterKw: 16,
  arrays: 2,
  arrayVoltage: 412,
  panelWattsEach: 6300,
  get panelKwTotal() {
    return (this.arrays * this.panelWattsEach) / 1000;
  },
  batteryKwh: 46,
  offGrid: true,               // TODO confirm: fully off-grid, or grid-tied?
};

/* -- transfers -------------------------------------------------------------
   John: drivers are paid 350,000; the going rate charged is 450,000.       */
export const TRANSFER = {
  charged: true,
  priceIdr: 450_000,
  driverPaidIdr: 350_000,
  /* 42 km is the ROAD distance, from routing the actual drive (OSRM: 41.6 km).
     The Booking.com listing says 35 km and the site followed it until the map
     was built on real road geometry, at which point the two contradicted each
     other on the same page. Straight-line is about 25 km, so 35 is neither
     measure. The hours are the owners' own and are unchanged — and time is the
     thing a guest actually plans around.
     TODO John: confirm 42 km, or tell us where 35 came from. */
  airport: { code: 'LOP', name: 'Lombok International', km: 42, hours: [1, 1.5] },
};

/* -- surf ------------------------------------------------------------------
   Breaks shown on the forecast panel and the map. Coordinates are the villa's
   for now; per-break coords to be confirmed.                                */
/* John, 25 Aug 2026: "Both Inside and Outsides left and right hander breaks
   bring the swell that people travel the Planet to get to." Inside and Outside
   each hold a left and a right — worth being precise about, because a surfer
   choosing between two weeks in Lombok and two weeks somewhere else reads
   exactly this line. */
/* COORDINATES. Each break is forecast at its own point rather than all four
   sharing the villa's. The positions were checked against the real coastline
   when the map was built — every one sits in water on the correct side of the
   bay, not on a hillside.

   And it matters more than expected. Open-Meteo's marine grid is coarse, so
   the assumption was that four points five kilometres apart would all land in
   one cell and return one answer. Queried on 26 Aug 2026 they land in THREE
   cells, and the answers genuinely differ:

     Inside + Beach Break  cell -8.875, 116.458    swell 1.08-1.46 m
     Outside Ekas          cell -8.958, 116.375    swell 1.64-2.22 m
     Kura Kura             cell -8.958, 116.458    swell 1.60-2.22 m

   Outside reading about half again the size of Inside is exactly what the bay
   actually does. Inside and the Beach Break share a cell and will always show
   the same numbers — they are 400 m apart and both inshore, so that is honest
   rather than broken. */
export const BREAKS = [
  { id: 'inside', name: 'Inside Ekas', lat: -8.91017, lng: 116.43612, note: 'Left and right, in front of the villa. The one you watch over breakfast.' },
  { id: 'outside', name: 'Outside Ekas', lat: -8.93800, lng: 116.41500, note: 'Left and right by boat. Bigger, heavier, emptier.' },
  { id: 'beach', name: 'The Beach Break', lat: -8.90006, lng: 116.44804, note: 'A short walk down the hill. Where you learn, and where you go when it is small.' },
  { id: 'kura', name: 'Kura Kura', lat: -8.92700, lng: 116.47600, note: '' },
];

/* -- day trips, for the illustrated map ----------------------------------- */
export const NEARBY = [
  { name: 'Kite surfing', drive: null },
  { name: 'Pink Beach', drive: null },
  { name: 'Kuta', drive: '1 hr' },
  { name: 'Selong Belanak', drive: '1.5 hrs' },
];

/* ============================================================================
   CONFIRMED FACTS — from the property's own Booking.com listing, 25 Aug 2026.

   Everything below is what the owners have already published themselves, so
   unlike the rest of this file it needs no "TODO confirm". Where it disagrees
   with an earlier guess, this wins.
   ========================================================================= */

export const STAY_TIMES = {
  checkInFrom: '14:00',
  checkInTo: '20:00',
  checkOutFrom: '10:00',
  checkOutTo: '12:00',
  note: 'Let us know roughly when you will arrive, so someone is there to meet you.',
};

/* Grouped the way a guest reads them, not the way Booking.com lists them. */
export const AMENITIES = [
  {
    group: 'In the room',
    items: [
      'Air conditioning',
      'Private bathroom',
      'Hot shower',
      'Towels and linen',
      'Hairdryer',
      'Wardrobe and clothes rack',
      'Desk',
      'Electric kettle',
      'Safe',
    ],
  },
  {
    group: 'Around the villa',
    items: [
      /* The 3 m depth is John's, 25 Aug 2026, and it is not a throwaway detail:
         it is what makes dive training possible here. See WATER in content.js. */
      'Two pools, the big one 3 m deep',
      'Garden and terrace',
      'Pool views',
      'Free WiFi throughout',
      'Free private parking',
      'Electric vehicle charging',
      'Non-smoking throughout',
      'Ground floor throughout',
    ],
  },
  {
    group: 'Getting here and about',
    items: [
      'Airport shuttle',
      'English and Indonesian spoken',
      'Family rooms',
    ],
  },
];

/* Said plainly rather than buried. Every one of these is better read before
   booking than discovered on arrival. */
export const HOUSE_RULES = [
  { rule: 'Children of any age are welcome', tone: 'yes' },
  { rule: 'Under-18s check in with a parent or guardian', tone: 'note' },
  { rule: 'No cots or extra beds', tone: 'no' },
  { rule: 'No pets', tone: 'no' },
  { rule: 'No parties or events', tone: 'no' },
  { rule: 'Non-smoking throughout', tone: 'no' },
  { rule: 'Photo ID needed at check-in', tone: 'note' },
];

/* Distances from the listing. Note the nearest food is 7 km — worth knowing
   before anyone writes "a warung on the doorstep" into the copy. */
/* The Booking.com list started at 7 km, which made it look as though there was
   nothing to eat nearby. That was an artefact of which businesses Booking.com
   happens to name. Measured from the villa's exact coordinates against
   OpenStreetMap, there is a warung 160 m away and three more places to eat
   inside 280 m. The close ones are added here with `walk` minutes at a
   deliberately unflattering 4.5 km/h, because the road out is a hill. */
export const NEARBY_PLACES = [
  { name: 'Warung Rizky',          km: 0.16, kind: 'food',    walk: 2 },
  { name: 'Places to eat nearby',  km: 0.28, kind: 'food',    walk: 4, note: 'three more within 280 m' },
  { name: 'Centre of Ekas',        km: 1.1,  kind: 'village', walk: 15 },
  { name: 'Pantai Kaliantan',      km: 5,    kind: 'beach' },
  { name: 'Gubuk Kopi',            km: 7,    kind: 'food' },
  { name: 'Lesehan Cemara',        km: 8,    kind: 'food' },
  { name: 'Bakso Diagung Arema',   km: 9,    kind: 'food' },
  { name: 'Mangrove park',         km: 13,   kind: 'trip' },
  { name: 'Lombok International',  km: 42,   kind: 'gate' },
];

/* -- Surf cam --------------------------------------------------------------
   Checked 25 Aug 2026: there is NO live webcam at Ekas. Surf-forecast has no
   cam source for Inside or Outside — they only link cams owned by locals, and
   nobody has put one up. Surfline and Magicseaweed carry forecasts for Ekas
   but no feed.

   So the section stays hidden rather than linking to a page that says "no
   cams here". Set `url` and it appears.

   Worth thinking about: the villa looks straight at Inside Ekas, has power
   and wifi, and there is no competing cam on the bay. A camera on the roof
   would be the only live view of this break anywhere — surfers would check it
   daily, and every one of them would be looking at your terrace. It is the
   cheapest marketing on this list.                                          */
export const SURF_CAM = {
  url: null,          // an embeddable stream URL, or a still image that refreshes
  kind: null,         // 'iframe' | 'image'
  credit: null,       // whose camera it is
  refreshSeconds: 60, // only used for 'image'
};
