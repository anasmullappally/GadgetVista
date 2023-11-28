import logger from "./config/logger.js";
import dotenv from "dotenv";
//configuring dotenv
dotenv.config();

import process from "node:process";
import { httpServer } from "./express-app.js";
import { connectDB } from "./config/database.js";

// Starting the server and listening at the specified port
const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, async () => {

  logger.info(`server listening at port - ${PORT}`, { label: "Server" });

  await connectDB();
});

process.on("exit", (code) => {
  logger.critical(`Platform server down alert - ${code}`, { label: "Platform" });
});
