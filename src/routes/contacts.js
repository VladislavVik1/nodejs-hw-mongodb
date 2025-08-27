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
// import authenticate from '../middlewares/authenticate.js'; // ← розкоментуй, якщо маршрути мають бути захищені

const router = express.Router();

// GET /contacts — список
router.get(
  '/',
  // authenticate,
  ctrlWrapper(fetchAllContacts)
);

// POST /contacts — створити (з фото)
router.post(
  '/',
  // authenticate,
  uploadPhoto,             // 1) приймаємо файл у полі "photo" (multer memory)
  uploadToCloudinary,      // 2) заливаємо у Cloudinary, кладемо URL у req.body.photo
  validateBody(addContactSchema), // 3) валідація тіла (photo — це URL)
  ctrlWrapper(createContactCtrl)  // 4) контролер створення
);

// GET /contacts/:contactId — один контакт
router.get(
  '/:contactId',
  // authenticate,
  isValidId,
  ctrlWrapper(getContactCtrl)
);

// PATCH /contacts/:contactId — оновити (можна нове фото)
router.patch(
  '/:contactId',
  // authenticate,
  isValidId,
  uploadPhoto,                // (опційно) нове фото
  uploadToCloudinary,         // якщо є файл — отримаємо req.body.photo = URL
  validateBody(updateContactSchema),
  ctrlWrapper(updateContactCtrl)
);

// DELETE /contacts/:contactId — видалити
router.delete(
  '/:contactId',
  // authenticate,
  isValidId,
  ctrlWrapper(deleteContactCtrl)
);

export default router;
