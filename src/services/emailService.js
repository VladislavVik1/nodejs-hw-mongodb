// src/services/emailService.js
import nodemailer from "nodemailer";

// создаём транспорт с таймаутами, чтобы не «висло»
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: String(process.env.SMTP_SECURE || "false") === "true", // true для 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
  connectionTimeout: 10000, // 10s
  greetingTimeout: 5000,    // 5s
  socketTimeout: 15000,     // 15s
  pool: true,
  maxConnections: 3,
  maxMessages: 20,
});

const from = process.env.SMTP_FROM || process.env.SMTP_USER;

export async function sendMail({ to, subject, html, text }) {
  try {
    const info = await transporter.sendMail({ from, to, subject, html, text });
    console.log("Email sent:", info.messageId);
    return true;
  } catch (err) {
    console.error("Email send error:", err);
    return false;
  }
}

export default { sendMail };
