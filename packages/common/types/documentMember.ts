import { JTDSchemaType } from "ajv/dist/jtd";

enum MembershipStatus {
  OWNER = "owner",
  COLABORATOR = "colaborator",
  READER = "reader",
}

export interface DocumentMember {
  docId: string;
  accountId: string;
  role: MembershipStatus;
  active: boolean;
}

export const documentMemberSchema: JTDSchemaType<DocumentMember> = {
  properties: {
    docId: {
      type: "string",
    },
    accountId: {
      type: "string",
    },
    role: {
      enum: [
        MembershipStatus.OWNER,
        MembershipStatus.COLABORATOR,
        MembershipStatus.READER,
      ],
    },
    active: {
      type: "boolean",
    },
  },
};
