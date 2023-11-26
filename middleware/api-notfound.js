export const APINotFound = async (req, res, next) => {
  try {
    // Assuming you want to handle a 404 error for API routes
    const error = new Error("API endpoint not found");
    error.status = 404;
    throw error;
  } catch (error) {
    next(error); // Pass the error to the next error-handling middleware
  }
};
