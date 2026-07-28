import { useTranslation } from 'react-i18next';
import { CONTACT, whatsappLink } from '../data/villa.js';

export default function Contact() {
  const { t } = useTranslation();

  return (
    <section className="mx-auto max-w-3xl px-5 py-24 lg:px-8 lg:py-32">
      <p className="label text-(--color-bronze)">{t('contact.title')}</p>
      <h1 className="mt-4 text-4xl sm:text-5xl">{t('contact.intro')}</h1>

      <div className="mt-12 flex flex-col gap-4 sm:flex-row">
        <a
          href={whatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="label rounded-xs bg-(--color-bronze) px-8 py-4 text-center font-semibold text-white transition-colors hover:bg-(--color-bronze-dim)"
        >
          {t('contact.whatsapp')}
        </a>
        <a
          href={`mailto:${CONTACT.email}`}
          className="label rounded-xs border border-(--color-sand-line) px-8 py-4 text-center transition-colors hover:border-(--color-bronze) hover:text-(--color-bronze)"
        >
          {t('contact.email')}
        </a>
      </div>

      <dl className="mt-16 flex flex-col gap-6 border-t border-(--color-sand-line) pt-10">
        <div>
          <dt className="label text-(--color-text-mute)">Where</dt>
          <dd className="mt-1 text-lg">{CONTACT.location}</dd>
        </div>
        <div>
          <dt className="label text-(--color-text-mute)">Email</dt>
          <dd className="mt-1 text-lg">{CONTACT.email}</dd>
        </div>
        <div>
          <dt className="label text-(--color-text-mute)">Instagram</dt>
          <dd className="mt-1 text-lg">@{CONTACT.instagram}</dd>
        </div>
      </dl>
    </section>
  );
}
