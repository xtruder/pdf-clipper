import React, { useRef } from "react";

import { DocumentInfo } from "~/models";

import { ReactComponent as BookOpenIcon } from "~/assets/icons/book-open-outline.svg";
import { ReactComponent as TrashIcon } from "~/assets/icons/trash-outline.svg";
import { ReactComponent as ShareIcon } from "~/assets/icons/share-outline.svg";
import { ReactComponent as CloudDownloadIcon } from "~/assets/icons/cloud-download-outline.svg";
import { ReactComponent as InformationCircleIcon } from "~/assets/icons/information-circle-outline.svg";

import { EditableText } from "./EditableText";

export interface DocumentInfoCardProps {
  document: DocumentInfo;
}

export const DocumentInfoCard: React.FC<DocumentInfoCardProps> = ({
  document,
}) => {
  const description = useRef(document.description || "");

  return (
    <div className="card card-side card-bordered border-black shadow-lg card-compact md:card-normal overflow-visible">
      <figure className="flex-[0.25] min-w-20 sm:min-w-40 md:min-w-40 pl-2 sm:pl-0 self-center">
        {document.cover ? (
          <img src={document.cover} style={{ width: "100%" }} />
        ) : (
          <BookOpenIcon className="w-full h-full" />
        )}
      </figure>
      <div className="flex flex-[2] card-body">
        <h2 className="card-title">
          <EditableText
            text={document.title}
            placeholder="Write title here..."
          />
        </h2>
        <span className="flex-1">
          <EditableText
            text={description.current}
            placeholder="Write description here..."
            clampClassName="line-clamp-4 sm:line-clamp-3 md:line-clamp-2"
          />
        </span>
        <div className="flex flex-row items-center">
          <progress
            className="progress w-1/4 mr-2 hidden sm:block"
            value="30"
            max="100"
          />
          <div className="badge sm:badge-lg md:badge-lg">30/100</div>
          <div className="flex-1"></div>
          <div className="flex flex-row items-center">
            <div className="dropdown mr-1">
              <div tabIndex={0} className="btn btn-xs sm:btn-sm">
                <ShareIcon className="w-4 h-4 sm:w-6 sm:h-6" />
                <span className="hidden md:block md:ml-1">Share</span>
              </div>
              <ul
                tabIndex={0}
                className="mb-1 shadow menu dropdown-content bg-base-300 rounded-box w-20 md:w-52"
              >
                <li>
                  <a>Item 1</a>
                </li>
                <li>
                  <a>Item 2</a>
                </li>
                <li>
                  <a>Item 3</a>
                </li>
              </ul>
            </div>
            <div className="dropdown mr-1">
              <div tabIndex={0} className="btn btn-xs sm:btn-sm">
                <CloudDownloadIcon className="w-4 h-4 sm:w-6 sm:h-6" />
                <span className="hidden md:block md:ml-1">Export</span>
              </div>
              <ul
                tabIndex={0}
                className="shadow menu dropdown-content bg-base-300 rounded-box w-20 md:w-52"
              >
                <li>
                  <a>Item 1</a>
                </li>
                <li>
                  <a>Item 2</a>
                </li>
                <li>
                  <a>Item 3</a>
                </li>
              </ul>
            </div>
            <div className="btn btn-xs sm:btn-sm mb-[1px]">
              <TrashIcon className="w-4 h-4 sm:w-6 sm:h-6" />
              <span className="hidden md:block md:ml-1">Delete</span>
            </div>
          </div>
        </div>
      </div>
      <div className="btn btn-xs md:btn-sm btn-primary absolute right-0 top-0 rounded-tl-none rounded-br-none md:rounded-full md:right-2 md:top-2">
        <InformationCircleIcon className="w-5 h-5" />
      </div>
    </div>
  );
};
