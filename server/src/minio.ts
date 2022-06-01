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

export async function saveFile(stream: Readable, key: string) {
  await client.putObject(bucketName, key, stream);
}
