import { JOURNAL } from '../data/content.js';

/* Numbered, because these three are a sequence — the build, the power, the
   people — and reading them in order tells the story of the place.

   Posts marked `draft` show their standfirst and say plainly that the full
   piece is coming. That is better than publishing something written in the
   owners' names that they did not write. */
export default function Journal() {
  return (
    <section id="journal" className="bg-(--color-ink) px-5 py-28 lg:px-10 lg:py-40">
      <div className="mx-auto max-w-[1500px]">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="label text-(--color-bronze-lit)">Journal</p>
            <h2 className="mt-6 max-w-2xl text-[clamp(2.1rem,4.4vw,3.6rem)]">
              How this place
              <br />
              came about
            </h2>
          </div>
          <p className="max-w-sm text-(--color-text-soft)">
            Written by the people who built it, which is the only way it would be
            worth reading.
          </p>
        </div>

        <ul className="mt-16 flex flex-col">
          {JOURNAL.map((post, i) => (
            <li key={post.id} className="border-t border-(--color-line) last:border-b">
              <article className="grid gap-4 py-9 lg:grid-cols-[auto_1fr_auto] lg:items-baseline lg:gap-10">
                <span className="idx">{String(i + 1).padStart(2, '0')}</span>

                <div className="min-w-0">
                  <h3 className="text-2xl lg:text-3xl">{post.title}</h3>
                  <p className="mt-3 max-w-2xl text-(--color-text-soft)">
                    {post.standfirst}
                  </p>
                  <p className="label-sm mt-4 text-(--color-text-mute)">
                    {post.author}
                    {post.date && ` · ${post.date}`}
                  </p>
                </div>

                <p className="label-sm shrink-0 text-(--color-text-mute) lg:text-right">
                  {post.draft ? 'Coming soon' : 'Read'}
                </p>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
