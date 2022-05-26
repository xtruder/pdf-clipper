import { v4 as uuidv4 } from "uuid";

import { NativeFS } from "~/lib/nativefs";
import { initDB } from "~/persistence/rxdb";

let _currentAccountId = localStorage.getItem("currentAccountId");
if (!_currentAccountId) {
  _currentAccountId = uuidv4();
  localStorage.setItem("currentAccountId", _currentAccountId);
}

export const currentAccountId = _currentAccountId;

/**local persistent rxdb */
export const db = await initDB(currentAccountId);

// create NativeFS for local file storage
export const fs: NativeFS = await NativeFS.usePrivateDirectory();
