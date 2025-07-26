const Joi = require("joi");

const addContactSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().min(7).max(20).required(),
  isFavourite: Joi.boolean().optional(),
  contactType: Joi.string().valid("personal", "work", "other").optional(),
});

const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(30),
  email: Joi.string().email(),
  phone: Joi.string().min(7).max(20),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid("personal", "work", "other"),
}).min(1); // потрібно хоча б одне поле

module.exports = {
  addContactSchema,
  updateContactSchema,
};
