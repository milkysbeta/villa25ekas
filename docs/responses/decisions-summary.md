# Decisions — where John and Alison agree, and where they don't

**John:** 26 of 29, 28 July 2026
**Alison:** 23 of 29, 25 August 2026

---

## Settled — both chose the same

| # | Decision | Outcome | Applied |
|---|---|---|---|
| 03 | How guests pay | Wise / bank transfer, confirmed by hand | ✅ |
| 04 | Rates | Published as "introductory rates — opening 2026" | ✅ |
| 06 | Minimum nights | 2 normally · 3 high season and buyouts | ✅ |
| 07 | Seasonal pricing | Build it, leave it off | ✅ |
| 09 | Neighbouring villa invoicing | Both said undecided — talk to Mitch first | — |
| 11 | Airport transfers | Always charged | ✅ 450,000 IDR |
| 13 | Domain | Bought, five years | ✅ live |
| 15 | Cloudflare | Both want step-by-step instructions first | ⏳ |
| 16 | Map | Hand-illustrated, with an "open in Google Maps" button | ⏳ |
| 19 | Blog in nav | Yes, from day one | ✅ |
| 27 | Languages | English only at launch | ✅ |

## Resolved by deference

**01 — Deposit.** Both ticked 30/70, but John wrote *"Alison is the booking.com
queen, she'll be better at this one"*, and Alison's own comment contradicts the
box she ticked:

> 30% is too complicated for most. Usually no deposit. Free cancellation up
> until 21 days then full payment taken.

Taking John's deference at face value, that makes the real policy **no deposit ·
free cancellation to 21 days · full payment at 21 days**. Applied, and it
supersedes both the 30/70 tick and Alison's separate "Moderate" answer on
question 02 — the two cannot both be true.

**Worth one more look**, because it is the single most commercially significant
line on the site and it was arrived at sideways rather than by anyone choosing it
outright.

## Alison opted out of authorship

**20 — Blog.** Alison: *"1 by guest, 2 by john, 3 surf coach. Not keen to have me
on post."* John's outline had her writing the piece on local trades. Her wishes
win. Now: a guest, John, and the surf coach. Applied.

---

## Eight genuine conflicts

These need one of you to decide. I have not picked a winner on any of them.

### 1. Whole-property discount (05)

| | |
|---|---|
| **John** | 25%, "but maybe 20%" — also for stays of 3 weeks+ |
| **Alison** | **No standard discount.** "25% is far too much. There could be a special price but not encouraged." |

**Currently: no standard discount.** Alison's position is the more conservative,
and a discount is easy to add later — much harder to withdraw once published.

### 2. Design-invoice commission (08)

| | |
|---|---|
| **John** | 10% of direct bookings until settled |
| **Alison** | **No commission.** "Don't really understand this. We pay bills as they come." |

**Removed entirely.** If a client does not understand a payment arrangement,
it should not be in the build — normal invoicing it is. No discussion needed
unless you want one.

### 3. Local business discounts (12)

| | |
|---|---|
| **John** | Yes — approach them before opening. Reciprocal, not commission: "we won't get a cut, but when we go down we get free food and drink." |
| **Alison** | **Skip it.** |

**Nothing built.** John's version costs nothing and is really a relationship
rather than a feature, so it may be worth him explaining that framing to Alison.

### 4. Currency display (21)

| | |
|---|---|
| **John** | IDR always, plus an auto-detected converter — NZD, AUD, EUR, GBP, USD |
| **Alison** | **IDR only.** |

**Unchanged for now** — the converter is still on. It is one line to switch off.
My own view, for what it is worth: most guests will be converting anyway, and
they will do it in a worse way in another tab. But it is a real preference and
Alison may have a reason.

### 5. Reviews section (22)

| | |
|---|---|
| **John** | Replace with "Why guests choose Ekas" |
| **Alison** | **Leave it out** until real reviews exist |

Not far apart — neither wants invented testimonials. **Nothing built yet.**

### 6. Ekas Guide (23)

| | |
|---|---|
| **John** | Build the page and nav slot now, write it after opening |
| **Alison** | **Skip it.** "Put info folder in each room." |

**The Guide page exists.** Alison's instinct is sound for guests already staying
— but a printed folder in a room cannot be found on Google by someone deciding
where to go. They solve different problems, and both are cheap.

### 7. Gap-night discounts (26)

| | |
|---|---|
| **John** | Yes — automatic discount on orphaned nights |
| **Alison** | **No.** |

**Switched off.** Consistent with Alison's line on discounts generally.

### 8. The booking system itself (25)

This is the big one.

| | |
|---|---|
| **John** | Only a paid deposit holds dates — will check with Gavin and Max |
| **Alison** | *"Not sure how this works. I don't think we need a booking site. Using booking.com enables us to block out dates that have enquired and paid directly through us."* |

Alison is questioning whether the availability calendar should exist at all, and
she is not wrong to: if Booking.com is the system of record, a second calendar on
your own site is a second thing to keep in step, and the failure mode is
double-booking a room.

**Two coherent answers, and they are quite different sites:**

- **Booking.com is the system of record.** The site's job is to make people want
  to stay, then send them to Booking.com. No calendar. Simplest to run, but you
  pay 15–18% commission on everything.
- **Direct bookings matter.** Keep the calendar, and connect it to Booking.com
  through a channel manager (Beds24, Smoobu, Hosthub — €15–35/month) so one
  calendar drives both. More setup, no commission on direct bookings.

Worth knowing: **Booking.com has no open API.** Their Connectivity APIs are
restricted to certified partners aimed at channel managers, so "our own styling,
synced with Booking.com" always means a channel manager in the middle.

The calendar is built and working. It is not wasted either way — but which of
these you pick changes what the site is for.

---

## Still nobody's answer

| # | Question | Blocks launch |
|---|---|---|
| 10 | How the neighbouring villa should be described | |
| 14 | Which email addresses | |
| 17 | Arrival routes — John gave Senggigi, needs the boat/flight detail | **yes** |
| 18 | What the map marks — John answered, Alison did not | |
| 28 | Soft opening — John says 1 September, Alison did not answer | **yes** |
