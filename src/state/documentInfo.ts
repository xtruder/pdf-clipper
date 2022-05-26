import { AtomEffect, atomFamily, DefaultValue } from "recoil";

import { debug as _debug } from "debug";

import { DocumentInfo, DocumentType } from "~/types";

import { pdfDocumentMeta } from "./pdf";
import { rxDocumentEffect } from "./effects";
import { currentAccountId, db } from "./persistence";

const debug = _debug("state:documents");

/**Document info atom keyed by documentId */
export const documentInfo = atomFamily<DocumentInfo, string>({
  key: "documentInfo",
  default: (documentId) => ({
    id: documentId,
    meta: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: currentAccountId,
    members: [],
  }),
  effects: (documentId) => [
    rxDocumentEffect(db.document_info, documentId),
    getDocumentMetaEffect,
  ],
});

/**Gets info about document by extracting it from file */
const getDocumentMetaEffect: AtomEffect<DocumentInfo> = ({
  node,
  getPromise,
  onSet,
  setSelf,
  trigger,
}) => {
  const getDocumentInfo = async () => {
    const docInfo = await getPromise(node);
    if (!docInfo) return;

    const { fileHash: fileId, type } = docInfo;
    if (!fileId || !type) return;

    let { title, author, pageCount, outline, cover } = docInfo.meta || {};

    if (pageCount || outline || cover) return;

    debug("updating doc info");

    if (type === DocumentType.PDF) {
      const pdfMeta = await getPromise(pdfDocumentMeta(fileId));

      setSelf((val) => ({
        ...(val as DocumentInfo),
        meta: {
          title: title || pdfMeta.title,
          author: author || pdfMeta.author,
          pageCount: pageCount || pdfMeta.pageCount,
          outline: outline || pdfMeta.outline,
          cover: cover || pdfMeta.firstPage,
        },
      }));
    }
  };

  if (trigger === "get") {
    getDocumentInfo();
  }

  onSet((newValue, oldValue) => {
    if (oldValue instanceof DefaultValue) return;
    if (newValue?.fileHash === oldValue?.fileHash) return;
    getDocumentInfo();
  });
};
