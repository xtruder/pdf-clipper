import getenv from "getenv.ts";

export const nodeEnv = getenv.string("NODE_ENV", "dev");
export const isDev = nodeEnv === "dev";
export const serverPort = getenv.int("SERVER_PORT", 5000);

export const traceExporterName = getenv.string("TRACE_EXPORTER_NAME", "noop");

export const hasuraGraphqlURL = getenv.string(
  "HASURA_GRAPHQL_GRAPHQL_URL",
  "http://localhost:8080/v1/graphql"
);
export const hasuraAdminSecret = getenv.string(
  "HASURA_ADMIN_SECRET",
  "hello123"
);

export const minioEndPoint = getenv.string("MINIO_ENDPOINT", "localhost");
export const minioPort = getenv.int("MINIO_PORT", 9000);
export const minioUseSSL = getenv.bool("MINIO_USE_SSL", false);
export const minioAccessKey = getenv.string(
  "MINIO_ACCESS_KEY",
  "qo3SQTpHuE2IMfU7"
);
export const minioSecretKey = getenv.string(
  "MINIO_SECRET_KEY",
  "PaHQqhz1p9ZZQvLFbhM5PQhAUILaJmLw"
);
