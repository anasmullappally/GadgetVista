import express from "express";
import { addToCart, getCart, removeCartItem, updateQuantity } from "../controllers/cart.js";
import { verifyToken } from "../middleware/token.js";
const router = express.Router();

router.post("/", verifyToken, addToCart)
router.get("/", verifyToken, getCart)
router.put("/:cartId", verifyToken, updateQuantity)
router.delete("/:cartId", verifyToken, removeCartItem)

export default router;
