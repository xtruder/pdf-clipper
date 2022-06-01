import getenv from "getenv.ts";

export const appPort: number = getenv.int("APP_PORT", 4000);

export const traceExporterName = getenv.string("TRACE_EXPORTER_NAME", "noop");
