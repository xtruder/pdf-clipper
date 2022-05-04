import { JTDSchemaType } from "ajv/dist/jtd";

export interface OutlinePosition {
  pageNumber?: number;
  location?: any;
  top?: number;
}

export interface OutlineNode extends OutlinePosition {
  title: string;
  items: OutlineNode[];
}

export interface DocumentOutline {
  items: OutlineNode[];
}

/**Document info provides metadata about document, like author, title,
 * description, cover and such.
 */
export interface DocumentMeta {
  /**title defines title assocaited with document */
  title?: string;

  // document author
  author?: string;

  // document description
  description?: string;

  // document cover image
  cover?: string;

  // number of pages that document has
  pageCount?: number;

  // outline of the document
  outline?: DocumentOutline;
}

export const documentMetaSchema: JTDSchemaType<
  DocumentMeta,
  { outlineNode: OutlineNode }
> = {
  optionalProperties: {
    title: {
      type: "string",
    },
    author: {
      type: "string",
    },
    description: {
      type: "string",
    },
    cover: {
      type: "string",
    },
    pageCount: {
      type: "uint32",
    },
    outline: {
      properties: {
        items: {
          elements: {
            ref: "outlineNode",
          },
        },
      },
    },
  },
  definitions: {
    outlineNode: {
      properties: {
        title: {
          type: "string",
        },
        items: {
          elements: {
            ref: "outlineNode",
          },
        },
      },
      optionalProperties: {
        pageNumber: {
          type: "uint32",
        },
        location: {},
        top: {
          type: "uint32",
        },
      },
    },
  },
};
