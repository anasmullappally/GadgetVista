import Joi from "joi";
import { fieldBaseMessages, fieldEmptyMessages, fieldMinMessages, fieldPatternMessages, fieldRequiredMessages } from "../utils/message-store/common-messages.js";

export const addToCartValidation = Joi.object({
    variant: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required().messages({
        "string.base": fieldBaseMessages["variant"],
        "string.empty": fieldEmptyMessages["variant"],
        "any.required": fieldRequiredMessages["variant"],
        "string.pattern.base": fieldPatternMessages["variant"],
    }),
    quantity: Joi.number().min(1).required().messages({
        "any.required": fieldRequiredMessages["quantity"],
        "number.base": fieldBaseMessages["quantity"],
        "number.min": fieldMinMessages["quantity"],
        "number.positive": fieldPatternMessages["quantity"],
        "number.empty": fieldEmptyMessages["quantity"],
    }),
})


export const updateQuantityValidation = Joi.object({
    type: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required().valid("increment", "decrement").messages({
        "string.base": fieldBaseMessages["cartType"],
        "string.empty": fieldEmptyMessages["cartType"],
        "any.required": fieldRequiredMessages["cartType"],
        "string.pattern.base": fieldPatternMessages["cartType"],
        "any.valid": fieldPatternMessages["category"]
    }),
})
