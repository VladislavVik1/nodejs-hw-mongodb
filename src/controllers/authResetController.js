import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import User from "../models/user.js";
import Session from "../models/session.js";
import emailService from "../services/emailService.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

export const sendResetEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) throw createHttpError(404, "User not found!");

    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "5m" });

    const resetLink = `${process.env.APP_DOMAIN}/reset-password?token=${token}`;

    const ok = await emailService.sendMail({
      to: email,
      subject: "Password reset",
      html: `
        <p>Щоб скинути пароль, перейдіть за посиланням (дійсне 5 хвилин):</p>
        <p><a href="${resetLink}">${resetLink}</a></p>
      `,
      text: `Reset your password: ${resetLink}`,
    });

    if (!ok) throw createHttpError(500, "Failed to send the email, please try again later.");

    res.status(200).json({
      status: 200,
      message: "Reset password email has been successfully sent.",
      data: {},
    });
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET); // { email }
    } catch {
      throw createHttpError(401, "Token is expired or invalid.");
    }

    const user = await User.findOne({ email: decoded.email });
    if (!user) throw createHttpError(404, "User not found!");

    const hash = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(user._id, { password: hash });

    // анулюємо всі сесії
    await Session.deleteMany({ userId: user._id });

    res.status(200).json({
      status: 200,
      message: "Password has been successfully reset.",
      data: {},
    });
  } catch (err) {
    next(err);
  }
};
