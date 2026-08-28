import "./avatar.css";

import { cva, type VariantProps } from "class-variance-authority";
import clsx from "clsx";
import * as React from "react";

import { mergeRefs } from "../internal/merge-refs";

type LoadingState = "loading" | "loaded" | "error";

interface AvatarContextValue {
  imageRef: React.RefObject<HTMLImageElement | null>;
  loadingState: LoadingState;
  setLoadingState: React.Dispatch<React.SetStateAction<LoadingState>>;
}

const AvatarContext = React.createContext<AvatarContextValue | null>(null);

function useAvatarContext(component: string) {
  const context = React.useContext(AvatarContext);
  if (!context) {
    throw new Error(`${component} must be used within Avatar.Root.`);
  }
  return context;
}

const root = cva("dds-avatar", {
  variants: {
    size: {
      small: "dds-avatar--size_small",
      medium: "dds-avatar--size_medium",
      large: "dds-avatar--size_large",
      xlarge: "dds-avatar--size_xlarge",
    },
  },
  defaultVariants: { size: "medium" },
});

export interface AvatarRootProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof root> {}

const Root = React.forwardRef<HTMLDivElement, AvatarRootProps>(
  ({ className, size, ...props }, ref) => {
    // `loading` is deliberately the initial server and client value. Image completion
    // is evaluated by Image only after hydration, avoiding markup disagreement.
    const [loadingState, setLoadingState] = React.useState<LoadingState>("loading");
    const imageRef = React.useRef<HTMLImageElement>(null);
    const context = React.useMemo(
      () => ({ imageRef, loadingState, setLoadingState }),
      [loadingState],
    );

    return (
      <AvatarContext.Provider value={context}>
        <div
          ref={ref}
          className={clsx(root({ size }), className)}
          {...props}
          data-loading-state={loadingState}
        />
      </AvatarContext.Provider>
    );
  },
);
Root.displayName = "Avatar.Root";

export interface AvatarImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {}

const Image = React.forwardRef<HTMLImageElement, AvatarImageProps>(
  ({ className, src, onLoad, onError, ...props }, ref) => {
    const { imageRef, loadingState, setLoadingState } = useAvatarContext("Avatar.Image");

    React.useEffect(() => {
      setLoadingState("loading");
      const image = imageRef.current;
      if (!image || !image.complete) return;

      setLoadingState(image.naturalWidth > 0 && image.naturalHeight > 0 ? "loaded" : "error");
    }, [src, imageRef, setLoadingState]);

    const handleLoad = React.useCallback(
      (event: React.SyntheticEvent<HTMLImageElement>) => {
        setLoadingState("loaded");
        onLoad?.(event);
      },
      [onLoad, setLoadingState],
    );
    const handleError = React.useCallback(
      (event: React.SyntheticEvent<HTMLImageElement>) => {
        setLoadingState("error");
        onError?.(event);
      },
      [onError, setLoadingState],
    );

    return (
      <img
        ref={mergeRefs(imageRef, ref)}
        className={clsx("dds-avatar__image", className)}
        {...props}
        src={src}
        onLoad={handleLoad}
        onError={handleError}
        data-loading-state={loadingState}
        hidden={loadingState !== "loaded"}
      />
    );
  },
);
Image.displayName = "Avatar.Image";

export interface AvatarFallbackProps extends React.HTMLAttributes<HTMLDivElement> {}

const Fallback = React.forwardRef<HTMLDivElement, AvatarFallbackProps>(
  ({ className, ...props }, ref) => {
    const { loadingState } = useAvatarContext("Avatar.Fallback");
    return (
      <div
        ref={ref}
        className={clsx("dds-avatar__fallback", className)}
        {...props}
        data-loading-state={loadingState}
        hidden={loadingState === "loaded"}
      />
    );
  },
);
Fallback.displayName = "Avatar.Fallback";

export interface AvatarBadgeProps extends React.HTMLAttributes<HTMLDivElement> {}

const Badge = React.forwardRef<HTMLDivElement, AvatarBadgeProps>(({ className, ...props }, ref) => {
  useAvatarContext("Avatar.Badge");
  return <div ref={ref} className={clsx("dds-avatar__badge", className)} {...props} />;
});
Badge.displayName = "Avatar.Badge";

export const Avatar = { Root, Image, Fallback, Badge };
