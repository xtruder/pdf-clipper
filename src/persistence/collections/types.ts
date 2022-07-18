import {
  KeyFunctionMap,
  RxCollection,
  RxCollectionCreator,
  RxJsonSchema,
} from "rxdb";
import { Database } from "../rxdb";

export interface CollectionCreator<
  T,
  M extends KeyFunctionMap | undefined = undefined
> extends RxCollectionCreator {
  name: string;
  schema: RxJsonSchema<T>;
  methods?: M;

  registerHooks?(collection: RxCollection, db: Database): void;
}
