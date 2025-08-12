import createError from 'http-errors';
import {
  getAllContacts,
  getContactById,
  createContact,
  updateContactById,
  deleteContactById,
} from '../services/contacts.js';

export const fetchAllContacts = async (req, res) => {
  // Явно приводим к числам и задаем дефолты
  const pageNum = Math.max(1, Number(req.query.page ?? 1));
  const perPageNum = Math.min(100, Math.max(1, Number(req.query.perPage ?? 10)));

  // Контроль сортировки
  const allowedSort = new Set(['name', 'createdAt', 'updatedAt']);
  const sortBy = allowedSort.has(req.query.sortBy) ? req.query.sortBy : 'name';
  const sortOrder = req.query.sortOrder === 'desc' ? 'desc' : 'asc';

  const type = req.query.type;
  const isFavouriteRaw = req.query.isFavourite;

  const filter = { userId: req.user._id };
  if (type) filter.contactType = type;
  if (typeof isFavouriteRaw !== 'undefined') {
    filter.isFavourite = String(isFavouriteRaw) === 'true';
  }

  const skip = (pageNum - 1) * perPageNum;
  const limit = perPageNum;

  const totalItems = await getAllContacts({ filter, countOnly: true });
  const contacts = await getAllContacts({
    filter,
    skip,
    limit,
    sortBy,
    sortOrder,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: {
      items: contacts,
      page: pageNum,
      perPage: perPageNum,
      totalItems,
      totalPages: Math.ceil(totalItems / perPageNum),
      hasPreviousPage: pageNum > 1,
      hasNextPage: pageNum * perPageNum < totalItems,
    },
  });
};

export const createContactCtrl = async (req, res) => {
  const payload = {
    ...req.body,
    userId: req.user._id,
  };

  // Если пришло фото из Cloudinary — добавляем в payload
  if (req.photoUrl) {
    payload.photo = req.photoUrl;
  }

  const newContact = await createContact(payload);

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

  const payload = { ...req.body };
  if (req.photoUrl) {
    payload.photo = req.photoUrl;
  }

  const updated = await updateContactById(contactId, payload, req.user._id);

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

  res.status(204).end();
};
