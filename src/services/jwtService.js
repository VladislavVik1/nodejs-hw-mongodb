import jwt from "jsonwebtoken";

function signResetToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "5m" });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null; // Повертаємо null замість кидання помилки
  }
}

export default { signResetToken, verifyToken };
