// src/components/JobsCarousel.jsx
/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";

export default function JobsCarousel({ jobs, onApply, onDetails }) {
  const railRef = useRef(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    const update = () => {
      setCanPrev(el.scrollLeft > 0);
      setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const scrollByCards = (dir = 1, cards = 1.5) => {
    const el = railRef.current;
    if (!el) return;
    const card = el.querySelector("[data-card]");
    const w = card ? card.getBoundingClientRect().width : el.clientWidth / 1.5;
    el.scrollBy({ left: dir * w * cards, behavior: "smooth" });
  };

  return (
    <div className="relative mt-6">
      {/* Prev button */}
      <button
        type="button"
        onClick={() => scrollByCards(-1)}
        disabled={!canPrev}
        aria-label="Scroll left"
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10
                   h-10 w-10 flex items-center justify-center rounded-full border bg-white shadow
                   disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      {/* Rail */}
      <div
        ref={railRef}
        role="region"
        aria-label="Open roles list"
        className="flex gap-4 overflow-x-hidden md:overflow-x-auto snap-x md:snap-mandatory scroll-px-4 px-12"
      >
        {/* padding so arrows don't cover cards */}
        {jobs.map((job) => (
          <article
            key={job.title}
            data-card
            className="snap-start flex-none w-[280px] sm:w-[320px] md:w-[360px]
                       flex flex-col border rounded-2xl p-6 shadow-sm bg-gray-50 hover:shadow-md"
          >
            <h3 className="text-xl font-semibold">{job.title}</h3>
            <p className="text-sm text-gray-500">{job.type}</p>
            <p className="mt-3 text-sm text-gray-600 line-clamp-3">{job.desc}</p>

            <ul className="mt-3 text-sm text-gray-600 list-disc pl-5 space-y-1">
              {job.perks.slice(0, 3).map((p) => <li key={p}>{p}</li>)}
            </ul>

            <div className="mt-auto pt-4 flex items-stretch gap-3">
              <button
                type="button"
                onClick={() => onDetails(job)}
                className="inline-flex h-11 items-center justify-center rounded-lg px-3 border text-sm font-medium hover:bg-white/60 cursor-pointer"
              >
                View details
              </button>
              <a
                href="#apply"
                onClick={(e) => { e.preventDefault(); onApply(job.title); }}
                className="inline-flex h-11 items-center justify-center rounded-lg px-3 bg-[#05270a] text-white text-sm font-medium hover:bg-[#05270a]/90"
              >
                Apply →
              </a>
            </div>
          </article>
        ))}
      </div>

      {/* Next button */}
      <button
        type="button"
        onClick={() => scrollByCards(1)}
        disabled={!canNext}
        aria-label="Scroll right"
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10
                   h-10 w-10 flex items-center justify-center rounded-full border bg-white shadow
                   disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
    </div>
  );
}
