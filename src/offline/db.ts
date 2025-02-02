import Dexie, { Table } from "dexie";
import { v4 as uuid } from "uuid";

export class Database extends Dexie {
  accounts!: Table;
  documents!: Table;
  documentMembers!: Table;
  documentHighlights!: Table;
  blobs!: Table;

  get allTables() {
    return [
      this.accounts,
      this.documents,
      this.documentMembers,
      this.documentHighlights,
      this.blobs,
    ];
  }

  constructor() {
    super("db");

    this.version(1).stores({
      accounts: "id,name",
      documents: "id",
      documentMembers: "id,document.id,account.id",
      documentHighlights: "id,document.id",
      blobs: "hash",
    });

    // set createdAt and updatedAt on create and update
    this.allTables.forEach((table) => {
      table.hook("creating", (_primKey, obj, _trans) => {
        obj.createdAt = new Date();
        obj.updatedAt = new Date();
      });

      table.hook("updating", (_mods, _primKey, _obj, _trans) => {
        return { updatedAt: new Date() };
      });
    });

    // set default id on creation
    [
      this.accounts,
      this.documents,
      this.documentMembers,
      this.documentHighlights,
    ].forEach((table) => {
      table.hook("creating", (_primKey, obj, _trans) => {
        if (!obj.id) obj.id = uuid();
      });
    });
  }

  async clear() {
    await Promise.all(this.allTables.map((tbl) => tbl.clear()));
  }
}
