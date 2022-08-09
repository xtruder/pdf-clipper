import { Subject } from "rxjs";
import deepEqual from "fast-deep-equal";
import createDebugLogger from "debug";

import type { JsonSchema, WithDeleted, RxCollection } from "rxdb";
import {
  replicateRxCollection,
  RxReplicationState,
} from "rxdb/plugins/replication";
import type {
  RxReplicationWriteToMasterRow,
  ReplicationPullHandlerResult,
  RxReplicationPullStreamItem,
} from "rxdb/dist/types/types";

import * as gql from "gql-query-builder";
import type Fields from "gql-query-builder/build/Fields";

import {
  getMutaionOperationNameForSchema,
  getQueryOperationNameForSchema,
  getSubscribeOperationNameForSchema,
} from "./graphql-schema";
import { Client, ExecutionResult, RequestParams } from "graphql-sse";

const getRecursiveSchemaFields = (schema: JsonSchema): Fields =>
  Object.entries(schema.properties || {})
    .filter(
      ([name]) => !["_attachments", "_meta", "_rev", "_deleted"].includes(name)
    )
    .map(([name, prop]) =>
      prop.type === "object" && prop.properties
        ? { [name]: getRecursiveSchemaFields(prop) }
        : prop.type === "array" && prop.items && !Array.isArray(prop.items)
        ? { [name]: getRecursiveSchemaFields(prop.items) }
        : name
    );

type CheckpointType = string;

type UpdateResult<T> = {
  updated: T[];
  rejected: T[];
};

export interface GraphqlReplicationOptions<RxDocType> {
  replicationIdentifier: string;
  collection: RxCollection<RxDocType, any>;
  updatedField: keyof RxDocType;
  deletedField?: keyof RxDocType;
  localField?: keyof RxDocType;
  client: Client;
  pullBatchSize?: number;
  pushBatchSize?: number;
  subscribe?: boolean;
  enablePush?: boolean;
}

export function replicateGraphql<RxDocType>({
  replicationIdentifier,
  collection,
  client,
  updatedField,
  deletedField,
  localField,
  pullBatchSize,
  pushBatchSize,
  subscribe = true,
  enablePush = true,
}: GraphqlReplicationOptions<RxDocType>): RxReplicationState<
  RxDocType,
  CheckpointType
> {
  const schema = collection.schema.jsonSchema;
  const fields = getRecursiveSchemaFields(schema as JsonSchema);
  const log = createDebugLogger(`graphql-replication:${collection.name}`);

  const executeQuery = async <T>(payload: RequestParams) =>
    new Promise<ExecutionResult<T, unknown>>((resolve, reject) => {
      let result: ExecutionResult<T, unknown>;
      client.subscribe<T>(payload, {
        next: (data) => (result = data),
        error: reject,
        complete: () => resolve(result),
      });
    });

  const getCheckpoint = (events: RxDocType[]) =>
    new Date(
      Math.max(
        ...events.map((event) =>
          event[updatedField]
            ? new Date(event[updatedField] as any).getTime()
            : 0
        )
      )
    ).toISOString();

  const mapEvents = (events: RxDocType[]) =>
    events.map(
      (event): WithDeleted<RxDocType> => ({
        ...event,
        _deleted: deletedField ? !!event[deletedField] : false,
      })
    );

  const stream$ = new Subject<
    RxReplicationPullStreamItem<RxDocType, CheckpointType>
  >();

  if (subscribe) {
    const payload = gql.subscription({
      operation: getSubscribeOperationNameForSchema(schema),
      fields,
      variables: {},
    });

    log("subscribing to changes: %s", payload.query);

    client.subscribe<RxDocType[]>(payload, {
      next: ({ data }) =>
        data &&
        stream$.next({
          documents: mapEvents(data),
          checkpoint: getCheckpoint(data),
        }),
      error: () => {
        log("subscription error, resyncing");
        stream$.next("RESYNC");
      },
      complete: () => stream$.complete(),
    });
  }

  return replicateRxCollection({
    replicationIdentifier,
    collection,
    waitForLeadership: true,
    autoStart: true,
    live: subscribe,
    retryTime: 10000,
    pull: {
      async handler(
        lastPulledCheckpoint: CheckpointType,
        batchSize: number
      ): Promise<ReplicationPullHandlerResult<RxDocType>> {
        const payload = gql.query({
          operation: getQueryOperationNameForSchema(schema),
          variables: { since: lastPulledCheckpoint, limit: batchSize },
          fields,
        });

        log(
          "pulling changes (since: %d): %s",
          lastPulledCheckpoint,
          payload.query
        );

        const { data: updated } = await executeQuery<RxDocType[]>(payload);

        if (!updated) throw new Error("error getting last updates");

        const checkpoint = getCheckpoint(updated);
        const documents = mapEvents(updated);

        if (documents.length) {
          log("new updated docs with checkpoint %s:", checkpoint, documents);
        }

        return {
          checkpoint,
          documents,
        };
      },
      batchSize: pullBatchSize,
      stream$,
    },
    push: enablePush
      ? {
          async handler(
            rows: RxReplicationWriteToMasterRow<RxDocType>[]
          ): Promise<WithDeleted<RxDocType>[]> {
            const docs = rows.map((row) => row.newDocumentState);

            // only write docs that don't have local set to true
            let docsToWrite = docs

              // if localField is defined filter docs that have local set to true
              .filter((doc) => (localField ? !!!doc[localField] : true))

              // remove _deleted from doc
              .map(({ _deleted, ...doc }) => doc);

            const payload = gql.mutation({
              operation: getMutaionOperationNameForSchema(schema),
              variables: {
                input: {
                  type: schema.title! + "Input",
                  required: true,
                  list: true,
                  value: docsToWrite,
                },
              },
              fields: [
                {
                  updated: fields,
                },
                {
                  rejected: fields,
                },
              ],
            });

            log(
              "push docs to server: %s",
              payload.query,
              payload.variables.input
            );

            const { data } = await executeQuery<UpdateResult<RxDocType>>(
              payload
            );
            if (!data) throw new Error("missing result data");

            const { updated, rejected } = data;

            log("writing rows success", data);

            const changed = rows
              .map((row) => row.newDocumentState)
              .filter(
                ({ _deleted, ...doc }) =>
                  !updated.find((u) => deepEqual(doc, u))
              );

            return mapEvents(rejected.concat(changed));
          },
          batchSize: pushBatchSize,
        }
      : undefined,
  });
}
