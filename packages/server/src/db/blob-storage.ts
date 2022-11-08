import { createReadStream } from "fs";
import { mkdtemp, writeFile, rm } from "fs/promises";
import { join } from "path";
import { Readable } from "stream";

import { Client, ClientOptions } from "minio";
import { fromStream as hashStream } from "hasha";

/** BlobStorage defines interface for storage of blobs */
export interface BlobStorage {
  /** saves blob to blob storage and returns blob hash */
  saveBlob(stream: Blob, contentType: string): Promise<string>;

  /** gets blob from blob storage by hash */
  getFileStream(hash: string): Promise<Readable>;
}

export interface MinioStorageOptions {
  minio: ClientOptions;
  imagesUrl: string;
}

export class MinioStorage implements BlobStorage {
  private client: Client;

  constructor(options: ClientOptions, private bucket: string) {
    this.client = new Client(options);
  }

  async saveBlob(blob: Blob, contentType: string): Promise<string> {
    // create temporary dir
    const tmpDir = await mkdtemp("nodejs");
    const tmpPath = join(tmpDir, "upload");

    // create file in tmp directory
    try {
      await writeFile(tmpPath, blob.stream());

      let stream = createReadStream(tmpPath, { autoClose: true });
      const hash = await hashStream(stream, { algorithm: "sha256" });

      stream = createReadStream(tmpPath, { autoClose: true });
      await this.client.putObject(this.bucket, hash, stream, {
        "Content-Type": contentType,
        hash,
      });

      await rm(tmpDir, { recursive: true });

      return hash;
    } catch (err) {
      await rm(tmpDir, { recursive: true });
      throw err;
    }
  }

  async getFileStream(hash: string): Promise<Readable> {
    return this.client.getObject(this.bucket, hash);
  }
}
