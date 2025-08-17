// src/services/emailService.js
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: String(process.env.SMTP_SECURE || "false") === "true", // true для 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
  connectionTimeout: 10000,
  greetingTimeout: 5000,
  socketTimeout: 15000,
  pool: true,
});

const from = process.env.SMTP_FROM || process.env.SMTP_USER;

export async function sendMail({ to, subject, html, text }) {
  try {
    if (!from) {
      throw new Error("SMTP_FROM or SMTP_USER must be set");
    }
    const info = await transporter.sendMail({ from, to, subject, html, text });
    console.log("Email sent:", info.messageId);
    return true;
  } catch (err) {
    console.error("Email send error:", err?.message || err);
    throw err;
  }
}

export default { sendMail };
