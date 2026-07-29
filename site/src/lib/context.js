import { createContext } from 'react';

/* Kept out of the component files on purpose. Exporting a non-component
   alongside a component breaks React Fast Refresh, which forces a full page
   reload on every edit — painful on a long parallax page where you lose your
   scroll position each time. */
export const Currency = createContext('IDR');

/* One page, so navigation is anchors rather than routes. */
export const SECTIONS = [
  { id: 'welcome',  label: 'Welcome' },
  { id: 'stay',     label: 'Stay' },
  { id: 'booking',  label: 'Availability' },
  { id: 'surf',     label: 'Surf' },
  { id: 'off-grid', label: 'Off-grid' },
  { id: 'journey',  label: 'Getting here' },
  { id: 'contact',  label: 'Contact' },
];
