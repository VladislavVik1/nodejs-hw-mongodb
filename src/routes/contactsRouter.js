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

// NEW: мидлвары для загрузки фото
import { uploadPhoto, uploadToCloudinary } from '../middlewares/uploadPhoto.js';

const router = express.Router();

// Отримати всі контакти
router.get('/', ctrlWrapper(fetchAllContacts));

// Створити новий контакт (с поддержкой фото)
router.post(
  '/',
  uploadPhoto,               // принимает multipart/form-data
  uploadToCloudinary,        // загружает фото в Cloudinary и кладет URL в req.photoUrl
  validateBody(addContactSchema),
  ctrlWrapper(createContactCtrl)
);

// Отримати контакт по ID
router.get('/:contactId', isValidId, ctrlWrapper(getContactCtrl));

// Оновити контакт (с поддержкой фото)
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
