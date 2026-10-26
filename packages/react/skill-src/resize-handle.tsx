/**
 * @title ResizeHandle
 * @summary 분할 패널의 너비와 높이를 포인터 드래그와 키보드로 조절하는 조작 손잡이.
 *
 * ## 언제 쓰나
 *
 * - 사이드바와 본문, 편집기와 미리보기 패널 사이의 분할 폭을 조절할 때.
 * - 상하로 배치된 위젯이나 로그 패널의 높이를 조절할 때(`orientation="horizontal"`).
 * - 키보드(화살표·Home·End) 및 스크린 리더(`role="separator"`) 접근성을 완비한 패널 조작 손잡이가 필요할 때.
 *
 * ## 쓰지 말 때
 *
 * - 단순 시각적 구분선 — `Separator`.
 * - 값 입력이나 범위 선택을 위한 슬라이더 컨트롤 — `Slider`.
 *
 * ## 핵심 API
 *
 * | prop | 타입 | 기본값 | 설명 |
 * | --- | --- | --- | --- |
 * | `aria-label` / `aria-labelledby` | string | 필수 | 구분선의 용도를 설명하는 접근성 라벨 |
 * | `orientation` | `"vertical" \| "horizontal"` | `"vertical"` | 손잡이 방향. vertical은 좌우 분할(가로 조절), horizontal은 상하 분할(세로 조절) |
 * | `value` | `number` | 필수 | 현재 크기 또는 분할 비율 값 |
 * | `min` | `number` | 필수 | 최소 하한값 |
 * | `max` | `number` | 필수 | 최대 상한값 |
 * | `step` | `number` | `1` | 키보드 1회 이동량 |
 * | `onValueChange` | `(value: number) => void` | 필수 | 조절 중 실시간 호출되는 변경 콜백 |
 * | `onReset` | `() => void` | 선택 | 더블클릭 또는 Enter/Space 키 입력 시 호출되는 초기화 콜백 |
 * | `disabled` | `boolean` | `false` | 조작 비활성화 여부 |
 *
 * ## 접근성
 *
 * - W3C ARIA `role="separator"` 명세를 충실히 따르며 `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-orientation`을 관리합니다.
 * - 키보드 포커스 시 ArrowLeft/ArrowDown으로 -step, ArrowRight/ArrowUp으로 +step, Home/End로 하한/상한 이동을 지원합니다.
 * - Enter 또는 Space 키를 눌러 기본값(`onReset`)으로 복원할 수 있습니다.
 */
import { ResizeHandle } from "@dg-design/react/resize-handle";
import * as React from "react";

/**
 * 1. Flex 좌우 분할 예제 (픽셀 단위 크기 조절)
 *
 * localStorage 연동 패턴:
 * - 패널 너비 저장은 브라우저 설정이므로 문서 저장과 분리하여 다룹니다.
 * - onValueChange 시 debounce하여 localStorage에 저장하거나, 드래그 종료 시 동기화합니다.
 */
export function FlexSplit() {
  const DEFAULT_WIDTH = 240;
  const [sidebarWidth, setSidebarWidth] = React.useState(DEFAULT_WIDTH);

  // 로컬 스토리지 연동 예시 (마운트 시 로드, 변경 시 저장)
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem("app:sidebar-width");
      if (saved) {
        const parsed = Number(saved);
        if (parsed >= 160 && parsed <= 400) {
          setSidebarWidth(parsed);
        }
      }
    } catch {
      /* 스토리지 접근 실패 시 무시 */
    }
  }, []);

  const handleValueChange = (newWidth: number) => {
    setSidebarWidth(newWidth);
    try {
      localStorage.setItem("app:sidebar-width", String(newWidth));
    } catch {
      /* 무시 */
    }
  };

  return (
    <div
      style={{
        display: "flex",
        height: 200,
        border: "1px solid var(--dds-color-stroke-neutral-weak)",
        borderRadius: "var(--dds-radius-r2)",
        overflow: "hidden",
      }}
    >
      <aside
        style={{
          width: sidebarWidth,
          padding: 16,
          backgroundColor: "var(--dds-color-bg-neutral-weak)",
          userSelect: "none",
        }}
      >
        <strong>사이드바</strong> ({sidebarWidth}px)
      </aside>
      <ResizeHandle
        aria-label="사이드바 너비 조절"
        orientation="vertical"
        value={sidebarWidth}
        min={160}
        max={400}
        step={10}
        onValueChange={handleValueChange}
        onReset={() => handleValueChange(DEFAULT_WIDTH)}
      />
      <main style={{ flex: 1, padding: 16 }}>
        <strong>본문 영역</strong>
      </main>
    </div>
  );
}

/**
 * 2. Grid 2열 비율 조절 예제 (퍼센트 / 비율 단위)
 *
 * 픽셀 대 비율 변환 공식:
 * - 컨테이너 너비: containerRect.width
 * - 새 비율: (currentPx / containerWidth) * 100
 * ResizeHandle의 value는 임의의 숫자이므로 30~70% 비율 단위를 그대로 사용할 수 있습니다.
 */
export function GridSplit() {
  const [leftPercent, setLeftPercent] = React.useState(40);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `${leftPercent}% auto 1fr`,
        height: 200,
        border: "1px solid var(--dds-color-stroke-neutral-weak)",
        borderRadius: "var(--dds-radius-r2)",
        overflow: "hidden",
      }}
    >
      <section style={{ padding: 16, backgroundColor: "var(--dds-color-bg-neutral-weak)" }}>
        <strong>좌측 열</strong> ({leftPercent}%)
      </section>
      <ResizeHandle
        aria-label="열 비율 조절"
        orientation="vertical"
        value={leftPercent}
        min={20}
        max={80}
        step={5}
        onValueChange={setLeftPercent}
        onReset={() => setLeftPercent(40)}
      />
      <section style={{ padding: 16 }}>
        <strong>우측 열</strong> ({100 - leftPercent}%)
      </section>
    </div>
  );
}

/**
 * 3. onReset 초기화 예제 (더블클릭 또는 Enter/Space 키로 기본값 복원)
 */
export function ResetSplit() {
  const INITIAL_HEIGHT = 120;
  const [height, setHeight] = React.useState(INITIAL_HEIGHT);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        maxWidth: 400,
        border: "1px solid var(--dds-color-stroke-neutral-weak)",
        borderRadius: "var(--dds-radius-r2)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height,
          padding: 12,
          backgroundColor: "var(--dds-color-bg-neutral-weak)",
          userSelect: "none",
        }}
      >
        <strong>상단 위젯</strong> (높이: {height}px)
        <p style={{ margin: "4px 0 0", fontSize: 12, color: "var(--dds-color-fg-neutral-weak)" }}>
          손잡이를 더블클릭하거나 포커스 후 Space/Enter를 누르면 초기 높이(120px)로 돌아갑니다.
        </p>
      </div>
      <ResizeHandle
        aria-label="위젯 높이 조절"
        orientation="horizontal"
        value={height}
        min={80}
        max={250}
        step={10}
        onValueChange={setHeight}
        onReset={() => setHeight(INITIAL_HEIGHT)}
      />
      <div style={{ padding: 12 }}>
        <strong>하단 내용</strong>
      </div>
    </div>
  );
}
