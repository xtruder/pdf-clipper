import { Blob } from "buffer";
import { createHash } from "crypto";
import { createReadStream, createWriteStream, read, ReadStream } from "fs";
import { mkdtemp, rm } from "fs/promises";
import { join } from "path";
import { Stream } from "stream";

export function hashStream(stream: Stream, algo: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const hash = createHash(algo);

    stream.on("error", reject);
    stream.on("data", (d) => hash.update(d));
    stream.on("end", () => resolve(hash.digest("hex")));
  });
}

export async function writeTmpStream(
  stream: Stream,
  name: string
): Promise<ReadStream> {
  // create temporary dir
  const tmpDir = await mkdtemp("nodejs");

  // create file in tmp directory
  const filePath = join(tmpDir, name);

  const writeStream = createWriteStream(filePath, {
    autoClose: true,
  });

  // try to write file
  try {
    await new Promise((resolve, reject) => {
      stream.on("end", resolve);
      stream.on("error", reject);

      stream.pipe(writeStream);
    });
  } catch (err) {
    await rm(tmpDir, { recursive: true });
    throw err;
  }

  // after file has been written create another read stream that will be
  // used for reading and eventually deleting file after stream has been closed
  const readStream = createReadStream(filePath, {
    autoClose: true,
  });
  readStream.on("close", () => rm(tmpDir, { recursive: true }));

  return readStream;
}

export function dataURItoBlob(dataURI: string): Blob {
  // convert base64 to raw binary data held in a string
  const data = dataURI.split(",")[1];
  const byteString = Buffer.from(data, "base64");

  // separate out the mime component
  const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

  // write the ArrayBuffer to a blob, and you're done
  const blob = new Blob([byteString], { type: mimeString });
  return blob;
}
