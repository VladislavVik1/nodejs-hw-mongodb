import express from 'express';
import { fetchAllContacts, fetchContactById } from '../controllers/contactsController.js';

const router = express.Router();

router.get('/', fetchAllContacts);
router.get('/:contactId', fetchContactById);

export default router;
