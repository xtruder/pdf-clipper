import { Story } from "@storybook/react";
import React from "react";

import { DocumentInfoCard } from "./DocumentInfoCard";

export default {
  title: "documents/DocumentInfoCard",
};

const loremIpsum = `Lorem ipsum odor amet, consectetuer adipiscing elit. Ac purus in massa egestas mollis varius;
dignissim elementum. Mollis tincidunt mattis hendrerit dolor eros enim, nisi ligula ornare.
Hendrerit parturient habitant pharetra rutrum gravida porttitor eros feugiat. Mollis elit
sodales taciti duis praesent id. Consequat urna vitae morbi nunc congue.`;

export const TheDocumentInfoCard: Story = (args) => {
  return (
    <div className="w-full max-w-400 p-2 ">
      <DocumentInfoCard
        title="A brief history of time"
        description={loremIpsum}
        pages={args.showPages && 300}
        lastPage={args.showLastPage && 10}
        cover={
          args.showCover &&
          "https://images-na.ssl-images-amazon.com/images/I/A1xkFZX5k-L.jpg"
        }
        onOpen={args.onOpen}
        onInfoClicked={args.onInfoClicked}
        onDeleteClicked={args.onDeleteClicked}
        onCopyLinkClicked={args.onCopyLinkClicked}
        onExportMarkdownClicked={args.onExportMarkdownClicked}
        onDownloadDocumentClicked={args.onDownloadDocumentClicked}
        onDownloadAllClicked={args.onDownloadAllClicked}
      />
    </div>
  );
};

TheDocumentInfoCard.args = {
  showCover: true,
  showPages: true,
  showLastPage: true,
};

TheDocumentInfoCard.argTypes = {
  onOpen: {
    action: "open clicked",
  },
  onInfoClicked: {
    action: "info clicked",
  },
  onDeleteClicked: {
    action: "delete clicked",
  },
  onCopyLinkClicked: { action: "copy link clicked" },
  onExportMarkdownClicked: { action: "export markdown clicked" },
  onDownloadDocumentClicked: { action: "download document clicked" },
  onDownloadAllClicked: { action: "download all clicked" },
};
