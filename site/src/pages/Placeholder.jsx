import { Link } from 'react-router-dom';

/* Routes that exist so navigation and links never break, but have no content
   yet. Says so plainly rather than showing lorem ipsum — an honest empty page
   is easier to hand to a client than a fake full one. */
export default function Placeholder({ title }) {
  return (
    <section className="mx-auto max-w-3xl px-5 py-32 lg:px-8">
      <p className="label text-(--color-bronze)">Not written yet</p>
      <h1 className="mt-4 text-4xl sm:text-5xl">{title}</h1>
      <p className="mt-6 text-(--color-text-soft)">
        This page is built and routed, but the words and photographs are still
        with the owners. It will fill in before launch.
      </p>
      <Link to="/" className="label mt-10 inline-block border-b border-(--color-bronze) pb-1 text-(--color-bronze)">
        Back to the start
      </Link>
    </section>
  );
}
