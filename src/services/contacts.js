import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { Contact } from '../models/Contact.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Отримати всі контакти користувача
export const getAllContacts = async ({
  filter = {},
  skip = 0,
  limit = 10,
  sortBy = 'name',
  sortOrder = 'asc',
  countOnly = false,
}) => {
  if (countOnly) {
    return Contact.countDocuments(filter);
  }

  return Contact.find(filter)
    .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
    .skip(skip)
    .limit(limit);
};

// Отримати один контакт користувача
export const getContactById = async (id, userId) => {
  return Contact.findOne({ _id: id, userId });
};

// Створити новий контакт
export const createContact = async (data) => {
  return Contact.create(data);
};

// Оновити контакт користувача
export const updateContactById = async (id, data, userId) => {
  return Contact.findOneAndUpdate({ _id: id, userId }, data, { new: true });
};

// Видалити контакт користувача
export const deleteContactById = async (id, userId) => {
  return Contact.findOneAndDelete({ _id: id, userId });
};

// Імпортувати контакти з JSON при старті, якщо колекція порожня
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
