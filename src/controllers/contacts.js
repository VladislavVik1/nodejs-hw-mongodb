import createError from 'http-errors';
import {
  getAllContacts,
  getContactById,
  createContact,
  updateContactById,
  deleteContactById,
} from '../services/contacts.js';

export const fetchAllContacts = async (req, res) => {
  const contacts = await getAllContacts();
  res.status(200).json({
    status: 200,
    message: 'Contacts retrieved successfully',
    data: contacts,
  });
};

export const createContactCtrl = async (req, res) => {
  const newContact = await createContact(req.body);
  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
};

export const getContactCtrl = async (req, res) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);
  if (!contact) throw createError(404, 'Contact not found');

  res.status(200).json({
    status: 200,
    message: 'Contact found!',
    data: contact,
  });
};

export const updateContactCtrl = async (req, res) => {
  const { contactId } = req.params;
  const updated = await updateContactById(contactId, req.body);
  if (!updated) throw createError(404, 'Contact not found');

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: updated,
  });
};

export const deleteContactCtrl = async (req, res) => {
  const { contactId } = req.params;
  const deleted = await deleteContactById(contactId);
  if (!deleted) throw createError(404, 'Contact not found');

  res.status(204).send();
};
