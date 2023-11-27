// import express from "express";
// import { config } from "dotenv";
// import cookieParser from "cookie-parser";
// import passport from "passport";
// import cors from "cors";
// import { errorHandler } from "./middleware/error-handler.js";
// import { connectDB } from "./config/database.js";
// import { APINotFound } from "./middleware/api-notfound.js";

// config();

// const PORT = process.env.PORT || 5000;
// export const app = express();

// app.use(passport.initialize());
// app.use(cookieParser());
// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());
// app.use(cors(corsOptions));

// import authRouter from "./routes/auth.js";
import logger from "./config/logger.js";

// app.get("/", (req, res) => res.send("Connected successfully"));

// app.use("/auth", authRouter);

// app.use(APINotFound);
// app.use(errorHandler);

// app.listen(PORT, async () => {
//   await connectDB();
//   logger.info({
//     label: "Server",
//     message: `Server connected successfully on ${PORT}`,
//   });
// });

//index
/**
 * This is  the server initializing file
 */
import dotenv from "dotenv";
//configuring dotenv
dotenv.config();

import process from "node:process";
import { httpServer } from "./express-app.js";
import { connectDB } from "./config/database.js";

// Starting the server and listening at the specified port
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, async () => {
  logger.info(`server listening at port - ${PORT}`, {
    label: "Server",
  });
  await connectDB();
});

process.on("exit", (code) => {
  logger.critical(`Platform server down alert - ${code}`, {
    label: "Platform",
  });
});
