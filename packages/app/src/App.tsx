import React, { Suspense, useCallback, useEffect, useMemo } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Client, Provider as UrqlProvider } from "urql";
import { v4 as uuid } from "uuid";

import { useWindowSize } from "@react-hook/window-size";
import { useColorScheme } from "use-color-scheme";
import { useLocalStorageState } from "ahooks";
import { suspend } from "suspend-react";

import { ErrorBoundary } from "react-error-boundary";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { ToastContainer } from "react-toastify";

import { createClient } from "~/gql/client";
import { Database } from "~/offline";

import {
  ErrorFallback,
  TopbarProgressIndicator,
  useContextProgress,
  ContextProgressProvider,
} from "@pdf-clipper/components";

import { DocumentViewPage } from "~/pages/DocumentViewPage";
import { MainPage } from "~/pages/MainPage";
import PDFViewPage from "~/pages/PDFReaderPage";

import "virtual:windi.css";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";

/** initializes database, graphql client and created initial account */
const useInitClient = (): Client => {
  // create offline database instance
  const db = useMemo(() => new Database(), []);

  // get current account id from local storage
  const [currentAccountId, setCurrentAccountId] = useLocalStorageState(
    "currentAccountId",
    {
      defaultValue: () => uuid(),
      serializer: (val) => val,
      deserializer: (val) => val,
    }
  );

  // create initial account if it does not exist
  suspend(async () => {
    const account = await db.accounts.get(currentAccountId);
    if (!account) {
      await db.accounts.add({ id: currentAccountId });
      setCurrentAccountId(currentAccountId);
    }
  }, []);

  // create graphql client
  const client = useMemo(
    () =>
      createClient({
        url: "http://localhost:4000/graphql",
        accountId: currentAccountId,
        db,
      }),
    [currentAccountId]
  );

  return client;
};

const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const ShowProgress: React.FC = useCallback(
    () => <TopbarProgressIndicator {...useContextProgress()} />,
    []
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
          path="/document/:source/:documentId"
          element={
            <PageWrapper>
              <DocumentViewPage />
            </PageWrapper>
          }
        />
        <Route path="/viewpdf/:source/:documentId" element={<PDFViewPage />} />
      </Routes>
    </Router>
  );
};

export function App(): JSX.Element {
  // initialize graphql client
  const client = useInitClient();

  // get color schema and windwo size information
  const { scheme } = useColorScheme();
  const [width, height] = useWindowSize();

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
          <body data-theme={scheme} className={scheme} />
        </Helmet>
      </HelmetProvider>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <UrqlProvider value={client}>
          <AppRouter />
        </UrqlProvider>
      </ErrorBoundary>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={scheme as any}
        style={{ minWidth: "600px" }}
      />
    </>
  );
}
