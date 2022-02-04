import React from "react";
import { Story } from "@storybook/react";

import { TipContainer } from "./TipContainer";

export default {
  title: "TipContainer",
};

export const TheTipContainer: Story = (args) => {
  const page = {
    left: 20,
    top: 20,
    width: 700,
    height: 780,
  };

  return (
    <div className="w-200 h-200 bg-green-300">
      <TipContainer
        scrollTop={10}
        style={{ top: 0, left: 50, bottom: 20 }}
        boundingRect={page}
      >
        <div className="bg-yellow-400">
          <a>this is a left top tip</a>
        </div>
      </TipContainer>
      <div
        style={{
          top: 0,
          left: 0,
          width: 80,
          height: 20,
          position: "absolute",
        }}
        className="bg-blue-600"
      ></div>

      <TipContainer
        scrollTop={10}
        style={{ top: 0, left: 800, bottom: 20 }}
        boundingRect={page}
      >
        <div className="bg-yellow-400">
          <a>this is a right top tip</a>
        </div>
      </TipContainer>
      <div
        style={{
          top: 0,
          left: 700,
          width: 80,
          height: 20,
          position: "absolute",
        }}
        className="bg-blue-600"
      ></div>

      <TipContainer
        scrollTop={10}
        style={{ top: 740, left: 50, bottom: 20 }}
        boundingRect={page}
      >
        <div className="bg-yellow-400">
          <a>this is a left bottom tip</a>
        </div>
      </TipContainer>
      <div
        style={{
          top: 740,
          left: 0,
          width: 80,
          height: 20,
          position: "absolute",
        }}
        className="bg-blue-600"
      ></div>

      <TipContainer
        scrollTop={10}
        style={{ top: 740, left: 800, bottom: 20 }}
        boundingRect={page}
      >
        <div className="bg-yellow-400">
          <a>this is a right bottom tip</a>
        </div>
      </TipContainer>
      <div
        style={{
          top: 740,
          left: 700,
          width: 80,
          height: 20,
          position: "absolute",
        }}
        className="bg-blue-600"
      ></div>
    </div>
  );
};

TheTipContainer.args = {};
