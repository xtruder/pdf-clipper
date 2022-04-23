/* eslint-disable @typescript-eslint/naming-convention */
import {
  MigrationBuilder,
  ColumnDefinitions,
  PgLiteral,
} from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createExtension("uuid-ossp", { ifNotExists: true });

  pgm.createFunction(
    "notify_trigger",
    [],
    {
      language: "plpgsql",
      replace: true,
      returns: "trigger",
      behavior: "VOLATILE",
    },
    `
DECLARE
  rec RECORD;
  payload TEXT;
BEGIN

  -- Set record row depending on operation
  CASE TG_OP
  WHEN 'UPDATE' THEN
     rec := NEW;
  WHEN 'INSERT' THEN
     rec := NEW;
  WHEN 'DELETE' THEN
     rec := OLD;
  ELSE
     RAISE EXCEPTION 'Unknown TG_OP: "%". Should not occur!', TG_OP;
  END CASE;

  -- Build the payload
  payload := json_build_object(
    'timestamp', CURRENT_TIMESTAMP,
    'action', LOWER(TG_OP),
    'table', TG_TABLE_NAME,
    'record', row_to_json(rec),
    'old', row_to_json(OLD));

  -- Notify the channel
  PERFORM pg_notify('db_events', payload);

  RETURN rec;
END;
  `
  );
  const tsType = {
    type: "timestamp",
    notNull: true,
    default: pgm.func("current_timestamp"),
  };

  const baseColumns = {
    id: {
      type: "uuid",
      notNull: true,
      primaryKey: true,
      default: new PgLiteral("uuid_generate_v4()"),
    },
    createdAt: tsType,
    updatedAt: tsType,
  };

  pgm.createTable("accountInfo", {
    ...baseColumns,
    name: { type: "varchar(100)" },
  });

  pgm.createTrigger("accountInfo", "accountInfo_notify", {
    when: "AFTER",
    operation: ["INSERT", "UPDATE", "DELETE"],
    function: "notify_trigger",
    level: "ROW",
  });

  pgm.createTrigger(
    "accountInfo",
    "accountInfo_before_updates",
    {
      when: "BEFORE",
      operation: ["INSERT", "UPDATE"],
      level: "ROW",
      language: "plpgsql",
    },
    `
BEGIN

END
  `
  );

  pgm.createTable("fileInfo", {
    ...baseColumns,
    mimeType: {
      type: "varchar(50)",
    },
    sources: {
      type: "jsonb",
    },
  });

  pgm.createTrigger("fileInfo", "fileInfo_notify", {
    when: "AFTER",
    operation: ["INSERT", "UPDATE", "DELETE"],
    function: "notify_trigger",
    level: "ROW",
  });

  pgm.createTable("documentInfo", {
    ...baseColumns,
    fileId: { type: "uuid", references: '"fileInfo"' },
    type: { type: "varchar(20)", notNull: true },
    title: { type: "text" },
    author: { type: "text" },
    description: { type: "text" },
    cover: { type: "text" },
    pageCount: { type: "integer" },
    outline: { type: "jsonb" },
    creator: { type: "uuid", references: '"accountInfo"', notNull: true },
  });

  pgm.createTrigger("documentInfo", "documentInfo_notify", {
    when: "AFTER",
    operation: ["INSERT", "UPDATE", "DELETE"],
    function: "notify_trigger",
    level: "ROW",
  });

  pgm.createTable("accountDocuments", {
    id: "id",
    accountId: { type: "uuid", references: '"accountInfo"', notNull: true },
    documentId: { type: "uuid", references: '"documentInfo"', notNull: true },
    role: { type: "string", notNull: true, default: "user" },
  });

  pgm.createTrigger("accountDocuments", "accountDocuments_notify", {
    when: "AFTER",
    operation: ["INSERT", "UPDATE", "DELETE"],
    function: "notify_trigger",
    level: "ROW",
  });

  pgm.createTable("documentHighlight", {
    ...baseColumns,
    docId: {
      type: "uuid",
      references: '"documentInfo"',
    },
    location: {
      type: "jsonb",
    },
    content: {
      type: "jsonb",
    },
    author: {
      type: "uuid",
      references: '"accountInfo"',
      notNull: true,
    },
  });

  pgm.createTrigger("documentHighlight", "documentHighlight_notify", {
    when: "AFTER",
    operation: ["INSERT", "UPDATE", "DELETE"],
    function: "notify_trigger",
    level: "ROW",
  });

  pgm.createTable("documentReadingInfo", {
    accountId: {
      type: "uuid",
      references: '"accountInfo"',
      notNull: true,
    },
    docId: {
      type: "uuid",
      references: '"documentInfo"',
      notNull: true,
    },
    lastPage: {
      type: "integer",
    },
    screenshot: {
      type: "string",
    },
    location: {
      type: "jsonb",
    },
    createdAt: tsType,
    updatedAt: tsType,
  });

  pgm.createTrigger("documentReadingInfo", "documentReadingInfo_notify", {
    when: "AFTER",
    operation: ["INSERT", "UPDATE", "DELETE"],
    function: "notify_trigger",
    level: "ROW",
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable("documentReadingInfo");
  pgm.dropTable("documentHighlight");
  pgm.dropTable("documentInfo");
  pgm.dropTable("fileInfo");
  pgm.dropTable("accountInfo");
  pgm.dropFunction("notify_trigger", []);
}
