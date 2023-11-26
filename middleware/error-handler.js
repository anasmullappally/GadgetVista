import mongoose from "mongoose";

export const errorHandler = async (err, req, res, next) => {
  let { message } = err;
  let status;

  // Check if the error is due to a Mongoose CastError or ValidationError
  if (err instanceof mongoose.Error.CastError) {
    const { errors } = err;
    const key = Object.keys(errors)[0];
    status = 400;
    message = `Enter valid ${key}`;
  }

  if (err instanceof mongoose.Error.ValidationError) {
    const { errors } = err;
    const key = Object.keys(errors)[0];
    if (!status) {
      status = 400;
    }
    if (errors[key].name === "CastError") {
      message = `Enter a valid ${key}`;
    } else {
      message = errors[key].message;
    }
  }

  // Check if the error is due to an undefined API endpoint
  if (err.status === 404) {
    status = 404;
    message = "API endpoint not found";
  }

  // Set a default status if it's not defined
  status = status || 500;
  message = status === 500 ? "Internal server error" : message;

  return res.status(status).json({ success: false, message });
};
