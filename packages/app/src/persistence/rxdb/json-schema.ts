import { RxJsonSchema } from "rxdb";

import collectionCreators from "./collections";

export const jsonSchemas: Record<
  string,
  RxJsonSchema<any>
> = Object.fromEntries(
  Object.entries(collectionCreators).map(([name, collection]) => [
    name,
    collection.schema,
  ])
);
