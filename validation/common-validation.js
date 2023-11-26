import Joi from "joi";

export const nameValidation = Joi.string()
  .required()
  .pattern(/^[a-zA-Z]+(?:[-' ][a-zA-Z]+)*$/);

export const emailValidation = Joi.string().email().required();

export const passwordValidation = Joi.string()
  .pattern(new RegExp("^[a-zA-Z0-9!@#$%^&*]{6,30}$"))
  .required();

export const phoneValidation = Joi.string()
  .pattern(new RegExp("^[0-9]{10}$"))
  .required();
