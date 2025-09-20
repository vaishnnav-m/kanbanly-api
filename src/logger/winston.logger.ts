import winston, { transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const customLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
  },
  colors: {
    error: "red",
    warn: "yellow",
    info: "green",
    http: "magenta",
    debug: "blue",
  },
};

const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.colorize(),
  winston.format.printf(({ timestamp, level, message, stack }) => {
    return stack
      ? `${timestamp} [${level.toUpperCase()}]: ${message}\n${stack}`
      : `${timestamp} [${level.toUpperCase()}]: ${message}`;
  })
);

const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.json()
);

const combinedFileTransport = new DailyRotateFile({
  dirname: "logs",
  filename: "%DATE%-app.log",
  datePattern: "YYYY-MM-DD",
  format: fileFormat,
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "14d",
});

const errorFileTransport = new DailyRotateFile({
  dirname: "logs",
  filename: "%DATE%-error.log",
  datePattern: "YYYY-MM-DD",
  format: fileFormat,
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "30d",
  level: "error",
});

winston.addColors(customLevels.colors);

const logger = winston.createLogger({
  levels: customLevels.levels,
  level: "debug",
  transports: [
    new transports.Console({ format: consoleFormat, handleExceptions: true }),
    combinedFileTransport,
    errorFileTransport,
  ],
});

export default logger;
