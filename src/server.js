import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import pino from 'pino-http';
import cookieParser from 'cookie-parser';
import authResetRouter from "./authReset.js";
import contactsRouter from './routes/contactsRouter.js';
import authRouter from './routes/auth.js';
import { handleError } from './middlewares/handleError.js';
import { notFound } from './middlewares/notFound.js';
import authenticate from './middlewares/authenticate.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const DB_URI = process.env.DB_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hw5';

app.set('trust proxy', 1); // важно для secure cookies за прокси
app.use("/auth", authResetRouter);
app.use(pino());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// без /api
app.use('/auth', authRouter);
app.use('/contacts', authenticate, contactsRouter);

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
