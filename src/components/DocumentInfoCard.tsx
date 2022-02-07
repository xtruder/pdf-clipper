import React from "react";

import { DocumentInfo } from "~/models";

import { ReactComponent as BookOpenIcon } from "~/assets/icons/book-open-outline.svg";

export interface DocumentInfoCardProps {
  document: DocumentInfo;
}

export const DocumentInfoCard: React.FC<DocumentInfoCardProps> = ({
  document,
}) => {
  return (
    <div className="card card-side card-bordered border-black shadow-lg card-compact md:card-normal">
      <figure className="flex-[0.2] min-w-20 sm:min-w-40 pl-2 sm:pl-0 self-center">
        {document.cover ? (
          <img src={document.cover} style={{ width: "100%" }} />
        ) : (
          <BookOpenIcon className="w-full h-full" />
        )}
      </figure>
      <div className="flex-[2] card-body">
        <h2 className="card-title">{document.title}</h2>
        {document.description && (
          <p className="line-clamp-4">{document.description}</p>
        )}
      </div>
    </div>
  );
};
