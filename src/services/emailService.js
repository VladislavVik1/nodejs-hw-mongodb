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

export async function sendMail({ to, subject, html, text, from }) {
  const sender = from || process.env.SMTP_FROM || process.env.SMTP_USER;
  if (!sender) throw new Error("SMTP_FROM or SMTP_USER must be set");
  if (!to) throw new Error('"to" is required');

  const info = await transporter.sendMail({ from: sender, to, subject, html, text });
  console.log("Email sent:", info.messageId);
  return info;
}

export default { sendMail };
