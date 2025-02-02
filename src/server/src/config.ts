import getenv from "getenv.ts";

export const isDev: boolean = getenv.string("NODE_ENV", "dev") === "dev";

export const port: number = getenv.int("APP_PORT", 4000);

export const traceExporterName = getenv.string("TRACE_EXPORTER_NAME", "noop");

export const postgres = {
  host: getenv.string("POSTGRES_HOST", isDev ? "localhost" : "postgres"),
  port: getenv.int("POSTGRES_PORT", 5432),
  user: getenv.string("POSTGRES_USER", "pdf-clipper"),
  password: getenv.string("POSTGRES_PASSWORD", "pdf-clipper"),
  database: getenv.string("POSTGRES_DB", "pdf-clipper"),
};
