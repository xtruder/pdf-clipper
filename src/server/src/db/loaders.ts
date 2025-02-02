import DataLoader from "dataloader";
import { In, BaseEntity, EntityNotFoundError } from "typeorm";

import {
  AccountEntity,
  DocumentEntity,
  BlobInfoEntity,
  DocumentMemberEntity,
  DocumentHighlightEntity,
} from "./entities";
import { getLogger } from "../logging";

export class TypeormDataLoader<K = any, T extends BaseEntity = any> {
  private loader = new DataLoader<K, T | null>(async (keys) => {
    this.logger.debug(
      "loading %s keys %s",
      this.entityCls.getRepository().metadata.name,
      keys.join()
    );
    const results = await this.queryFn(keys as K[]);

    return keys.map((key) => this.findFn(results, key));
  });
  private logger = getLogger("typeorm-data-loader");

  constructor(
    private entityCls: { new (): T } & typeof BaseEntity,
    private queryFn: (keys: K[]) => Promise<T[]>,
    private findFn: (results: T[], key: K) => T | null = (results, key) =>
      results.find((entity) => this.entityCls.getId(entity) === key) ?? null
  ) {}

  async load(key?: K): Promise<T | null> {
    if (!key) return null;

    return this.loader.load(key);
  }

  async mustLoad(key: K): Promise<T> {
    const result = await this.loader.load(key);

    if (!result) throw new EntityNotFoundError(this.entityCls, key);

    return result;
  }

  clearAll(): void {
    this.loader.clearAll();
  }
}

export class TypeormArrayDataLoader<K = any, T extends BaseEntity = any> {
  private loader = new DataLoader<K, T[]>(
    async (keys) => {
      const results = await this.queryFn(keys as K[]);

      return keys.map((key) => this.filterFn(results, key));
    }
    // {
    //   cache: false,
    // }
  );

  constructor(
    private queryFn: (keys: K[]) => Promise<T[]>,
    private filterFn: (results: T[], key: K) => T[]
  ) {}

  load(key: K): Promise<T[]> {
    return this.loader.load(key);
  }

  clearAll(): void {
    this.loader.clearAll();
  }
}

export const createLoaders = () => ({
  accountLoader: new TypeormDataLoader(AccountEntity, (ids: string[]) =>
    AccountEntity.findBy({ id: In(ids) })
  ),
  documentLoader: new TypeormDataLoader(DocumentEntity, (ids: string[]) =>
    DocumentEntity.find({
      where: { id: In(ids) },
      loadRelationIds: {
        relations: ["cover", "file", "createdBy"],
        disableMixedMap: true,
      },
    })
  ),
  blobInfoLoader: new TypeormDataLoader(BlobInfoEntity, (hashes: string[]) =>
    BlobInfoEntity.find({
      where: { hash: In(hashes) },
      loadRelationIds: {
        relations: ["createdBy"],
        disableMixedMap: true,
      },
    })
  ),
  documentMembersByDocIdLoader: new TypeormArrayDataLoader(
    (ids: string[]) =>
      DocumentMemberEntity.find({
        where: { documentId: In(ids) },
        loadRelationIds: {
          relations: ["account", "document", "createdBy"],
          disableMixedMap: true,
        },
      }),
    (results, docId) => results.filter((m) => m.documentId === docId)
  ),
  documentMembersByAccIdLoader: new TypeormArrayDataLoader(
    (accIds: string[]) =>
      DocumentMemberEntity.find({
        where: { accountId: In(accIds) },
        loadRelationIds: {
          relations: ["account", "document", "createdBy"],
          disableMixedMap: true,
        },
      }),
    (results, accId) => results.filter((m) => m.accountId === accId)
  ),
  documentHighlightsByDocIdLoader: new TypeormArrayDataLoader(
    (docIds: string[]) =>
      DocumentHighlightEntity.find({
        where: { documentId: In(docIds) },
        loadRelationIds: {
          relations: ["createdBy", "document", "image"],
          disableMixedMap: true,
        },
      }),
    (results, docId) => results.filter((h) => h.documentId === docId)
  ),
});

export type Loaders = ReturnType<typeof createLoaders>;
