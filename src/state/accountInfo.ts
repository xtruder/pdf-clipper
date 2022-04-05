import { selector, atom, waitForAll, DefaultValue } from "recoil";
import { v4 as uuidv4 } from "uuid";
import { debug as _debug } from "debug";

import { AccountInfo, DocumentInfo } from "~/types";

import { resourceEffect } from "./effects";
import { persistence } from "./persistence";
import { documentInfo } from "./documentInfo";

const debug = _debug("state:account");

const generateNewAccount = selector<AccountInfo>({
  key: "generateNewAccount",
  get: async () => {
    const accountInfo = { id: uuidv4(), documentIds: [] };

    debug("generating new account", accountInfo);

    // persist intial account
    await persistence.accountInfo(accountInfo.id).write(accountInfo);
    localStorage.setItem("currentAccount", accountInfo.id);

    return accountInfo;
  },
});

/**Atom for current user account */
export const currentAccount = atom<AccountInfo>({
  key: "currentAccount",
  default: generateNewAccount,
  effects: [
    resourceEffect(
      persistence.accountInfo(localStorage.getItem("currentAccount") || "")
    ),
  ],
});

export const accountDocuments = selector<DocumentInfo[]>({
  key: "accountDocuments",
  get: ({ get }) => {
    const { documentIds } = get(currentAccount);

    const documentInfos = get(
      waitForAll(documentIds.map((id) => documentInfo(id)))
    );

    return documentInfos;
  },
  set: ({ set, get }, docInfos) => {
    if (docInfos instanceof DefaultValue) return;

    const curAccount = get(currentAccount);

    const newDocIds = curAccount.documentIds.filter((id) =>
      docInfos.find((d) => d.id === id)
    );

    set(currentAccount, (acc) => ({ ...acc, documentIds: newDocIds }));
  },
});
