import { createHash } from "crypto";
import { Stream } from "stream";

export function hashStream(stream: Stream, algo: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const hash = createHash(algo);

    stream.on("error", reject);
    stream.on("data", (d) => hash.update(d));
    stream.on("end", () => resolve(hash.digest("hex")));
  });
}
