import { RecoilState, RecoilValue } from "recoil";

import {
  Account,
  AccountInfo,
  DocumentInfo,
  DocumentMember,
  DocumentReadingInfo,
} from "~/types";

import { account, accountInfo, currentAccount } from "./account";
import { document } from "./document";
import { documentReadingInfo } from "./documentReadingInfo";

/**State defines interface for application state */
export interface State {
  /**currentAccount holds state associated with current account */
  currentAccount: RecoilValue<Account | undefined>;

  /**account holds state for accounts */
  account: (accountId: string) => RecoilState<Account | undefined>;

  /**accountInfo holds public account information */
  accountInfo: (accountId: string) => RecoilValue<AccountInfo | undefined>;

  /**document holds state for specific document */
  document: (documentId: string) => RecoilState<DocumentInfo>;

  /**documentReadingInfo holds reading info associated with account and document */
  documentReadingInfo: (
    params: [accountId: string, documentId: string]
  ) => RecoilState<DocumentReadingInfo>;
}

const state: State = {
  currentAccount,
  account,
  accountInfo,
  document,
  documentReadingInfo,
};
