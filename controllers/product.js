import tinycolor from "tinycolor2";
import { HTTP_BAD_REQUEST, HTTP_STATUS_CREATED, HTTP_STATUS_OK } from "../utils/status-codes.js";
import { addBrandValidation, createProductValidation, variantValidation } from "../validation/product-validation.js";
import { brandMessages, productsMessages, variantMessages } from "../utils/message-store/product.js";
import { Products } from "../models/products.js";
import logger from "../config/logger.js";
import { Brands } from "../models/brands.js";
import moment from "moment";
import sharp from "sharp";
import { v2 as cloudinary } from 'cloudinary';
import { Variants } from "../models/variants.js";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadImages = async (images, filenamePrefix) => {
    try {
        const uploadPromises = images.map(async (image, index) => {
            return new Promise((resolve, reject) => {
                const filename = `${filenamePrefix}-${index + 1}`;
                cloudinary.uploader.upload_stream(
                    { resource_type: "auto", public_id: filename },
                    async (error, result) => {
                        if (error) {
                            console.error('Error uploading image:', error);
                            reject(error);
                        } else {
                            // console.log('Image uploaded successfully:', result);
                            resolve({
                                filename: filename,
                                url: result.secure_url
                            });
                        }
                    }
                ).end(image.buffer);
            });
        });

        const uploadResults = await Promise.all(uploadPromises);
        return uploadResults;
    } catch (error) {
        console.error('Error uploading images:', error);
        throw error;
    }
};


export const getProducts = async (req, res, next) => {
    try {
        const products = await Products.find()
            .populate("brand", "name -_id")
            .populate("variants",)
            .lean()

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

export const createVariant = async (req, res, next) => {
    try {
        if (req?.fileValidationError) {
            return res.status(400).json({ success: false, message: req.fileValidationError });
        }
        const { value, error } = variantValidation.validate(req.body);
        if (error) {
            return res.status(HTTP_BAD_REQUEST).json({ success: false, message: error.details[0].message });
        }
        const { files } = req
        let exceededImage = null;

        for (const [index, file] of files.entries()) {
            const metadata = await sharp(file?.buffer).metadata();
            const width = metadata.width;
            // console.log(width, "wdt");
            // Check if the width exceeds the maximum allowed width
            if (width > 400) {
                console.log(file.originalname);
                exceededImage = { index, width };
                break; // Stop processing further images
            }
        }
        // console.log(exceededImage, "exceededImage");
        // Check if an exceeded image was found
        // if (exceededImage) {
        //     return res.status(HTTP_BAD_REQUEST).json({
        //         success: false,
        //         message: 'One or more images exceed the maximum allowed width of 400px!',
        //         exceededImage: exceededImage
        //     });
        // }

        const { colorCode, selectedProduct } = value

        if (!tinycolor(colorCode).isValid()) {
            return res.status(HTTP_BAD_REQUEST).json({ success: false, message: productsMessages["color-not-valid"], colorCode: colorCode });
        }
        const product = await Products.findById(selectedProduct)
        if (!product) {
            return res.status(HTTP_BAD_REQUEST).json({ success: false, message: variantMessages["product-not-exist"] })
        }

        const variant = new Variants({
            ...value,
            product: product._id,
            brand: product.brand,
            isVisible: product.isVisible,
            releaseDate: product.releaseDate
        })

        const images = await uploadImages(req.files, variant._id)
        variant.images = images
        product.variants.push(variant._id)
        const brand = await Brands.findById(product.brand)
        brand.totalProducts += variant.quantity
        brand.activeProducts += variant.quantity
        await variant.save()
        await product.save()
        await brand.save()

        logger.info({ label: "createProduct", message: variantMessages["success"] });
        return res.status(HTTP_STATUS_CREATED).json({ success: true, message: variantMessages["success"] })
    } catch (error) {
        logger.error({ label: "createVariant", message: error.message });
        next(error)
    }
}

export const getVariants = async (req, res, next) => {
    try {

        const variants = await Variants.find()
            .populate("product", "name shippingCharge warrantyInfo accessories")
            .populate("brand", "name -_id")
            .lean()

        logger.info({ label: "getVariants", message: productsMessages["fetched"] });
        return res.status(HTTP_STATUS_OK).json({ success: true, variants, message: productsMessages["fetched"] })

    } catch (error) {
        logger.error({ label: "getVariants", message: error.message });
        next(error);
    }
}

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