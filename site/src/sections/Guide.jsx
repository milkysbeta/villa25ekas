import Parallax from '../components/Parallax.jsx';
import { GUIDE, GUIDE_KINDS } from '../data/content.js';
import { IMAGES } from '../data/images.js';

/* Grouped by kind rather than listed flat, because "a break you can see from
   the villa" and "a beach an hour and a half away" are answers to different
   questions. Someone planning a week reads this looking for one or the other. */
export default function Guide() {
  const groups = Object.keys(GUIDE_KINDS).map((kind) => ({
    kind,
    label: GUIDE_KINDS[kind],
    items: GUIDE.filter((g) => g.kind === kind),
  })).filter((g) => g.items.length);

  return (
    <Parallax
      src={IMAGES.surf.src}
      alt={IMAGES.surf.alt}
      speed={0.12}
      overlay="linear-gradient(to bottom, rgba(16,14,11,.93) 0%, rgba(16,14,11,.88) 50%, rgba(16,14,11,.96) 100%)"
    >
      <section id="guide" className="px-5 py-28 lg:px-10 lg:py-40">
        <div className="mx-auto max-w-[1500px]">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="label text-(--color-bronze-lit)">Ekas Guide</p>
              <h2 className="mt-6 max-w-2xl text-[clamp(2.1rem,4.4vw,3.6rem)]">
                What is worth
                <br />
                doing nearby
              </h2>
            </div>
            <p className="max-w-sm text-(--color-text-soft)">
              Ekas is quiet, and that is the point — but there is more within an
              hour and a half than most people expect.
            </p>
          </div>

          <div className="mt-16 grid gap-12 lg:grid-cols-3 lg:gap-16">
            {groups.map((g) => (
              <div key={g.kind}>
                <p className="label border-b border-(--color-line-lit) pb-3 text-(--color-bronze)">
                  {g.label}
                </p>
                <ul className="flex flex-col">
                  {g.items.map((item) => (
                    <li
                      key={item.id}
                      className="border-b border-(--color-line) py-5"
                    >
                      <div className="flex items-baseline justify-between gap-4">
                        <h3 className="text-xl">{item.name}</h3>
                        {item.drive && (
                          <span className="label-sm shrink-0 tabular-nums text-(--color-text-mute)">
                            {item.drive}
                          </span>
                        )}
                      </div>
                      {item.detail && (
                        <p className="mt-2 text-[15px] text-(--color-text-soft)">
                          {item.detail}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p className="label mt-14 text-(--color-text-mute)">
            A fuller guide — history, old photographs, where to eat — is being
            written
          </p>
        </div>
      </section>
    </Parallax>
  );
}
