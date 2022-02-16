import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { ErrorBoundary } from "react-error-boundary";
import { RecoilRoot } from "recoil";
import { Helmet, HelmetProvider } from "react-helmet-async";
import useDarkMode from "use-dark-mode-hook";

import { StateCtx } from "./state/state";
import { localState } from "./state/localState";

import { ErrorFallback } from "~/components/ErrorFallback";
import {
  TopbarProgressIndicator,
  useContextProgress,
  ContextProgressProvider,
} from "~/components/ProgressIndicator";

import { DocumentViewPage } from "~/pages/DocumentViewPage";
import { MainPage } from "~/pages/MainPage";
import { PDFViewPage } from "~/pages/PDFViewPage";

import "virtual:windi.css";
import "./App.css";

const PageWrapper: React.FC = ({ children }) => {
  const ShowProgress: React.FC = () => (
    <TopbarProgressIndicator {...useContextProgress()} />
  );

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <ContextProgressProvider>
        <Suspense fallback={<ShowProgress />}>{children}</Suspense>
      </ContextProgressProvider>
    </ErrorBoundary>
  );
};

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <PageWrapper>
              <MainPage />
            </PageWrapper>
          }
        />
        <Route
          path="/document/:documentId"
          element={
            <PageWrapper>
              <DocumentViewPage />
            </PageWrapper>
          }
        />
        <Route
          path="/viewpdf/:documentId"
          element={
            <PageWrapper>
              <PDFViewPage />
            </PageWrapper>
          }
        ></Route>
      </Routes>
    </Router>
  );
};

export function App(): JSX.Element {
  const [isDarkMode, _toggleDarkMode] = useDarkMode({});
  const state = localState;

  return (
    <>
      <HelmetProvider>
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
      </HelmetProvider>
      <RecoilRoot>
        <StateCtx.Provider value={state}>
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <AppRouter />
          </ErrorBoundary>
        </StateCtx.Provider>
      </RecoilRoot>
    </>
  );
}
