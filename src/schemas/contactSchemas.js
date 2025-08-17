// src/schemas/contactSchemas.js
import Joi from "joi";

export const addContactSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().optional(),
  phoneNumber: Joi.string().min(7).max(20).required(),
  isFavourite: Joi.boolean().optional(),
  contactType: Joi.string().valid("personal", "work", "home").optional(),
  photo: Joi.string().uri().optional(),       // ✅ разрешаем URL фото
  photoPublicId: Joi.string().optional(),     // ✅ ID из Cloudinary (если сохраняем)
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(30),
  email: Joi.string().email(),
  phoneNumber: Joi.string().min(7).max(20),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid("personal", "work", "home"),
  photo: Joi.string().uri(),                  // ✅ можно менять фото
  photoPublicId: Joi.string(),
}).min(1);
