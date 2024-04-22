import tinycolor from "tinycolor2";
import { HTTP_BAD_REQUEST, HTTP_STATUS_CREATED, HTTP_STATUS_OK } from "../utils/status-codes.js";
import { createProductValidation } from "../validation/product-validation.js";
import { productsMessages } from "../utils/message-store/product.js";
import { Products } from "../models/products.js";
import logger from "../config/logger.js";


export const getProducts = async (req, res) => {
    try {
        const products = await Products.find({ isVisible: true })

        return res.status(HTTP_STATUS_OK).json({ success: true, products, message: productsMessages["fetched"] })
    } catch (error) {
        logger.error({ label: "getProducts", message: error.message });
        next(error);
    }
}


export const createProduct = async (req, res, next) => {
    try {
        const { value, error } = createProductValidation.validate(req.body);
        if (error) {
            return res.status(HTTP_BAD_REQUEST).json({ success: false, message: error.details[0].message });
        }
        const { name, category, brand, description, accessories, warrantyInfo, variants } = value
        let totalQuantity = 0
        for (const variant of variants) {
            const { colors } = variant
            for (const item of colors) {
                if (!tinycolor(item.colorCode).isValid()) {
                    return res.status(HTTP_BAD_REQUEST).json({ success: false, message: productsMessages["color-not-valid"], colorCode: item.colorCode });
                }
            }
            totalQuantity += variant.quantity
        }

        const product = new Products({
            name,
            category,
            brand,
            description,
            accessories,
            warrantyInfo,
            variants,
            quantityInfo: {
                total: totalQuantity,
            }
        })

        await product.save()

        logger.info({ label: "createProduct", message: productsMessages["product-added"] });

        return res.status(HTTP_STATUS_CREATED).json({ success: true, message: productsMessages["product-added"] })

    } catch (error) {
        logger.error({ label: "createProduct", message: error.message });
        next(error);
    }
}

export const getBrands = async (req, res, next) => {
    try {
        const brands = await Products.distinct("brand")

        return res.status(HTTP_STATUS_OK).json({ success: true, brands, message: productsMessages["brands-fetched"] })
        
    } catch (error) {
        logger.error({ label: "getBrands", message: error.message });
        next(error);
    }
}