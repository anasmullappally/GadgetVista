import express from "express";
import { addBrand, createProduct, getBrands, getProducts } from "../controllers/product.js";
const router = express.Router();

router.get("/", getProducts)
router.post("/", createProduct)
router.get("/brands", getBrands)
router.post("/brands", addBrand)


export default router;
