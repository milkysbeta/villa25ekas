import { Link } from 'react-router-dom';
import { LOGO } from '../data/images.js';
import { CONTACT, whatsappLink } from '../data/villa.js';
import { NAV_PAGES } from '../lib/routes.js';

export default function Footer() {
  const year = new Date().getFullYear();
  const half = Math.ceil(NAV_PAGES.length / 2);
  const columns = [NAV_PAGES.slice(0, half), NAV_PAGES.slice(half)];

  return (
    <footer className="border-t border-(--color-line) bg-(--color-ink) px-5 py-16 lg:px-10 lg:py-20">
      <div className="mx-auto max-w-[1500px]">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link to="/" className="flex items-center gap-3" aria-label="Villa 25 Ekas — home">
              <img src={LOGO} alt="" width="52" height="52" className="h-13 w-auto object-contain" />
              <span className="flex flex-col leading-none">
                <span className="font-(family-name:--font-brand) text-base uppercase tracking-[0.34em]">
                  Villa 25
                </span>
                <span className="label-sm mt-1.5 text-(--color-text-mute)">Ekas · Lombok</span>
              </span>
            </Link>
            <p className="mt-7 max-w-xs text-[15px] text-(--color-text-soft)">
              A luxurious five bedroom escape above the turquoise waters of Ekas
              Beach. Four minutes&rsquo; walk from the sand.
            </p>
          </div>

          {columns.map((group, i) => (
            <nav key={i} aria-label={i === 0 ? 'Pages' : 'More pages'}>
              <p className={`label text-(--color-bronze) ${i === 0 ? '' : 'invisible hidden lg:block'}`}>
                The villa
              </p>
              <ul className="mt-5 flex flex-col gap-3">
                {group.map((p) => (
                  <li key={p.slug}>
                    <Link
                      to={`/${p.slug}`}
                      className="text-[15px] text-(--color-text-soft) transition-colors hover:text-(--color-bronze-lit)"
                    >
                      {p.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

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
                  href={`tel:${CONTACT.phone}`}
                  className="text-[15px] text-(--color-text-soft) transition-colors hover:text-(--color-bronze-lit)"
                >
                  {CONTACT.phoneShow}
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
