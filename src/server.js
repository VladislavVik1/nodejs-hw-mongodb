import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import pino from 'pino-http';
import cookieParser from 'cookie-parser';

import contactsRouter from './routes/contactsRouter.js';
import authRouter from './routes/auth.js';
import { handleError } from './middlewares/handleError.js';
import { notFound } from './middlewares/notFound.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const DB_URI = process.env.DB_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hw5';

app.use(pino());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/api/contacts', contactsRouter);
app.use('/api/auth', authRouter);

app.use(notFound);
app.use(handleError);

// Connect DB & start server
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
