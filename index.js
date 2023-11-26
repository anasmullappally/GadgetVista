import express from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import passport from "passport";
import cors from "cors";
import { errorHandler } from "./middleware/error-handler.js";
import { connectDB } from "./config/database.js";
import { APINotFound } from "./middleware/api-notfound.js";

config();

const corsOptions = {
  origin: `${process.env.FRONTEND}`,
  credentials: true,
};

const PORT = process.env.PORT || 5000;
export const app = express();

app.use(passport.initialize());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors(corsOptions));

import authRouter from "./routes/auth.js";

app.get("/", (req, res) => res.send("Connected successfully"));

app.use("/auth", authRouter);

app.use(APINotFound);
app.use(errorHandler);

app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server connected successfully on ${PORT}`);
});
