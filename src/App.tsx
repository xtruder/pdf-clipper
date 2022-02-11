import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Helmet } from "react-helmet";
import useDarkMode from "use-dark-mode-hook";

import { StateCtx } from "./state/state";
import { localState } from "./state/localState";
import { RecoilRoot, useSetRecoilState } from "recoil";
import { s4 } from "./lib/utils";
import { DocumentType } from "./models";

import { MainPage } from "./pages/MainPage";
import { DocumentViewPage } from "./pages/DocumentViewPage";
import { PDFViewPage } from "./pages/PDFViewPage";

import "virtual:windi.css";
import "./App.css";

export function App(): JSX.Element {
  const [isDarkMode, _toggleDarkMode] = useDarkMode({});
  const state = localState;

  return (
    <>
      <Helmet>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
        />
        <body
          data-theme={isDarkMode ? "dark" : "light"}
          className={isDarkMode ? "dark" : "light"}
        />
      </Helmet>
      <RecoilRoot>
        <StateCtx.Provider value={state}>
          <Router>
            <Routes>
              <Route path="/" element={<MainPage />} />
              <Route
                path="/document/:documentId"
                element={<DocumentViewPage />}
              />
              <Route path="/viewpdf/:documentId" element={<PDFViewPage />} />
            </Routes>
          </Router>
        </StateCtx.Provider>
      </RecoilRoot>
    </>
  );
}
