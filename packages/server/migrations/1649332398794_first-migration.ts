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

  const idType = {
    type: "uuid",
    notNull: true,
    primaryKey: true,
    default: new PgLiteral("uuid_generate_v4()"),
  };

  const tsType = {
    type: "timestamp",
    notNull: true,
    default: pgm.func("current_timestamp"),
  };

  pgm.createTable("accounts", {
    id: idType,
    name: { type: "varchar(100)" },
    createdAt: tsType,
    updatedAt: tsType,
  });

  pgm.createTrigger("accounts", "accounts_notify", {
    when: "AFTER",
    operation: ["INSERT", "UPDATE", "DELETE"],
    function: "notify_trigger",
    level: "ROW",
  });
}
