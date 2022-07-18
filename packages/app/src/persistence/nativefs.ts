import {
  getOriginPrivateDirectory,
  FileSystemDirectoryHandle,
  FileSystemFileHandle,
} from "native-file-system-adapter";

import parseDataUrl from "data-urls";

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

export class NativeFS {
  constructor(private rootDir: FileSystemDirectoryHandle) {}

  static async usePrivateDirectory() {
    return new NativeFS(await getPrivateDirectory());
  }

  /**Saves file to native filesystem, content can be string, dataurl or File */
  async saveFile(path: string, contents: string | File | BufferSource | Blob) {
    let rootDir: FileSystemDirectoryHandle;

    // create directory recusively and get new directory handle and file name
    [rootDir, path] = await this.getOrCreateRecursiePath(path);

    let fileHandle: FileSystemFileHandle | undefined;
    try {
      fileHandle = await rootDir.getFileHandle(path, { create: true });

      const file = await fileHandle.createWritable({
        keepExistingData: false,
      });

      if (typeof contents === "string") {
        // if contents is data url, first read it as blob, otherwise just write the
        // string contents
        const dataUrl = parseDataUrl(contents);
        await file.write(dataUrl ? dataUrl.body : contents);
      } else {
        await file.write(contents);
      }

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

  /**Gets file by name */
  async getFile(path: string): Promise<File> {
    let rootDir: FileSystemDirectoryHandle;

    [rootDir, path] = await this.getOrCreateRecursiePath(path);

    const fileHandle = await rootDir.getFileHandle(path);
    const file = await fileHandle.getFile();

    return file;
  }

  async fileExists(path: string): Promise<boolean> {
    let rootDir: FileSystemDirectoryHandle;

    [rootDir, path] = await this.getOrCreateRecursiePath(path);

    try {
      await rootDir.getFileHandle(path);
    } catch (err) {
      if (
        err instanceof DOMException &&
        err.code === DOMException.NOT_FOUND_ERR
      ) {
        return false;
      }

      throw err;
    }

    return true;
  }

  async getFiles(path: string) {
    let rootDir: FileSystemDirectoryHandle;

    [rootDir, path] = await this.getOrCreateRecursiePath(path + "/f");

    const entries: {
      kind: "file" | "directory";
      name: string;
    }[] = [];

    for await (const [, entry] of rootDir.entries()) {
      entries.push(entry);
    }

    return entries;
  }

  /**Removes file by path */
  async removeFile(path: string): Promise<void> {
    let rootDir: FileSystemDirectoryHandle;

    [rootDir, path] = await this.getOrCreateRecursiePath(path);

    const fileHandle = await rootDir.getFileHandle(path);

    await fileHandle.remove();
  }

  /**creates ar gets directory recursively */
  private async getOrCreateRecursiePath(
    path: string,
    dir: FileSystemDirectoryHandle = this.rootDir
  ): Promise<[FileSystemDirectoryHandle, string]> {
    const parts = path.split("/");

    if (parts.length <= 1) return [dir, parts[0]];

    const dirHandle = await dir.getDirectoryHandle(parts[0], { create: true });
    return await this.getOrCreateRecursiePath(
      parts.slice(1).join("/"),
      dirHandle
    );
  }
}
