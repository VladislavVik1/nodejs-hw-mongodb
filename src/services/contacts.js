import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { Contact } from '../models/Contact.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getAllContacts = async () => {
  return await Contact.find();
};

export const getContactById = async (id) => {
  return await Contact.findById(id);
};

export const seedContactsIfEmpty = async () => {
  const count = await Contact.countDocuments();

  if (count === 0) {
    const filePath = path.join(__dirname, '../../data/contacts.json');
    const data = await fs.readFile(filePath, 'utf-8');
    const contacts = JSON.parse(data);
    await Contact.insertMany(contacts);
    console.log('✅ Контакти імпортовані автоматично!');
  } else {
    console.log('📌 Контакти вже існують, імпорт не потрібен');
  }
};
