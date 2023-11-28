import jwt from "jsonwebtoken";
import { Users } from "../models/users";


/**
 * verifies if the provided refreshToken is exist in database or not.
 * If exist then check for if token is valid or not.
 */

export const verifyRefreshToken = (refreshToken, refresh_secret) => {

    // return promised value
    return new Promise(async (resolve, reject) => {

        // verifying refresh token with jwt
        jwt.verify(refreshToken, refresh_secret, async (err, tokenDetails) => {
            if (err) {
                return reject({ message: "Invalid refresh token" })
            } else {
                const { _id: userID } = tokenDetails

                // finding user login tokens collection and also checking if user is blocked or not
                const user = await Users.findById(userID).select("loginToken block verified").exec()
                if (user?.block === true) {
                    return reject({ message: "Invalid refresh token2 " })
                }

                // finding out the specified token in the login token collection
                const token = user?.loginToken?.find((eachToken) => eachToken?.token === refreshToken)
                if (!token) {
                    return reject({ message: "Invalid refresh token" });
                }

                // even after finding the token we are checking wether the correct person is requesting 

                return resolve({ tokenDetails, verified: user?.verified, message: "Valid refresh token" })
            }
        })

    })
}