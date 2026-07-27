# Villa 25 Ekas — Decisions Register

Every open decision for the website and booking setup, with a recommendation and the
reasoning behind it. Bring this to the clients, tick a column, send it back.

**Status key:** ⬜ open · 🟨 leaning · ✅ decided

---

## A. Money & policy

### A1 — Deposit amount ⬜
| Option | Reasoning |
|---|---|
| **30% on booking, 70% due 14 days before arrival** ← *recommended* | Industry standard for Indonesian villas. Low enough that guests don't hesitate, high enough that no-shows hurt them more than you. |
| 50% / 50% | More cash up front, more booking hesitation. Worth it only if you're funding operations from deposits. |
| 100% on booking | Only sensible for stays under 3 nights or last-minute (<7 days out). Recommend adopting this as a *rule* alongside the 30% default. |

**Decision:** ______________________

### A2 — Cancellation policy ⬜
| Option | Reasoning |
|---|---|
| Flexible — full refund up to 14 days out | Maximum bookings, maximum exposure. Bad fit for a 5-room property where one cancellation is 20% of your inventory. |
| **Moderate — deposit refundable up to 30 days out, 50% of deposit to 14 days, non-refundable inside 14** ← *recommended* | Standard for boutique villas. Guests accept it; you're protected in high season. |
| Strict — deposit non-refundable, date changes offered instead | Best cash protection, but you will lose bookings to competitors on the same search page. |

Add regardless: a **date-change credit** valid 12 months. Costs you nothing, saves most
arguments, and reads as generous.

**Decision:** ______________________

### A3 — Payment rails ⬜
**The constraint:** Stripe does not onboard Indonesian-registered businesses. Options:

| Option | Reasoning |
|---|---|
| **NZ company holds Stripe** ← *recommended if the NZ entity is real and active* | Cleanest guest experience — card payment on your own site, no friction. Needs the NZ company to be the contracting party in your T&Cs. Accountant should sight this. |
| Xendit (Indonesian gateway) | Built for Indonesia, accepts cards + local methods (GoPay, OVO, bank VA). Higher setup friction, ~3.5% + IDR 2,000 per card transaction. The right long-term answer if the business is Indonesian. |
| Wise + manual bank transfer | Zero setup, near-zero fees, but you chase every deposit manually and ~20–30% of guests abandon at the "please transfer" step. Fine for soft opening, not for scale. |

**Recommended sequence:** Wise/bank transfer for the soft opening → Stripe (NZ) or Xendit
once volume justifies the admin.

**Decision:** ______________________

### A4 — Rates confirmation 🟨
Current working numbers:

| Unit | Rate (IDR/night) | ≈ USD | ≈ NZD |
|---|---|---|---|
| Lower-level room (shared kitchen + small pool) × 3 | 1,600,000 | ~$98 | ~$165 |
| 2-bedroom Villa (shares big pool) | 2,500,000 | ~$153 | ~$258 |
| Upstairs 1-bed apartment (restricted availability) | 2,000,000 | ~$123 | ~$207 |

*Conversions approximate, at ~16,300 IDR/USD. Site will show live rates.*

**Open:** are these launch rates or introductory rates? Recommend publishing them as
**"Introductory rates — Opening 2026"**. It justifies a rise later without anyone feeling
misled, and creates urgency now.

**Decision:** ______________________

### A5 — Whole-property buyout discount ⬜
Working idea: all units, minus 40%.

Full stack at rack rate = (3 × 1,600,000) + 2,500,000 + 2,000,000 = **9,300,000 IDR/night**.
Minus 40% = **5,580,000 IDR/night** (~$342 USD).

**Concern worth raising with the clients:** 40% is steep. A buyout guest is your *least*
price-sensitive customer and creates the least operational hassle (one arrival, one
departure, one group of expectations). Recommend **25%** → 6,975,000 IDR (~$428), with 40%
held back as a negotiating card for long stays or low season.

**Decision:** ______________________

### A6 — Minimum nights ⬜
| Context | Recommendation |
|---|---|
| Standard | 2 nights |
| High season (Jun–Sep, Dec–Jan) | 3 nights |
| Whole-property buyout | 3 nights |
| Upstairs apartment when owners are on site | 14 nights (as already agreed) |
| Peak (Christmas/NY) | 5–7 nights |

