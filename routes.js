import express from "express";
const router = express.Router();

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import productRoutes from "./routes/product.js";
import cartRoutes from "./routes/cart.js";

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/products", productRoutes);
router.use("/cart", cartRoutes);

export default router;
