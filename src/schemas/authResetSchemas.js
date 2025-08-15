import Joi from "joi";

export const sendResetEmailSchema = Joi.object({
  email: Joi.string().email().required(),
});

export const resetPwdSchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().min(6).required(),
});
