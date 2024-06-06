import logger from "../config/logger.js";
import { Users } from "../models/users.js";
import { HTTP_BAD_REQUEST, HTTP_STATUS_FORBIDDEN, HTTP_STATUS_INTERNAL_ERROR } from "../utils/status-codes.js";
import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req?.headers?.authorization;
        if (!authHeader) {
            return res.status(HTTP_BAD_REQUEST).json({ message: "You are not authenticated" })
        }
        const token = authHeader.split(" ")[1];

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
            if (user) {
                if (user?.role !== "user") {
                    return res.status(HTTP_BAD_REQUEST).json({ message: "Access Denied! Please login again." })
                }
                const userDetails = await Users.findById(user._id).select("block").lean()
                if (userDetails?.block) {
                    return res.status(HTTP_BAD_REQUEST).json({
                        message: "You are blocked by the Admin, Please contact your Admin for further details"
                    })
                }
                req.user = user;
                next();

            } else if (err?.message && err.message === 'jwt expired') {
                return res.status(HTTP_STATUS_FORBIDDEN).json({
                    message: "Your access token has expired. Please log in again to continue."
                })
            } else {
                return res.status(HTTP_BAD_REQUEST).json({
                    message: "User not authenticated",
                })
            }
        })
    } catch (err) {
        logger.error(err.message, { label: 'verifyToken' })
        return res.status(HTTP_STATUS_INTERNAL_ERROR).json({ message: "Internal Server Error" })
    }
}