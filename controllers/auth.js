import logger from "../config/logger.js";
import { User } from "../models/users.js";
import { loginMessages, signupMessages } from "../utils/message-store/auth.js";
import { HTTP_BAD_REQUEST, HTTP_STATUS_CREATED, HTTP_STATUS_OK, } from "../utils/status-codes.js";
import { loginValidationSchema, userRegistrationValidationSchema, } from "../validation/auth-validation.js";
import bcrypt from "bcrypt";

export const signup = async (req, res, next) => {
  try {
    //validating body data using joi schema
    const { value, error } = userRegistrationValidationSchema.validate(req.body);
    if (error) {
      return res.status(HTTP_BAD_REQUEST).json({ success: false, message: error.details[0].message });
    }
    // destructuring
    const { firstName, lastName, email, phoneNumber, password, dateOfBirth } = value;

    //checking email already exist or not
    const emailExist = await User.exists({ email: email?.toLowerCase() });
    if (emailExist) {
      return res.status(HTTP_BAD_REQUEST).json({ success: false, message: signupMessages["email-exist"] });
    }
    // checking phone number already exists or not
    const phoneExist = await User.exists({ phoneNumber });
    if (phoneExist) {
      return res.status(HTTP_BAD_REQUEST).json({ success: false, message: signupMessages["phone-exist"] });
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

    return res.status(HTTP_STATUS_CREATED).json({ message: signupMessages["success"], success: true });
  } catch (error) {
    logger.error({ label: "signup", message: error.message });
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { value, error } = loginValidationSchema.validate(req.body);
    if (error) {
      return res.status(HTTP_BAD_REQUEST).json({ success: false, message: error.details[0].message });
    }
    const { email, password } = value;

    const user = await User.findOne({ email: email.toLowerCase() })
      .select("email password")
      .lean();

    if (!user) {
      return res.status(HTTP_BAD_REQUEST).json({ success: false, message: loginMessages["no-user"] });
    }
    const passwordCorrect = await bcrypt.compare(password, user?.password)
    if (!passwordCorrect) {
      return res.status(HTTP_BAD_REQUEST).json({ success: false, message: loginMessages["wrong-password"] });
    }
    //FIXME: Create A jwt token
    return res.status(HTTP_STATUS_OK).json({ success: true, message: loginMessages["success"] })
  } catch (error) {
    logger.error({ label: "login", message: error.message });
    next(error);
  }
};
