/**
 * File contains modules about generating new access token after validating old token
 */

import logger from "../config/logger.js";
import { HTTP_BAD_REQUEST, HTTP_STATUS_CREATED, HTTP_STATUS_INTERNAL_ERROR } from "../utils/status-codes.js";
import jwt from "jsonwebtoken";
import { verifyRefreshToken } from "./verify-refresh-token.js";
import { Users } from "../models/users.js";


export const generateNewAccessToken = async (req, res) => {
    try {
        // finding user ip and browser from which source they are sending
        const { refreshToken } = req.body;
        if (!refreshToken || typeof refreshToken !== "string") {
            return res.status(HTTP_BAD_REQUEST).json({ success: false, message: "Your session expired. Please login again." })
        }

        // function to verify refresh token
        verifyRefreshToken(refreshToken, process.env.REFRESH_TOKEN_SECRET)
            .then(async ({ tokenDetails, verified }) => {
                const { _id, role, batchID } = tokenDetails

                // generating new access and refresh tokens
                const accessToken = jwt.sign({ _id, role, verified, batchID }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "7d" })
                const newRefreshToken = jwt.sign({ _id, role, verified, batchID }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });


                // Update the first document that matches the criteria
                const updatedToken = await Users.findOneAndUpdate(
                    { _id: tokenDetails?._id, 'loginToken.token': refreshToken },
                    { $set: { 'loginToken.$.token': newRefreshToken, 'loginToken.$.time': Date.now() } },
                    { new: true }, // This option returns the updated document
                )

                if (!updatedToken) {
                    logger.error(` while updating the previous refresh token got error for user- ${_id} ip - ${userSystemIP} `, { label: 'generateNewAccessToken' })
                    return res.status(HTTP_STATUS_INTERNAL_ERROR).json({ success: false, message: "Internal Database Error. Please login again" })
                }

                return res.status(HTTP_STATUS_CREATED).json({
                    accessToken, refreshToken: newRefreshToken, message: "Access token created successfully.", success: true,
                })

            }).catch((err) => {
                return res.status(HTTP_BAD_REQUEST).json({ success: false, message: "Your session expired. Please login again." })
            });

    } catch (err) {
        logger.error({ label: 'generateNewAccessToken', message: err.message })
        return res.status(HTTP_STATUS_INTERNAL_ERROR).json({ success: false, message: "Internal Server Error. Please login again." })
    }
}