import logger from "../config/logger.js";
import { Cart } from "../models/cart.js";
import { Variants } from "../models/variants.js";
import { HTTP_BAD_REQUEST, HTTP_STATUS_CREATED, HTTP_STATUS_OK } from "../utils/status-codes.js";
import { addToCartValidation, updateQuantityValidation } from "../validation/cart-validation.js";

export const addToCart = async (req, res, next) => {
    try {
        const { error, value } = addToCartValidation.validate(req.body)

        if (error) {
            return res.status(HTTP_BAD_REQUEST).json({ success: false, message: error.details[0].message });
        }
        const { variant, quantity } = value
        const { _id: userId } = req.user
        const cartExist = await Cart.findOne({ variant, user: userId }).select("variant quantity product").populate("product", "name").populate("variant", "name images ram rom price")
        if (cartExist) {
            cartExist.quantity += quantity
            await cartExist.save()

            logger.info({ label: "addToCart", message: "successfully added cart" });

            return res.status(HTTP_STATUS_OK).json({ success: true, cart: cartExist, message: "successfully added to cart" })

        } else {

            const variantDetails = await Variants.findById(variant).select("product price brand").lean()
            const { product, brand } = variantDetails
            const cart = new Cart({
                product, brand, variant, quantity, user: userId
            })

            await cart.save();

            const newCart = await Cart.findById(cart._id).populate("product", "name").populate("variant", "name images ram rom price")

            logger.info({ label: "addToCart", message: "successfully added cart" });

            return res.status(HTTP_STATUS_CREATED).json({ success: true, cart: newCart, message: "successfully added to cart" })
        }
    } catch (error) {
        logger.error({ label: "addToCart", message: error.message });
        next(error)
    }
}


export const getCart = async (req, res, next) => {
    try {
        const cart = await Cart.find({ user: req.user._id })
            // .populate("brand", "name")
            .populate("product", "name")
            .populate("variant", "name images ram rom price")


        logger.info({ label: "getCart", message: "successfully fetched cart" });

        return res.status(HTTP_STATUS_OK).json({ success: true, cart, message: "successfully fetched cart" })

    } catch (error) {
        logger.error({ label: "getCart", message: error.message });
        next(error)
    }
}

export const updateQuantity = async (req, res, next) => {
    try {
        const { cartId } = req.params
        const { error, value } = updateQuantityValidation.validate(req.body)

        if (error) {
            return res.status(HTTP_BAD_REQUEST).json({ success: false, message: error.details[0].message });
        }

        const { type } = value

        const cart = await Cart.findOne({ user: req.user._id, _id: cartId }).select("quantity")
        if (!cart) {
            return res.status(HTTP_BAD_REQUEST).json({ success: false, message: "cart not found" })
        }

        cart.quantity = type === "increment" ? cart.quantity + 1 : cart.quantity - 1
        await cart.save()

        logger.info({ label: "updateQuantity", message: "updated cart quantity" });
        return res.status(HTTP_STATUS_OK).json({ success: true, message: "updated cart quantity" })
    } catch (error) {
        logger.error({ label: "updateQuantity", message: error.message });
        next(error)
    }
}

export const removeCartItem = async (req, res, next) => {
    try {
        const { cartId } = req.params

        await Cart.deleteOne({ _id: cartId, user: req.user._id })

        logger.info({ label: "removeCartItem", message: `Item ${cartId} removed from cart` });

        return res.status(HTTP_STATUS_OK).json({ success: true, message: "Item removed from cart" })
    } catch (error) {
        logger.error({ label: "removeCartItem", message: error.message });
        next(error)
    }
}