**Decision:** ______________________

### A7 — Seasonal pricing ⬜
Not enough data yet. Recommend building the *capability* now and leaving it switched off.
Revisit after 6 months of booking data. Typical Lombok pattern: +20–30% Jun–Sep and
Dec–Jan, −15% Feb–Mar (wet season).

**Decision:** ______________________

---

## B. Guest experience

### B1 — Airport transfers ⬜
**Researched facts:** Lombok International (LOP) → Ekas is ~40 km / 24 miles. Real drive
time 1–1.5 hours; the Jerowaru road is narrow and partly unpaved. Existing local operators
charge IDR 200,000–500,000 per vehicle each way.

| Option | Reasoning |
|---|---|
| **Free pickup for stays of 5+ nights, IDR 400,000 otherwise** ← *recommended* | Nudges longer stays, which are far more profitable per hour of staff time. The "free transfer" line is a strong conversion lever on the booking page. |
| Free for all stays | Generous, but you're absorbing ~IDR 800,000 return on a 2-night booking. |
| Always charged | Simplest, but you lose a persuasive selling point for very little money. |

**Decision:** free pickup threshold = ______ nights · charge otherwise = IDR ______

### B2 — Local partner discounts ⬜
Proposal to take to local businesses: **10% for Villa 25 guests on presentation of a card
or code.** Costs them little, guarantees them traffic, costs you nothing, and gives the
website a genuinely useful "Eat & Drink in Ekas" section that competitors won't have.

Targets to approach — fill in as you go:

| Business | Type | Contact | Discount agreed? |
|---|---|---|---|
| | Warung / local | | |
| | Western / café | | |
| | Surf shop / board hire | | |
| | Boat charter | | |
| | Spearfishing guide | | |
| | Massage / spa | | |
| | Scooter hire | | |
| | Cooking class | | |

**Decision:** ______________________

### B3 — Included vs. paid extras ⬜
Which of these are **included in the nightly rate** vs. **charged**?

| Item | Included | Charged (IDR) | Not offered |
|---|---|---|---|
| Breakfast | ⬜ | ⬜ ______ | ⬜ |
| Daily housekeeping | ⬜ | ⬜ ______ | ⬜ |
| Airport transfer | see B1 | | |
| Board storage | ⬜ | ⬜ ______ | ⬜ |
| Board hire | ⬜ | ⬜ ______ | ⬜ |
| Surf guiding | ⬜ | ⬜ ______ | ⬜ |
| Boat to outside break | ⬜ | ⬜ ______ | ⬜ |
| Private chef (per meal) | ⬜ | ⬜ ______ | ⬜ |
| Massage (per hour) | ⬜ | ⬜ ______ | ⬜ |
| Scooter hire (per day) | ⬜ | ⬜ ______ | ⬜ |
| Laundry | ⬜ | ⬜ ______ | ⬜ |
| Ice | ⬜ | ⬜ ______ | ⬜ |

**Note:** "free breakfast" is one of the strongest conversion phrases in villa marketing.
Strongly recommend including it and pricing it into the nightly rate.

---

## C. Website & technology

### C1 — Booking engine ⬜
| Option | Monthly | Reasoning |
|---|---|---|
| **None yet — enquiry form + WhatsApp** ← *recommended for soft opening* | €0 | Zero cost, zero risk, and 5 units is genuinely manageable by hand for the first months. Buys time to see real demand. |
| Beds24 | ~€15–25 | Cheapest real engine. Powerful, embeddable, but the admin interface is dated. |
| Smoobu | ~€25–35 | Much nicer guest-facing widget, German-built so its multi-language booking flow is excellent — directly relevant given DE/FR are target markets. |
| Lodgify | ~€70–140 | Needs the multi-unit tier for your setup. Good, but you're paying largely for a website builder you won't use. |
| GuestPro | Unpublished — request quote | Full PMS + channel manager. Likely overkill until you're on OTAs. |

**Recommended path:** launch with enquiry + WhatsApp → add **Smoobu** at ~3 months if
enquiry volume justifies it.

**Decision:** ______________________

