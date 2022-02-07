import { Story } from "@storybook/react";
import React from "react";
import { DocumentInfo, DocumentType } from "~/models";
import { DocumentInfoCard } from "./DocumentInfoCard";

export default {
  title: "DocumentInfoCard",
};

const loremIpsum = `Lorem ipsum odor amet, consectetuer adipiscing elit. Ac purus in massa egestas mollis varius;
dignissim elementum. Mollis tincidunt mattis hendrerit dolor eros enim, nisi ligula ornare.
Hendrerit parturient habitant pharetra rutrum gravida porttitor eros feugiat. Mollis elit
sodales taciti duis praesent id. Consequat urna vitae morbi nunc congue.`;

export const TheDocumentInfoCard: Story = (args) => {
  const document: DocumentInfo = {
    id: "id",
    type: DocumentType.PDF,
    title: "A brief history of time",
    description: loremIpsum,
    cover:
      args.showCover &&
      "https://images-na.ssl-images-amazon.com/images/I/A1xkFZX5k-L.jpg",
  };

  return (
    <div className="w-full max-w-400 p-2 ">
      <DocumentInfoCard document={document} />
    </div>
  );
};

TheDocumentInfoCard.args = {
  showCover: true,
};
