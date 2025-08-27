// src/controllers/authResetController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import User from "../models/user.js";
import Session from "../models/session.js";
import { sendMail } from "../services/emailService.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";
// прибираємо можливий трейлінг-слеш, щоб лінк не подвоював слеші
const APP_DOMAIN = (process.env.APP_DOMAIN || "http://localhost:3000").replace(/\/$/, "");

// Щоб не «висіло», якщо SMTP зависає
const withTimeout = (promise, ms = 15000) =>
  Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(createHttpError(504, "Email service timeout")), ms)
    ),
  ]);

// POST /auth/send-reset-email
export const sendResetEmail = async (req, res, next) => {
  try {
    const { email } = req.body || {};
    if (!email) throw createHttpError(400, "Email is required");

    const user = await User.findOne({ email });

    // Не розкриваємо, чи існує користувач — відповідь однакова
    if (user) {
      const token = jwt.sign(
        { sub: user._id.toString(), email },
        JWT_SECRET,
        { expiresIn: "5m" }
      );

      const resetLink = `${APP_DOMAIN}/reset-password?token=${encodeURIComponent(token)}`;

      await withTimeout(
        sendMail({
          to: email,
          subject: "Password reset",
          html: `
            <p>Щоб скинути пароль, перейдіть за посиланням (дійсне 5 хвилин):</p>
            <p><a href="${resetLink}">${resetLink}</a></p>
          `,
          text: `Reset your password (valid 5 minutes): ${resetLink}`,
        })
      ).catch((err) => {
        // Якщо SMTP зламався — все одно не палимо існування юзера,
        // але лог дамо у консоль для дебагу
        console.error("send-reset-email error:", err?.message || err);
      });
    }

    return res.status(200).json({
      status: 200,
      message: "If this email exists, a reset link was sent",
      data: {},
    });
  } catch (err) {
    return next(err);
  }
};

// POST /auth/reset-pwd
export const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body || {};
    if (!token || !password) throw createHttpError(400, "Token and password are required");

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET); // { sub, email }
    } catch {
      throw createHttpError(401, "Token is expired or invalid.");
    }

    const user =
      (await User.findById(decoded.sub)) ||
      (await User.findOne({ email: decoded.email }));

    if (!user) throw createHttpError(404, "User not found!");

    const hash = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(user._id, { password: hash });

    // Анулюємо всі сесії
    await Session.deleteMany({ userId: user._id });

    return res.status(200).json({
      status: 200,
      message: "Password has been successfully reset.",
      data: {},
    });
  } catch (err) {
    return next(err);
  }
};
