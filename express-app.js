/**
 * Creates app, configure express, API routes
 */

import dotenv from "dotenv";
dotenv.config(); //configuring dotenv

import { createServer } from "http";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import routes from "./routes.js"; // importing routes
// import { corsOptions } from "./configs/cors.js"; // cross origin resource sharing (cors)
// import swaggerUi from "swagger-ui-express";
// import specs from "./swagger/swagger-def.js";

import { APINotFound } from "./middleware/api-notfound.js";
import { errorHandler } from "./middleware/error-handler.js";

const clientURL =process.env.CLIENT
const corsOptions = {
    origin: clientURL,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
};

// creating a instance of express application
const app = express();

// creating http server using the express server
const httpServer = createServer(app);

// parsing incoming request data with extended options
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(helmet());
// //Swagger
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// use CORS middleware with customs options
app.use(cors(corsOptions));

// api routes module
app.use("/api", routes);

// route not exist message
app.use(APINotFound);

// middleware to handle errors
app.use(errorHandler);

export { app, httpServer };
