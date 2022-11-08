import { createContextState } from "create-context-state";
import React, { CSSProperties, useEffect } from "react";
import useState from "react-usestateref";
import setRandomInterval from "set-random-interval";

export interface ProgressIndicatorProps {
  progress: number;
  message?: string;
}

export interface RadialProgressIndicatorProps extends ProgressIndicatorProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showPct?: boolean;
  inside?: JSX.Element;
}

export const RadialProgressIndicator: React.FC<RadialProgressIndicatorProps> =
  ({
    className = "",
    progress,
    message,
    showPct = true,
    inside,
    size = "md",
  }) => {
    const progressPct = Math.round(progress * 100).toString();

    inside = inside ? (
      inside
    ) : showPct ? (
      <>{progressPct}%</>
    ) : progress < 1 ? (
      <>
        Loading
        <LoadingDots />
      </>
    ) : (
      <>Loaded</>
    );

    const style = {
      "--value": progressPct,
      "--size": size === "sm" ? "6rem" : size === "md" ? "9rem" : "12rem",
      "--thickness":
        size === "sm" ? "0.5rem" : size === "md" ? "0.8rem" : "1rem",
    } as CSSProperties;

    return (
      <div
        className={`flex flex-col items-center justify-center h-full w-full ${className}`}
      >
        <div>
          <div
            className="radial-progress bg-primary text-primary-content border-4 border-primary"
            style={style}
          >
            {inside}
          </div>
        </div>
        {message && <span>{message}</span>}
      </div>
    );
  };

export interface TopbarProgessIndicatorProps extends ProgressIndicatorProps {
  progressText?: string;
  showPct?: boolean;
  className?: string;
  progressClassName?: string;
}

export const TopbarProgressIndicator: React.FC<TopbarProgessIndicatorProps> = ({
  progress,
  message,
  progressText = "Loading",
  showPct = true,
  className = "",
  progressClassName = "",
}) => {
  const progressPct = Math.round(progress * 100);

  return (
    <div className={`flex flex-col w-full items-center ${className}`}>
      <progress
        className={`progress progress-primary w-full rounded-none ${progressClassName}`}
        value={progressPct}
        max={100}
      />
      {showPct && (
        <div className="mt-2">
          <span>
            {message ? message : progressText} {progressPct}%
          </span>
        </div>
      )}
    </div>
  );
};

export const LoadingDots: React.FC = () => {
  const [dotCount, setDotCount] = useState<number>(0);

  useEffect(() => {
    let timer = setInterval(() => setDotCount((count) => (count + 1) % 4), 200);
    return () => clearInterval(timer);
  });

  return (
    <>
      {Array.from({ length: dotCount })
        .map(() => ".")
        .join("")}
    </>
  );
};

export interface ProgressStatusContext {
  progress: number;
  message: string;
  setProgress: (progress: number) => void;
  setMessage: (message: string) => void;
  reset: () => void;
}

export interface ContextProgressProps {
  defaultProgress?: number;
  defaultMessage?: string;
  children: React.ReactNode;
}

export const [ContextProgressProvider, useContextProgress] = createContextState<
  ProgressStatusContext,
  ContextProgressProps
>(({ set, props }) => ({
  progress: 0,
  message: "",
  setProgress: (progress: number) =>
    set({ progress: progress > 1 ? 1 : progress }),
  setMessage: (message: string) => set({ message }),
  reset: () =>
    set({ progress: props.defaultProgress, message: props.defaultMessage }),
}));

export const useRandomProgress = (
  duration: number,
  minInterval = 100,
  maxInterval = 500
) => {
  const [progress, setProgress, progressRef] = useState(0);

  if (duration < maxInterval)
    throw new Error("durration must be greater than max interval");

  useEffect(() => {
    const estimatedIntervals =
      duration / (minInterval + (maxInterval - minInterval) / 2) - 1;
    const initialStep = 1 / estimatedIntervals;

    let currentIntervals = 0;
    let step = initialStep;
    const updateProgress = () => {
      const expectedIntervals = estimatedIntervals * progressRef.current;
      step +=
        currentIntervals > expectedIntervals
          ? initialStep * 0.9
          : -initialStep * 0.9;

      let newProgress = progressRef.current + step;
      if (newProgress >= 1) newProgress = 1;

      currentIntervals++;

      setProgress(newProgress);
    };

    const interval = setRandomInterval(
      updateProgress,
      minInterval,
      maxInterval
    );

    return () => {
      interval.clear();
      setProgress(0);
    };
  }, [duration]);

  return progress;
};
