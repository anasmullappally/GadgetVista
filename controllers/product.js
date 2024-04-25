import tinycolor from "tinycolor2";
import { HTTP_BAD_REQUEST, HTTP_STATUS_CREATED, HTTP_STATUS_OK } from "../utils/status-codes.js";
import { addBrandValidation, createProductValidation } from "../validation/product-validation.js";
import { brandMessages, productsMessages } from "../utils/message-store/product.js";
import { Products } from "../models/products.js";
import logger from "../config/logger.js";
import { Brands } from "../models/brands.js";
import Joi from "joi";
import moment from "moment";


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

        const { name, category, brand, accessories, warrantyInfo, shippingCharge, releaseDate } = value

        if (!moment(releaseDate).isAfter(moment())) {
            return res.status(HTTP_BAD_REQUEST).json({ success: false, message: productsMessages["releaseDate"] })
        }
        const brandExist = await Brands.findById(brand).select("_id").lean()
        if (!brandExist) {
            return res.status(HTTP_BAD_REQUEST).json({ success: false, message: productsMessages["releaseDate"] })
        }
        // let totalQuantity = 0
        // for (const variant of variants) {
        //     const { colors } = variant
        //     for (const item of colors) {
        //         if (!tinycolor(item.colorCode).isValid()) {
        //             return res.status(HTTP_BAD_REQUEST).json({ success: false, message: productsMessages["color-not-valid"], colorCode: item.colorCode });
        //         }
        //     }
        //     totalQuantity += variant.quantity
        // }

        const product = new Products({
            name,
            category,
            brand: brandExist._id,
            accessories,
            warrantyInfo,
            releaseDate,
            shippingCharge
        })
        await product.save()

        logger.info({ label: "createProduct", message: productsMessages["product-added"] });

        return res.status(HTTP_STATUS_CREATED).json({ success: true, message: productsMessages["product-added"] })

    } catch (error) {
        logger.error({ label: "createProduct", message: error.message });
        next(error);
    }
}

// export const getBrands = async (req, res, next) => {
//     try {
//         const brands = await Products.distinct("brand")

//         return res.status(HTTP_STATUS_OK).json({ success: true, brands, message: productsMessages["brands-fetched"] })

//     } catch (error) {
//         logger.error({ label: "getBrands", message: error.message });
//         next(error);
//     }
// }

export const addBrand = async (req, res, next) => {
    try {
        const { value, error } = addBrandValidation.validate(req.body)

        if (error) {
            return res.status(HTTP_BAD_REQUEST).json({ success: false, message: error.details[0].message });
        }

        const { brandName } = value
        const brandExist = await Brands.exists({ name: brandName.toLowerCase() })
        if (brandExist) {
            return res.status(HTTP_BAD_REQUEST).json({ success: false, message: brandMessages["brand-exist"] });
        }

        const newBrand = new Brands({
            name: brandName.toLowerCase()
        })
        await newBrand.save()
        logger.info({ label: "addBrand", message: brandMessages["created"] });
        return res.status(HTTP_STATUS_CREATED).json({ success: true, message: brandMessages["created"], brand: newBrand })
    } catch (error) {
        logger.error({ label: "addBrand", message: error.message });
        next(error);
    }
}

export const getBrands = async (req, res, next) => {
    try {
        const brands = await Brands.find().select("name totalProducts activeProducts").lean()

        logger.info({ label: "getBrands", message: brandMessages["fetched"] });
        return res.status(HTTP_STATUS_OK).json({ success: true, brands, message: brandMessages["fetched"] })
    } catch (error) {
        logger.error({ label: "getBrands", message: error.message });
        next(error);
    }
}