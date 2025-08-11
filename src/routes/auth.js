import express from 'express';
import validateBody from '../middlewares/validateBody.js';
import {
  register, login, refresh, logout,
  sendResetEmail, resetPassword,
} from '../controllers/auth.js';
import {
  registerSchema, loginSchema,
  sendResetEmailSchema, resetPwdSchema,
} from '../schemas/auth.js';

const router = express.Router();

router.post('/register', validateBody(registerSchema), register);
router.post('/login', validateBody(loginSchema), login);
router.post('/refresh', refresh);
router.post('/logout', logout);

// NEW
router.post('/send-reset-email', validateBody(sendResetEmailSchema), sendResetEmail);
router.post('/reset-pwd', validateBody(resetPwdSchema), resetPassword);

export default router;
