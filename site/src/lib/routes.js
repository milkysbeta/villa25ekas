/* ============================================================================
   The site's pages.

   ONE list, used for three things that must never disagree:
     - the router's routes
     - the navigation and footer links
     - the static HTML files the deploy writes, so every URL survives a hard
       refresh (GitHub Pages has no server-side routing — a path only exists
       if a file exists at it)

   Add a page here and it appears in all three. `slug: ''` is the home page.
   ========================================================================= */

export const BASENAME = '/demo';

export const PAGES = [
  /* Home earns a link of its own as well as the logo. The logo has always gone
     home, but that is a convention people who build websites know and plenty
     of guests do not — and this site is aimed partly at an older audience who
     will look for the word. */
  { slug: '',             label: 'Home',         title: 'Villa 25 Ekas · luxury surf villas in Ekas Bay, Lombok', primary: true, bleed: true },

  /* `primary` marks the ones that earn a place in the top bar. Ten links at a
     readable size do not fit a laptop header, and ten choices is a menu rather
     than a navigation. The rest are one tap away in the mobile menu and listed
     in full in the footer — reachable, just not competing. */
  { slug: 'stay',         label: 'Stay',         title: 'Stay · Villa 25 Ekas',                  primary: true },
  { slug: 'availability', label: 'Availability', title: 'Availability & rates · Villa 25 Ekas',  primary: true, bleed: true },
  /* `bleed` means the page opens with a full-bleed photograph rather than
     text, so it wants no top padding and a transparent header over it — the
     same treatment the home page has always had. Without it the surf photo
     started 96 px down the page with a band of flat ink above it. */
  { slug: 'surf',         label: 'Surf',         title: 'Surf · Villa 25 Ekas',                  primary: true, bleed: true },
  { slug: 'off-grid',     label: 'Off-grid',     title: 'Off the grid · Villa 25 Ekas',          primary: true },
  { slug: 'getting-here', label: 'Getting here', title: 'Getting here · Villa 25 Ekas',          primary: true },
  { slug: 'contact',      label: 'Contact',      title: 'Contact · Villa 25 Ekas',               primary: true },

  { slug: 'experiences',  label: 'Experiences',  title: 'Experiences · Villa 25 Ekas' },
  { slug: 'gallery',      label: 'Gallery',      title: 'Gallery · Villa 25 Ekas' },
  { slug: 'guide',        label: 'Ekas Guide',   title: 'Ekas Guide · Villa 25 Ekas' },
  { slug: 'journal',      label: 'Journal',      title: 'Journal · Villa 25 Ekas' },
];

/** Everything reachable — the mobile menu and the footer show all of these. */
export const NAV_PAGES = PAGES.filter((p) => p.nav !== false);

/** The seven in the desktop top bar. */
export const PRIMARY_PAGES = NAV_PAGES.filter((p) => p.primary);

/** The page a router pathname refers to. Used by both the layout and the
    header so they cannot disagree about which page is showing. */
export const pageFor = (pathname) => {
  const slug = pathname.replace(BASENAME, '').replace(/^\/|\/$/g, '');
  return PAGES.find((p) => p.slug === slug) ?? PAGES[0];
};

/** Slugs the build must write an index.html for. */
export const SLUGS = PAGES.map((p) => p.slug).filter(Boolean);
