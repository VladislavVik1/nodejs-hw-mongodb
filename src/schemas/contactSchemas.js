const Joi = require("joi");

const contactAddSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().min(3).max(20).required(),
  contactType: Joi.string().valid("friend", "work", "family", "other").required(),
  isFavourite: Joi.boolean()
});

const contactUpdateSchema = Joi.object({
  name: Joi.string().min(3).max(20),
  email: Joi.string().email(),
  phone: Joi.string().min(3).max(20),
  contactType: Joi.string().valid("friend", "work", "family", "other"),
  isFavourite: Joi.boolean()
}).min(1); // не можна пустий запит

module.exports = {
  contactAddSchema,
  contactUpdateSchema
};
