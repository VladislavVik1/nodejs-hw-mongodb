// src/routes/auth.js
import express from 'express';
import validateBody from '../middlewares/validateBody.js';
import {
  register,
  login,
  refresh,
  logout,
} from '../controllers/auth.js';
import {
  registerSchema,
  loginSchema,
} from '../schemas/auth.js';

const router = express.Router();

router.post('/register', validateBody(registerSchema), register);
router.post('/login', validateBody(loginSchema), login);
router.post('/refresh', refresh);
router.post('/logout', logout);

export default router;
