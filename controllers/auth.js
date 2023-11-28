import logger from "../config/logger.js";
import { Users } from "../models/users.js";
import { generateToken } from "../tokens/generate-token.js";
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
    const emailExist = await Users.exists({ email: email?.toLowerCase() });
    if (emailExist) {
      return res.status(HTTP_BAD_REQUEST).json({ success: false, message: signupMessages["email-exist"] });
    }
    // checking phone number already exists or not
    const phoneExist = await Users.exists({ phoneNumber });
    if (phoneExist) {
      return res.status(HTTP_BAD_REQUEST).json({ success: false, message: signupMessages["phone-exist"] });
    }

    //encrypt user password
    const hashPassword = await bcrypt.hash(password, 10);

    const user = new Users({
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

    const user = await Users.findOne({ email: email.toLowerCase() })
      .select("email password block")
      .lean();

    if (!user) {
      return res.status(HTTP_BAD_REQUEST).json({ success: false, message: loginMessages["no-user"] });
    }

    if (user?.block) {
      return res.status(HTTP_BAD_REQUEST).json({ success: false, message: loginMessages["block"] });
    }

    const passwordCorrect = await bcrypt.compare(password, user?.password)
    if (!passwordCorrect) {
      return res.status(HTTP_BAD_REQUEST).json({ success: false, message: loginMessages["wrong-password"] });
    }
    const payload = { user: user._id }
    const { accessToken, refreshToken } = await generateToken({ payload, accessSecretKey: process.env.ACCESS_TOKEN_SECRET, refreshSecretKey: process.env.REFRESH_TOKEN_SECRET })

    return res.status(HTTP_STATUS_OK).json({ success: true, accessToken, refreshToken, message: loginMessages["success"] })
  } catch (error) {
    logger.error({ label: "login", message: error.message });
    next(error);
  }
};
