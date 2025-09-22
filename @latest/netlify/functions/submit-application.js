/* eslint-disable no-undef */
// netlify/functions/submit-application.js
import parser from "aws-lambda-multipart-parser";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// where to send the application
const TO_EMAIL = process.env.JOBS_TO_EMAIL;   // e.g. "hiring@yourdomain.com"
const FROM_EMAIL = process.env.JOBS_FROM_EMAIL; // e.g. "no-reply@yourdomain.com"

export const handler = async (event) => {
  // Only allow POST
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    // Parse multipart/form-data (body is base64-encoded on Netlify)
    // The second argument 'true' tells the parser to keep file contents as a Buffer
    const data = parser.parse(event, true);

    // Fields from your form
    const name = data.name || "";
    const email = data.email || "";
    const phone = data.phone || "";
    const position = data.position || "";
    const experience = data.experience || "";
    // Your file input (we named it "attachment" in the form)
    const resume = data.attachment || data.resume || null; // allow either key

    // Build email HTML
    const html = `
      <h2>New Job Application</h2>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
      <p><strong>Position:</strong> ${escapeHtml(position)}</p>
      <p><strong>Experience:</strong></p>
      <pre style="white-space:pre-wrap; font:inherit">${escapeHtml(experience)}</pre>
    `;

    // Prepare attachments (optional)
    const attachments = [];
    if (resume && resume.content && resume.filename) {
      attachments.push({
        filename: resume.filename,
        content: Buffer.isBuffer(resume.content)
          ? resume.content.toString("base64")
          : Buffer.from(resume.content, "binary").toString("base64"),
      });
    }

    // Send email via Resend
    await resend.emails.send({
      from: FROM_EMAIL,        // must be a verified sender in Resend
      to: TO_EMAIL,
      subject: `Job Application: ${position || "Unknown Position"} — ${name || "Unknown"}`,
      html,
      attachments,
      reply_to: email || undefined,
    });

    return json(200, { ok: true });
  } catch (err) {
    console.error(err);
    return json(500, { error: "Failed to send" });
  }
};

// Helpers
const escapeHtml = (str) =>
  String(str).replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));

const json = (code, obj) => ({
  statusCode: code,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(obj),
});