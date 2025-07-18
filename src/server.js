import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import pino from 'pino-http';

import contactsRouter from './routes/contactsRouter.js';
import { handleError } from './middlewares/handleError.js';
import { notFound } from './middlewares/notFound.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const DB_URI = process.env.DB_URI;

// Middleware
app.use(cors());
app.use(pino());
app.use(express.json());

// Routes
app.use('/contacts', contactsRouter);

// Not found
app.use(notFound);

// Global error handler
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
