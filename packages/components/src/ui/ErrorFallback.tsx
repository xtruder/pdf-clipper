import React, { useEffect } from "react";
import { FallbackProps } from "react-error-boundary";

export interface ErrorFallbackProps extends FallbackProps {
  className?: string;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetErrorBoundary,
  className = "",
}) => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className={`alert shadow-lg alert-error ${className}`} role="alert">
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="stroke-current flex-shrink-0 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>Error! {error.message}</span>
      </div>
      <div className="flex-none">
        <button className="btn btn-sm" onClick={resetErrorBoundary}>
          Retry
        </button>
      </div>
    </div>
  );
};
