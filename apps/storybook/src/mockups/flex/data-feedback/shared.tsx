import * as React from "react";
import { Button } from "@dg-design/react";

import { ROLES, resolve } from "../profiles";
import { profileVariant, type Flex } from "../FlexKit";

export type PostStatus = "발행" | "검토" | "초안" | "보관";
export interface Post {
  id: string;
  title: string;
  author: string;
  status: PostStatus;
  views: number;
  comments: number;
  updated: string;
}

export const POSTS: readonly Post[] = [
  { id: "P-101", title: "컴포넌트 디자인 기록", author: "편도걸", status: "발행", views: 12840, comments: 32, updated: "10-08" },
  { id: "P-102", title: "토큰 이름 규칙 정리", author: "김하늘", status: "발행", views: 8421, comments: 12, updated: "10-07" },
  { id: "P-103", title: "다크 모드 대비 점검", author: "이서준", status: "검토", views: 1204, comments: 4, updated: "10-06" },
  { id: "P-104", title: "표와 목록을 고르는 기준", author: "박지민", status: "초안", views: 0, comments: 0, updated: "10-05" },
  { id: "P-105", title: "가상 스크롤 행 높이", author: "최윤아", status: "발행", views: 23017, comments: 58, updated: "10-03" },
  { id: "P-106", title: "live region 정책", author: "정민호", status: "보관", views: 3390, comments: 7, updated: "09-28" },
  { id: "P-107", title: "모바일 하단 행동 영역", author: "강지우", status: "초안", views: 0, comments: 0, updated: "09-27" },
  { id: "P-108", title: "브랜드 블루 결정 메모", author: "윤채원", status: "발행", views: 901, comments: 2, updated: "09-25" },
];

export const STATUS_INTENT = { 발행: "positive", 검토: "informative", 초안: "neutral", 보관: "neutral" } as const;

export const num = (n: number) => n.toLocaleString("ko-KR");

/** 표 한 줄 행 높이. CSS(--fx-table-row)와 DataTable의 JS virtual.rowHeight가 같은 정본을 읽는다. */
export function tableRow(v: Flex): number {
  return resolve(ROLES["table-row"], profileVariant(v), v.density).px ?? 44;
}

/**
 * 표 안의 한 행만 hover로 그린다. FlexState force는 칸 전체에 걸려 머리글 행까지 hover가 되므로,
 * 렌더 뒤에 해당 tr에만 mk-hover를 단다(DataTable은 행 className을 받지 않는다).
 */
export function HoverRow({ index, children }: { index: number; children: React.ReactNode }) {
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const id = window.setTimeout(() => ref.current?.querySelector(`tr[data-row-index="${index}"]`)?.classList.add("mk-hover"), 120);
    return () => window.clearTimeout(id);
  }, [index]);
  return <div ref={ref} style={{ width: "100%" }}>{children}</div>;
}

/** 시안 안의 흰 면. 칸 배경 위에서 실제로 놓이는 표면을 보인다. */
export function Surface({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ width: "100%", boxSizing: "border-box", background: "var(--dds-color-bg-layer-default)", border: "1px solid var(--dds-color-stroke-neutral-weak)", borderRadius: "var(--dds-radius-r3)", overflow: "hidden", ...style }}>
      {children}
    </div>
  );
}

function Icon({ children, size = 16 }: { children: React.ReactNode; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}

export const SearchIcon = () => <Icon><circle cx="7" cy="7" r="4.5" /><path d="M10.5 10.5L14 14" /></Icon>;
export const DocIcon = ({ size }: { size?: number }) => <Icon size={size}><path d="M4 2.5h5l3 3v8H4z" /><path d="M9 2.5v3h3M6 8.5h4M6 11h4" /></Icon>;
export const BellIcon = () => <Icon size={20}><path d="M4 11.5V7a4 4 0 0 1 8 0v4.5l1 1.5H3z" /><path d="M6.5 14.5h3" /></Icon>;
export const CheckIcon = () => <Icon size={14}><path d="M3.5 8.5l3 3 6-7" /></Icon>;
export const InboxIcon = () => <Icon size={24}><path d="M2.5 9.5l2-6h7l2 6v4h-11z" /><path d="M2.5 9.5h3.5l1 1.5h2l1-1.5h3.5" /></Icon>;
export const SearchOffIcon = () => <Icon size={24}><circle cx="7" cy="7" r="4.5" /><path d="M10.5 10.5L14 14M5.5 5.5l3 3M8.5 5.5l-3 3" /></Icon>;
export const CloudOffIcon = () => <Icon size={24}><path d="M4.5 12.5a3 3 0 0 1-.4-6 4 4 0 0 1 7.6-1.2 3.3 3.3 0 0 1 .8 6.5" /><path d="M2.5 2.5l11 11" /></Icon>;

/**
 * 선택 Chip 자리. 공용 Chip은 new-kinds 시안이 정하고, 여기서는 Button(neutral weak small)에
 * chip 역할 치수만 얹어 Badge와 나란히 비교한다. 선택은 aria-pressed + 체크 아이콘(색만으로 나르지 않음).
 */
export function ChipStandIn({ label, pressed = false, disabled, onClick }: { label: string; pressed?: boolean; disabled?: boolean; onClick?: () => void }) {
  return (
    <Button size="small" intent="neutral" variant="weak" className="fx-df-chip" aria-pressed={pressed} disabled={disabled} onClick={onClick}>
      {pressed && <CheckIcon />}
      {label}
    </Button>
  );
}
