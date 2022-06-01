import React, { useEffect, useState } from "react";

import { ReactComponent as ArrowLeftIcon } from "~/assets/icons/arrow-left-outline.svg";

export type ModalArgs = {
  size: "auto" | "md" | "lg";
  show?: boolean;
  modalBoxClassName?: string;

  /**modal content */
  children: React.ReactNode;
};

export const Modal: React.FC<ModalArgs> = ({
  size = "auto",
  show = false,
  modalBoxClassName = {},
  children,
}) => {
  const classes = {
    size:
      size === "auto"
        ? "h-auto"
        : size === "md"
        ? "h-3/4 md:h-1/2"
        : "h-screen md:h-3/4",
    rounded:
      size === "auto"
        ? "rounded-t-xl md:rounded-box"
        : size === "md"
        ? "rounded-t-xl md:rounded-box"
        : "rounded-none md:rounded-box",
    margin: "mx-0 md:mx-4",
    position: "items-end md:items-center",
  };

  return (
    <>
      <input type="checkbox" className="modal-toggle" checked={show} />
      <div className={`modal ${classes.position}`}>
        <div
          className={`modal-box flex flex-col shadow-lg ${classes.size} ${classes.rounded} ${classes.margin} ${modalBoxClassName}`}
        >
          {children}
        </div>
      </div>
    </>
  );
};

type Action = {
  name: string;
  content: React.ReactNode;
  close: boolean;
  primary?: boolean;
};

export const ActionModal: React.FC<
  ModalArgs & {
    actions: Action[];
  }
> = ({ children, actions, show, ...args }) => {
  const [showed, setShowed] = useState(show);
  useEffect(() => setShowed(show), [show]);

  const actionClicked = (action: Action) => {
    if (action.close) {
      setShowed(false);
    }
  };

  const actionElements = actions?.map((action) => (
    <button
      key={action.name}
      className={`btn ${action.primary && "btn-primary"}`}
      onClick={() => actionClicked(action)}
    >
      {action.content}
    </button>
  ));

  return (
    <Modal {...args} show={showed}>
      <div className="flex-1">{children}</div>
      {actionElements && (
        <div className="modal-action flex-none">{actionElements}</div>
      )}
    </Modal>
  );
};

export const NavbarModal: React.FC<
  ModalArgs & {
    backbtn?: boolean;
    className?: string;
  }
> = ({ children, show, className, size, ...args }) => {
  const [showed, setShowed] = useState(show);
  useEffect(() => setShowed(show), [show]);

  const backClicked = () => {
    setShowed(false);
  };

  const classes = {
    boxBorder:
      size === "lg"
        ? "rounded-none md:rounded-xl"
        : "rounded-t-xl md:rounded-xl",
    navbarBorder:
      size === "lg" ? "rounded-none md:rounded-t-xl" : "rounded-t-xl",
  };

  return (
    <Modal
      {...args}
      size={size}
      show={showed}
      modalBoxClassName={`p-0 ${classes.boxBorder}`}
    >
      <div
        className={`navbar shadow-lg bg-neutral-focus text-neutral-content ${className} ${classes.navbarBorder}`}
      >
        <div className="flex-none">
          <button className="btn btn-square btn-ghost">
            <ArrowLeftIcon
              className="inline-block w-6 h-6 stroke-current text-primary"
              onClick={backClicked}
            />
          </button>
        </div>
      </div>
      <div className="flex-1">{children}</div>
    </Modal>
  );
};
