import express from 'express';
import authenticate from '../middlewares/authenticate.js';
import {
  getAllContacts,
  getContactById,
  addContact,
  deleteContact,
  updateContact,
} from '../../controllers/contacts.controller.js';
import validateBody from '../../middlewares/validateBody.js';
import isValidId from '../../middlewares/isValidId.js';
import {
  addContactSchema,
  updateContactSchema,
} from '../../schemas/contactSchemas.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getAllContacts);
router.get('/:contactId', isValidId, getContactById);
router.post('/', validateBody(addContactSchema), addContact);
router.delete('/:contactId', isValidId, deleteContact);
router.patch('/:contactId', isValidId, validateBody(updateContactSchema), updateContact);

export default router;
