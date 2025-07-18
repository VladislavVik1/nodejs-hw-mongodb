import dotenv from 'dotenv';
dotenv.config();

import { initMongoConnection } from './db/initMongoConnection.js';
import { setupServer } from './server.js';
import { seedContactsIfEmpty } from './services/contacts.js';

const startApp = async () => {
  await initMongoConnection();
  await seedContactsIfEmpty(); // 👈 має бути до setupServer()
  setupServer();
};

startApp();
