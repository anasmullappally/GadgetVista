import express from "express";
import { addBrand, createProduct, createVariant, getBrands, getProducts, getVariants } from "../controllers/product.js";
import multer from "multer";
const router = express.Router();

// Multer configuration to handle file uploads
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb, res) => {
        if (!file.mimetype.startsWith('image')) {
            req.fileValidationError = 'Only image files are allowed!';
            return cb(null, false);
        }
        cb(null, true);
    }
});

router.get("/", getProducts)
router.post("/", createProduct)
router.get("/brands", getBrands)
router.post("/brands", addBrand)
router.post("/variants", upload.array("images"), createVariant);
router.get("/variants", getVariants)


export default router;
