// src/App.jsx
import { useState } from "react";
import { Outlet, Link } from "react-router-dom";

export default function App() {
  return (
    <div className="font-sans text-gray-800">
      <SiteHeader />
      <Outlet />
      <Footer />
    </div>
  );
}

function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Brand (uses your exported logo in /public). If you prefer the LS badge, see comment below */}
        <Link to="/" className="flex items-center gap-3">
  <picture>
    <source srcSet="/logo-original.png" type="image/png" />
    <img
      src="/logo-original.png"
      alt="LawnSolutions"
      width="1944"   // intrinsic size for CLS prevention
      height="1015"  // intrinsic size for CLS prevention
      className="h-16 md:h-20 w-auto align-middle"
    />
  </picture>
  <span className="sr-only">LawnSolutions</span>
</Link>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          <a href="/#services" className="hover:text-[#05270a]">Services</a>
          <a href="/#gallery" className="hover:text-[#05270a]">Gallery</a>
          <a href="/#testimonials" className="hover:text-[#05270a]">Reviews</a>
          <Link to="/careers" className="hover:text-[#05270a]">Careers</Link>
          <a
            href="/#contact"
            className="px-4 py-2 rounded-xl bg-[#05270a] text-white hover:bg-[#05270a]/90 shadow"
          >
            Get a Quote
          </a>
        </nav>

        <button
          className="md:hidden p-2 rounded-lg border"
          onClick={() => setOpen(!open)}
          aria-label="Toggle Menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
            <path d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/>
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t bg-white">
          <div className="px-4 py-3 flex flex-col gap-3 text-sm">
            <a href="/#services" onClick={() => setOpen(false)}>Services</a>
            <a href="/#gallery" onClick={() => setOpen(false)}>Gallery</a>
            <a href="/#testimonials" onClick={() => setOpen(false)}>Reviews</a>
            <Link to="/careers" onClick={() => setOpen(false)} className="hover:text-[#05270a]">Careers</Link>
            <a
              href="/#contact"
              onClick={() => setOpen(false)}
              className="px-4 py-2 rounded-xl bg-[#05270a] text-white text-center hover:bg-[#05270a]/90"
            >
              Get a Quote
            </a>
          </div>
        </div>
      )}
    </header>
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
            Built with <a href="https://vitejs.dev" target="_blank" rel="noreferrer" className="underline hover:text-white">Vite</a> &{" "}
            <a href="https://react.dev" target="_blank" rel="noreferrer" className="underline hover:text-white">React</a>.
          </p>
        </div>
      </div>
    </footer>
  );
}
