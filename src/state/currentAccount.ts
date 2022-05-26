import { selector, atom } from "recoil";
import { debug as _debug } from "debug";

import { AccountInfo } from "~/types";

import { currentAccountId, db } from "./persistence";
import { rxDocumentEffect } from "./effects";

const debug = _debug("state:account");

const generateNewAccount = selector<AccountInfo>({
  key: "generateNewAccount",
  get: async () => {
    const accountInfo: AccountInfo = {
      id: currentAccountId,
      documents: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    debug("generating new account", accountInfo);

    // persist intial account
    await db.collections.account_info.newDocument(accountInfo).save();

    return accountInfo;
  },
});

/**Atom for current user account */
export const currentAccount = atom<AccountInfo>({
  key: "currentAccount",
  default: generateNewAccount,
  effects: [rxDocumentEffect(db.collections.account_info, currentAccountId)],
});
