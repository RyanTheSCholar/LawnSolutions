// src/pages/Home.jsx
import { useState, useRef } from "react";
import { useFaviconMarquee } from "../hooks/useFaviconMarquee";

const serviceImgs = [
  "https://images.unsplash.com/photo-1598970434795-0c54fe7c0642?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1599599810769-9b7b1ea16035?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1597047084895-58ed5300d6a0?q=80&w=1200&auto=format&fit=crop",
];
const galleryImgs = [
  "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1518732714860-b62714ce0c59?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1518732714860-b62714ce0c59?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1473445361085-b9a06f585f02?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1200&auto=format&fit=crop",
];

export default function Home() {
  useFaviconMarquee({ bg: "#05270a", text: "LS", fps: 60 });

  return (
    <>
      <Hero />
      <Badges />
      <Services />
      <CTA />
      <Gallery />
      <Testimonials />
      <Contact />
    </>
  );
}
function Hero() {
  return (
    <section id="home" className="relative">
      {/* Background video */}
      <video
        className="h-[70vh] w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        poster="/hero-poster.jpg"
        preload="metadata"
      >
        {/* Prefer WebM, then MP4 */}
        <source src="/hero.webm" type="video/webm" />
        <source src="/hero.mp4" type="video/mp4" />
        {/* Fallback text */}
        Your browser does not support the video tag.
      </video>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="max-w-7xl mx-auto px-4 text-white">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            Landscaping that makes your home <span className="text-[#05270a]">shine</span>.
          </h1>
          <p className="mt-4 max-w-2xl text-lg md:text-xl text-white/90">
            From lawn care to custom hardscapes, we design and maintain outdoor spaces you'll love coming home to.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="/#contact" className="px-6 py-3 rounded-xl bg-[#05270a] hover:bg-[#05270a]/90 shadow-lg">Request a Quote</a>
            <a href="/#services" className="px-6 py-3 rounded-xl bg-white/10 border border-white/30 hover:bg-white/20">See Services</a>
          </div>
        </div>
      </div>
    </section>
  );
}


