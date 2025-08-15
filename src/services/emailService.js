import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

async function sendMail({ to, subject, html, text }) {
  const from = process.env.SMTP_FROM;
  try {
    await transporter.sendMail({ from, to, subject, html, text });
    return true;
  } catch (e) {
    console.error("Email send error:", e);
    return false;
  }
}

export default { sendMail };
