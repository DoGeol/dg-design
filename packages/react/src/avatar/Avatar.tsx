import "./avatar.css";

import { cva, type VariantProps } from "class-variance-authority";
import clsx from "clsx";
import * as React from "react";

import { mergeRefs } from "../internal/merge-refs";

type LoadingState = "loading" | "loaded" | "error";

/**
 * "none" = 전환 없음(캐시 완료·오류·motion="none"), "start" = 시작 프레임(opacity 0),
 * "run" = 최종 opacity로 전환 중. 캐시 경로는 start를 거치지 않아 깜빡임이 없다.
 */
type FadeState = "none" | "start" | "run";

interface AvatarContextValue {
  imageRef: React.RefObject<HTMLImageElement | null>;
  loadingState: LoadingState;
  setLoadingState: React.Dispatch<React.SetStateAction<LoadingState>>;
  motion: "auto" | "none";
  fade: FadeState;
  setFade: React.Dispatch<React.SetStateAction<FadeState>>;
}

const AvatarContext = React.createContext<AvatarContextValue | null>(null);

/** 서버에는 레이아웃이 없다 — Collapsible과 같은 방식으로 SSR 경고를 피한다. */
const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

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
    VariantProps<typeof root> {
  /** 기본값 "none" — 대량 목록에서 아바타가 우수수 나타나지 않도록 등장 효과가 없다.
   * "auto"를 고른 프로필 영역에서만 네트워크로 새로 받은 이미지가 150ms 페이드인한다
   * (캐시 완료·오류 복귀·최초 렌더는 언제나 즉시). */
  motion?: "auto" | "none";
}

