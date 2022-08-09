import { Observable, Subject, map, catchError, of, merge } from "rxjs";
import deepEqual from "fast-deep-equal";

import type {
  EventBulk,
  JsonSchema,
  RxDocumentData,
  RxJsonSchema,
  RxStorage,
  WithDeleted,
  RxStorageInstanceReplicationState,
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

type CheckpointType = number;

type UpdateResult<T> = {
  updated: T[];
  rejected: T[];
};

export interface RxGraphQLReplicationOptions<RxDocType> {
  updatedField: keyof RxDocType;
  deletedField?: keyof RxDocType;
  localField?: keyof RxDocType;
}

export class RxGraphQLReplicationHandler<RxDocType>
  implements RxReplicationHandler<RxDocType, CheckpointType>
{
  private updateSubject = new Subject<RxDocType[]>();

  public masterChangeStream$: Observable<
    "RESYNC" | EventBulk<WithDeleted<RxDocType>, CheckpointType>
  > = this.updateSubject.pipe(
    map(
      (updated): EventBulk<WithDeleted<RxDocType>, CheckpointType> => ({
        id: randomCouchString(10),
        events: this.mapEvents(updated),
        checkpoint: this.getCheckpoint(updated),
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
    private schema: RxJsonSchema<RxDocumentData<RxDocType>>,
    private options: RxGraphQLReplicationOptions<RxDocType>
  ) {
    this.schemaFields = getRecursiveSchemaFields(this.schema as JsonSchema);

    this.unsubscribe = this.subscribeChanges();
  }

  private getCheckpoint(events: RxDocType[]) {
    return Math.max(
      ...events.map((event) =>
        event[this.options.updatedField]
          ? new Date(event[this.options.updatedField] as any).getTime()
          : 0
      )
    );
  }

  private mapEvents(events: RxDocType[]) {
    return events.map(
      (event): WithDeleted<RxDocType> => ({
        ...event,
        _deleted: this.options.deletedField
          ? !!event[this.options.deletedField]
          : false,
      })
    );
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

    const updated = await this.client.request<RxDocType[]>(query, variables);

    return {
      checkpoint: this.getCheckpoint(updated),
      documentsData: this.mapEvents(updated),
    };
  }

  async masterWrite(
    rows: RxReplicationWriteToMasterRow<RxDocType>[]
  ): Promise<WithDeleted<RxDocType>[]> {
    console.log("writing rows to master", this.collectionName, rows);

    const docs = rows.map((row) => row.newDocumentState);

    // only write docs that don't have local set to true
    let docsToWrite = docs;
    if (this.options.localField) {
      const localField = this.options.localField;
      docsToWrite = docs.filter((doc) => !!!doc[localField]);
    }

    const { query, variables } = this.getMutationOp(docsToWrite);

    console.log(query, variables);

    const { updated, rejected } = await this.client.request<
      UpdateResult<RxDocType>
    >(query, variables);

    console.log("writing rows success", this.collectionName);

    const changed = rows
      .map((row) => row.newDocumentState)
      .filter(
        ({ _deleted, ...doc }) => !updated.find((u) => deepEqual(doc, u))
      );

    return this.mapEvents(rejected.concat(changed));
  }
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
  metaStorage: RxStorage<RxStorageInternals, RxStorageSettings>,
  options: RxGraphQLReplicationOptions<RxDocType>
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
      forkInstance.schema,
      options
    ),
    conflictHandler: defaultConflictHandler,
  });
}
