// src/App.jsx
import { useState, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { useFaviconMarquee } from "./assets/hooks/useFaviconMarquee.js";

export default function App() {
  useFaviconMarquee({
    size: 96,
    bg: "#05270a",
    color: "#ffffff",
    round: true,
    fps: 60,
    text: "LS",
  });
  return (
    <div className="font-sans text-gray-800">
      <SiteHeader />
      <ScrollToHash /> {/* <-- add this */}
      <Outlet />
      <Footer />
    </div>
  );
}

function ScrollToHash() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const id = hash.slice(1);

    const getHeaderHeight = () =>
      document.querySelector("header")?.offsetHeight ?? 0;

    const scrollToTarget = () => {
      const el = document.getElementById(id);
      if (!el) return false;
      const headerH = getHeaderHeight();
      const extra = 8; // small breathing room
      const y = el.getBoundingClientRect().top + window.scrollY - headerH - extra;
      window.scrollTo({ top: y, behavior: "smooth" });
      return true;
    };

    // Try immediately
    if (scrollToTarget()) return;

    // Observe until target is in DOM (route just mounted)
    const mo = new MutationObserver(() => {
      if (scrollToTarget()) mo.disconnect();
    });
    mo.observe(document.body, { childList: true, subtree: true });

    // A few retries after animations / iOS toolbar collapse
    const timers = [120, 280, 600].map((t) => setTimeout(scrollToTarget, t));

    // Final attempt after full load (images)
    const onLoad = () => scrollToTarget();
    window.addEventListener("load", onLoad, { once: true });

    return () => {
      mo.disconnect();
      timers.forEach(clearTimeout);
      window.removeEventListener("load", onLoad);
    };
  }, [pathname, hash]);

  return null;
}

