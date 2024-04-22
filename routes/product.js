import express from "express";
import { createProduct, getBrands, getProducts } from "../controllers/product.js";
const router = express.Router();

router.get("/", getProducts)
router.post("/", createProduct)
router.get("/brands", getBrands)


export default router;
