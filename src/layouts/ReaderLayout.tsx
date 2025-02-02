import React, { Suspense } from "react";
import { FallbackProps } from "react-error-boundary";

import {
  ErrorFallback,
  ContextProgressProvider,
  TopbarProgressIndicator,
  useContextProgress,
} from "@pdf-clipper/components";
import { MyErrorBoundary } from "~/MyErrorBoundary";

export const ReaderLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const ShowProgress: React.FC = () => (
    <TopbarProgressIndicator {...useContextProgress()} />
  );

  const ShowError: React.FC<FallbackProps> = (props) => (
    <div className="p-10 w-full">
      <ErrorFallback {...props} />
    </div>
  );

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 relative">
        <MyErrorBoundary FallbackComponent={ShowError}>
          <ContextProgressProvider>
            <Suspense fallback={<ShowProgress />}>{children}</Suspense>
          </ContextProgressProvider>
        </MyErrorBoundary>
      </div>
    </div>
  );
};
