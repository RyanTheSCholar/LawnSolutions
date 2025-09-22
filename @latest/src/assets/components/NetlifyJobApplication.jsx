// src/components/JobApplicationForm.jsx
import { useState, useRef } from "react";

const MAX_MB = 5;
const ACCEPTED = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export default function JobApplicationForm() {
  const [status, setStatus] = useState(null); // "loading" | "ok" | "error" | string
  const [resumeFile, setResumeFile] = useState(null);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  const validateFile = (f) => {
    if (!f) return {};
    const tooBig = f.size > MAX_MB * 1024 * 1024;
    const badType = !ACCEPTED.includes(f.type);
    const errs = {};
    if (tooBig) errs.resume = `File too large (max ${MAX_MB} MB).`;
    if (badType) errs.resume = "Only PDF or Word files are allowed.";
    return errs;
  };

  const onFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) {
      setResumeFile(null);
      setErrors((x) => ({ ...x, resume: undefined }));
      return;
    }
    const errs = validateFile(f);
    if (Object.keys(errs).length) {
      setErrors((x) => ({ ...x, ...errs }));
      setResumeFile(null);
      return;
    }
    setErrors((x) => ({ ...x, resume: undefined }));
    setResumeFile(f);
  };

  const clearFile = () => {
    setResumeFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setErrors((x) => ({ ...x, resume: undefined }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);

    // Ensure file exists & valid
    if (!resumeFile) {
      setErrors((x) => ({ ...x, resume: "Please attach your résumé." }));
      return;
    }
    const fileErrs = validateFile(resumeFile);
    if (Object.keys(fileErrs).length) {
      setErrors((x) => ({ ...x, ...fileErrs }));
      return;
    }
    fd.set("resume", resumeFile);

    setStatus("loading");
    try {
      const res = await fetch("/.netlify/functions/submit-application", {
        method: "POST",
        body: fd,
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("ok");
      form.reset();
      clearFile();
      setErrors({});
    } catch (err) {
      setStatus("error");
    }
  };

  const baseInput =
    "mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm " +
    "placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 " +
    "disabled:bg-slate-100 disabled:text-slate-500";
  const labelCls = "block text-sm font-medium text-slate-700";
  const help = "mt-1 text-xs text-slate-500";
  const errText = "mt-1 text-xs text-red-600";

  return (
    <section className="py-8">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <header className="mb-6">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Apply for a Position</h2>
            <p className="mt-1 text-sm text-slate-600">
              Fill out the form below and attach your résumé (PDF/Word).
            </p>
          </header>

          {/* Alert messages */}
          <div aria-live="polite" className="mb-4">
            {status === "loading" && (
              <div className="rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-900">
                Submitting your application…
              </div>
            )}
            {status === "ok" && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                Thanks! Your application has been sent.
              </div>
            )}
            {status === "error" && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
                Something went wrong sending your application. Please try again.
              </div>
            )}
          </div>

          <form
            name="job-application"
            method="POST"
            encType="multipart/form-data"
            data-netlify="true"
            data-netlify-honeypot="bot-field"
            onSubmit={onSubmit}
            className="grid grid-cols-1 gap-5"
          >
            {/* Netlify form name (important) */}
            <input type="hidden" name="form-name" value="job-application" />
            {/* Honeypot */}
            <p className="hidden">
              <label>
                Don’t fill this out: <input name="bot-field" />
              </label>
            </p>

            <div>
              <label className={labelCls} htmlFor="name">
                Full Name
              </label>
              <input id="name" name="name" required className={baseInput} placeholder="Jane Doe" />
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className={labelCls} htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  required
                  className={baseInput}
                  placeholder="jane@example.com"
                />
              </div>
              <div>
                <label className={labelCls} htmlFor="phone">
                  Phone
                </label>
                <input id="phone" name="phone" required className={baseInput} placeholder="(555) 555-5555" />
              </div>
            </div>

            <div>
              <label className={labelCls} htmlFor="position">
                Position
              </label>
              <input id="position" name="position" required className={baseInput} placeholder="Crew Lead" />
            </div>

            <div>
              <label className={labelCls} htmlFor="coverLetter">
                Cover Letter (optional)
              </label>
              <textarea
                id="coverLetter"
                name="coverLetter"
                rows={5}
                className={baseInput + " resize-y"}
                placeholder="Briefly tell us why you’re a great fit…"
              />
              <p className={help}>You can also include any schedule or start-date notes here.</p>
            </div>

            <div>
              <label className={labelCls} htmlFor="resume">
                Résumé <span className="font-normal text-slate-500">(PDF/Doc, ≤ {MAX_MB} MB)</span>
              </label>

              <div className="mt-1 flex items-center gap-2">
                <input
                  ref={fileInputRef}
                  id="resume"
                  type="file"
                  name="resume"
                  accept=".pdf,.doc,.docx"
                  onChange={onFileChange}
                  className={
                    baseInput +
                    " file:mr-4 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-slate-700"
                  }
                  required
                />
                {resumeFile && (
                  <button
                    type="button"
                    onClick={clearFile}
                    className="rounded-full p-1 text-xl leading-none"
                    style={{ color: "red", background: "transparent", border: "none", cursor: "pointer" }}
                    title="Remove file"
                    aria-label="Remove file"
                  >
                    ×
                  </button>
                )}
              </div>

              {resumeFile && (
                <p className={help}>
                  Selected: <span className="font-medium">{resumeFile.name}</span> —{" "}
                  {(resumeFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              )}
              {errors.resume && <p className={errText}>{errors.resume}</p>}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={status === "loading"}
                className="inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "loading" ? "Submitting…" : "Submit Application"}
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Protected by a honeypot. If spam increases, add hCaptcha/Turnstile.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
