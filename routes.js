import express from "express";
const router = express.Router();

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";

router.use("/auth", authRoutes);
router.use("/user", userRoutes);

export default router;