function Badges() {
  return (
    <section className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        {[
          ["Locally Owned", "Serving DFW"],
          ["5★ Rated", "100+ reviews"],
          ["Licensed & Insured", "Peace of mind"],
          ["Free Estimates", "Fast scheduling"],
        ].map(([title, subtitle]) => (
          <div key={title} className="p-4 rounded-2xl bg-gray-50 border">
            <p className="font-semibold">{title}</p>
            <p className="text-xs text-gray-500">{subtitle}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Services() {
  const items = [
    { title: "Lawn Care", desc: "Weekly mowing, edging, weed control, fertilization, and seasonal cleanups.", img: serviceImgs[0] },
    { title: "Landscape Design", desc: "Beds, native plants, mulch, irrigation tweaks, and low-maintenance plans.", img: serviceImgs[1] },
    { title: "Hardscapes", desc: "Patios, pathways, retaining walls, stone borders, and outdoor living.", img: serviceImgs[2] },
  ];

  return (
    <section id="services" className="py-16 bg-gradient-to-b from-white to-[#05270a]/10 border-b scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold">Services</h2>
        <p className="mt-2 text-gray-600 max-w-2xl">
          Flexible packages for homes and commercial properties. Tell us your goals— we'll craft the perfect plan.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((s) => (
            <article key={s.title} className="rounded-2xl overflow-hidden border bg-white shadow-sm hover:shadow-md transition">
              <img src={s.img} alt={s.title} className="h-48 w-full object-cover" />
              <div className="p-5">
                <h3 className="text-xl font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{s.desc}</p>
                <a href="/#contact" className="inline-block mt-4 text-sm font-medium text-[#05270a] hover:text-[#05270a]">Get a quote →</a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="py-14">
      <div className="max-w-7xl mx-auto px-4">
        <div className="rounded-3xl bg-[#05270a] text-white p-8 md:p-12 flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            <h3 className="text-2xl md:text-3xl font-bold">Ready for curb appeal that turns heads?</h3>
            <p className="text-white/90 mt-2">Book a free on-site estimate. We'll measure, plan, and send a transparent proposal within 24 hours.</p>
          </div>
          <a href="/#contact" className="px-6 py-3 rounded-xl bg-white text-[#05270a] font-semibold hover:bg-white/90">Request Estimate</a>
        </div>
      </div>
    </section>
  );
}

function Gallery() {
  return (
    <section id="gallery" className="py-16 border-t border-b bg-white scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold">Project Gallery</h2>
        <p className="mt-2 text-gray-600 max-w-2xl">From small touch-ups to full transformations. See a few of our recent projects.</p>
        <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4">
          {galleryImgs.map((src, i) => (
            <img key={i} src={src} alt={`Gallery ${i + 1}`} className="w-full h-40 md:h-56 object-cover rounded-xl border" />
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const data = [
    { name: "Kara M.", quote: "LawnSolutions completely revamped our front yard. The crew was professional and fast—neighbors keep asking who did it!" },
    { name: "Marcus T.", quote: "Consistent, reliable, and they always clean up. Our lawn has never looked better." },
    { name: "Helen S.", quote: "Loved the design options and the clear pricing. Five stars!" },
  ];

  return (
    <section id="testimonials" className="py-16 bg-[#05270a]/5 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold">What clients say</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {data.map((t) => (
            <figure key={t.name} className="rounded-2xl border bg-white p-6 shadow-sm">
              <blockquote className="text-gray-700">“{t.quote}”</blockquote>
              <figcaption className="mt-4 text-sm font-medium">— {t.name}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const ENDPOINT = "https://formsubmit.co/ajax/ryan.bowen000@gmail.com";
  const [status, setStatus] = useState({ state: "idle", msg: "" });
  const formRef = useRef(null);

  // helper to append timestamps
function appendTimestamps(fd) {
  const now = new Date();

  // Fixed CST (UTC-06:00), always labeled "CST", 12-hour format
  const nowUTCms = now.getTime() + now.getTimezoneOffset() * 60000;
  const cst = new Date(nowUTCms - 6 * 60 * 60 * 1000);
  const pad = (n) => String(n).padStart(2, "0");
  const hh = cst.getHours();
  const hh12 = ((hh + 11) % 12) + 1; // 1..12
  const ampm = hh >= 12 ? "PM" : "AM";
  const cstStr =
    `${cst.getFullYear()}-` +
    `${pad(cst.getMonth() + 1)}-` +
    `${pad(cst.getDate())} ` +
    `${pad(hh12)}:` +
    `${pad(cst.getMinutes())}:` +
    `${pad(cst.getSeconds())} ${ampm} CST`;

  fd.append("submitted_at_cst", cstStr);
}



  async function onSubmit(e) {
    e.preventDefault();
    try {
      setStatus({ state: "loading", msg: "Sending..." });
      const formData = new FormData(formRef.current);
      if (formData.get("_gotcha")) return; // honeypot

      // Email formatting/meta
      formData.append("_subject", "New Quote Request — LawnSolutions");
      formData.append("_captcha", "false");
      formData.append("_template", "table");

      // ⬇️ add timestamps
      appendTimestamps(formData);

      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      });
      if (res.ok) {
        setStatus({ state: "success", msg: "Thanks! We’ll be in touch shortly." });
        formRef.current.reset();
      } else {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || "Submission failed");
      }
    } catch (err) {
      setStatus({ state: "error", msg: err.message || "Something went wrong." });
    }
  }

  return (
    <section id="contact" className="py-16 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold">Get your free quote</h2>
        <p className="mt-2 text-gray-600 max-w-2xl">
          Tell us a bit about your property and goals. We'll reach out shortly to schedule a quick walkthrough.
        </p>

        {status.state !== "idle" && (
          <div
            className={`mt-4 rounded-xl px-4 py-3 text-sm ${
              status.state === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : status.state === "error"
                ? "bg-red-50 text-red-700 border border-red-200"
                : "bg-gray-50 text-gray-700 border"
            }`}
          >
            {status.msg}
          </div>
        )}

        <form ref={formRef} onSubmit={onSubmit} className="mt-8 grid gap-4 md:grid-cols-2" noValidate>
          {/* Honeypot */}
          <input type="text" name="_gotcha" className="hidden" tabIndex={-1} autoComplete="off" />
          <div className="grid gap-2">
            <label className="text-sm">Name</label>
            <input name="name" required className="border rounded-xl px-4 py-3" placeholder="Jane Doe" />
          </div>
          <div className="grid gap-2">
            <label className="text-sm">Email</label>
            <input name="email" type="email" required className="border rounded-xl px-4 py-3" placeholder="jane@example.com" />
          </div>
          <div className="grid gap-2 md:col-span-2">
            <label className="text-sm">Address (City / Zip)</label>
            <input name="address" className="border rounded-xl px-4 py-3" placeholder="Arlington, TX 76010" />
          </div>
          <div className="grid gap-2 md:col-span-2">
            <label className="text-sm">What can we help with?</label>
            <textarea name="message" required className="border rounded-xl px-4 py-3 min-h-32" placeholder="Lawn care, bed refresh, patio, irrigation..." />
          </div>
          <button
            type="submit"
            disabled={status.state === "loading"}
            className="md:col-span-2 px-6 py-3 rounded-xl bg-[#05270a] text-white font-semibold hover:bg-[#05270a]/90 disabled:opacity-60"
          >
            {status.state === "loading" ? "Sending..." : "Send Request"}
          </button>
        </form>
      </div>
    </section>
  );
}