function SiteHeader() {
  const [open, setOpen] = useState(false);

  // Tiny tap feedback (Android haptics when available)
  const tapFx = () => {
    try { navigator.vibrate?.(12); } catch (_) {}
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand — full page reload on click */}
        <a href="/" className="flex items-center gap-3">
          <picture>
            <source srcSet="/logo-original.png" type="image/webp" />
            <img
              src="/logo-original.png"
              alt="LawnSolutions"
              width="1944"
              height="1015"
              className="h-16 md:h-20 w-auto align-middle"
            />
          </picture>
          <span className="sr-only">LawnSolutions</span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link to="/#services" className="hover:text-[#05270a]">Services</Link>
          <Link to="/#gallery" className="hover:text-[#05270a]">Gallery</Link>
          <Link to="/#testimonials" className="hover:text-[#05270a]">Reviews</Link>
          <Link to="/careers" className="hover:text-[#05270a]">Careers</Link>
          <Link
            to="/#contact"
            className="px-4 py-2 rounded-xl bg-[#05270a] text-white hover:bg-[#05270a]/90 shadow"
          >
            Get a Quote
          </Link>
        </nav>

        {/* Mobile toggle with animated icon + press feedback */}
        <button
          className="md:hidden p-2 rounded-lg border border-gray-300 text-[#05270a] transition active:scale-95"
          onClick={() => { tapFx(); setOpen(v => !v); }}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          <span className="relative block w-7 h-7">
            {/* Hamburger */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                 fill="none" stroke="currentColor" strokeWidth="1.75"
                 strokeLinecap="round" strokeLinejoin="round"
                 className={`absolute inset-0 w-7 h-7 transition-all duration-300 ease-out
                 ${open ? "opacity-0 scale-90 rotate-45" : "opacity-100 scale-100 rotate-0"}
                 motion-reduce:transition-none`}>
              <path d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
            </svg>
            {/* Close (X) */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                 fill="none" stroke="currentColor" strokeWidth="1.75"
                 strokeLinecap="round" strokeLinejoin="round"
                 className={`absolute inset-0 w-7 h-7 transition-all duration-300 ease-out
                 ${open ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-90 -rotate-45"}
                 motion-reduce:transition-none`}>
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </span>
        </button>
      </div>

      {/* Mobile menu: smooth height + fade, tap feedback on links */}
      <div
        id="mobile-menu"
        className={`md:hidden border-t bg-white grid overflow-hidden
          transition-[grid-template-rows,opacity] duration-300 ease-out
          ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0 pointer-events-none"}
          motion-reduce:transition-none`}
        aria-hidden={!open}
      >
        <div className="overflow-hidden">
          <div className="px-4 py-3 flex flex-col gap-2 text-sm">
            <Link
              to="/#services"
              onClick={() => { tapFx(); setOpen(false); }}
              className="group -mx-2 px-2 py-2 rounded-lg transition
                         active:scale-95 hover:bg-gray-50 active:bg-gray-100 focus:bg-gray-100 focus:outline-none"
            >
              <span className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#05270a]/80 opacity-0
                                 group-active:opacity-100 group-focus:opacity-100 transition" />
                Services
              </span>
            </Link>

            <Link
              to="/#gallery"
              onClick={() => { tapFx(); setOpen(false); }}
              className="group -mx-2 px-2 py-2 rounded-lg transition
                         active:scale-95 hover:bg-gray-50 active:bg-gray-100 focus:bg-gray-100 focus:outline-none"
            >
              <span className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#05270a]/80 opacity-0
                                 group-active:opacity-100 group-focus:opacity-100 transition" />
                Gallery
              </span>
            </Link>

            <Link
              to="/#testimonials"
              onClick={() => { tapFx(); setOpen(false); }}
              className="group -mx-2 px-2 py-2 rounded-lg transition
                         active:scale-95 hover:bg-gray-50 active:bg-gray-100 focus:bg-gray-100 focus:outline-none"
            >
              <span className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#05270a]/80 opacity-0
                                 group-active:opacity-100 group-focus:opacity-100 transition" />
                Reviews
              </span>
            </Link>

            <Link
              to="/careers"
              onClick={() => { tapFx(); setOpen(false); }}
              className="group -mx-2 px-2 py-2 rounded-lg transition
                         active:scale-95 hover:bg-gray-50 active:bg-gray-100 focus:bg-gray-100 focus:outline-none"
            >
              <span className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#05270a]/80 opacity-0
                                 group-active:opacity-100 group-focus:opacity-100 transition" />
                Careers
              </span>
            </Link>

            <Link
              to="/#contact"
              onClick={() => { tapFx(); setOpen(false); }}
              className="mt-1 px-4 py-2 rounded-xl bg-[#05270a] text-white text-center
                         hover:bg-[#05270a]/90 active:scale-95 transition"
            >
              Get a Quote
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}


// ... keep your Footer unchanged ...
// src/pages/Home.jsx

function Services() {
  return (
    <section id="services" className="py-16 bg-gradient-to-b from-white to-[#05270a]/10 border-b scroll-mt-24">
      {/* ... */}
    </section>
  );
}

function Gallery() {
  return (
    <section id="gallery" className="py-16 border-t border-b bg-white scroll-mt-24">
      {/* ... */}
    </section>
  );
}

function Testimonials() {
  return (
    <section id="testimonials" className="py-16 bg-[#05270a]/5 scroll-mt-24">
      {/* ... */}
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="py-16 scroll-mt-24">
      {/* ... */}
    </section>
  );
}
/* If you want to use the original LS badge instead of an image, replace the <img> with:
<span className="inline-flex size-9 items-center justify-center rounded-full bg-[#05270a] text-white font-bold">LS</span>
<span className="text-lg font-semibold">LawnSolutions</span>
*/

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-4 gap-8">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <img
              src="/logo-header-40.png"
              srcSet="/logo-header-40.png 1x, /logo-header-80@2x.png 2x"
              alt="LawnSolutions"
              className="h-9 w-auto"
            />
            <span className="sr-only">LawnSolutions</span>
          </div>
          <p className="mt-3 text-sm text-gray-400 max-w-md">
            Design • Build • Maintain — serving the DFW area with friendly, professional service.
          </p>
        </div>

        <div>
          <h4 className="font-semibold">Company</h4>
          <ul className="mt-3 space-y-2 text-sm text-gray-400">
            <li><a href="/#services" className="hover:text-white">Services</a></li>
            <li><a href="/#gallery" className="hover:text-white">Gallery</a></li>
            <li><a href="/#testimonials" className="hover:text-white">Reviews</a></li>
            <li><Link to="/careers" className="hover:text-white">Careers</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold">Contact</h4>
          <ul className="mt-3 space-y-2 text-sm text-gray-400">
            <li>(555) 123-4567</li>
            <li>hello@lawnsolutions.com</li>
            <li>Mon–Sat 8am–6pm</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-6 text-xs text-gray-400 flex flex-wrap items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} LawnSolutions. All rights reserved.</p>
          <p>
            Built by <a href="https://vitejs.dev" target="_blank" rel="noreferrer" className="underline hover:text-white">Ryan Bowen</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
