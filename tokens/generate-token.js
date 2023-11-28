import jwt from "jsonwebtoken";
import { Users } from "../models/users.js";


export const generateToken = async ({ payload, accessSecretKey, refreshSecretKey }) => {
    try {
        const { user } = payload

        // generating access and refresh tokens using jsonwebtoken
        const accessToken = jwt.sign(payload, accessSecretKey, { expiresIn: "1d" });  // 5 min validity
        const refreshToken = jwt.sign(payload, refreshSecretKey, { expiresIn: "7d" }) // 7 days validity

        // token details we are storing in the user collection to track
        const tokenDetails = {
            token: refreshToken,
            time: Date.now()
        }

        //FIXME: write a code to if there is any same agent and ip replace it with new refresh token

        const token = await Users.findOneAndUpdate({ _id: user }, { $push: { loginToken: tokenDetails } })
        if (!token) {
            throw new Error("While creating user token got error with DB")
        }
        return Promise.resolve({ accessToken, refreshToken })
    } catch (err) {
        return Promise.reject(err);
    }
}