// src/schemas/contactSchemas.js
import Joi from "joi";

const contactTypeEnum = ["personal", "work", "home"];

export const addContactSchema = Joi.object({
  name: Joi.string().trim().min(3).max(30).required(),
  email: Joi.string().trim().email().optional(),
  phoneNumber: Joi.string().trim().min(7).max(20).required(),
  isFavourite: Joi.boolean().optional(),
  contactType: Joi.string().valid(...contactTypeEnum).optional(),
  // Лише URL фото з Cloudinary, без publicId
  photo: Joi.string().uri().optional(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().trim().min(3).max(30),
  email: Joi.string().trim().email(),
  phoneNumber: Joi.string().trim().min(7).max(20),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid(...contactTypeEnum),
  photo: Joi.string().uri(),
}).min(1);
