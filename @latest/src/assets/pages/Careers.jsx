/* eslint-disable react/prop-types */
// src/pages/Careers.jsx
import { useRef, useState, useEffect } from "react";
import { usePageMeta } from "../hooks/usePageMeta";

export default function Careers() {
  useEffect(() => {
    // Always start at top when opening the page
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  const jobs = [
    {
      title: "Landscape Crew Member",
      type: "Full-time",
      desc: "Deliver high-quality landscaping services including mowing, planting, and installations.",
      perks: ["Paid weekly", "Company truck (on shift)", "Uniforms provided"],
      details: {
        summary: "Entry-level role on our maintenance/install crews with clear growth to Lead within ~6–12 months.",
        responsibilities: [
          "Mowing, edging, trimming, blowing, and bed maintenance",
          "Assist with softscape installs: plants, mulch, rock",
          "Basic irrigation checks & reporting leaks/broken heads",
          "Equipment care: fueling, blade checks, cleanliness"
        ],
        requirements: [
          "Valid driver's license & reliable transportation",
          "Comfortable working outdoors in Texas heat",
          "Able to lift 50 lbs and stand for long periods",
          "Positive attitude and willingness to learn"
        ],
        extras: [
          "Starting pay: $15–$20/hr DOE",
          "OT available during peak seasons"
        ]
      }
    },
    {
      title: "Crew Lead / Foreman",
      type: "Full-time",
      desc: "Lead a team on installs and maintenance. Requires lawn/hardscape experience and leadership skills.",
      perks: ["Leadership bonus", "PTO", "401(k) match"],
      details: {
        summary: "Hands-on leader managing 2–4 crew members and daily route quality.",
        responsibilities: [
          "Plan daily tasks and hold crews to quality & safety",
          "Customer walk‑throughs, small change orders, site photos",
          "Hardscape layout: paver paths, borders, small retaining walls",
          "Irrigation troubleshooting and basic repairs"
        ],
        requirements: [
          "2+ years in landscape or hardscape",
          "Clean driving record; comfortable towing",
          "Clear communication & team coaching",
          "Bi‑lingual EN/ES a plus"
        ],
        extras: [
          "Pay: $20–$28/hr + lead bonus",
          "Company truck on shift"
        ]
      }
    },
    {
      title: "Seasonal Helper",
      type: "Part-time / Seasonal",
      desc: "Assist with peak-season work: cleanups, mulch, plantings, irrigation checks. Great entry role.",
      perks: ["Flexible schedule", "Overtime available", "On-the-job training"],
      details: {
        summary: "Flexible role ideal for students/seasonal workers; weekend shifts available.",
        responsibilities: [
          "Spring/fall cleanups and haul‑offs",
          "Mulch installs and plantings",
          "Debris loading and shop organization"
        ],
        requirements: [
          "Able to lift 50 lbs and work outdoors",
          "Weekend availability preferred",
          "No experience required"
        ],
        extras: [
          "Pay: $14–$18/hr",
          "Fast onboarding"
        ]
      }
    }
  ];

  const [selectedRole, setSelectedRole] = useState(jobs[0].title);
  const [modalJob, setModalJob] = useState(null);

  function jumpToApply(role) {
    setSelectedRole(role);
    const el = document.getElementById("apply");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  usePageMeta({
    title: "LawnSolutions",
    description:
      "Join a tight-knit crew building beautiful outdoor spaces. See open roles, benefits, and apply today.",
  });

  return (
    <main className="min-h-screen bg-white">
      {/* Page hero */}
      <section className="relative border-b">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <h1 className="text-4xl md:text-5xl font-extrabold">Careers at LawnSolutions</h1>
          <p className="mt-3 text-lg text-gray-600 max-w-2xl">
            Join a tight-knit, fast-moving team building outdoor spaces people love. Competitive pay, clear growth paths, and respectful culture.
          </p>
          <div className="mt-6">
            <a
              href="#apply"
              onClick={(e) => {
                e.preventDefault();
                jumpToApply(selectedRole);
              }}
              className="px-6 py-3 rounded-xl bg-[#05270a] text-white hover:bg-[#05270a]/90 shadow"
            >
              Apply Now
            </a>
          </div>
        </div>
      </section>

      {/* Recruiting video */}
      <VideoSection
        title="A day on the crew"
        youtubeUrl="https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0&modestbranding=1"
      />

      {/* Open roles */}
      <section className="pt-12 pb-6">
  <div className="max-w-7xl mx-auto px-4">
    <h2 className="text-2xl md:text-3xl font-bold">Open Roles</h2>

    <JobsCarousel jobs={jobs} onApply={jumpToApply} onDetails={(job) => setModalJob(job)} />
  </div>
</section>

      {/* Job details modal */}
      <JobDetailsModal job={modalJob} onClose={() => setModalJob(null)} />

      {/* Application form */}
      <ApplicationForm selectedRole={selectedRole} />
    </main>
  );
}

/* ------------------------- Application Form ------------------------- */
function ApplicationForm({ selectedRole }) {
  const [status, setStatus] = useState({ state: "idle", msg: "" });
  const formRef = useRef(null);
  const fileRef = useRef(null);
  const [fileName, setFileName] = useState("");
  const [fileByteSize, setFileByteSize] = useState(0);
  const [fileError, setFileError] = useState("");

  const MAX_BYTES = 3 * 1024 * 1024; // 3MB

  useEffect(() => {
    // Show success banner when redirected back after submit
    if (location.hash === "#thanks") {
      setStatus({ state: "success", msg: "Thanks for applying! We’ll be in touch." });
      history.replaceState(null, "", location.pathname); // clean hash
    }
  }, []);

  function formatBytes(n) {
    if (!n && n !== 0) return "";
    const mb = n / (1024 * 1024);
    return `${mb.toFixed(mb < 0.1 ? 2 : 1)} MB`;
  }

  function onFileChange(e) {
    const f = e.target.files?.[0];
    if (!f) {
      setFileName("");
      setFileByteSize(0);
      setFileError("");
      return;
    }
    setFileName(f.name);
    setFileByteSize(f.size);

    if (f.type !== "application/pdf") {
      setFileError("Please upload a PDF file.");
    } else if (f.size > MAX_BYTES) {
      setFileError(`File is too large (${formatBytes(f.size)}). Max ${formatBytes(MAX_BYTES)}.`);
    } else {
      setFileError("");
    }
  }

  function clearFile() {
    const input = fileRef.current;
    if (!input) return;

    input.value = "";
    try { input.type = "text"; input.type = "file"; }
    catch {
      const form = document.createElement("form");
      const parent = input.parentNode;
      const next = input.nextSibling;
      form.appendChild(input);
      form.reset();
      parent.insertBefore(input, next);
    }
    setFileName("");
    setFileByteSize(0);
    setFileError("");
    setStatus({ state: "idle", msg: "" });
  }

  // Only block submit when invalid; otherwise let the browser POST to Netlify
  function onSubmit(e) {
    const f = fileRef.current?.files?.[0];
    if (f && (f.type !== "application/pdf" || f.size > MAX_BYTES)) {
      e.preventDefault();
      setStatus({ state: "error", msg: "Please choose a valid PDF under 3MB." });
      return;
    }
    setStatus({ state: "loading", msg: "Submitting..." });
  }

  return (
    <section id="apply" className="py-16 border-t">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold">Application</h2>
        <p className="mt-2 text-gray-600 max-w-2xl">
          Tell us a bit about yourself. We’ll reach out within one business day.
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

        <form
          ref={formRef}
          onSubmit={onSubmit}
          name="job-application"            // Netlify form name
          method="POST"
          data-netlify="true"               // enable Netlify Forms
          encType="multipart/form-data"     // required for file uploads
          action="/careers#thanks"          // success redirect on your site
          netlify-honeypot="bot-field"      // honeypot field name
          className="mt-8 grid gap-4 md:grid-cols-2"
          noValidate
        >
          {/* Netlify requires this hidden input to match the form name */}
          <input type="hidden" name="form-name" value="job-application" />
          {/* Honeypot (must exist and remain empty) */}
          <input type="text" name="bot-field" className="hidden" tabIndex={-1} autoComplete="off" />

          <div className="grid gap-2">
            <label className="text-sm">Full Name</label>
            <input name="name" required className="border rounded-xl px-4 py-3" placeholder="Jane Doe" />
          </div>

          <div className="grid gap-2">
            <label className="text-sm">Email</label>
            <input name="email" type="email" required className="border rounded-xl px-4 py-3" placeholder="jane@example.com" />
          </div>

          <div className="grid gap-2">
            <label className="text-sm">Phone</label>
            <input name="phone" className="border rounded-xl px-4 py-3" placeholder="(555) 123-4567" />
          </div>

          <div className="grid gap-2">
            <label className="text-sm">Position</label>
            <select name="position" defaultValue={selectedRole} className="border rounded-xl px-4 py-3">
              <option>Landscape Crew Member</option>
              <option>Crew Lead / Foreman</option>
              <option>Seasonal Helper</option>
            </select>
          </div>

          <div className="grid gap-2 md:col-span-2">
            <label htmlFor="resume" className="text-sm">Resume (PDF)</label>

            <input
              ref={fileRef}
              id="resume"
              name="attachment"               // Netlify will store this file with the submission
              type="file"
              accept=".pdf,application/pdf"
              className="sr-only"
              onChange={onFileChange}
            />

            <div className="flex items-center gap-3 rounded-xl px-4 py-3 bg-white border">
              {/* File icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-[#05270a] shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                <path d="M14 3v6h6" />
                <path d="M12 17v-6" />
                <path d="M9.5 12.5 12 10l2.5 2.5" />
              </svg>

              {/* Filename + size */}
              <span className="text-sm text-gray-700 truncate flex-1">
                {fileName ? `${fileName} ${fileByteSize ? `— ${formatBytes(fileByteSize)}` : ""}` : "Choose a PDF (max 3MB)"}
              </span>

              {/* Browse */}
              <label
                htmlFor="resume"
                className="inline-flex items-center px-3 py-1 rounded-lg bg-[#05270a] text-white text-xs cursor-pointer hover:bg-[#05270a]/90"
              >
                Browse
              </label>

              {/* Clear */}
              <button
                type="button"
                onClick={clearFile}
                disabled={!fileName}
                aria-label="Remove selected file"
                title="Clear file"
                className="ml-1 inline-flex items-center justify-center w-7 h-7 rounded-md text-red-600 hover:text-red-700 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Inline error */}
            {fileError && <p className="text-xs text-red-600">{fileError}</p>}
            {!fileError && fileName && (
              <p className="text-xs text-gray-500">Looks good. PDF under {formatBytes(MAX_BYTES)}.</p>
            )}
          </div>

          <div className="grid gap-2 md:col-span-2">
            <label className="text-sm">Tell us about your experience</label>
            <textarea name="experience" className="border rounded-xl px-4 py-3 min-h-32" placeholder="Brief summary of relevant work..." />
          </div>

          <button
            type="submit"
            disabled={status.state === "loading" || !!fileError}
            className="md:col-span-2 px-6 py-3 rounded-xl bg-[#05270a] text-white font-semibold hover:bg-[#05270a]/90 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {status.state === "loading" ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      </div>
    </section>
  );
}


/* ------------------------- Video Section component ------------------------ */
function VideoSection({ title = "Our work in action", youtubeUrl, srcMp4, poster }) {
  const isEmbed = Boolean(youtubeUrl);

  return (
    <section id="video" className="pt-6 pb-16 bg-gray-50 border-t">
      <div className="max-w-7xl mx-auto px-4">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="mt-2 text-gray-600 max-w-2xl">
          Get a feel for our team, projects, and the kind of transformations we build every week.
        </p>

        <div className="mt-6 rounded-2xl overflow-hidden shadow border bg-black">
          {isEmbed ? (
            <div className="relative w-full pt-[56.25%]">
              <iframe
                className="absolute inset-0 h-full w-full"
                src={youtubeUrl}
                title="Recruiting video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
              />
            </div>
          ) : (
            <video className="w-full h-auto" controls playsInline poster={poster}>
              <source src={srcMp4} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
        </div>
      </div>
    </section>
  );
}

function JobsCarousel({ jobs, onApply, onDetails }) {
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
      {/* Prev button — now visible on mobile too */}
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

      {/* Rail: no swipe on mobile (overflow hidden), scrollable on desktop */}
      <div
        ref={railRef}
        role="region"
        aria-label="Open roles list"
        className="flex gap-4 overflow-x-hidden md:overflow-x-auto snap-x md:snap-mandatory scroll-px-4
                   px-12"  // padding so arrows don't cover cards
      >
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

      {/* Next button — now visible on mobile too */}
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

/* ------------------------- Job Details Modal ------------------------ */
function JobDetailsModal({ job, onClose }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!job) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();

    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [job, onClose]);

  if (!job) return null;

  return (
    <div
      className="fixed inset-0 z-[60]"
      role="dialog"
      aria-modal="true"
      aria-label={`${job.title} details`}
    >
      {/* Backdrop */}
      <button
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close"
        title="Close"
      />

      {/* Panel */}
      <div className="absolute inset-0 flex items-start md:items-center justify-center p-4 md:p-8">
        <div
          ref={dialogRef}
          tabIndex={-1}
          className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border p-6 outline-none"
        >
          <div className="flex items-start gap-4">
            <div>
              <h3 className="text-xl md:text-2xl font-bold">{job.title}</h3>
              <p className="text-sm text-gray-500">{job.type}</p>
            </div>
          </div>

          {job.details?.responsibilities && (
            <div className="mt-4">
              <h4 className="font-semibold">Responsibilities</h4>
              <ul className="mt-2 list-disc pl-5 space-y-1 text-sm text-gray-700">
                {job.details.responsibilities.map((li) => (
                  <li key={li}>{li}</li>
                ))}
              </ul>
            </div>
          )}

          {job.details?.requirements && (
            <div className="mt-4">
              <h4 className="font-semibold">Requirements</h4>
              <ul className="mt-2 list-disc pl-5 space-y-1 text-sm text-gray-700">
                {job.details.requirements.map((li) => (
                  <li key={li}>{li}</li>
                ))}
              </ul>
            </div>
          )}

          {job.details?.extras && (
            <div className="mt-4">
              <h4 className="font-semibold">Comp & Extras</h4>
              <ul className="mt-2 list-disc pl-5 space-y-1 text-sm text-gray-700">
                {job.details.extras.map((li) => (
                  <li key={li}>{li}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <a
              href="#apply"
              onClick={(e) => {
                e.preventDefault();
                onClose();
                document.getElementById("apply")?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className="inline-flex justify-center px-5 py-3 rounded-xl bg-[#05270a] text-white font-semibold hover:bg-[#05270a]/90"
            >
              Apply for this role
            </a>
            <button
              onClick={onClose}
              className="inline-flex justify-center px-5 py-3 rounded-xl border border-red-200 text-red-600 font-semibold hover:bg-red-100 hover:border-red-300  cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
