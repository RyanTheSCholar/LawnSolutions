// src/pages/Careers.jsx
import { useRef, useState } from "react";

export default function Careers() {
  const jobs = [
    {
      title: "Landscape Crew Member",
      type: "Full-time",
      desc: "Deliver high-quality landscaping services including mowing, planting, and installations.",
      perks: ["Paid weekly", "Company truck (on shift)", "Uniforms provided"],
    },
    {
      title: "Crew Lead / Foreman",
      type: "Full-time",
      desc: "Lead a team on installs and maintenance. Requires lawn/hardscape experience and leadership skills.",
      perks: ["Leadership bonus", "PTO", "401(k) match"],
    },
    {
      title: "Seasonal Helper",
      type: "Part-time / Seasonal",
      desc: "Assist with peak-season work: cleanups, mulch, plantings, irrigation checks. Great entry role.",
      perks: ["Flexible schedule", "Overtime available", "On-the-job training"],
    },
  ];

  const [selectedRole, setSelectedRole] = useState(jobs[0].title);

  function jumpToApply(role) {
    setSelectedRole(role);
    const el = document.getElementById("apply");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

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
            <a href="#apply" onClick={(e) => { e.preventDefault(); jumpToApply(selectedRole); }} className="px-6 py-3 rounded-xl bg-[#05270a] text-white hover:bg-[#05270a]/90 shadow">
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
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {jobs.map((job) => (
              <article key={job.title} className="border rounded-2xl p-6 shadow-sm bg-gray-50 hover:shadow-md">
                <h3 className="text-xl font-semibold">{job.title}</h3>
                <p className="text-sm text-gray-500">{job.type}</p>
                <p className="mt-3 text-sm text-gray-600">{job.desc}</p>
                <ul className="mt-3 text-sm text-gray-600 list-disc pl-5 space-y-1">
                  {job.perks.map((p) => <li key={p}>{p}</li>)}
                </ul>
                <a
                  href="#apply"
                  onClick={(e) => { e.preventDefault(); jumpToApply(job.title); }}
                  className="inline-block mt-4 text-sm font-medium text-[#05270a] hover:text-[#05270a]"
                >
                  Apply for this role →
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Application form */}
      <ApplicationForm selectedRole={selectedRole} />
    </main>
  );
}

/* ------------------------- Application Form ------------------------- */
function ApplicationForm({ selectedRole }) {
  const ENDPOINT = "https://formsubmit.co/ajax/ryan.bowen000@gmail.com";
  const [status, setStatus] = useState({ state: "idle", msg: "" });
  const formRef = useRef(null);
  const fileRef = useRef(null);

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
      setStatus({ state: "loading", msg: "Submitting..." });
      const formData = new FormData(formRef.current);
      if (formData.get("_gotcha")) return; // honeypot

      // Email formatting/meta
      appendTimestamps(formData); // add CST timestamp first
      formData.append("_subject", "New Job Application — LawnSolutions");
      formData.append("_captcha", "false");
      formData.append("_template", "table");
      formData.append("source", "Careers Page");

      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      });

      if (res.ok) {
        setStatus({ state: "success", msg: "Thanks for applying! We’ll be in touch." });
        formRef.current.reset();
        if (fileRef.current) fileRef.current.value = null;
      } else {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || "Submission failed");
      }
    } catch (err) {
      setStatus({ state: "error", msg: err.message || "Something went wrong." });
    }
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

        <form ref={formRef} onSubmit={onSubmit} className="mt-8 grid gap-4 md:grid-cols-2" noValidate>
          {/* Honeypot (bots fill it, humans don't) */}
          <input type="text" name="_gotcha" className="hidden" tabIndex={-1} autoComplete="off" />

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
            <label className="text-sm">Resume (PDF)</label>
            <input ref={fileRef} name="resume" type="file" accept=".pdf" className="border rounded-xl px-4 py-3 bg-white" />
          </div>
          <div className="grid gap-2 md:col-span-2">
            <label className="text-sm">Tell us about your experience</label>
            <textarea name="experience" className="border rounded-xl px-4 py-3 min-h-32" placeholder="Brief summary of relevant work..." />
          </div>

          <button
            type="submit"
            disabled={status.state === "loading"}
            className="md:col-span-2 px-6 py-3 rounded-xl bg-[#05270a] text-white font-semibold hover:bg-[#05270a]/90 disabled:opacity-60"
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
