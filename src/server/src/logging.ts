import winston, { format, LoggerOptions } from "winston";

const myFormat = format.printf(({ level, message, label, timestamp }) => {
  return `${timestamp} ${level} [${label}]: ${message}`;
});

const loggerFormat = format.combine(
  format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  format.colorize(),
  format.splat(),
  format.metadata({ fillExcept: ["message", "level", "timestamp", "label"] }),
  myFormat
);

const loggers = new winston.Container();

export const getLogger = (id: string, options: LoggerOptions = {}) =>
  loggers.has(id)
    ? loggers.get(id)
    : loggers.add(id, {
        transports: [new winston.transports.Console()],
        defaultMeta: { service: "pdf-clipper" },
        format: format.combine(format.label({ label: id }), loggerFormat),
        level: "debug",
        ...options,
      });

getLogger("typeorm", { level: "warn" });
getLogger("graphql-yoga", { level: "debug" });

export const logger = getLogger("main");

// export const expressLogger = expressWinston.logger({
//   winstonInstance: logger,
//   meta: true,
//   expressFormat: true,
//   format: loggerFormat,
//   colorize: true,
//   headerBlacklist: ["authorization", "cookie"],
// });
