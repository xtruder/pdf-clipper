import React, {
  forwardRef,
  useEffect,
  useState,
  ReactEventHandler,
  ComponentPropsWithoutRef,
} from "react";
import { blobToDataURL } from "../lib/dom";

export interface ImageProps
  extends Omit<ComponentPropsWithoutRef<"img">, "src"> {
  src?: string | Blob;
  fallbackSrc?: string;
}

export const Image = forwardRef<HTMLImageElement, ImageProps>(
  ({ src, fallbackSrc, onLoad: _onLoad, onError: _onError, ...rest }, ref) => {
    const [{ currentSrc, errored, loaded }, setState] = useState<{
      currentSrc?: string;
      errored: boolean;
      loaded: boolean;
    }>({
      currentSrc: undefined,
      errored: false,
      loaded: false,
    });

    // update src when property gets updated
    useEffect(() => {
      if (src) {
        if (src instanceof Blob) {
          Promise.resolve(blobToDataURL(src)).then((dataUrl) =>
            setState((s) => ({ ...s, currentSrc: dataUrl }))
          );
        } else {
          setState((s) => ({ ...s, currentSrc: src }));
        }
      } else if (fallbackSrc)
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
