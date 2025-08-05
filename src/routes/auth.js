import express from 'express';
import { register } from '../controllers/auth.js';
import validateBody from '../middlewares/validateBody.js';
import { registerSchema, loginSchema } from '../schemas/auth.js';

const router = express.Router();
router.post('/login', validateBody(loginSchema), login);
router.post('/refresh', refresh);
router.post('/logout', logout);

router.post('/register', validateBody(registerSchema), register);

export default router;
