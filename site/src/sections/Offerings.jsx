/* The four-column row from the reference sites. Line icons, drawn rather than
   pulled from a set, so they share a stroke weight with the rest of the page. */

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.1,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

const Wave = () => (
  <svg viewBox="0 0 32 32" className="h-8 w-8" {...stroke} aria-hidden="true">
    <path d="M2 20c3.5 0 3.5-4 7-4s3.5 4 7 4 3.5-4 7-4 3.5 4 7 4" />
    <path d="M2 26c3.5 0 3.5-3 7-3s3.5 3 7 3 3.5-3 7-3 3.5 3 7 3" opacity=".55" />
    <path d="M20 12a6 6 0 0 0-9.6-4.8" />
  </svg>
);

const Sun = () => (
  <svg viewBox="0 0 32 32" className="h-8 w-8" {...stroke} aria-hidden="true">
    <circle cx="16" cy="16" r="5.5" />
    <path d="M16 3v3.5M16 25.5V29M3 16h3.5M25.5 16H29M6.8 6.8l2.5 2.5M22.7 22.7l2.5 2.5M25.2 6.8l-2.5 2.5M9.3 22.7l-2.5 2.5" />
  </svg>
);

const Water = () => (
  <svg viewBox="0 0 32 32" className="h-8 w-8" {...stroke} aria-hidden="true">
    <path d="M16 3.5s7.5 8.4 7.5 13.2a7.5 7.5 0 0 1-15 0C8.5 11.9 16 3.5 16 3.5Z" />
    <path d="M12.6 17.4a3.5 3.5 0 0 0 3.4 3.6" opacity=".6" />
  </svg>
);

const Leaf = () => (
  <svg viewBox="0 0 32 32" className="h-8 w-8" {...stroke} aria-hidden="true">
    <path d="M26 5.5c1 9.5-4 17-12.5 17.5A7.6 7.6 0 0 1 6 15.5C6.5 7 14 3.5 26 5.5Z" />
    <path d="M6 27c4-6.5 9-11 15-14" opacity=".6" />
  </svg>
);

const ITEMS = [
  {
    icon: <Wave />,
    title: 'Surf on the doorstep',
    body: 'Inside Ekas breaks in front of the villa. Outside is a short boat ride, and empties the moment the day boats leave.',
  },
  {
    icon: <Sun />,
    title: 'Entirely off-grid',
    body: '12.6 kW of solar and 46 kWh of battery. The air conditioning runs all night on yesterday afternoon.',
  },
  {
    icon: <Water />,
    title: 'Two pools',
    body: 'The big pool for the villa and the apartment, a smaller one shared by the garden rooms.',
  },
  {
    icon: <Leaf />,
    title: 'Built from here',
    body: 'Locally sourced hardwood for colour, strength and durability — much of it recycled. The water the house uses goes back into the gardens.',
  },
];

export default function Offerings() {
  return (
    <section className="border-y border-(--color-line) bg-(--color-shell)">
      <div className="mx-auto grid max-w-[1500px] gap-px bg-(--color-line) px-0 sm:grid-cols-2 lg:grid-cols-4">
        {ITEMS.map((item) => (
          <article key={item.title} className="bg-(--color-shell) px-7 py-12 lg:px-9 lg:py-16">
            <span className="text-(--color-bronze)">{item.icon}</span>
            <h3 className="label mt-7 text-(--color-text)">{item.title}</h3>
            <p className="mt-4 text-[15.5px] leading-relaxed text-(--color-text-soft)">
              {item.body}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
