import React, {
  forwardRef,
  ReactEventHandler,
  useEffect,
  useState,
} from "react";

export interface ImageProps extends React.ComponentPropsWithoutRef<"img"> {
  src?: string;
  fallbackSrc?: string;
}

export const Image = forwardRef<HTMLImageElement, ImageProps>(
  ({ src, fallbackSrc, onLoad: _onLoad, onError: _onError, ...rest }, ref) => {
    const [{ currentSrc, errored, loaded }, setState] = useState<{
      currentSrc?: string;
      errored: boolean;
      loaded: boolean;
    }>({
      currentSrc: src || fallbackSrc,
      errored: false,
      loaded: false,
    });

    // update src when property gets updated
    useEffect(() => {
      if (src) setState((s) => ({ ...s, currentSrc: src }));
      else if (fallbackSrc)
        setState((s) => ({ ...s, currentSrc: fallbackSrc }));
    }, [src, fallbackSrc]);

    const onError: ReactEventHandler<HTMLImageElement> = (event) => {
      if (errored && fallbackSrc)
        setState((s) => ({ ...s, currentSrc: fallbackSrc }));

      _onError?.(event);
    };

    const onLoad: ReactEventHandler<HTMLImageElement> = (event) => {
      if (!loaded) setState((s) => ({ ...s, loaded: true }));

      _onLoad?.(event);
    };

    return (
      <img
        ref={ref}
        src={currentSrc}
        onLoad={onLoad}
        onError={onError}
        {...rest}
      />
    );
  }
);
