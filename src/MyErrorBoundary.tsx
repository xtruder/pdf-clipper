import React, {
  useCallback,
  FC,
  ComponentType,
  PropsWithChildren,
} from "react";
import { ErrorBoundary } from "react-error-boundary";

import { ErrorFallback, ErrorFallbackProps } from "@pdf-clipper/components";
import { useClient } from "./ClientProvider";

export interface MyErrorBoundaryProps extends PropsWithChildren {
  FallbackComponent?: ComponentType<ErrorFallbackProps>;
}

export const MyErrorBoundary: FC<MyErrorBoundaryProps> = ({
  FallbackComponent = ErrorFallback,
  children,
}) => {
  const { resetClient } = useClient();

  const onError = useCallback(() => {
    resetClient();
  }, []);

  return (
    <ErrorBoundary FallbackComponent={FallbackComponent} onError={onError}>
      {children}
    </ErrorBoundary>
  );
};
