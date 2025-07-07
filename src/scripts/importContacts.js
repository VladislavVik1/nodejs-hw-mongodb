import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { Contact } from '../models/Contact.js';

dotenv.config();

// __dirname workaround for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// MongoDB URI
const { MONGODB_USER, MONGODB_PASSWORD, MONGODB_URL, MONGODB_DB } = process.env;
const uri = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_URL}/${MONGODB_DB}?retryWrites=true&w=majority`;

const importContacts = async () => {
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');

    const filePath = path.join(__dirname, '../../data/contacts.json');
    const data = await fs.readFile(filePath, 'utf-8');
    const contacts = JSON.parse(data);

    await Contact.insertMany(contacts);
    console.log('Contacts imported successfully!');

    process.exit(0);
  } catch (error) {
    console.error('Error importing contacts:', error.message);
    process.exit(1);
  }
};

importContacts();
