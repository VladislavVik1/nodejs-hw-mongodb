import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import contactsRouter from './routes/contactsRouter.js';

export const setupServer = () => {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(cors());
  app.use(pino());
  app.use(express.json());

  app.use('/contacts', contactsRouter);

  app.use('*', (req, res) => {
    res.status(404).json({ message: 'Not found' });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
