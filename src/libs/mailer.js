import nodemailer from 'nodemailer';

const {
  SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM,
} = process.env;

export const mailer = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT || 587),
  secure: false,
  auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
});

export const sendMail = async ({ to, subject, html, text }) => {
  return mailer.sendMail({ from: SMTP_FROM, to, subject, text, html });
};
