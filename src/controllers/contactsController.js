// src/controllers/contactsController.js
import createHttpError from "http-errors";
import { Contact } from "../models/contact.js";
import { uploadBufferToCloudinary } from "../helpers/uploadToCloudinary.js";

// POST /contacts
export const addContact = async (req, res, next) => {
  try {
    const data = { ...req.body };

    // если пришёл файл
    if (req.file?.buffer) {
      const cloud = await uploadBufferToCloudinary(req.file.buffer, { folder: "contacts" });
      data.photo = cloud.secure_url; // в модели уже есть поле photo: String
    }

    const created = await Contact.create(data);
    return res.status(201).json(created);
  } catch (err) {
    return next(err);
  }
};

// PATCH /contacts/:contactId
export const updateContactById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const patch = { ...req.body };

    if (req.file?.buffer) {
      const cloud = await uploadBufferToCloudinary(req.file.buffer, { folder: "contacts" });
      patch.photo = cloud.secure_url;
    }

    const updated = await Contact.findByIdAndUpdate(contactId, patch, { new: true });
    if (!updated) throw createHttpError(404, "Contact not found");

    return res.json(updated);
  } catch (err) {
    return next(err);
  }
};
