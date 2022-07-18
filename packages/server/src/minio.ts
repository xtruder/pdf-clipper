import { Client } from "minio";
import { Readable } from "stream";
import { hashStream } from "./utils";

const client = new Client({
  endPoint: "localhost",
  port: 9000,
  useSSL: false,
  accessKey: "8kiOWgHm0lW7HK1o",
  secretKey: "MRBxJT1zVQLs2g0gbDRfPzQpWgfn3Oqb",
});

const filesBucket = "files";
const imagesBucket = "images";

/**Saves file by uploading to S3 bucket with provided key */
export async function saveFile(stream: Readable, key: string) {
  await client.putObject(filesBucket, key, stream);
}

/**Get file url using presigned URL, make it avalible for 1hour */
export async function getFileUrl(key: string): Promise<string> {
  return await client.presignedGetObject(filesBucket, key, 3600);
}

export async function saveImage(stream: Readable, key: string) {
  await client.putObject(imagesBucket, key, stream, {
    "Content-Type": "image/png",
  });
}

export async function getImageUrl(key: string): Promise<string | null> {
  let etag: string;

  try {
    const file = await client.getObject(imagesBucket, key);
    etag = await hashStream(file, "md5");
  } catch (err) {
    return null;
  }

  return `http://localhost:9000/images/${key}?etag=${etag}`;
}
