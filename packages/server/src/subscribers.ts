import { GraphQLYogaError } from "@graphql-yoga/node";

import {
  EventSubscriber,
  EntitySubscriberInterface,
  InsertEvent,
  UpdateEvent,
  EntityManager,
  Not,
  IsNull,
} from "typeorm";
import { DocumentMemberEntity, DocumentRole } from "./entities";

@EventSubscriber()
export class DocumentMembersValidatorSubscriber
  implements EntitySubscriberInterface<DocumentMemberEntity>
{
  listenTo = () => DocumentMemberEntity;

  afterInsert = (event: InsertEvent<DocumentMemberEntity>) =>
    this.validateDocumentMembers(event.manager, event.entity.documentId);

  afterUpdate = (event: UpdateEvent<DocumentMemberEntity>) =>
    this.validateDocumentMembers(event.manager, event.entity?.documentId);

  async validateDocumentMembers(mgr: EntityManager, documentId?: string) {
    if (!documentId) return;

    const count = await mgr.count(DocumentMemberEntity, {
      where: {
        documentId,
        role: DocumentRole.Admin,
        acceptedAt: Not(IsNull()),
      },
    });

    if (count <= 0)
      throw new GraphQLYogaError(
        "documument requires at least one document admin",
        { code: "VALIDATION_ERROR" }
      );
  }
}
