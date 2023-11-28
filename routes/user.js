import express from "express";
import { getUserDetails } from "../controllers/user.js";
const router = express.Router();

router.get("/", getUserDetails)

export default router;
