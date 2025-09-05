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
import authenticate from '../middlewares/authenticate.js';

const router = express.Router();

// GET /contacts — список (пагинация/фильтры/сортировка из req.query)
router.get(
  '/',
  authenticate,
  ctrlWrapper(fetchAllContacts)
);

// POST /contacts — создать (multipart/form-data с файлом photo)
router.post(
  '/',
  authenticate,
  uploadPhoto,            // принимает файл в поле "photo" (multer.memoryStorage)
  uploadToCloudinary,     // кладёт URL в req.body.photo
  validateBody(addContactSchema), // Joi ожидает уже URL в req.body.photo
  ctrlWrapper(createContactCtrl)
);

// GET /contacts/:contactId — один контакт
router.get(
  '/:contactId',
  authenticate,
  isValidId,
  ctrlWrapper(getContactCtrl)
);

// PATCH /contacts/:contactId — обновить (multipart/form-data; опционально новое фото)
router.patch(
  '/:contactId',
  authenticate,
  isValidId,
  uploadPhoto,
  uploadToCloudinary,     // если файл пришёл — в req.body.photo будет URL
  validateBody(updateContactSchema),
  ctrlWrapper(updateContactCtrl)
);

// DELETE /contacts/:contactId — удалить (контроллер должен вернуть 204 No Content)
router.delete(
  '/:contactId',
  authenticate,
  isValidId,
  ctrlWrapper(deleteContactCtrl)
);

export default router;
