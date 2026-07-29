# Fonts

Self-hosted only. Never link a font from a CDN — it leaks every visitor's IP
address to a third party, adds a DNS round trip before any text can paint, and
fails outright under a strict content security policy.

## Which font goes where

| Slot | CSS token | Font | Status |
|---|---|---|---|
| "Villa 25 Ekas" — the H1 | `--font-brand` | **Transcity** | licence needed |
| "Your perfect Island getaway" — the H2 | `--font-tagline` | **Priestacy** | licence needed |
| Card titles, prices, figures | `--font-display` | system serif stack | fine as-is |
| All running text | `--font-body` | system sans stack | fine as-is |

`app.css` already declares all of them. Drop the `.woff2` files in this folder
with the exact names below and they appear on the next reload. Until then each
one quietly falls through to the next family in its stack, so nothing breaks.

- `Transcity.woff2`
- `Priestacy.woff2`
- `PapeterieDupont-Serif.woff2`  *(only if that one is still wanted)*

---

## Licensing — read before this site goes public

**Transcity and Priestacy are both distributed on 1001fonts as *personal use
only*.** Neither permits commercial use, and neither grants web embedding.

A website advertising villa rooms for money is commercial use. There is no
reading of these licences under which the current setup would be permitted once
the site is live.

Both designers are explicit about penalties:

- **Transcity** — Dharmas Foundry. Prohibits commercial use "including
  Advertising, Promotion, TV, Film, Video, Motion Graphics, Youtube, or Product
  Packaging". Violations charged at **100× the standard licence price**.
  Commercial licence: dharmasstudio.com/transcity
- **Priestacy** — Sronstudio (Yusron Billah). "Not free for commercial use."
  Violation penalty stated as **10× the licence price**.
  Commercial licence: sronstudio.com

### What to buy

Two separate things, and people routinely buy only the first:

1. **A commercial licence** — permits using the font for a business at all.
2. **A webfont licence** — permits serving the font file from a website.
   Usually priced by monthly pageviews.

A desktop licence covers opening the font in Illustrator and exporting a
flattened logo. It does not cover this folder. If the budget only stretches to
one, the sensible move is to set the villa name as artwork inside the logo and
leave the site's headings on the system stack — that needs desktop rights only.

### Installing, once licensed

1. Convert the OTF/TTF to `.woff2` (transfonter.org, or `fonttools`). Roughly
   30% smaller than the original, and universally supported.
2. Subset to Latin while you are there — these faces set a handful of headings,
   so a full character set is wasted bytes. Usually halves the file again.
3. Drop the files here with the names above. Nothing else to change.
