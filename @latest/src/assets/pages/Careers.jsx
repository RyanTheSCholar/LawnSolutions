/* eslint-disable react/prop-types */
// src/pages/Careers.jsx
import { useRef, useState, useEffect } from "react";
import { usePageMeta } from "../hooks/usePageMeta";
import NetlifyJobApplicationForm from "../components/NetlifyJobApplication"; // ⬅ default import
import JobsCarousel from "../components/JobsCarousel";

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
        summary:
          "Entry-level role on our maintenance/install crews with clear growth to Lead within ~6–12 months.",
        responsibilities: [
          "Mowing, edging, trimming, blowing, and bed maintenance",
          "Assist with softscape installs: plants, mulch, rock",
          "Basic irrigation checks & reporting leaks/broken heads",
          "Equipment care: fueling, blade checks, cleanliness",
        ],
        requirements: [
          "Valid driver's license & reliable transportation",
          "Comfortable working outdoors in Texas heat",
          "Able to lift 50 lbs and stand for long periods",
          "Positive attitude and willingness to learn",
        ],
        extras: ["Starting pay: $15–$20/hr DOE", "OT available during peak seasons"],
      },
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
          "Customer walk-throughs, small change orders, site photos",
          "Hardscape layout: paver paths, borders, small retaining walls",
          "Irrigation troubleshooting and basic repairs",
        ],
        requirements: [
          "2+ years in landscape or hardscape",
          "Clean driving record; comfortable towing",
          "Clear communication & team coaching",
          "Bi-lingual EN/ES a plus",
        ],
        extras: ["Pay: $20–$28/hr + lead bonus", "Company truck on shift"],
      },
    },
    {
      title: "Seasonal Helper",
      type: "Part-time / Seasonal",
      desc: "Assist with peak-season work: cleanups, mulch, plantings, irrigation checks. Great entry role.",
      perks: ["Flexible schedule", "Overtime available", "On-the-job training"],
      details: {
        summary: "Flexible role ideal for students/seasonal workers; weekend shifts available.",
        responsibilities: [
          "Spring/fall cleanups and haul-offs",
          "Mulch installs and plantings",
          "Debris loading and shop organization",
        ],
        requirements: ["Able to lift 50 lbs and work outdoors", "Weekend availability preferred", "No experience required"],
        extras: ["Pay: $14–$18/hr", "Fast onboarding"],
      },
    },
  ];

  const [selectedRole, setSelectedRole] = useState(jobs[0].title);
  const [modalJob, setModalJob] = useState(null);

  // Success modal controlled at the page level
  const [showSuccess, setShowSuccess] = useState(false);
  useEffect(() => {
    const params = new URLSearchParams(location.search); // ✅ define params
    if (params.get("submitted") === "1") {
      setShowSuccess(true);
      history.replaceState(null, "", location.pathname); // clear the query
    }
  }, []);

  function jumpToApply(role) {
    setSelectedRole(role);
    const el = document.getElementById("apply");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  usePageMeta({
    title: "LawnSolutions",
    description: "Join a tight-knit crew building beautiful outdoor spaces. See open roles, benefits, and apply today.",
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
      <VideoSection title="A day on the crew" youtubeUrl="https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0&modestbranding=1" />

      {/* Open roles */}
      <section className="pt-12 pb-6">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold">Open Roles</h2>
          <JobsCarousel jobs={jobs} onApply={jumpToApply} onDetails={(job) => setModalJob(job)} />
        </div>
      </section>

      {/* Job details modal */}
      <JobDetailsModal job={modalJob} onClose={() => setModalJob(null)} />

      {/* Application form (Netlify) */}
      <section id="apply" className="py-16 border-t">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold">Application</h2>
          <p className="mt-2 text-gray-600 max-w-2xl">Tell us a bit about yourself. We’ll reach out within one business day.</p>

          <NetlifyJobApplicationForm
            selectedRole={selectedRole}
            successTarget="/careers?submitted=1" // BrowserRouter + SPA rule
          />
        </div>
      </section>

      {/* Success modal (opens after Netlify redirects back with ?submitted=1) */}
      <SuccessModal open={showSuccess} onClose={() => setShowSuccess(false)} />
    </main>
  );
}

/* ------------------------- Video Section component ------------------------ */
function VideoSection({ title = "Our work in action", youtubeUrl, srcMp4, poster }) {
  const isEmbed = Boolean(youtubeUrl);

  return (
    <section id="video" className="pt-6 pb-16 bg-gray-50 border-t">
      <div className="max-w-7xl mx-auto px-4">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="mt-2 text-gray-600 max-w-2xl">Get a feel for our team, projects, and the kind of transformations we build every week.</p>

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

/* ------------------------- Job Details Modal ------------------------ */
function JobDetailsModal({ job, onClose }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!job) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();

    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [job, onClose]);

  if (!job) return null;

  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label={`${job.title} details`}>
      {/* Backdrop */}
      <button className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} aria-label="Close" title="Close" />

      {/* Panel */}
      <div className="absolute inset-0 flex items-start md:items-center justify-center p-4 md:p-8">
        <div ref={dialogRef} tabIndex={-1} className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border p-6 outline-none">
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

/* ------------------------- Success Modal ------------------------ */
function SuccessModal({ open, onClose }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();

    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-label="Application submitted">
      {/* Backdrop */}
      <button className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} aria-label="Close" title="Close" />

      {/* Panel */}
      <div className="absolute inset-0 flex items-start md:items-center justify-center p-4 md:p-8">
        <div ref={dialogRef} tabIndex={-1} className="w-full max-w-md bg-white rounded-2xl shadow-2xl border p-6 outline-none">
          <div className="flex items-start gap-3">
            {/* Check icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-green-600 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <path d="m9 11 3 3L22 4" />
            </svg>

            <div>
              <h3 className="text-lg md:text-xl font-bold">Thanks—application received!</h3>
              <p className="mt-1 text-sm text-gray-600">We’ll review your resume and reach out to you soon.</p>
            </div>
          </div>

          <div className="mt-6 flex items-stretch justify-end gap-3">
            <a
              href="#apply"
              onClick={(e) => {
                e.preventDefault();
                onClose();
                document.getElementById("apply")?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className="inline-flex h-11 items-center justify-center rounded-xl px-5 font-semibold bg-[#05270a] text-white hover:bg-[#05270a]/90"
            >
              Back to Careers
            </a>
            <button
              onClick={onClose}
              className="inline-flex h-11 items-center justify-center rounded-xl px-5 font-semibold border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
