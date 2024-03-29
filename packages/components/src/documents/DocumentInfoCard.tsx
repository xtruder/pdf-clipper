import React, { ReactElement } from "react";

import { ReactComponent as BookOpenIcon } from "../assets/icons/book-open-outline.svg";
import { ReactComponent as TrashIcon } from "../assets/icons/trash-outline.svg";
import { ReactComponent as ShareIcon } from "../assets/icons/share-outline.svg";
import { ReactComponent as CloudDownloadIcon } from "../assets/icons/cloud-download-outline.svg";
import { ReactComponent as InformationCircleIcon } from "../assets/icons/information-circle-outline.svg";

import { EditableText } from "../ui/EditableText";
import { TopbarProgressIndicator } from "../ui/ProgressIndicator";
import { Image } from "../ui/Image";

export interface DocumentInfoCardProps {
  title?: string;
  description?: string;
  cover?: string | Blob;
  lastPage?: number;
  pages?: number;
  isLoading?: boolean;
  loadingProgress?: number;

  // handlers
  onOpen?: () => void;
  onInfoClicked?: () => void;
  onDeleteClicked?: () => void;
  onCopyLinkClicked?: () => void;
  onExportMarkdownClicked?: () => void;
  onDownloadDocumentClicked?: () => void;
  onDownloadAllClicked?: () => void;
  onDescriptionChanged?: (text: string, reset: () => void) => void;
  onTitleChanged?: (text: string, reset: () => void) => void;
}

export const DocumentInfoCard: React.FC<DocumentInfoCardProps> = ({
  title,
  description = "",
  cover,
  lastPage,
  pages,
  isLoading,
  loadingProgress,

  // handlers
  onOpen = () => null,
  onInfoClicked = () => null,
  onDeleteClicked = () => null,
  onCopyLinkClicked = () => null,
  onExportMarkdownClicked = () => null,
  onDownloadDocumentClicked = () => null,
  onDownloadAllClicked = () => null,
  onDescriptionChanged = () => null,
  onTitleChanged = () => null,
}) => {
  const cardBody = (
    <>
      <h2 className="card-title">
        <EditableText
          text={title}
          placeholder="Write title here..."
          onChange={onTitleChanged}
        />
      </h2>
      <span className="flex-1">
        <EditableText
          text={description}
          placeholder="Write description here..."
          clampClassName="line-clamp-4 sm:line-clamp-3 md:line-clamp-2"
          onChange={onDescriptionChanged}
        />
      </span>
      <div className="flex flex-row items-center">
        {pages && (
          <>
            {lastPage && (
              <progress
                className="progress w-1/4 mr-2 hidden sm:block"
                value="30"
                max="100"
              />
            )}
            <div className="badge sm:badge-lg md:badge-lg">
              {lastPage ? (
                <>
                  {lastPage}/{pages}
                </>
              ) : (
                <>Pages: {pages}</>
              )}
            </div>
          </>
        )}
        <div className="flex-1"></div>
        <div className="flex flex-row items-center">
          <div className="dropdown dropdown-end mr-1">
            <div tabIndex={0} className="btn btn-xs sm:btn-sm">
              <ShareIcon className="w-4 h-4 sm:w-6 sm:h-6" />
              <span className="hidden md:block md:ml-1">Share</span>
            </div>
            <ul
              tabIndex={0}
              className="mb-1 shadow menu dropdown-content bg-base-300 rounded-box w-40 md:w-52"
            >
              <li>
                <a onClick={() => onCopyLinkClicked()}>Copy link</a>
              </li>
            </ul>
          </div>
          <div className="dropdown dropdown-end mr-1">
            <div tabIndex={0} className="btn btn-xs sm:btn-sm">
              <CloudDownloadIcon className="w-4 h-4 sm:w-6 sm:h-6" />
              <span className="hidden md:block md:ml-1">Export</span>
            </div>
            <ul
              tabIndex={0}
              className="shadow menu dropdown-content bg-base-300 rounded-box w-40 md:w-52"
            >
              <li>
                <a onClick={() => onExportMarkdownClicked()}>
                  Export markdown annotations
                </a>
              </li>
              <li>
                <a onClick={() => onDownloadDocumentClicked()}>Download PDF</a>
              </li>
              <li>
                <a onClick={() => onDownloadAllClicked()}>
                  Download PDF and annotations as zip
                </a>
              </li>
            </ul>
          </div>
          <div
            className="btn btn-xs sm:btn-sm mb-[1px] relative"
            onClick={() => onDeleteClicked()}
          >
            <TrashIcon className="w-4 h-4 sm:w-6 sm:h-6" />

            <span className="hidden md:block md:ml-1">Delete</span>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="card card-side card-bordered border-black shadow-lg card-compact md:card-normal overflow-visible">
      <figure
        className="flex-[0.25] min-w-20 sm:min-w-40 md:min-w-40 pl-2 sm:pl-0 self-center cursor-pointer"
        onClick={() => onOpen()}
      >
        {cover ? (
          <Image src={cover} style={{ width: "100%" }} />
        ) : (
          <BookOpenIcon className="w-full h-full" />
        )}
      </figure>
      <div className="flex flex-[2] card-body">
        {isLoading ? (
          <TopbarProgressIndicator
            progress={loadingProgress || 0}
            progressText="Loading document meta"
          />
        ) : (
          cardBody
        )}
      </div>
      {!isLoading && (
        <div
          className="btn btn-xs md:btn-sm btn-primary absolute right-0 top-0
          rounded-tl-none rounded-br-none md:rounded-full md:right-2 md:top-2"
          onClick={() => onInfoClicked()}
        >
          <InformationCircleIcon className="w-5 h-5" />
        </div>
      )}
    </div>
  );
};

export const DocumentInfoCardList: React.FC<{
  children: ReactElement[];
  className?: string;
}> = ({ children, className }) => {
  return (
    <ul className={`overflow-scroll ${className}`}>
      {React.Children.map(children, (child, i) => (
        <li key={child.key} className={`${i !== 0 && "pt-2"}`}>
          {child}
        </li>
      ))}
    </ul>
  );
};
