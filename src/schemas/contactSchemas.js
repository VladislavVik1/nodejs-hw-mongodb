import Joi from "joi";

export const addContactSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().optional(),
  phoneNumber: Joi.string().min(7).max(20).required(), // 🟢 змінено
  isFavourite: Joi.boolean().optional(),
  contactType: Joi.string().valid("personal", "work", "home").optional(), // 🟢 "home" замість "other"
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(30),
  email: Joi.string().email(),
  phoneNumber: Joi.string().min(7).max(20), // 🟢 змінено
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid("personal", "work", "home"), // 🟢 змінено
}).min(1);

