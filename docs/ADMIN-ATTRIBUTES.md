# Admin Portal — Controllable Attributes

Everything the admin portal could control, with the permission level I'd suggest and a
build-cost estimate. Use this to decide scope: **tick what you want in v1**, and anything
untickled becomes phase 2 without wasted work.

**Roles:** `OWNER` (you + Alison + partners) · `MANAGER` (island staff) · `—` (nobody, hard-coded)

**Cost key:** ● small · ●● medium · ●●● large

Portal login: password-protected. Working preview password `ekasadmin123` — **must be
replaced with per-user accounts before the site is public.**

---

## 1. Availability & bookings

| Attribute | Role | Cost | v1? |
|---|---|---|---|
| Block/unblock dates per unit | OWNER + MANAGER | ●● | ⬜ |
| Owner-occupied blackout for the upstairs apartment | OWNER | ● | ⬜ |
| Auto 14-night minimum when owners on site | OWNER | ● | ⬜ |
| View incoming enquiries | OWNER + MANAGER | ● | ⬜ |
| Mark enquiry as replied / confirmed / lost | OWNER + MANAGER | ● | ⬜ |
| Manually enter a booking (phone/walk-in) | OWNER + MANAGER | ●● | ⬜ |
| Calendar overview across all units | OWNER + MANAGER | ●● | ⬜ |
| Export bookings to CSV | OWNER | ● | ⬜ |

## 2. Pricing

| Attribute | Role | Cost | v1? |
|---|---|---|---|
| Nightly rate per unit | OWNER | ● | ⬜ |
| Whole-property buyout rate / discount % | OWNER | ● | ⬜ |
| Minimum nights (global + per unit) | OWNER | ● | ⬜ |
| Seasonal rate periods | OWNER | ●● | ⬜ |
| Deposit % | OWNER | ● | ⬜ |
| Extra-guest surcharge | OWNER | ● | ⬜ |
| Show/hide prices publicly | OWNER | ● | ⬜ |

## 3. Media library

| Attribute | Role | Cost | v1? |
|---|---|---|---|
| Upload photos | OWNER + MANAGER | ●● | ⬜ |
| Drag to reorder | OWNER + MANAGER | ●● | ⬜ |
| Pin to top / feature | OWNER + MANAGER | ● | ⬜ |
| Caption + alt text (per language) | OWNER + MANAGER | ●● | ⬜ |
| Delete | OWNER | ● | ⬜ |
| Assign photo to a section (hero, villa, surf, gallery) | OWNER + MANAGER | ●● | ⬜ |
| Tag source (official / guest / Instagram) | OWNER + MANAGER | ● | ⬜ |
| Record photo permission/credit | OWNER + MANAGER | ● | ⬜ |
| Replace hero image | OWNER | ● | ⬜ |
| Upload video for hero | OWNER | ●● | ⬜ |

## 4. Content

| Attribute | Role | Cost | v1? |
|---|---|---|---|
| Edit headline + subheadline | OWNER | ● | ⬜ |
| Edit each unit's description | OWNER | ●● | ⬜ |
| Edit amenity list (add/remove/reorder) | OWNER | ●● | ⬜ |
| Edit experiences + prices | OWNER + MANAGER | ●● | ⬜ |
| Edit local partners & discounts | OWNER + MANAGER | ●● | ⬜ |
| Edit "Our Favourites" picks | OWNER | ● | ⬜ |
| Edit house rules | OWNER | ● | ⬜ |
| Edit T&Cs / privacy / cancellation text | OWNER | ● | ⬜ |
| Per-language editing (EN/ID/DE/FR) | OWNER | ●●● | ⬜ |
| Mark a translation "needs review" | OWNER | ● | ⬜ |

## 5. Theme *(deferred — design to be locked first)*

Per your note: **one theme for now**, saved under the name `villa`. Everything below is
built as design tokens so it's editable later without a rewrite, but no editing UI in v1.

| Attribute | Role | Cost | v1? |
|---|---|---|---|
| Colour tokens (bg, surface, gold, sand, sage, ocean, text, hover) | OWNER | ●● | ⬜ |
| Heading font + body font | OWNER | ●● | ⬜ |
| Base font size *(accessibility lever for older guests)* | OWNER | ● | ⬜ |
| Named theme presets | OWNER | ●● | ⬜ |
| Draft → preview → publish flow | OWNER | ●● | ⬜ |

## 6. Site settings

| Attribute | Role | Cost | v1? |
|---|---|---|---|
| Coming-soon mode on/off | OWNER | ● | ⬜ |
| Preview password | OWNER | ● | ⬜ |
| Contact email / phone / WhatsApp number | OWNER | ● | ⬜ |
| Instagram handle | OWNER | ● | ⬜ |
| Which currencies appear in the switcher | OWNER | ● | ⬜ |
| Which languages are live vs. hidden | OWNER | ● | ⬜ |
| Surf breaks shown on the forecast panel | OWNER | ● | ⬜ |
| Forecast length (3 or 5 day) | OWNER | ● | ⬜ |
| Map pin location | OWNER | ● | ⬜ |
| SEO title/description per page | OWNER | ●● | ⬜ |

## 7. Users

| Attribute | Role | Cost | v1? |
|---|---|---|---|
| Invite a user by email | OWNER | ●● | ⬜ |
| Set role (owner / manager) | OWNER | ● | ⬜ |
| Deactivate a user | OWNER | ● | ⬜ |
| Activity log — who changed what, when | OWNER | ●● | ⬜ |

---

## Recommended v1 scope

If the goal is a soft opening in 3 weeks, build **sections 1, 3, 6 and 7** plus the
pricing basics from 2. That gives the island managers everything they need day-to-day
(availability, enquiries, photos, contact details) while content and theme editing wait
until the design is locked and the copy is signed off.

Sections 4 and 5 are where these projects quietly turn into a six-month CMS build. Worth
being deliberate about.
