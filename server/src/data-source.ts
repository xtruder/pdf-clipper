import "reflect-metadata";

import { DataSource } from "typeorm";
import {
  AccountEntity,
  DocumentEntity,
  DocumentHighlightEntity,
  DocumentMemberEntity,
  FileEntity,
} from "./entities";

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
    FileEntity,
  ],
  migrations: [],
  subscribers: [],
  logger: "advanced-console",
});
