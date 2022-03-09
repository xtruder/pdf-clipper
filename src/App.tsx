import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { ErrorBoundary } from "react-error-boundary";
import { RecoilRoot } from "recoil";
import { Helmet, HelmetProvider } from "react-helmet-async";
import useDarkMode from "@utilityjs/use-dark-mode";

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
import PDFViewPage from "~/pages/PDFViewPage";

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
        <Route path="/viewpdf/:documentId" element={<PDFViewPage />} />
      </Routes>
    </Router>
  );
};

export function App(): JSX.Element {
  const { isDarkMode } = useDarkMode({});

  const state = localState;

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <meta charSet="UTF-8" />
          <link rel="icon" type="image/svg+xml" href="src/favicon.svg" />
          <title>PDF clipper</title>

          <meta
            name="viewport"
            content="minimum-scale=1.0, initial-scale=1.0, maximum-scale=1.0, width=device-width, shrink-to-fit=no"
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
