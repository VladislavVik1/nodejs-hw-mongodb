import express from 'express';
import {
  fetchAllContacts,
  createContactCtrl,
  getContactCtrl,
  updateContactCtrl,
  deleteContactCtrl,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = express.Router();

// Отримати всі контакти
router.get('/', ctrlWrapper(fetchAllContacts));

// Створити новий контакт
router.post('/', ctrlWrapper(createContactCtrl));

// Отримати контакт по ID
router.get('/:contactId', ctrlWrapper(getContactCtrl));

// Оновити контакт
router.patch('/:contactId', ctrlWrapper(updateContactCtrl));

// Видалити контакт
router.delete('/:contactId', ctrlWrapper(deleteContactCtrl));

export default router;
