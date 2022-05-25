import { Client } from "minio";
import {
  minioAccessKey,
  minioEndPoint,
  minioPort,
  minioSecretKey,
  minioUseSSL,
} from "../config";

export const minioClient = new Client({
  endPoint: minioEndPoint,
  port: minioPort,
  useSSL: minioUseSSL,
  accessKey: minioAccessKey,
  secretKey: minioSecretKey,
});
