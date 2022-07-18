import React, { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";

import { App } from "./App";

const container = document.querySelector("#root")!;
const root = createRoot(container);

root.render(
  <StrictMode>
    <Suspense fallback={<></>}>
      <App />
    </Suspense>
  </StrictMode>
);
