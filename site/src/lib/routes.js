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
  { slug: '',             label: 'Home',         title: 'Villa 25 Ekas — luxury surf villas in Ekas Bay, Lombok', nav: false },
  { slug: 'stay',         label: 'Stay',         title: 'Stay — Villa 25 Ekas' },
  { slug: 'availability', label: 'Availability', title: 'Availability & rates — Villa 25 Ekas' },
  { slug: 'surf',         label: 'Surf',         title: 'Surf — Villa 25 Ekas' },
  { slug: 'off-grid',     label: 'Off-grid',     title: 'Off the grid — Villa 25 Ekas' },
  { slug: 'experiences',  label: 'Experiences',  title: 'Experiences — Villa 25 Ekas' },
  { slug: 'gallery',      label: 'Gallery',      title: 'Gallery — Villa 25 Ekas' },
  { slug: 'guide',        label: 'Ekas Guide',   title: 'Ekas Guide — Villa 25 Ekas' },
  { slug: 'getting-here', label: 'Getting here', title: 'Getting here — Villa 25 Ekas' },
  { slug: 'journal',      label: 'Journal',      title: 'Journal — Villa 25 Ekas' },
  { slug: 'contact',      label: 'Contact',      title: 'Contact — Villa 25 Ekas' },
];

/** Pages that appear in the navigation. */
export const NAV_PAGES = PAGES.filter((p) => p.nav !== false);

/** Slugs the build must write an index.html for. */
export const SLUGS = PAGES.map((p) => p.slug).filter(Boolean);
