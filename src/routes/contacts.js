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
import { uploadPhoto, uploadToCloudinary } from '../middlewares/uploadPhoto.js';
// import { auth } from '../middlewares/auth.js'; // ← если нужно защищать маршруты

const router = express.Router();

// GET /contacts — список
router.get(
  '/',
  // auth,
  ctrlWrapper(fetchAllContacts)
);

// POST /contacts — создать (с фото)
router.post(
  '/',
  // auth,
  uploadPhoto,
  uploadToCloudinary,
  validateBody(addContactSchema),
  ctrlWrapper(createContactCtrl)
);

// GET /contacts/:contactId — один контакт
router.get(
  '/:contactId',
  // auth,
  isValidId,
  ctrlWrapper(getContactCtrl)
);

// PATCH /contacts/:contactId — обновить (с фото)
router.patch(
  '/:contactId',
  // auth,
  isValidId,
  uploadPhoto,
  uploadToCloudinary,
  validateBody(updateContactSchema),
  ctrlWrapper(updateContactCtrl)
);

// DELETE /contacts/:contactId — удалить
router.delete(
  '/:contactId',
  // auth,
  isValidId,
  ctrlWrapper(deleteContactCtrl)
);

export default router;
