import { Client } from "minio";
import { Readable } from "stream";

const client = new Client({
  endPoint: "localhost",
  port: 9000,
  useSSL: false,
  accessKey: "8kiOWgHm0lW7HK1o",
  secretKey: "MRBxJT1zVQLs2g0gbDRfPzQpWgfn3Oqb",
});

const bucketName = "files";

/**Saves file by uploading to S3 bucket with provided key */
export async function saveFile(stream: Readable, key: string) {
  await client.putObject(bucketName, key, stream);
}

/**Get file url using presigned URL, make it avalible for 1hour */
export async function getFileUrl(key: string): Promise<string> {
  return await client.presignedGetObject(bucketName, key, 3600);
}
