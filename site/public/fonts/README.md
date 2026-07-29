# Fonts

Self-hosted only. Never link a font from a CDN — it leaks every visitor's IP
address to a third party, adds a DNS round trip before any text can paint, and
fails outright under a strict content security policy.

## Papeterie Dupont

Commercial font duo by Elvina Gafarova (Elvina Studio). Buy from Creative
Market, MyFonts or the designer's Etsy shop.

**Buy the WEBFONT licence, not just the desktop one.** A desktop licence covers
putting the font in Illustrator and exporting a flattened logo. It does *not*
cover serving the font file from a website — that needs a web licence, usually
priced by monthly pageviews. Getting this wrong is the single most common
licensing mistake on small brand sites, and foundries do check.

### Installing it

1. Convert the OTF/TTF to `.woff2` (https://transfonter.org, or `fonttools`).
   woff2 is roughly 30% smaller than the original and every browser in use
   supports it.
2. Drop the files here with these exact names:

   - `PapeterieDupont-Serif.woff2`
   - `PapeterieDupont-Script.woff2`   (optional — only if the script is used)

3. That is all. `src/styles/app.css` already declares them and the site will
   pick them up on the next reload.

Until the files exist the browser quietly falls back to the stack in
`--font-brand`, so nothing breaks in the meantime.

### Subsetting

The serif is only used for a handful of headings, so a full character set is
wasted bytes. Transfonter can subset to Latin — usually cuts the file by half
or more. Worth doing before launch.
