import React, { Suspense, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { ErrorBoundary } from "react-error-boundary";
import { Helmet, HelmetProvider } from "react-helmet-async";
import useDarkMode from "@utilityjs/use-dark-mode";

import { useViewport } from "./lib/react";

import { ApolloProvider } from "@apollo/client";
import { client, queueLink } from "./apollo";

import { ErrorFallback } from "~/components/ui/ErrorFallback";
import {
  TopbarProgressIndicator,
  useContextProgress,
  ContextProgressProvider,
} from "~/components/ui/ProgressIndicator";

import { DocumentViewPage } from "~/pages/DocumentViewPage";
import { MainPage } from "~/pages/MainPage";
import PDFViewPage from "~/pages/PDFReaderPage";

import "virtual:windi.css";
import "./App.css";

// Note: remove these listeners when your app is shut down to avoid leaking listeners.
window.addEventListener("offline", () => queueLink.close());
window.addEventListener("online", () => queueLink.open());

const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
  const { height, width } = useViewport();

  // define global --vh and --vw css variables that have viewport width and height set
  useEffect(() => {
    document.documentElement.style.setProperty("--vh", `${height}px`);
    document.documentElement.style.setProperty("--vw", `${width}px`);
  }, [width, height]);

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
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <ApolloProvider client={client}>
          <AppRouter />
        </ApolloProvider>
      </ErrorBoundary>
    </>
  );
}
