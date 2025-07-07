import dotenv from 'dotenv';
dotenv.config();

import { initMongoConnection } from './db/initMongoConnection.js';
import { setupServer } from './server.js';
import { seedContactsIfEmpty } from './services/contacts.js'; // ⬅️ новий імпорт

const startApp = async () => {
  await initMongoConnection();
  await seedContactsIfEmpty(); // ⬅️ імпорт якщо немає контактів
  setupServer();
};

startApp();
