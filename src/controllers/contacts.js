import { Contact } from '../models/Contact.js';

export const getAllContacts = async ({
  filter = {},
  skip = 0,
  limit = 10,
  sortBy = 'name',
  sortOrder = 'asc',
  countOnly = false,
}) => {
  if (countOnly) {
    return await Contact.countDocuments(filter);
  }

  return await Contact.find(filter)
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 });
};

export const getContactById = async (contactId, userId) => {
  return await Contact.findOne({ _id: contactId, userId });
};

export const createContact = async (data) => {
  return await Contact.create(data);
};

export const updateContactById = async (contactId, data, userId) => {
  return await Contact.findOneAndUpdate(
    { _id: contactId, userId },
    data,
    { new: true }
  );
};

export const deleteContactById = async (contactId, userId) => {
  return await Contact.findOneAndDelete({ _id: contactId, userId });
};
