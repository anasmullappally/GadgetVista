import logger from "../config/logger.js";
import { User } from "../models/users.js";
import { signupMessages } from "../utils/message-store/auth.js";
import {
  HTTP_BAD_REQUEST,
  HTTP_STATUS_CREATED,
} from "../utils/status-codes.js";
import { userValidationSchema } from "../validation/auth-validation.js";

export const signup = async (req, res, next) => {
  try {
    const { value, error } = userValidationSchema.validate(req.body);
    if (error) {
      return res
        .status(HTTP_BAD_REQUEST)
        .json({ success: false, message: error.details[0].message });
    }

    const { firstName, lastName, email, phoneNumber, password, dateOfBirth } =
      value;

    const emailExist = await User.exists({ email: email?.toLowerCase() });
    if (emailExist)
      return res
        .status(HTTP_BAD_REQUEST)
        .json({ success: false, message: signupMessages["email-exist"] });

    const phoneExist = await User.exists({ phoneNumber });
    if (phoneExist)
      return res
        .status(HTTP_BAD_REQUEST)
        .json({ success: false, message: signupMessages["phone-exist"] });

    const user = new User({
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      dateOfBirth,
    });
    await user.save();

    return res
      .status(HTTP_STATUS_CREATED)
      .json({ message: "success", success: true });
  } catch (error) {
    logger.error({ label: "signup", message: error.message });
    next(error);
  }
};
