import { AtomEffect, atomFamily, DefaultValue } from "recoil";

import { debug as _debug } from "debug";

import { DocumentInfo, DocumentType } from "~/types";

import { pdfDocumentMeta } from "./pdf";
import { resourceEffect } from "./effects";
import { persistence } from "./persistence";

const debug = _debug("state:documents");

/**Document info atom keyed by documentId */
export const documentInfo = atomFamily<DocumentInfo, string>({
  key: "documentInfo",
  default: (docId) => ({
    id: docId,
    highlightIds: [],
  }),
  effects: (docId) => [
    resourceEffect(persistence.documentInfo(docId)),
    getDocumentInfoEffect,
  ],
});

/**Gets info about document by extracting it from file */
const getDocumentInfoEffect: AtomEffect<DocumentInfo> = ({
  node,
  getPromise,
  onSet,
  setSelf,
  trigger,
}) => {
  const getDocumentInfo = async () => {
    const docInfo = await getPromise(node);
    if (!docInfo) return;

    let { fileId, type, title, author, pageCount, outline, cover } = docInfo;

    if (pageCount || outline || cover) return;

    debug("updating doc info");

    if (!fileId || !type) return;

    if (type === DocumentType.PDF) {
      const pdfMeta = await getPromise(pdfDocumentMeta(fileId));

      setSelf((val) => ({
        ...(val as DocumentInfo),
        title: title || pdfMeta.title,
        author: author || pdfMeta.author,
        pageCount: pageCount || pdfMeta.pageCount,
        outline: outline || pdfMeta.outline,
        cover: cover || pdfMeta.firstPage,
      }));
    }
  };

  if (trigger === "get") {
    getDocumentInfo();
  }

  onSet((newValue, oldValue) => {
    if (oldValue instanceof DefaultValue) return;
    if (newValue.fileId === oldValue.fileId) return;
    getDocumentInfo();
  });
};
