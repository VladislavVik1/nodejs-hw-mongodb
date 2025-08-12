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

// NEW: миддлвары для загрузки фото
import { uploadPhoto, uploadToCloudinary } from '../middlewares/uploadPhoto.js';

const router = express.Router();

// Отримати всі контакти
router.get('/', ctrlWrapper(fetchAllContacts));

// Створити новий контакт (с фото)
router.post(
  '/',
  uploadPhoto,
  uploadToCloudinary,
  validateBody(addContactSchema),
  ctrlWrapper(createContactCtrl)
);

// Отримати контакт по ID
router.get('/:contactId', isValidId, ctrlWrapper(getContactCtrl));

// Оновити контакт (с фото)
router.patch(
  '/:contactId',
  isValidId,
  uploadPhoto,
  uploadToCloudinary,
  validateBody(updateContactSchema),
  ctrlWrapper(updateContactCtrl)
);

// Видалити контакт
router.delete('/:contactId', isValidId, ctrlWrapper(deleteContactCtrl));

export default router;
