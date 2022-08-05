import { Observable, Subject, map, catchError, of, merge } from "rxjs";
import deepEqual from "fast-deep-equal";

import type {
  EventBulk,
  JsonSchema,
  RxDocumentData,
  RxJsonSchema,
  RxStorage,
  RxStorageInstance,
  WithDeleted,
  RxStorageInstanceReplicationState,
  RxStorageReplicationMeta,
  RxCollection,
} from "rxdb";
import type {
  RxReplicationHandler,
  RxReplicationWriteToMasterRow,
} from "rxdb/dist/types/types";
import {
  randomCouchString,
  replicateRxStorageInstance,
  defaultConflictHandler,
  RX_REPLICATION_META_INSTANCE_SCHEMA,
} from "rxdb";

import * as gql from "gql-query-builder";
import type Fields from "gql-query-builder/build/Fields";
import type { GraphQLWebSocketClient } from "graphql-request";

import {
  getMutaionOperationNameForSchema,
  getQueryOperationNameForSchema,
  getSubscribeOperationNameForSchema,
} from "./graphql-schema";

const getRecursiveSchemaFields = (schema: JsonSchema): Fields =>
  Object.entries(schema.properties || {})
    .filter(([name]) => !["_attachments", "_meta", "_rev"].includes(name))
    .map(([name, prop]) =>
      prop.type === "object" && prop.properties
        ? { [name]: getRecursiveSchemaFields(prop) }
        : prop.type === "array" && prop.items && !Array.isArray(prop.items)
        ? { [name]: getRecursiveSchemaFields(prop.items) }
        : name
    );

type BulkUpdate<T> = {
  id: string;
  lwt: number;
  updated: WithDeleted<T>[];
};

type UpdateResult<T> = {
  updated: WithDeleted<T>[];
  rejected: WithDeleted<T>[];
};

export class RxGraphQLReplicationHandler<RxDocType>
  implements RxReplicationHandler<RxDocType, number>
{
  private updateSubject = new Subject<BulkUpdate<RxDocType>>();

  public masterChangeStream$: Observable<
    "RESYNC" | EventBulk<WithDeleted<RxDocType>, number>
  > = this.updateSubject.pipe(
    map(
      ({ id, updated, lwt }): EventBulk<WithDeleted<RxDocType>, number> => ({
        id,
        events: updated,
        checkpoint: lwt,
        context: "",
      })
    ),
    catchError((_err, caught) => {
      // upon error re-subscribe and force a resync
      // this.unsubscribe?.();
      // this.unsubscribe = this.subscribeChanges();

      // retry source observable again
      return merge(of("RESYNC" as const), caught);
    })
  );

  private unsubscribe: ReturnType<GraphQLWebSocketClient["subscribe"]>;
  private schemaFields: Fields;

  constructor(
    private client: GraphQLWebSocketClient,
    private collectionName: string,
    private schema: RxJsonSchema<RxDocumentData<RxDocType>>
  ) {
    this.schemaFields = getRecursiveSchemaFields(this.schema as JsonSchema);

    this.unsubscribe = this.subscribeChanges();
  }

  private getSubscriptionOp = () =>
    gql.subscription({
      operation: getSubscribeOperationNameForSchema(this.schema),
      fields: this.schemaFields,
      variables: {},
    });

  private getQueryOp = (since: number, limit: number) =>
    gql.query({
      operation: getQueryOperationNameForSchema(this.schema),
      variables: { since, limit },
      fields: this.schemaFields,
    });

  private getMutationOp = (docs: RxDocType[]) =>
    gql.mutation({
      operation: getMutaionOperationNameForSchema(this.schema),
      variables: {
        input: {
          type: this.schema.title! + "Input",
          required: true,
          list: true,
          value: docs,
        },
      },
      fields: [
        {
          updated: this.schemaFields,
        },
        {
          rejected: this.schemaFields,
        },
      ],
    });

  private subscribeChanges() {
    const { query } = this.getSubscriptionOp();

    return this.client.subscribe(query, this.updateSubject);
  }

  async masterChangesSince(
    checkpoint: number,
    bulkSize: number
  ): Promise<{
    checkpoint: number;
    documentsData: WithDeleted<RxDocType>[];
  }> {
    const { query, variables } = this.getQueryOp(checkpoint, bulkSize);

    const { updated, lwt } = await this.client.request<BulkUpdate<RxDocType>>(
      query,
      variables
    );

    return {
      checkpoint: lwt,
      documentsData: updated,
    };
  }

  async masterWrite(
    rows: RxReplicationWriteToMasterRow<RxDocType>[]
  ): Promise<WithDeleted<RxDocType>[]> {
    console.log("writing rows to master", this.collectionName, rows);

    const docs = rows.map((row) => row.newDocumentState);

    const { query, variables } = this.getMutationOp(docs);

    console.log(query, variables);

    const { updated, rejected } = await this.client.request<
      UpdateResult<RxDocType>
    >(query, variables);

    console.log("writing rows success", this.collectionName);

    const changed = rows
      .map((row) => row.newDocumentState)
      .filter((doc) => !updated.find((u) => deepEqual(doc, u)));

    return rejected.concat(changed);
  }
}

export interface RxStorageInstanceWithReplication<
  RxDocType,
  Internals,
  InstanceCreationOptions,
  CheckpointType = any
> extends RxStorageInstance<
    RxDocType,
    Internals,
    InstanceCreationOptions,
    CheckpointType
  > {
  replicationState?: RxStorageInstanceReplicationState<RxDocType>;
  metaInstance?: RxStorageInstance<
    RxStorageReplicationMeta,
    Internals,
    InstanceCreationOptions,
    any
  >;
}

export async function replicateRxCollection<
  RxDocType,
  OrmMethods,
  StaticMethods,
  RxStorageInternals,
  RxStorageSettings
>(
  collection: RxCollection<RxDocType, OrmMethods, StaticMethods>,
  client: GraphQLWebSocketClient,
  metaStorage: RxStorage<RxStorageInternals, RxStorageSettings>
): Promise<RxStorageInstanceReplicationState<RxDocType>> {
  const forkInstance = collection.storageInstance;

  const metaInstance = await metaStorage.createStorageInstance({
    databaseInstanceToken: randomCouchString(10),
    databaseName: forkInstance.databaseName + "-meta",
    collectionName: forkInstance.collectionName,
    schema: RX_REPLICATION_META_INSTANCE_SCHEMA,
    options: {} as any,
    multiInstance: true,
  });

  return replicateRxStorageInstance<RxDocType>({
    identifier: randomCouchString(10),
    bulkSize: 100,
    forkInstance,
    metaInstance,
    replicationHandler: new RxGraphQLReplicationHandler<RxDocType>(
      client,
      forkInstance.collectionName,
      forkInstance.schema
    ),
    conflictHandler: defaultConflictHandler,
  });
}
