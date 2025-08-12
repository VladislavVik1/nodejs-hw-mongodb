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

// GET /contacts
router.get('/', ctrlWrapper(fetchAllContacts));

// POST /contacts
router.post('/', validateBody(addContactSchema), ctrlWrapper(createContactCtrl));

// GET /contacts/:contactId
router.get('/:contactId', isValidId, ctrlWrapper(getContactCtrl));

// PATCH /contacts/:contactId
router.patch('/:contactId', isValidId, validateBody(updateContactSchema), ctrlWrapper(updateContactCtrl));

// DELETE /contacts/:contactId
router.delete('/:contactId', isValidId, ctrlWrapper(deleteContactCtrl));

export default router;
