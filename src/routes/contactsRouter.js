import express from 'express';
import {
  fetchAllContacts,
  createContact,
  getContactById,
  updateContact,
  deleteContact,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = express.Router();

// Отримати всі контакти
router.get('/', ctrlWrapper(fetchAllContacts));

// Створити новий контакт
router.post('/', ctrlWrapper(createContact));

// Отримати контакт по ID
router.get('/:contactId', ctrlWrapper(getContactById));

// Оновити контакт
router.patch('/:contactId', ctrlWrapper(updateContact));

// Видалити контакт
router.delete('/:contactId', ctrlWrapper(deleteContact));

export default router;
