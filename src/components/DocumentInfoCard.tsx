import React, { useRef, useState } from "react";
import ContentEditable from "react-contenteditable";

import { DocumentInfo } from "~/models";

import { ReactComponent as BookOpenIcon } from "~/assets/icons/book-open-outline.svg";
import { ReactComponent as PencilAltIcon } from "~/assets/icons/pencil-alt-outline.svg";
import { stripHtml } from "~/lib/dom";

export interface DocumentInfoCardProps {
  document: DocumentInfo;
}

export const DocumentInfoCard: React.FC<DocumentInfoCardProps> = ({
  document,
}) => {
  const [isEditingDescription, setEditDescription] = useState(false);
  const description = useRef(document.description || "");

  return (
    <div className="card card-side card-bordered border-black shadow-lg card-compact md:card-normal">
      <figure className="flex-[0.2] min-w-20 sm:min-w-35 md:min-w-30 pl-2 sm:pl-0 self-center">
        {document.cover ? (
          <img src={document.cover} style={{ width: "100%" }} />
        ) : (
          <BookOpenIcon className="w-full h-full" />
        )}
      </figure>
      <div className="flex flex-[2] card-body">
        <h2 className="card-title">{document.title}</h2>
        <span className="flex-1">
          <PencilAltIcon
            className="w-4 h-4 float-right cursor-pointer"
            onClick={() => setEditDescription(!isEditingDescription)}
          />

          {isEditingDescription ? (
            <ContentEditable
              html={description.current}
              onChange={(e) => {
                description.current = stripHtml(e.target.value);
              }}
              onBlur={() => setEditDescription(false)}
            />
          ) : (
            <a className="line-clamp-4 sm:line-clamp-3 md:line-clamp-2">
              {description.current}
            </a>
          )}
        </span>
        <div className="flex flex-row items-center">
          <progress className="progress w-1/4 mr-2" value="30" max="100" />
          <div className="badge">30/100</div>
          <div className="flex-1"></div>
          <div>hello</div>
        </div>
      </div>
    </div>
  );
};
