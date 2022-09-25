import "reflect-metadata";

import { DataSource } from "typeorm";
import {
  AccountEntity,
  DocumentEntity,
  DocumentHighlightEntity,
  DocumentMemberEntity,
  BlobInfoEntity,
} from "./entities";
import { DocumentMembersValidatorSubscriber } from "./subscribers";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "postgrespassword",
  database: "postgres",
  synchronize: true,
  logging: true,
  entities: [
    AccountEntity,
    DocumentEntity,
    DocumentHighlightEntity,
    DocumentMemberEntity,
    BlobInfoEntity,
  ],
  migrations: [],
  subscribers: [DocumentMembersValidatorSubscriber],
  logger: "advanced-console",
});
