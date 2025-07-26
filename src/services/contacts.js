import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { Contact } from '../models/Contact.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔹 Отримати всі контакти (з підтримкою пагінації, фільтрації, сортування)
export const getAllContacts = async (options = {}) => {
  const {
    filter = {},
    skip = 0,
    limit = 0,
    sortBy = 'name',
    sortOrder = 'asc',
    countOnly = false,
  } = options;

  if (countOnly) {
    return Contact.countDocuments(filter);
  }

  return Contact.find(filter)
    .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
    .skip(skip)
    .limit(limit);
};

// 🔹 Отримати один контакт за ID
export const getContactById = async (id) => {
  return Contact.findById(id);
};

// 🔹 Створити новий контакт
export const createContact = async (data) => {
  return Contact.create(data);
};

// 🔹 Оновити контакт
export const updateContactById = async (id, data) => {
  return Contact.findByIdAndUpdate(id, data, { new: true });
};

// 🔹 Видалити контакт
export const deleteContactById = async (id) => {
  return Contact.findByIdAndDelete(id);
};

// 🔹 Імпортувати з JSON при старті, якщо колекція порожня
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
