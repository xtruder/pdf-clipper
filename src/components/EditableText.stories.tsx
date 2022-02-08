import React from "react";
import { Args, ArgTypes, Story } from "@storybook/react";

import { EditableText } from "./EditableText";

const argTypes: Partial<ArgTypes<Args>> = {
  onChange: {
    action: "change",
  },
};

// const args: Partial<Args> = {
//   text: "",
//   placeholder: "",
//   editing: false,

// };

export default {
  title: "EditableText",
};

export const DefaultEditableText: Story = (args) => {
  return (
    <div className="m-2 w-100">
      <EditableText className="border-2" onChange={args.onChange} />
    </div>
  );
};

DefaultEditableText.argTypes = argTypes;
