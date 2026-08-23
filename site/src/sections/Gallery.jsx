import { useEffect, useState } from 'react';
import { GALLERY } from '../data/content.js';

const B = import.meta.env.BASE_URL;

/* A masonry column layout rather than a grid, so portrait and landscape shots
   sit together without being cropped to a common shape. CSS columns handle it
   with no JavaScript and no layout thrash on resize.

   Clicking opens a lightbox. Escape and the arrow keys work, because a gallery
   you can only leave with the mouse is irritating on a laptop. */
export default function Gallery() {
  const [open, setOpen] = useState(null);   // index, or null

  useEffect(() => {
    if (open === null) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(null);
      if (e.key === 'ArrowRight') setOpen((i) => (i + 1) % GALLERY.length);
      if (e.key === 'ArrowLeft') setOpen((i) => (i - 1 + GALLERY.length) % GALLERY.length);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <section id="gallery" className="bg-(--color-shell) px-5 py-28 lg:px-10 lg:py-40">
      <div className="mx-auto max-w-[1500px]">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="label text-(--color-bronze-lit)">Gallery</p>
            <h2 className="mt-6 max-w-2xl text-[clamp(2.1rem,4.4vw,3.6rem)]">
              Have a look around
            </h2>
          </div>
          <p className="max-w-sm text-(--color-text-soft)">
            More going up as the photography comes in — rooms, the pools, and the
            bay at every hour worth photographing.
          </p>
        </div>

        <div className="mt-14 columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
          {GALLERY.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setOpen(i)}
              className="group block w-full overflow-hidden border border-(--color-line) bg-(--color-plate)"
              aria-label={`Open: ${img.alt}`}
            >
              <img
                src={`${B}images/${img.src}`}
                alt={img.alt}
                loading="lazy"
                className="block w-full transition-transform duration-500 group-hover:scale-[1.03]"
              />
            </button>
          ))}

          {/* Honest empty slots rather than a thin-looking gallery. They tell the
              owners what is still needed and read as deliberate to a guest. */}
          {Array.from({ length: Math.max(0, 6 - GALLERY.length) }).map((_, i) => (
            <div
              key={`slot${i}`}
              className="flex aspect-4/3 w-full items-center justify-center border border-dashed border-(--color-line-lit) bg-(--color-plate)/50"
            >
              <p className="label-sm text-(--color-text-mute)">More coming</p>
            </div>
          ))}
        </div>
      </div>

      {open !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={GALLERY[open].alt}
          onClick={() => setOpen(null)}
          className="fixed inset-0 z-70 flex items-center justify-center bg-(--color-ink)/95 p-5 backdrop-blur-sm"
        >
          <img
            src={`${B}images/${GALLERY[open].src}`}
            alt={GALLERY[open].alt}
            className="max-h-[86vh] max-w-full object-contain"
          />
          <p className="absolute inset-x-0 bottom-6 text-center text-[14px] text-(--color-text-soft)">
            {GALLERY[open].alt}
          </p>
          <button
            type="button"
            onClick={() => setOpen(null)}
            aria-label="Close"
            className="label absolute right-5 top-5 rounded-xs border border-(--color-line-lit) px-4 py-2.5 text-(--color-text)"
          >
            Close
          </button>
        </div>
      )}
    </section>
  );
}
