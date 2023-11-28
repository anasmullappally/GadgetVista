import logger from "../config/logger.js";
import { Users } from "../models/users.js";
import { HTTP_STATUS_OK } from "../utils/status-codes.js";


export const getUserDetails = async (req, res, next) => {
    try {
        const user = await Users.findOne({}).select("firstName lastName email phoneNumber dateOfBirth").lean()

        return res.status(HTTP_STATUS_OK).json({ success: true, message: 'success', user })
    } catch (error) {
        logger.error({ label: "getUserDetails", message: error.message });
        next(error);
    }
}