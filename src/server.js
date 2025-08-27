// src/server.js
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import pino from 'pino-http';
import cookieParser from 'cookie-parser';

import authResetRouter from './routes/authReset.js';
import contactsRouter from './routes/contacts.js';
import authRouter from './routes/auth.js';

import { handleError } from './middlewares/handleError.js';
import { notFound } from './middlewares/notFound.js';
import authenticate from './middlewares/authenticate.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const DB_URI =
  process.env.DB_URI ||
  process.env.MONGODB_URI ||
  'mongodb://127.0.0.1:27017/hw6';

// якщо є проксі (Render/Heroku/Nginx) — потрібне для secure cookies
app.set('trust proxy', 1);

// базові middleware
app.use(pino());
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

// healthcheck
app.get('/healthz', (_req, res) => res.json({ ok: true }));

// маршрути
app.use('/auth', authRouter);        // register/login/refresh/logout
app.use('/auth', authResetRouter);   // /auth/send-reset-email, /auth/reset-pwd
app.use('/contacts', authenticate, contactsRouter);

// 404 + error handler
app.use(notFound);
app.use(handleError);

// підключення до БД та старт сервера
mongoose
  .connect(DB_URI)
  .then(() => {
    console.log('✅ Database connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ Database connection error:', error.message);
    process.exit(1);
  });
