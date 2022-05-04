import { Document } from "./document";
import { DocumentMeta } from "./documentMeta";

/**DocumentInfo defines aggregate for Document and DocumentMeta and a few extra
 * fields derived from events
 */
export interface DocumentInfo extends Document, DocumentMeta {
  /**createdBy defines account that document was created by */
  createdBy: string;

  /**createdAt defines document creation time */
  createdAt: Date;

  /**updatedAt defines document last update time */
  updatedAt: Date;

  /**deletedAt defines document deletion time (if deleted) */
  deletedAt?: Date;

  /**archivedAt defines document archival time (if archived) */
  archivedAt?: Date;
}
