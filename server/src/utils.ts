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
