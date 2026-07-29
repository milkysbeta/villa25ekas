import { LOGO } from '../data/images.js';
import { CONTACT, whatsappLink } from '../data/villa.js';
import { SECTIONS } from '../lib/context.js';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-(--color-line) bg-(--color-ink) px-5 py-16 lg:px-10 lg:py-20">
      <div className="mx-auto max-w-[1500px]">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <a href="#top" className="flex items-center gap-3" aria-label="Villa 25 Ekas — top">
              <img src={LOGO} alt="" width="52" height="52" className="h-13 w-auto object-contain" />
              <span className="flex flex-col leading-none">
                <span className="font-(family-name:--font-display) text-base uppercase tracking-[0.34em]">
                  Villa 25
                </span>
                <span className="label-sm mt-1.5 text-(--color-text-mute)">Ekas · Lombok</span>
              </span>
            </a>
            <p className="mt-7 max-w-xs text-[15px] text-(--color-text-soft)">
              Five rooms above Ekas Bay, run on sunlight and built from local
              timber. Four minutes from the sand.
            </p>
          </div>

          <nav aria-label="Sections">
            <p className="label text-(--color-bronze)">The villa</p>
            <ul className="mt-5 flex flex-col gap-3">
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="text-[15px] text-(--color-text-soft) transition-colors hover:text-(--color-bronze-lit)"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="label text-(--color-bronze)">Get in touch</p>
            <ul className="mt-5 flex flex-col gap-3">
              <li>
                <a
                  href={whatsappLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[15px] text-(--color-text-soft) transition-colors hover:text-(--color-bronze-lit)"
                >
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="text-[15px] break-all text-(--color-text-soft) transition-colors hover:text-(--color-bronze-lit)"
                >
                  {CONTACT.email}
                </a>
              </li>
              <li>
                <a
                  href={`https://instagram.com/${CONTACT.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[15px] text-(--color-text-soft) transition-colors hover:text-(--color-bronze-lit)"
                >
                  @{CONTACT.instagram}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-(--color-line) pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="label-sm text-(--color-text-mute)">
            © {year} Villa 25 Ekas · {CONTACT.location}
          </p>
          <p className="label-sm text-(--color-text-mute)">
            Forecast{' '}
            <a
              href="https://open-meteo.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:text-(--color-bronze-lit)"
            >
              Open-Meteo
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
