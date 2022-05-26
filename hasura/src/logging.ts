import winston, { format } from "winston";
import expressWinston from "express-winston";

const loggerFormat = format.combine(
  format.timestamp(),
  format.colorize(),
  format.simple()
);

export const logger = winston.createLogger({
  transports: [new winston.transports.Console()],
  defaultMeta: { service: "pdf-clipper-actions" },
  format: loggerFormat,
});

export const expressLogger = expressWinston.logger({
  winstonInstance: logger,
  meta: true,
  expressFormat: true,
  format: loggerFormat,
  colorize: true,
  headerBlacklist: ["authorization", "cookie"],
});
