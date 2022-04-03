import { FileSystemDirectoryHandle } from "native-file-system-adapter";

import { getPrivateDirectory, NativeFS } from "./nativefs";
import { waitError } from "./utils";

const dirEntires = async (dir?: FileSystemDirectoryHandle) => {
  const entries: (FileSystemDirectoryHandle | FileSystemHandle)[] = [];

  for await (const [_, file] of dir?.entries() || []) entries.push(file);

  return entries;
};

const dirNames = async (dir?: FileSystemDirectoryHandle) =>
  (await dirEntires(dir)).map((f) => f.name);

const clean = async (dir: FileSystemDirectoryHandle) =>
  Promise.all(
    (await dirEntires(dir)).map((f) =>
      dir.removeEntry(f.name, { recursive: true })
    )
  );

const fileContents = async (
  dir: FileSystemDirectoryHandle,
  name: string
): Promise<string> => {
  const fileHandle = await dir.getFileHandle(name);
  const file = await fileHandle.getFile();
  return await file.text();
};

const toFile = async (
  dir: FileSystemDirectoryHandle,
  name: string,
  contents: string
) => {
  const fileHandle = await dir.getFileHandle(name, { create: true });
  const file = await fileHandle.createWritable();
  await file.write(contents);
  await file.close();
};

let privDirectory: FileSystemDirectoryHandle;

before(async () => {
  privDirectory = await getPrivateDirectory();
});

beforeEach(async () => {
  await clean(privDirectory);
});

it("should use private directory", async () => {
  await NativeFS.usePrivateDirectory();
});

describe("saveFile", () => {
  let fs: NativeFS;

  beforeEach(async () => {
    fs = await NativeFS.usePrivateDirectory();
  });

  it("should save file in root directory with text content", async () => {
    await fs.saveFile("my-file.txt", "hello world");

    expect(await dirNames(privDirectory)).contains("my-file.txt");
    expect(await fileContents(privDirectory, "my-file.txt")).eq("hello world");
  });

  it("should save file in subdirectory", async () => {
    await fs.saveFile("my-directory/my-file.txt", "hello world");

    expect(await dirNames(privDirectory)).contains("my-directory");

    const dirHandle = await privDirectory.getDirectoryHandle("my-directory");
    expect(await dirNames(dirHandle)).contains("my-file.txt");
  });

  it("should save data url", async () => {
    await fs.saveFile(
      "my-file.txt",
      "data:text/plain;charset=utf-8;base64,aGVsbG8gd29ybGQ="
    );

    expect(await dirNames(privDirectory)).contains("my-file.txt");
    expect(await fileContents(privDirectory, "my-file.txt")).eq("hello world");
  });
});

describe("getFile", () => {
  let fs: NativeFS;

  beforeEach(async () => {
    fs = await NativeFS.usePrivateDirectory();
  });

  it("should get simple text file", async () => {
    await toFile(privDirectory, "my-file.txt", "hello world");

    const file = await fs.getFile("my-file.txt");

    expect(await file.text()).eq("hello world");
  });

  it("should error if file does not exist", async () => {
    const err = await waitError(fs.getFile("my-file.txt"));
    expect(err?.name).eq("NotFoundError");
  });

  it("should get text from file in directory", async () => {
    const dir = await privDirectory.getDirectoryHandle("my-dir", {
      create: true,
    });
    await toFile(dir, "my-file.txt", "hello world");

    const file = await fs.getFile("my-dir/my-file.txt");

    expect(await file.text()).eq("hello world");
  });
});
