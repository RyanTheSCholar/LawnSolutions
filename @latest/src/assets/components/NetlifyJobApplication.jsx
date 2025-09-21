/* eslint-disable react/prop-types */
// src/components/NetlifyJobApplicationForm.jsx
import { useEffect, useRef, useState } from "react";

export default function NetlifyJobApplicationForm({
  formName = "job-application",
  // eslint-disable-next-line react/prop-types
  successTarget = "/careers#thanks", // or "/#thanks" if you don't want SPA rewrites
  selectedRole = "Landscape Crew Member",
  maxBytesMB = 3,
}) {
  const [status, setStatus] = useState({ state: "idle", msg: "" });
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [fileError, setFileError] = useState("");
  const fileRef = useRef(null);

  const MAX_BYTES = maxBytesMB * 1024 * 1024;

  useEffect(() => {
    if (location.hash === "#thanks") {
      setStatus({ state: "success", msg: "Thanks for applying! We’ll be in touch." });
      history.replaceState(null, "", location.pathname); // clear the hash
    }
  }, []);

  function formatBytes(n) {
    const mb = n / (1024 * 1024);
    return `${mb.toFixed(mb < 0.1 ? 2 : 1)} MB`;
  }

  function onFileChange(e) {
    const f = e.target.files?.[0];
    if (!f) {
      setFileName("");
      setFileSize(0);
      setFileError("");
      return;
    }
    setFileName(f.name);
    setFileSize(f.size);

    if (f.type !== "application/pdf") setFileError("Please upload a PDF file.");
    else if (f.size > MAX_BYTES)
      setFileError(`File is too large (${formatBytes(f.size)}). Max ${formatBytes(MAX_BYTES)}.`);
    else setFileError("");
  }

  function clearFile() {
    const input = fileRef.current;
    if (!input) return;
    input.value = "";
    try {
      input.type = "text";
      input.type = "file";
    } catch {
      const tmp = document.createElement("form");
      const parent = input.parentNode;
      const next = input.nextSibling;
      tmp.appendChild(input);
      tmp.reset();
      parent?.insertBefore(input, next || null);
    }
    setFileName("");
    setFileSize(0);
    setFileError("");
    setStatus({ state: "idle", msg: "" });
  }

  // Let the browser POST to Netlify; only block if invalid
  function onSubmit(e) {
    const f = fileRef.current?.files?.[0];
    if (f && (f.type !== "application/pdf" || f.size > MAX_BYTES)) {
      e.preventDefault();
      setStatus({ state: "error", msg: "Please choose a valid PDF under " + maxBytesMB + "MB." });
      return;
    }
    setStatus({ state: "loading", msg: "Submitting..." });
  }

  return (
    <form
      onSubmit={onSubmit}
      name={formName}
      method="POST"
      data-netlify="true"
      encType="multipart/form-data"
      action={successTarget}
      netlify-honeypot="bot-field"
      className="mt-8 grid gap-4 md:grid-cols-2"
      noValidate
    >
      {/* Netlify requirements */}
      <input type="hidden" name="form-name" value={formName} />
      <input type="text" name="bot-field" className="hidden" tabIndex={-1} autoComplete="off" />

      {/* Optional top status (success via #thanks; errors inline) */}
      {status.state === "error" && (
        <div className="md:col-span-2 rounded-xl px-4 py-3 text-sm bg-red-50 text-red-700 border border-red-200">
          {status.msg}
        </div>
      )}
      {status.state === "loading" && (
        <div className="md:col-span-2 rounded-xl px-4 py-3 text-sm bg-gray-50 text-gray-700 border">
          {status.msg}
        </div>
      )}
      {status.state === "success" && (
        <div className="md:col-span-2 rounded-xl px-4 py-3 text-sm bg-green-50 text-green-700 border border-green-200">
          {status.msg}
        </div>
      )}

      {/* Fields */}
      <div className="grid gap-2">
        <label className="text-sm">Full Name</label>
        <input
          name="name"
          required
          className="border rounded-xl px-4 py-3"
          placeholder="Jane Doe"
        />
      </div>

      <div className="grid gap-2">
        <label className="text-sm">Email</label>
        <input
          name="email"
          type="email"
          required
          className="border rounded-xl px-4 py-3"
          placeholder="jane@example.com"
        />
      </div>

      <div className="grid gap-2">
        <label className="text-sm">Phone</label>
        <input
          name="phone"
          className="border rounded-xl px-4 py-3"
          placeholder="(555) 123-4567"
        />
      </div>

      <div className="grid gap-2">
        <label className="text-sm">Position</label>
        <select
          name="position"
          defaultValue={selectedRole}
          className="border rounded-xl px-4 py-3"
        >
          <option>Landscape Crew Member</option>
          <option>Crew Lead / Foreman</option>
          <option>Seasonal Helper</option>
        </select>
      </div>

      {/* Resume upload */}
      <div className="grid gap-2 md:col-span-2">
        <label htmlFor="resume" className="text-sm">Resume (PDF)</label>

        <input
          ref={fileRef}
          id="resume"
          name="attachment"                // Netlify will store this file
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
            {fileName ? `${fileName}${fileSize ? ` — ${formatBytes(fileSize)}` : ""}` : `Choose a PDF (max ${maxBytesMB}MB)`}
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
            className="ml-1 inline-flex items-center justify-center w-7 h-7 rounded-md text-red-600 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
              className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round">
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
        <textarea
          name="experience"
          className="border rounded-xl px-4 py-3 min-h-32"
          placeholder="Brief summary of relevant work..."
        />
      </div>

      <button
        type="submit"
        disabled={status.state === "loading" || !!fileError}
        className="md:col-span-2 px-6 py-3 rounded-xl bg-[#05270a] text-white font-semibold hover:bg-[#05270a]/90 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status.state === "loading" ? "Submitting..." : "Submit Application"}
      </button>
    </form>
  );
}
