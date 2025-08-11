import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import pino from 'pino-http';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';

import contactsRouter from './routes/contactsRouter.js';
import authRouter from './routes/auth.js';
import { handleError } from './middlewares/handleError.js';
import { notFound } from './middlewares/notFound.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const DB_URI =
  process.env.DB_URI ||
  process.env.MONGODB_URI ||
  'mongodb://127.0.0.1:27017/hw5';

/* ---------- Swagger UI ---------- */
let swaggerJson = null;
const swaggerPath = path.resolve('./docs/swagger.json');

if (fs.existsSync(swaggerPath)) {
  try {
    swaggerJson = JSON.parse(fs.readFileSync(swaggerPath, 'utf-8'));
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJson));
    console.log('📘 Swagger UI available at /api-docs');
  } catch (e) {
    console.warn('⚠️  Failed to read docs/swagger.json:', e.message);
  }
} else {
  console.warn('ℹ️  docs/swagger.json not found. Run "npm run build-docs" to generate it.');
}

/* ---------- Middlewares ---------- */
app.use(pino());
app.use(
  cors({
    origin: true, // на проде можно сузить до вашего фронтенд-домена
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

/* ---------- Routes ---------- */
app.use('/api/contacts', contactsRouter);
app.use('/api/auth', authRouter);

/* ---------- 404 & Error handlers ---------- */
app.use(notFound);
app.use(handleError);

/* ---------- DB connect & start ---------- */
mongoose
  .connect(DB_URI)
  .then(() => {
    console.log('✅ Database connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      if (swaggerJson) {
        console.log(`🔎 Open Swagger UI: http://localhost:${PORT}/api-docs`);
      }
    });
  })
  .catch((error) => {
    console.error('❌ Database connection error:', error.message);
    process.exit(1);
  });
