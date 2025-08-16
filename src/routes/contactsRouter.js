// src/routes/contacts.js
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

// ВАЖНО: используем наш новый middleware
import { uploadPhoto, uploadToCloudinary } from '../middlewares/uploadPhoto.js';

const router = express.Router();

// GET /contacts
router.get('/', ctrlWrapper(fetchAllContacts));

// POST /contacts (multipart/form-data с полем `photo`)
router.post(
  '/',
  uploadPhoto,               // парсим файл
  uploadToCloudinary,        // если файл есть — грузим в Cloudinary и кладем URL в req.body.photo
  validateBody(addContactSchema),
  ctrlWrapper(createContactCtrl),
);

// GET /contacts/:contactId
router.get('/:contactId', isValidId, ctrlWrapper(getContactCtrl));

// PATCH /contacts/:contactId (можно прислать новое фото + любые поля)
router.patch(
  '/:contactId',
  isValidId,
  uploadPhoto,               // принять новое фото (если есть)
  uploadToCloudinary,        // загрузить в Cloudinary и положить URL в req.body
  validateBody(updateContactSchema),
  ctrlWrapper(updateContactCtrl),
);

// DELETE /contacts/:contactId
router.delete('/:contactId', isValidId, ctrlWrapper(deleteContactCtrl));

export default router;
