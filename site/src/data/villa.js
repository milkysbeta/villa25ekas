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
  location: 'Ekas Bay, Lombok, Indonesia',
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
      'The simplest way to stay — and the closest to the water.',
    features: ['Shared kitchen', 'Small pool', 'Garden outlook'],
    bookable: true,
  },
  {
    id: 'two-bedroom',
    name: 'The Two-Bedroom Villa',
    kind: 'villa',
    count: 1,
    rate: 2_500_000,
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
    rate: 2_000_000,
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

  /* CONFLICT, left at Alison's answer. John wanted 25% ("maybe 20%"), Alison
     said "25% is far too much... could be a special price but not encouraged".
     A discount is easy to add and hard to withdraw once published. */
  buyoutDiscount: 0,
  longStayDiscount: null,

  /* CONFLICT, left off. John wanted automatic discounts on orphaned nights,
     Alison said no — consistent with her line on discounts generally. */
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
  airport: { code: 'LOP', name: 'Lombok International', km: 40, hours: [1, 1.5] },
};

/* -- surf ------------------------------------------------------------------
   Breaks shown on the forecast panel and the map. Coordinates are the villa's
   for now; per-break coords to be confirmed.                                */
export const BREAKS = [
  { id: 'inside', name: 'Inside Ekas', note: 'The one you can see from the villa.' },
  { id: 'outside', name: 'Outside Ekas', note: 'By boat. Bigger, heavier, emptier.' },
  { id: 'beach', name: 'The Beach Break', note: 'Where you learn, or where you go when it is small.' },
  { id: 'kura', name: 'Kura Kura', note: '' },
];

/* -- day trips, for the illustrated map ----------------------------------- */
export const NEARBY = [
  { name: 'Kite surfing', drive: null },
  { name: 'Pink Beach', drive: null },
  { name: 'Kuta', drive: '1 hr' },
  { name: 'Selong Belanak', drive: '1.5 hrs' },
];
