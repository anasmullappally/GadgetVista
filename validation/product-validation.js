import Joi from "joi";
import { fieldBaseMessages, fieldEmptyMessages, fieldInvalidMessages, fieldMinMessages, fieldPatternMessages, fieldRequiredMessages } from "../utils/message-store/common-messages.js";

export const createProductValidation = Joi.object({
    name: Joi.string().required().messages({
        "string.empty": fieldEmptyMessages["productName"],
        "any.required": fieldRequiredMessages["productName"],
        "any.only": fieldInvalidMessages["productName"],
    }),
    category: Joi.string().required().valid("phone", "laptop").messages({
        "string.empty": fieldEmptyMessages["category"],
        "any.required": fieldRequiredMessages["category"],
        "any.only": fieldInvalidMessages["category"],
        "any.valid": fieldPatternMessages["category"]
    }),
    brand: Joi.string().required().messages({
        "string.empty": fieldEmptyMessages["brand"],
        "any.required": fieldRequiredMessages["brand"],
        "any.only": fieldInvalidMessages["brand"],
    }),
    description: Joi.string().required().messages({
        "string.empty": fieldEmptyMessages["description"],
        "any.required": fieldRequiredMessages["description"],
        "any.only": fieldInvalidMessages["description"],
    }),
    accessories: Joi.string().required().messages({
        "string.empty": fieldEmptyMessages["accessories"],
        "any.required": fieldRequiredMessages["accessories"],
        "any.only": fieldInvalidMessages["accessories"],
    }),
    warrantyInfo: Joi.string().required().messages({
        "string.empty": fieldEmptyMessages["warrantyInfo"],
        "any.required": fieldRequiredMessages["warrantyInfo"],
        "any.only": fieldInvalidMessages["warrantyInfo"],
    }),
    variants: Joi.array()
        .items(
            Joi.object({
                ram: Joi.number().min(1).required().messages({
                    'any.required': fieldRequiredMessages["ram"],
                    'number.base': fieldBaseMessages["ram"],
                    'number.min': fieldMinMessages["ram"],
                    'number.positive': fieldPatternMessages["ram"],
                    'number.empty': fieldEmptyMessages["ram"],
                }),
                rom: Joi.number().min(1).required().messages({
                    'any.required': fieldRequiredMessages["rom"],
                    'number.base': fieldBaseMessages["rom"],
                    'number.min': fieldMinMessages["rom"],
                    'number.positive': fieldPatternMessages["rom"],
                    'number.empty': fieldEmptyMessages["rom"],
                }),
                mrp: Joi.number().min(1).required().messages({
                    'any.required': fieldRequiredMessages["mrp"],
                    'number.base': fieldBaseMessages["mrp"],
                    'number.min': fieldMinMessages["mrp"],
                    'number.positive': fieldPatternMessages["mrp"],
                    'number.empty': fieldEmptyMessages["mrp"],
                }),
                price: Joi.number().min(1).required().messages({
                    'any.required': fieldRequiredMessages["price"],
                    'number.base': fieldBaseMessages["price"],
                    'number.min': fieldMinMessages["price"],
                    'number.positive': fieldPatternMessages["price"],
                    'number.empty': fieldEmptyMessages["price"],
                }),
                quantity: Joi.number().min(1).required().messages({
                    'any.required': fieldRequiredMessages["quantity"],
                    'number.base': fieldBaseMessages["quantity"],
                    'number.min': fieldMinMessages["quantity"],
                    'number.positive': fieldPatternMessages["quantity"],
                    'number.empty': fieldEmptyMessages["quantity"],
                }),
                shippingCharge: Joi.number().required().messages({
                    'any.required': fieldRequiredMessages["shippingCharge"],
                    'number.base': fieldBaseMessages["shippingCharge"],
                    'number.positive': fieldPatternMessages["shippingCharge"],
                    'number.empty': fieldEmptyMessages["shippingCharge"],
                }),
                colors: Joi.array().items(
                    Joi.object({
                        color: Joi.string().required().messages({
                            "string.empty": fieldEmptyMessages["color"],
                            "any.required": fieldRequiredMessages["color"],
                            "any.only": fieldInvalidMessages["color"],
                        }),
                        colorCode: Joi.string().required().messages({
                            "string.empty": fieldEmptyMessages["colorCode"],
                            "any.required": fieldRequiredMessages["colorCode"],
                            "any.only": fieldInvalidMessages["colorCode"],
                        }),
                    })
                ).min(1)
                    .required()
                    .messages({
                        'any.required': fieldRequiredMessages["colors"],
                        'array.min': fieldMinMessages["colors"],
                    })
            })
        ).min(1)
        .required()
        .messages({
            'any.required': fieldRequiredMessages["variant"],
            'array.min': fieldMinMessages["variant"],
        })

});