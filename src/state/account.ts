import {
  selector,
  atom,
  waitForAll,
  DefaultValue,
  atomFamily,
  selectorFamily,
} from "recoil";
import { v4 as uuidv4 } from "uuid";
import { debug as _debug } from "debug";

import { Account, AccountDocumentMembership, AccountInfo } from "~/types";

import { resourceEffect } from "./effects";
import { persistence } from "./persistence";
import { document } from "./document";

const debug = _debug("state:account");

/**Atom for current account if it is avalible */
export const currentAccount = atom<Account | undefined>({
  key: "currentAccount",
  effects: [
    resourceEffect(
      persistence.accountInfo(localStorage.getItem("currentAccount") || "")
    ),
  ],
});

export const account = atomFamily<Account | undefined, string>({
  key: "account",
});

export const accountInfo = atomFamily<AccountInfo | undefined, string>({
  key: "accountInfo",
});
