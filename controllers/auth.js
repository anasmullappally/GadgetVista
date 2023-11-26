import logger from "../config/logger.js";
import { User } from "../models/users.js";
import { signupMessages } from "../utils/message-store/auth.js";
import {
  HTTP_BAD_REQUEST,
  HTTP_STATUS_CREATED,
} from "../utils/status-codes.js";
import { userValidationSchema } from "../validation/auth-validation.js";
import bcrypt from "bcrypt";

export const signup = async (req, res, next) => {
  try {
    //validating body data using joi schema
    const { value, error } = userValidationSchema.validate(req.body);
    if (error) {
      return res
        .status(HTTP_BAD_REQUEST)
        .json({ success: false, message: error.details[0].message });
    }
    // destructuring
    const { firstName, lastName, email, phoneNumber, password, dateOfBirth } =
      value;

    //checking email already exist or not
    const emailExist = await User.exists({ email: email?.toLowerCase() });
    if (emailExist) {
      return res
        .status(HTTP_BAD_REQUEST)
        .json({ success: false, message: signupMessages["email-exist"] });
    }
    // checking phone number already exists or not
    const phoneExist = await User.exists({ phoneNumber });
    if (phoneExist) {
      return res
        .status(HTTP_BAD_REQUEST)
        .json({ success: false, message: signupMessages["phone-exist"] });
    }

    //encrypt user password
    const hashPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName: firstName?.toLowerCase(),
      lastName: lastName?.toLowerCase(),
      email: email?.toLowerCase(),
      password: hashPassword,
      phoneNumber,
      dateOfBirth,
    });

    //save data
    await user.save();

    return res
      .status(HTTP_STATUS_CREATED)
      .json({ message: signupMessages["success"], success: true });
  } catch (error) {
    logger.error({ label: "signup", message: error.message });
    next(error);
  }
};
