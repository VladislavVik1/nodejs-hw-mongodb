import express from 'express';
import {
  fetchAllContacts,
  createContactCtrl,
  getContactCtrl,
  updateContactCtrl,
  deleteContactCtrl,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { addContactSchema, updateContactSchema } from '../schemas/contactSchemas.js';
import validateBody from '../middlewares/validateBody.js';
import isValidId from '../middlewares/isValidId.js';

const router = express.Router();

// Отримати всі контакти
router.get('/', ctrlWrapper(fetchAllContacts));

// Створити новий контакт
router.post('/', validateBody(addContactSchema), ctrlWrapper(createContactCtrl));

// Отримати контакт по ID
router.get('/:contactId', isValidId, ctrlWrapper(getContactCtrl));

// Оновити контакт
router.patch('/:contactId', isValidId, validateBody(updateContactSchema), ctrlWrapper(updateContactCtrl));

// Видалити контакт
router.delete('/:contactId', isValidId, ctrlWrapper(deleteContactCtrl));

export default router;
