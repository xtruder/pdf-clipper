import React from "react";
import { Story } from "@storybook/react";

import { Modal, ActionModal, NavbarModal } from "./Modal";

const loreipsum = (
  <p>
    Enim dolorem dolorum omnis atque necessitatibus. Consequatur aut adipisci
    qui iusto illo eaque. Consequatur repudiandae et. Nulla ea quasi eligendi.
    Saepe velit autem minima.
  </p>
);

export default {
  title: "ui/Modal",
};

const sizeArgType = {
  control: {
    type: "select",
    options: ["auto", "md", "lg"],
  },
};

export const TheModal: Story = (args) => {
  return (
    <>
      <Modal size={args.size} show={args.showed}>
        {loreipsum}
      </Modal>
    </>
  );
};

TheModal.argTypes = {
  size: sizeArgType,
};

TheModal.args = {
  showed: true,
};

export const TheActionModal: Story = (args) => {
  return (
    <>
      <a>{loreipsum}</a>
      <ActionModal
        size={args.size}
        show={args.showed}
        actions={[
          {
            name: "accept",
            content: "Accept",
            close: true,
            primary: true,
          },
          {
            name: "close",
            content: "Close",
            close: true,
          },
        ]}
      >
        {loreipsum}
      </ActionModal>
    </>
  );
};

TheActionModal.argTypes = {
  size: sizeArgType,
};

TheActionModal.args = {
  showed: true,
};

export const TheNavbarModal: Story = (args) => {
  return (
    <>
      <a>{loreipsum}</a>
      <NavbarModal size={args.size} show={args.showed}>
        {loreipsum}
      </NavbarModal>
    </>
  );
};

TheNavbarModal.argTypes = {
  size: sizeArgType,
};

TheNavbarModal.args = {
  showed: true,
};