const Root = React.forwardRef<HTMLDivElement, AvatarRootProps>(
  ({ className, size, motion = "none", ...props }, ref) => {
    // `loading` is deliberately the initial server and client value. Image completion
    // is evaluated by Image only after hydration, avoiding markup disagreement.
    const [loadingState, setLoadingState] = React.useState<LoadingState>("loading");
    const [fade, setFade] = React.useState<FadeState>("none");
    const imageRef = React.useRef<HTMLImageElement>(null);
    const context = React.useMemo(
      () => ({ imageRef, loadingState, setLoadingState, motion, fade, setFade }),
      [loadingState, motion, fade],
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
  ({ className, src, onLoad, onError, onTransitionEnd, ...props }, ref) => {
    const { imageRef, loadingState, setLoadingState, motion, fade, setFade } =
      useAvatarContext("Avatar.Image");

    // 이 src의 결과를 이미 정했는지. 캐시로 즉시 확정한 뒤 뒤늦게 도착하는 load 이벤트가
    // 페이드를 다시 켜지 않게 한다(캐시는 언제나 즉시 표시).
    const settledRef = React.useRef(false);
    const frameRef = React.useRef<number | null>(null);
    const cancelFade = React.useCallback(() => {
      if (frameRef.current !== null && typeof cancelAnimationFrame === "function") {
        cancelAnimationFrame(frameRef.current);
      }
      frameRef.current = null;
    }, []);

    // 커밋 직후(그림 그리기 전, 그리고 브라우저가 load 이벤트를 던지기 전)에 판정한다 —
    // 이미 받아 둔 이미지는 src를 걸자마자 complete가 true라, 이 순서여야 캐시가 항상
    // "즉시 표시"로 갈린다. 첫 렌더 값은 서버·클라이언트 모두 loading이라 hydration은 그대로다.
    useIsomorphicLayoutEffect(() => {
      // src가 바뀌면 진행 중이던 페이드도 취소한다 — 이전 이미지의 잔상을 남기지 않는다.
      settledRef.current = false;
      cancelFade();
      setFade("none");
      setLoadingState("loading");
      const image = imageRef.current;
      if (!image || !image.complete) return;

      settledRef.current = true;
      setLoadingState(image.naturalWidth > 0 && image.naturalHeight > 0 ? "loaded" : "error");
    }, [src, imageRef, setLoadingState, setFade, cancelFade]);

    React.useEffect(() => cancelFade, [cancelFade]);

    // 시작 프레임이 DOM에 실제로 올라간 뒤에만 목표값으로 넘어간다. 두 가지가 다 필요하다:
    // 커밋 직후(layout effect)에 opacity 0을 강제로 계산시켜야 "바뀐 값"이 생기고,
    // 다음 프레임(단발 rAF)에 바꿔야 그 프레임이 화면에 남는다. 둘 중 하나만으로는
    // 두 변경이 한 번에 합쳐져 전환이 통째로 사라진다.
    useIsomorphicLayoutEffect(() => {
      if (fade !== "start" || motion !== "auto") return;
      const image = imageRef.current;
      if (!image || typeof requestAnimationFrame !== "function") return;
      void getComputedStyle(image).opacity;
      frameRef.current = requestAnimationFrame(() => {
        frameRef.current = null;
        setFade("run");
      });
      return cancelFade;
    }, [fade, motion, imageRef, setFade, cancelFade]);

    const handleLoad = React.useCallback(
      (event: React.SyntheticEvent<HTMLImageElement>) => {
        // 지금 걸려 있는 src의 이벤트만 상태로 받는다. 소비자 콜백은 그대로 넘긴다.
        const current = event.currentTarget.getAttribute("src") === src;
        if (current && !settledRef.current) {
          settledRef.current = true;
          setLoadingState("loaded");
          // 시작 프레임(opacity 0)을 거쳐 최종값으로 전환한다 — 실제 예약은 아래 layout effect에서.
          if (motion === "auto") setFade("start");
        }
        onLoad?.(event);
      },
      [onLoad, setLoadingState, setFade, motion, src],
    );
    const handleError = React.useCallback(
      (event: React.SyntheticEvent<HTMLImageElement>) => {
        if (event.currentTarget.getAttribute("src") === src) {
          settledRef.current = true;
          cancelFade();
          setFade("none");
          setLoadingState("error");
        }
        onError?.(event);
      },
      [onError, setLoadingState, setFade, cancelFade, src],
    );

    // motion을 도중에 꺼도 남은 상태가 이미지를 투명하게 붙잡지 않는다.
    const activeFade = motion === "auto" ? fade : "none";

    return (
      <img
        ref={mergeRefs(imageRef, ref)}
        className={clsx("dds-avatar__image", className)}
        {...props}
        src={src}
        onLoad={handleLoad}
        onError={handleError}
        // 페이드가 끝나야 fallback을 접는다 — 그전까지는 이미지 뒤에 그대로 남는다.
        onTransitionEnd={(event) => {
          onTransitionEnd?.(event);
          setFade("none");
        }}
        data-loading-state={loadingState}
        data-fade={activeFade === "none" ? undefined : activeFade}
        hidden={loadingState !== "loaded"}
      />
    );
  },
);
Image.displayName = "Avatar.Image";

export interface AvatarFallbackProps extends React.HTMLAttributes<HTMLDivElement> {}

const Fallback = React.forwardRef<HTMLDivElement, AvatarFallbackProps>(
  ({ className, ...props }, ref) => {
    const { loadingState, motion, fade } = useAvatarContext("Avatar.Fallback");
    // 페이드 중에는 이미지 뒤에 그대로 남아 빈 자리가 보이지 않게 하되, 접근성 트리에서는
    // 빼서 이미지 alt와 중복으로 읽히지 않게 한다. 전환이 끝나면 평소대로 hidden으로 접는다.
    const fading = motion === "auto" && fade !== "none";
    return (
      <div
        ref={ref}
        className={clsx("dds-avatar__fallback", className)}
        {...props}
        data-loading-state={loadingState}
        aria-hidden={fading ? "true" : props["aria-hidden"]}
        hidden={loadingState === "loaded" && !fading}
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

export { Root as AvatarRoot, Image as AvatarImage, Fallback as AvatarFallback, Badge as AvatarBadge };
