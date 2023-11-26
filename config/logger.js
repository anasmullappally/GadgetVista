import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import chalk from "chalk";

// Custom format to add colors
const coloredFormat = winston.format.printf(
  ({ timestamp, message, level, label }) => {
    let levelColor = chalk.green; // Green color for info logs

    if (level === "error") {
      levelColor = chalk.red; // Red color for error logs
    }

    // Apply color to different parts of the log message
    const formattedTimestamp = levelColor(timestamp);
    const formattedRelatedTo = levelColor(`[${label}]`);
    const formattedMessage = levelColor(message);

    return `${formattedTimestamp} ${formattedRelatedTo} ${formattedMessage}`;
  }
);

// Create a logger instance
const logger = winston.createLogger({
  level: "info", // Log level
  format: winston.format.combine(
    winston.format.timestamp({ format: "DD-MM-YYYY HH:mm" }), // Customize timestamp format
    winston.format.errors({ stack: true }), // Include stack traces for errors
    winston.format.splat(), // Interpolate any data passed into logger
    coloredFormat // Use the custom colored format
  ),
  transports: [
    new DailyRotateFile({
      filename: "logs/application-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d", // Keep logs for 14 days
      level: "info",
    }),
    new DailyRotateFile({
      filename: "logs/error-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d", // Keep logs for 14 days
      level: "error", // Separate file for error logs
    }),
    new DailyRotateFile({
      filename: "logs/combined-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d", // Keep logs for 14 days
    }),
    new winston.transports.Console({
      format: winston.format.combine(
        coloredFormat // Use the custom colored format
      ),
    }),
  ],
});

export default logger; // Export the logger to use it in other modules
