import logger from "../config/logger.js";
import { User } from "../models/users.js";

export const signup = async (req, res, next) => {
  // try {
  //   const user = new User({
  //     firstName: "Anas",
  //     lastName: "Mullappally",
  //     email: "Anasmp0029@gmail.com",
  //     password: "Anas@123",
  //     phoneNumber: "8547700297",
  //     dateOfBirth: new Date("1998-09-11"),
  //   });
  //   throw new Error("Hello");
  //   await user.save();

  //   return res.status(201).json({ message: "success", user, success: true });
  // } catch (error) {
  //   logger.error(error.message);
  //   next();
  // }
};
