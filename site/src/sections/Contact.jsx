import Parallax from '../components/Parallax.jsx';
import { CONTACT, whatsappLink } from '../data/villa.js';
import { IMAGES } from '../data/images.js';

export default function Contact() {
  return (
    <Parallax
      src={IMAGES.closing.src}
      alt={IMAGES.closing.alt}
      speed={0.16}
      overlay="linear-gradient(to bottom, rgba(16,14,11,.9) 0%, rgba(16,14,11,.78) 45%, rgba(16,14,11,.94) 100%)"
    >
      <section id="contact" className="px-5 py-32 lg:px-10 lg:py-44">
        <div className="mx-auto grid max-w-[1500px] gap-16 lg:grid-cols-2 lg:gap-24">
          <div>
            <p className="label text-(--color-bronze-lit)">Get in touch</p>
            <h2 className="mt-6 text-[clamp(2.1rem,4.4vw,3.6rem)]">
              Come and see it
              <br />
              for yourself
            </h2>
            <p className="mt-8 max-w-md text-lg text-(--color-text-soft)">
              Send us your dates and how many of you there are. We answer within
              a day, usually sooner, and there is no booking form to fight with.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="label btn btn-solid"
              >
                Message on WhatsApp
              </a>
              <a href={`mailto:${CONTACT.email}`} className="label btn btn-line">
                Send an email
              </a>
            </div>
          </div>

          <dl className="flex flex-col self-center">
            {[
              ['Where', CONTACT.location],
              ['Email', CONTACT.email],
              ['WhatsApp', `+${CONTACT.whatsapp}`],
              ['Instagram', `@${CONTACT.instagram}`],
            ].map(([term, value]) => (
              <div
                key={term}
                className="flex flex-col gap-1 border-t border-(--color-line-lit) py-5 last:border-b sm:flex-row sm:items-baseline sm:gap-8"
              >
                <dt className="label w-32 shrink-0 text-(--color-text-mute)">{term}</dt>
                <dd className="text-lg">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </Parallax>
  );
}
