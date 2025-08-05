import express from 'express';
import { register, login, refresh, logout } from '../controllers/auth.js';
import validateBody from '../middlewares/validateBody.js';
import { registerSchema, loginSchema } from '../schemas/auth.js';

const router = express.Router();
router.post('/refresh', refresh);
router.post('/logout', logout);

router.post('/register', validateBody(registerSchema), register);

export default router;
