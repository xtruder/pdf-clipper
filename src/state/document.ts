import { AtomEffect, atomFamily, DefaultValue } from "recoil";

import { debug as _debug } from "debug";

import { DocumentInfo } from "~/types";

import { pdfDocumentMeta } from "./pdf";
import { resourceEffect } from "./effects";
import { persistence } from "./persistence";

const debug = _debug("state:documents");

/**Document info atom keyed by documentId */
export const document = atomFamily<DocumentInfo, string>({
  key: "documentInfo",
  default: (documentId) => ({
    id: documentId,
    members: [],
    meta: {},
  }),
  effects: (documentId) => [
    resourceEffect(persistence.document(documentId)),
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
    const doc = await getPromise(node);
    if (!doc) return;

    let { title, author, pageCount, outline, cover } = doc.meta || {};

    if (pageCount || outline || cover) return;

    debug("updating doc info");

    if (!doc.fileId || !doc.type) return;

    if (doc.type === "pdf") {
      const pdfMeta = await getPromise(pdfDocumentMeta(doc.fileId));

      setSelf((val) => ({
        ...(val as DocumentInfo),
        meta: {
          title: title || pdfMeta.author,
          author: author || pdfMeta.author,
          cover: cover || pdfMeta.firstPage,
          pageCount: pageCount || pdfMeta.pageCount,
          outline: outline || pdfMeta.outline,
        },
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
