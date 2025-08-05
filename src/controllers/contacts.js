import createError from 'http-errors';
import {
  getAllContacts,
  getContactById,
  createContact,
  updateContactById,
  deleteContactById,
} from '../services/contacts.js';

export const fetchAllContacts = async (req, res) => {
  const {
    page = 1,
    perPage = 10,
    sortBy = 'name',
    sortOrder = 'asc',
    type,
    isFavourite,
  } = req.query;

  const filter = { userId: req.user._id };

  if (type) filter.contactType = type;
  if (isFavourite !== undefined) filter.isFavourite = isFavourite === 'true';

  const totalItems = await getAllContacts({ filter, countOnly: true });

  const contacts = await getAllContacts({
    filter,
    skip: (page - 1) * perPage,
    limit: Number(perPage),
    sortBy,
    sortOrder,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: {
      data: contacts,
      page: Number(page),
      perPage: Number(perPage),
      totalItems,
      totalPages: Math.ceil(totalItems / perPage),
      hasPreviousPage: Number(page) > 1,
      hasNextPage: Number(page) * Number(perPage) < totalItems,
    },
  });
};

export const createContactCtrl = async (req, res) => {
  const newContact = await createContact({
    ...req.body,
    userId: req.user._id,
  });

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
};

export const getContactCtrl = async (req, res) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId, req.user._id);

  if (!contact) throw createError(404, 'Contact not found');

  res.status(200).json({
    status: 200,
    message: 'Contact found!',
    data: contact,
  });
};

export const updateContactCtrl = async (req, res) => {
  const { contactId } = req.params;
  const updated = await updateContactById(contactId, req.body, req.user._id);

  if (!updated) throw createError(404, 'Contact not found');

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: updated,
  });
};

export const deleteContactCtrl = async (req, res) => {
  const { contactId } = req.params;
  const deleted = await deleteContactById(contactId, req.user._id);

  if (!deleted) throw createError(404, 'Contact not found');

  res.status(204).send();
};
