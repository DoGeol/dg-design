/**
 * @title Icon
 * @summary 24 grid 기반 자체 SVG 아이콘 소수 세트 (16종).
 *
 * ## 언제 쓰나
 *
 * - 버튼, 링크, 입력창 등 조작 요소 안에 상태나 의미를 시각적으로 보조할 때.
 * - 문구 옆에 상태를 나타내는 장식 글리프가 필요할 때.
 *
 * ## 쓰지 말 때
 *
 * - 로고, 일러스트, 브랜드 심볼 — 별도 SVG 자산 사용.
 * - 아이콘 단독으로 클릭 동작을 처리하고 싶을 때 — 반드시 `Button`의 `iconOnly`로 감싸서 사용.
 * - 비인터랙티브 상태 알림 전체 레이아웃 — `StatePanel`.
 *
 * ## 핵심 API
 *
 * | prop | 값 | 설명 |
 * | --- | --- | --- |
 * | `size` | `16` · `20`(기본) · `24` | 24 grid 기준 정사각형 시각 크기. 선 굵기는 크기에 비례해 축소 |
 * | `label` | string | 제공 시 `role="img"`와 `aria-label`이 설정됨. 생략/공백 시 `aria-hidden="true"`, `focusable="false"` |
 * | `className` / `style` | string / CSSProperties | 추가 스타일 및 외관 조정 |
 *
 * ## 접근성 및 색상 규칙
 *
 * - **색상 상속**: 모든 아이콘은 `currentColor`로 그려지며, 부모의 `--dds-color-fg-*`를 상속한다.
 * - **조작 영역**: 아이콘 자체는 행동을 소유하지 않는다. 최소 조작 영역(모바일 44px, 데스크톱 24px)은 부모 조작 요소(`Button` 등)가 제공한다.
 * - **접근 이름 중복 방지**: `Button iconOnly` 안에 넣을 때는 Button에 `aria-label`을 주고 내부 Icon에는 `label`을 주지 않는다(장식으로 처리하여 스크린리더 중복 낭독 방지).
 *
 * ## 첫 공개 16종 목록
 *
 * - 탐색/방향: `ChevronUpIcon`, `ChevronDownIcon`, `ChevronLeftIcon`, `ChevronRightIcon`
 * - 조작/기호: `CloseIcon`, `MenuIcon`, `ExternalLinkIcon`, `PlusIcon`, `MinusIcon`
 * - 상태/선택: `CheckIcon`, `CopyIcon`, `SearchIcon`, `SettingsIcon`, `DragHandleIcon`
 * - 테마: `SunIcon`, `MoonIcon`
 */
import { Button } from "@dg-design/react/button";
import {
  CheckIcon,
  ChevronDownIcon,
  CopyIcon,
  ExternalLinkIcon,
  SunIcon,
} from "@dg-design/react/icon";
import * as React from "react";

/** 버튼 안의 아이콘 — 버튼에 접근 이름을 주고 아이콘은 장식으로 둔다 */
export function IconButtonExample() {
  const [copied, setCopied] = React.useState(false);

  return (
    <Button
      iconOnly
      aria-label={copied ? "복사 완료" : "코드 복사"}
      intent="neutral"
      variant="ghost"
      size="small"
      onClick={() => setCopied(!copied)}
    >
      {copied ? <CheckIcon size={20} /> : <CopyIcon size={20} />}
    </Button>
  );
}

/** 문구와 함께 쓰이는 장식 아이콘 */
export function InlineWithText() {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "var(--dds-dimension-x1_5)",
        color: "var(--dds-color-fg-neutral)",
        fontSize: 14,
      }}
    >
      <SunIcon size={16} />
      <span>라이트 모드</span>
    </span>
  );
}

/** 독립적으로 설명용 접근 이름을 가진 아이콘 */
export function StandaloneLabeled() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <ChevronDownIcon size={24} label="아래로 펼치기" />
      <ExternalLinkIcon size={20} label="새 창에서 열림" />
    </div>
  );
}
