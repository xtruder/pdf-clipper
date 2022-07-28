import {
  getOriginPrivateDirectory,
  FileSystemDirectoryHandle,
  FileSystemFileHandle,
} from "native-file-system-adapter";

import { BlobCache } from "./blobstore";

export async function getPrivateDirectory() {
  let dir: FileSystemDirectoryHandle | undefined;

  // try to use native private directory, or fallback to indexeddb
  try {
    dir = await getOriginPrivateDirectory();
  } catch (err) {
    dir = await getOriginPrivateDirectory(
      import("native-file-system-adapter/src/adapters/indexeddb.js" as any)
    );
  }

  return dir;
}

/**BlobCache using browser native filesystem */
export class NativeFSBlobCache implements BlobCache {
  constructor(private rootDir: FileSystemDirectoryHandle) {}

  static async usePrivateDirectory() {
    return new NativeFSBlobCache(await getPrivateDirectory());
  }

  /**Saves file to native filesystem, content can be string, dataurl or File */
  async save(key: string, contents: Blob) {
    let fileHandle: FileSystemFileHandle | undefined;
    try {
      fileHandle = await this.rootDir.getFileHandle(key, { create: true });

      const file = await fileHandle.createWritable({
        keepExistingData: false,
      });

      await file.write(contents);
      await file.close();
    } catch (err) {
      // if there was an error remove file and then re-throw the error
      try {
        await fileHandle?.remove();
      } finally {
        throw err;
      }
    }
  }

  async load(key: string, mimeType: string): Promise<Blob | null> {
    if (!(await this.has(key))) return null;

    const fileHandle = await this.rootDir.getFileHandle(key);
    const file = await fileHandle.getFile();

    return file.slice(0, file.size, mimeType);
  }

  async remove(key: string): Promise<void> {
    try {
      const fileHandle = await this.rootDir.getFileHandle(key);
      await fileHandle.remove();
    } catch (err) {}
  }

  async has(key: string): Promise<boolean> {
    for await (const [, entry] of this.rootDir.entries()) {
      if (entry.name === key) return true;
    }

    return false;
  }
}
