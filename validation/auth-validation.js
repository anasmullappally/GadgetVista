import Joi from "joi";
import {
  emailValidation,
  nameValidation,
  passwordValidation,
  phoneValidation,
} from "./common-validation.js";
import {
  fieldEmptyMessages,
  fieldInvalidMessages,
  fieldMaxMessages,
  fieldPatternMessages,
  fieldRequiredMessages,
} from "../utils/message-store/common-messages.js";

export const userRegistrationValidationSchema = Joi.object({
  name: nameValidation.messages({
    "string.empty": fieldEmptyMessages["name"],
    "string.pattern.base": fieldPatternMessages["name"],
    "any.required": fieldRequiredMessages["name"],
    "any.only": fieldInvalidMessages["name"],
  }),
  email: emailValidation.messages({
    "string.empty": fieldEmptyMessages["email"],
    "string.email": fieldInvalidMessages["email"],
    "any-Invalid": fieldInvalidMessages["email"],
  }),
  password: passwordValidation.messages({
    "string.empty": fieldEmptyMessages["password"],
    "string.pattern.base": fieldPatternMessages["password"],
    "any.required": fieldRequiredMessages["password"],
    "any-only": fieldInvalidMessages["password"],
  }),
  phoneNumber: phoneValidation.messages({
    "string.empty": fieldEmptyMessages["phoneNumber"],
    "string.pattern.base": fieldPatternMessages["phoneNumber"],
    "any.required": fieldRequiredMessages["phoneNumber"],
    "any-Invalid": fieldInvalidMessages["phoneNumber"],
  }),
  dateOfBirth: Joi.date().iso().max("now").required().messages({
    "date.base": fieldInvalidMessages["dateOfBirth"],
    "date.max": fieldMaxMessages["dateOfBirth"],
    "any.required": fieldRequiredMessages["dateOfBirth"],
    "any-invalid": fieldInvalidMessages["dateOfBirth"],
  }),
});

export const loginValidationSchema = Joi.object({
  email: emailValidation.messages({
    "string.empty": fieldEmptyMessages["email"],
    "string.email": fieldInvalidMessages["email"],
    "any-Invalid": fieldInvalidMessages["email"],
  }),
  password: passwordValidation.messages({
    "string.empty": fieldEmptyMessages["password"],
    "string.pattern.base": fieldPatternMessages["password"],
    "any.required": fieldRequiredMessages["password"],
    "any-only": fieldInvalidMessages["password"],
  }),
});
