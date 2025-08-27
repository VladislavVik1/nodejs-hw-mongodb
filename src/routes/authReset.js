// src/routes/authReset.js
import express from "express";
import validateBody from "../middlewares/validateBody.js";
import { sendResetEmailSchema, resetPwdSchema } from "../schemas/authResetSchemas.js";
import { sendResetEmail, resetPassword } from "../controllers/authResetController.js";
// import authenticate from "../middlewares/authenticate.js"; // за потреби

const router = express.Router();

// Відправка листа зі скиданням пароля
router.post(
  "/send-reset-email",
  // authenticate,
  validateBody(sendResetEmailSchema),
  sendResetEmail
);

// Скидання пароля за токеном
router.post(
  "/reset-pwd",
  // authenticate, // зазвичай не потрібна аутентифікація для скидання
  validateBody(resetPwdSchema),
  resetPassword
);

export default router;
