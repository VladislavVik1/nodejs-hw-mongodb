import express from "express";
import validateBody from "../middlewares/validateBody.js";
import { sendResetEmailSchema, resetPwdSchema } from "../schemas/authResetSchemas.js";
import { sendResetEmail, resetPassword } from "../controllers/authResetController.js";

const router = express.Router();

router.post("/send-reset-email", validateBody(sendResetEmailSchema), sendResetEmail);
router.post("/reset-pwd", validateBody(resetPwdSchema), resetPassword);

export default router;
