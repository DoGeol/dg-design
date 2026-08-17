import "./toast.css";

import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { createPortal } from "react-dom";

import { registerNotificationLayer } from "../internal/dialog-stack";
import { usePresence } from "../internal/use-presence";

const toastItem = cva("dds-toast", {
  variants: {
    intent: {
      brand: "dds-toast--intent_brand",
      neutral: "dds-toast--intent_neutral",
      critical: "dds-toast--intent_critical",
      positive: "dds-toast--intent_positive",
      warning: "dds-toast--intent_warning",
      informative: "dds-toast--intent_informative",
    },
  },
  defaultVariants: { intent: "neutral" },
});

export type ToastIntent = NonNullable<VariantProps<typeof toastItem>["intent"]>;

export interface ToastOptions {
  intent?: ToastIntent;
  title: string;
  description?: string;
}

/**
 * 자동 닫힘까지의 시간. 짧은 제목 한 줄을 읽고 닫기 버튼까지 옮겨갈 여유(WCAG 2.2.1의
 * 권고 하한과 흔한 구현값이 겹치는 구간)로 5초. hover·포커스 중에는 흐르지 않는다.
 */
const DURATION_MS = 5000;
/** 동시에 보일 최대 개수. 이보다 많으면 화면 한쪽이 목록이 되고 아래쪽이 잘린다. */
const MAX_VISIBLE = 3;

interface ToastEntry extends ToastOptions {
  id: number;
  /** false면 논리적으로 닫힌 상태 — 퇴장 애니메이션이 끝날 때까지만 배열에 남는다. */
  open: boolean;
}

let nextId = 0;

const ToastContext = React.createContext<((options: ToastOptions) => void) | undefined>(undefined);

/** Provider 안에서 토스트를 띄우는 함수를 돌려준다. */
export function useToast(): (options: ToastOptions) => void {
  const toast = React.useContext(ToastContext);
  if (!toast) throw new Error("useToast는 Toast.Provider 안에서만 쓸 수 있다.");
  return toast;
}

export interface ToastProviderProps {
  /** 닫기 버튼의 접근 이름. 앱 언어에 맞춰 한 번만 지정한다. */
  closeLabel?: string;
  children?: React.ReactNode;
}

function ToastProvider({ closeLabel = "닫기", children }: ToastProviderProps) {
  const [entries, setEntries] = React.useState<ToastEntry[]>([]);
  const [viewport, setViewport] = React.useState<HTMLElement | null>(null);

  // 다른 오버레이 6곳은 "열릴 때 만들고 닫히면 없앤다"지만 viewport는 마운트 시 1회만 만든다 —
  // 토스트가 0개인 순간에 사라지면 다음 토스트가 새 컨테이너를 얻어 스택이 끊긴다.
  // 알림 레이어로 등록해 모달이 열려 있어도 inert에서 면제받는다.
  React.useEffect(() => {
    const element = document.createElement("div");
    element.className = "dds-toast__viewport";
    document.body.appendChild(element);
    const unregister = registerNotificationLayer(element);
    setViewport(element);
    return () => {
      unregister();
      element.remove();
      setViewport(null);
    };
  }, []);

  const close = React.useCallback((id: number) => {
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, open: false } : e)));
  }, []);

  const remove = React.useCallback((id: number) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const toast = React.useCallback((options: ToastOptions) => {
    const id = nextId++;
    setEntries((prev) => {
      const next = [...prev, { ...options, id, open: true }];
      const open = next.filter((e) => e.open);
      const excess = open.length - MAX_VISIBLE;
      if (excess <= 0) return next;
      // 초과분은 오래된 것부터 밀어낸다. 즉시 제거하지 않는 이유는 퇴장 애니메이션을 태우기 위함.
      const doomed = new Set(open.slice(0, excess).map((e) => e.id));
      return next.map((e) => (doomed.has(e.id) ? { ...e, open: false } : e));
    });
  }, []);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {viewport &&
        createPortal(
          entries.map((entry) => (
            <ToastItem
              key={entry.id}
              entry={entry}
              closeLabel={closeLabel}
              onClose={close}
              onExited={remove}
            />
          )),
          viewport,
        )}
    </ToastContext.Provider>
  );
}
ToastProvider.displayName = "Toast.Provider";

interface ToastItemProps {
  entry: ToastEntry;
  closeLabel: string;
  onClose: (id: number) => void;
  onExited: (id: number) => void;
}

function ToastItem({ entry, closeLabel, onClose, onExited }: ToastItemProps) {
  const { present, ref } = usePresence(entry.open);
  const [hovered, setHovered] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const paused = hovered || focused;

  React.useEffect(() => {
    if (!present) onExited(entry.id);
  }, [present, entry.id, onExited]);

  React.useEffect(() => {
    if (!entry.open || paused) return;
    // 일시정지가 풀리면 남은 시간이 아니라 전체 지속시간을 다시 센다 — 방금 읽던 항목을
    // 손을 떼자마자 지우지 않기 위한 의도적 선택.
    const timer = setTimeout(() => onClose(entry.id), DURATION_MS);
    return () => clearTimeout(timer);
  }, [entry.open, entry.id, paused, onClose]);

  if (!present) return null;

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement | null>}
      // critical만 assertive(role="alert"), 나머지는 polite(role="status").
      // aria-live는 따로 얹지 않는다 — role이 politeness를 이미 갖는다.
      role={entry.intent === "critical" ? "alert" : "status"}
      data-state={entry.open ? "open" : "closed"}
      className={toastItem({ intent: entry.intent })}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      <div className="dds-toast__body">
        <p className="dds-toast__title">{entry.title}</p>
        {entry.description ? <p className="dds-toast__description">{entry.description}</p> : null}
      </div>
      <button
        type="button"
        className="dds-toast__close"
        aria-label={closeLabel}
        onClick={() => onClose(entry.id)}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="M4 4l8 8M12 4l-8 8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}

/** 트리거가 없는 유일한 컴포넌트 — compound 대신 Provider + `useToast()` 훅이다. */
export const Toast = {
  Provider: ToastProvider,
};
