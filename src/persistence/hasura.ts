import { currentAccountId } from "~/state";
import { DocumentInfo } from "~/types";

import { DatabaseCollections } from "./rxdb";

const GET_ACCOUNT_DOCUMENTS = `query getAccountDocuments(
  $updatedAt: timestamptz!,
  $accountId: uuid!
) {
  documents(
    where: {
      _and: {
        updatedAt: {_gt: $updatedAt},
        members: {
          acceptedAt: {_is_null: false},
          accountId: {_eq: $accountId}
        }
      }
    }
  ) {
    id
    fileHash
    meta
    type
    members {
      accountId
      role
      createdAt
      acceptedAt
    }
    createdBy
    createdAt
    updatedAt
  }
}`;

const UPSERT_ACCOUNT_DOCUMENT = `mutation upsertAccountDocument(
  $id: uuid!,
  $deleted: Boolean,
  $createdBy: uuid,
  $updatedAt: timestamptz!,
  $fileHash: String,
  $members: [accountDocuments_insert_input!] = [],
  $type: document_type_enum,
  $meta: jsonb,
) {
  # delete existing document members, so we can replace them in out upsert
  deleteAccountDocuments(where:{documentId:{_eq:$id}}) {
    affected_rows
  }

  # upsert document
  insertDocument(
    object: {
      id:$id,
      deleted: $deleted,
      fileHash: $fileHash,
      createdBy: $createdBy,
      members: {
        data: $members,
        on_conflict: {
          constraint: accounts_documents_account_id_document_id_key,
          update_columns: [role, acceptedAt]
        }
      },
      type: $type,
      meta: $meta
    },

    # update document if already exists,
    # but only if last update time is before our update time
    on_conflict: {
      constraint: documents_pkey,
      update_columns: [type, meta, fileHash, deleted],
      where: {updatedAt: {_lt: $updatedAt}}
    }
  ) {
    id
  }
}`;

export function setupReplication(db: DatabaseCollections) {
  debugger;
  const replicationState = db.document_info.syncGraphQL({
    url: "http://localhost:8080/v1/graphql",
    headers: {
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3NmZjNmNjMC1lZDk3LTQ2NGEtODljMS0xMWE3MjJjMzZiM2YiLCJuYW1lIjoiSm9obiBEb2UiLCJhZG1pbiI6ZmFsc2UsImlhdCI6MTY1MTY1NDIxNiwiaHR0cHM6Ly9oYXN1cmEuaW8vand0L2NsYWltcyI6eyJ4LWhhc3VyYS1hbGxvd2VkLXJvbGVzIjpbImFkbWluIiwidXNlciIsImFub255bW91cyJdLCJ4LWhhc3VyYS1kZWZhdWx0LXJvbGUiOiJhZG1pbiIsIngtaGFzdXJhLXVzZXItaWQiOiI3NmZjNmNjMC1lZDk3LTQ2NGEtODljMS0xMWE3MjJjMzZiM2YiLCJ4LWhhc3VyYS1jdXN0b20iOiJjdXN0b20tdmFsdWUifX0.vQ07RAk9AShH8qsJZERellqksxJ6_gb4eboENYY6OsY`,
    },
    pull: {
      queryBuilder: (doc) => ({
        query: GET_ACCOUNT_DOCUMENTS,
        variables: {
          updatedAt: doc?.updatedAt || new Date(0).toUTCString(),
          accountId: currentAccountId,
        },
      }),
    },
    push: {
      batchSize: 1,
      queryBuilder: (doc: DocumentInfo) => {
        console.log("pushing changes");
        return {
          query: UPSERT_ACCOUNT_DOCUMENT,
          variables: {
            id: doc.id,
            deleted: !!doc.deletedAt,
            createdBy: currentAccountId,
            updatedAt: doc.updatedAt,
            //fileHash: doc.fileHash,
            members: doc.members,
            type: doc.type,
            meta: doc.meta,
          },
        };
      },
    },
    live: true,
    liveInterval: 1000 * 10,

    deletedFlag: "deleted",
  });

  replicationState.error$.subscribe((err) => {
    console.error("replication error:");
    console.dir(err);
  });
}
