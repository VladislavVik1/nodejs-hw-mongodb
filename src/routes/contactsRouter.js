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

// Мидлвары для загрузки фото
import { uploadPhoto, uploadToCloudinary } from '../middlewares/uploadPhoto.js';

const router = express.Router();

// GET /contacts
router.get('/', ctrlWrapper(fetchAllContacts));

// POST /contacts (с поддержкой фото)
router.post(
  '/',
  uploadPhoto,               // принимает multipart/form-data
  uploadToCloudinary,        // загружает фото в Cloudinary и кладет URL в req.photoUrl
  validateBody(addContactSchema),
  ctrlWrapper(createContactCtrl)
);

// GET /contacts/:contactId
router.get('/:contactId', isValidId, ctrlWrapper(getContactCtrl));

// PATCH /contacts/:contactId (с поддержкой фото)
router.patch(
  '/:contactId',
  isValidId,
  uploadPhoto,
  uploadToCloudinary,
  validateBody(updateContactSchema),
  ctrlWrapper(updateContactCtrl)
);

// DELETE /contacts/:contactId
router.delete('/:contactId', isValidId, ctrlWrapper(deleteContactCtrl));

export default router;
