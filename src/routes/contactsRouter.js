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
import upload from '../middlewares/upload.js'; // <-- додаємо

const router = express.Router();

// GET /contacts
router.get('/', ctrlWrapper(fetchAllContacts));

// POST /contacts  (multipart/form-data з полем `photo`)
router.post(
  '/',
  upload.single('photo'),                 // <-- спочатку парсимо файл/форму
  validateBody(addContactSchema),         // <-- потім валідація body
  ctrlWrapper(createContactCtrl),
);

// GET /contacts/:contactId
router.get('/:contactId', isValidId, ctrlWrapper(getContactCtrl));

// PATCH /contacts/:contactId  (можна оновлювати тільки фото або разом з іншими полями)
router.patch(
  '/:contactId',
  isValidId,
  upload.single('photo'),                 // <-- приймаємо нове фото
  validateBody(updateContactSchema),
  ctrlWrapper(updateContactCtrl),
);

// DELETE /contacts/:contactId
router.delete('/:contactId', isValidId, ctrlWrapper(deleteContactCtrl));

export default router;
