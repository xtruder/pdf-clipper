import "fake-indexeddb/auto";
import { test, beforeEach, expect } from "vitest";

import { Database } from "./db";

const db = new Database();

beforeEach(() => db.clear());

test.each([
  db.accounts,
  db.documents,
  db.documentMembers,
  db.documentHighlights,
])("should set default id for table $name", async (tbl) => {
  const id = await tbl.add({});
  const doc = await tbl.get(id);

  expect(doc.id).eq(id);
  expect(doc.id).toBeTypeOf("string");
});

test.each(db.allTables)(
  "should set createdAt and updatedAt for $name",
  async (tbl) => {
    const key = tbl.schema.primKey.keyPath! as string;
    expect(key).toBeTypeOf("string");

    const id = await tbl.add({ [key]: "123-123" });
    const doc = await tbl.get(id);
    expect(doc.createdAt).toBeInstanceOf(Date);
    expect(doc.updatedAt).toBeInstanceOf(Date);

    // emulate passed time so updatedAt gets changed
    await new Promise((res) => setTimeout(res, 1));

    await tbl.put({ ...doc });
    const updatedDoc = await tbl.get(id);

    // make sure createdAt is the same and updatedAt has increased
    expect(updatedDoc.createdAt).toEqual(doc.createdAt);
    expect(updatedDoc.updatedAt).greaterThan(doc.updatedAt);
  }
);