### C2 — Channel manager / OTA sync ⬜
Already leaning: **not needed at launch** — display availability only, drive direct
bookings. Revisit when occupancy plateaus below ~50%; Airbnb and Booking.com cost 15–18%
commission but solve a cold-start problem.

**Decision:** ______________________

### C3 — Domain ⬜ **← time-sensitive**
`villa25ekas.com` — approx **USD $11–12/year** at Porkbun or Cloudflare Registrar (neither
marks up; WHOIS privacy included). Avoid GoDaddy: cheap first year, ~$22+ on renewal.

`.co.id` requires a registered Indonesian company, so `.com` is the correct choice.

**This should be bought this week regardless of build timeline** — it is the only item on
this list that someone else can take from you.

**Decision:** ______________________

### C4 — Hosting ⬜
| Option | Cost | Reasoning |
|---|---|---|
| **Cloudflare Pages** ← *recommended* | Free | Free tier is genuinely unlimited for a site this size. Also gives free country detection for the currency switcher, and free CDN in Asia — meaningfully faster for guests browsing from Indonesia and Australia. |
| Vercel | Free → $20/mo | Slightly nicer developer experience. Free tier has bandwidth limits you could hit with heavy photography. |

**Decision:** ______________________

### C5 — Languages ⬜
Agreed: English, Indonesian, German, French. Machine translation as a first pass, **held
as draft until a native speaker reviews**. One clumsy French sentence does more brand
damage on a luxury site than having no French at all.

**Open:** who reviews DE and FR? Budget ~USD $150–250 for a professional pass over ~1,500
words if no one in the network can do it.

**Decision:** ______________________

### C6 — Instagram strategy ✅ *(resolved)*
Instagram's API only returns your *own* account's media — public keyword search cannot be
pulled programmatically, and scraping it gets IPs blocked. So the gallery is a **media
library** you upload to, with drag-to-reorder, pin, caption, and delete. Auto-sync from
`@villa_25_ekas` can be layered on later once that account has content.

### C7 — Ekas Guide (history, local area, old photos) ⬜
Recommend **phase 2**, but with the route and navigation slot built now so it drops in
without rework. Reasoning: it's the strongest long-term SEO asset on the site — people
search "things to do in Ekas" far more than they search your villa name — but it's several
thousand words of writing that shouldn't block a soft opening.

**Decision:** ______________________

### C8 — Reviews section ⬜
No guests yet, so no reviews. Options: omit the section entirely until real reviews exist
(recommended — fake or placeholder testimonials are a serious trust risk), or replace it
with a "Why guests choose Ekas" section that does similar persuasive work honestly.

**Decision:** ______________________

---

## D. Legal & compliance

### D1 — Terms & conditions ⬜
Required before taking a single deposit. Must cover: deposit and balance schedule,
cancellation, damage liability, house rules, who the contracting entity is (NZ company vs.
Indonesian entity — ties to A3).

### D2 — Privacy policy ⬜
Required — you will have German and French visitors, so **GDPR applies**. Needs to cover
what the enquiry form collects, where it's stored (Supabase), and how to request deletion.
Also drives the cookie/analytics consent banner.

### D3 — Indonesian check-in form ✅
Guests must complete and sign a check-in form and may be asked for valid ID, per
Indonesian regulation. This should be stated on the booking confirmation page and in the
confirmation email — not buried in T&Cs. Draft wording already supplied by the client and
will be adapted.

---

## E. Summary of what blocks the soft opening

| # | Item | Blocks launch? | Owner |
|---|---|---|---|
| 1 | Buy `villa25ekas.com` | **Yes** | Client |
| 2 | Confirm deposit % + cancellation policy | **Yes** — can't take money without it | Client |
| 3 | Payment method for deposits (Wise account details) | **Yes** | Client |
| 4 | Villa photos (interior) | Partially — generics can bridge | Client |
| 5 | Amenities questionnaire returned | **Yes** — can't write accurate copy without it | 3 clients |
| 6 | Logo as vector (SVG/AI) | No — PNG works for now | Client |
| 7 | Drone footage | No — phase 2 hero upgrade | Client |
| 8 | Translation review | No — launch English-first | Client |
| 9 | Booking engine | No — WhatsApp + enquiry covers soft opening | — |
