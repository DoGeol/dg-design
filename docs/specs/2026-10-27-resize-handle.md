# ResizeHandle 스펙 — 분할 패널 크기 조절 손잡이

## 메타

- 생성: 2026-10-27
- 유형: 브라운필드 · leaf 컴포넌트와 선택형 훅, 새 공개 하위 경로
- 상태: **승인 (2026-10-27)** — 열린 질문은 기본안으로 결정
- 대상: `@dg-design/react/resize-handle`; 새 의존성 없음.
- 근거: [구성 규칙](../decisions/2026-09-05-component-composition-rules.md), [flex 방향](../decisions/2026-10-09-flex-adoption-direction.md), [P4](2026-10-09-p4-new-kinds.md).
- 외부 근거: dg-studio `design-a/docs/reports/2026-10-27-design-audit.md` §3, 같은 워크트리 `docs/plans/2026-10-27-design-audit-updates.md` §1·§5.
- 아래 앱 경로는 직접 읽은 `/Users/pdg/WebstormProjects/dg-studio/src/` 기준이다.

## 목표

분할 화면·사이드바의 너비와 높이를 포인터 드래그와 키보드로 조절하는 조작 손잡이를 제공한다.
W3C ARIA의 `role="separator"` 명세, 키보드 단위 증감, 더블클릭 초기화를 표준화한다.
패널 레이아웃 계산(Grid fr/rem)과 지속 저장(localStorage)은 컴포넌트가 소유하지 않고 소비자가 다룬다.

## 구성요소와 소비처

| 구성요소 | 형태·독립 기능 | 코드로 확인한 소비처 / 처리 |
| --- | --- | --- |
| ResizeHandle | leaf · 블로그 편집 화면 패널 분할 | `features/homeground-blog-editor/use-editor-split.ts:9`, `editor-screen.tsx:588`의 `<hr {...split.props} className="hg-editor-separator" />` — 본문/정보 패널(30~70fr) 조절 |
| ResizeHandle | leaf · 이력서 편집 화면 좌우 패널 분할 | `features/homeground-resume-editor/use-resume-panel-resize.ts:24`, `resume-editor.tsx:710,738`의 `<hr className="resume-panel-separator" ... />` — 위젯 목록(12~32rem)·인스펙터(18~40rem) 조절 |
| useResizeHandle | 선택형 훅 · 저수준 분할 배선 | 기존 `src/shared/ui/use-resizable-split.ts`의 포인터 캡처·키보드·ARIA 로직을 훅으로도 공개해 커스텀 요소 바인딩 지원 |
| 초기화 콜백 | 인터랙션 기능 | 더블클릭 및 보조 키보드 입력 시 `onReset`을 호출해 CSS 기본값 또는 초기 비율로 복원 |

블로그 편집기와 이력서 편집기라는 두 독립 기능으로 구성 규칙 근거를 충족한다.
패널 폭 저장은 브라우저 설정이며 문서 저장과 무관하므로 스토리지 접근을 DDS 안에 강제하지 않는다.
`<hr>` 태그를 임의로 조립하던 기존 방식 대신 의미론과 포인터 캡처가 완비된 컴포넌트로 전환한다.

## API

```tsx
import { useState } from "react";
import { ResizeHandle } from "@dg-design/react/resize-handle";

export function SplitPanels() {
  const [leftWidth, setLeftWidth] = useState(300);

  return (
    <div style={{ display: "flex", width: "100%" }}>
      <aside style={{ width: leftWidth }}>사이드바</aside>
      <ResizeHandle
        aria-label="사이드바 너비 조절"
        orientation="vertical"
        value={leftWidth}
        min={200}
        max={600}
        step={10}
        onValueChange={setLeftWidth}
        onReset={() => setLeftWidth(300)}
      />
      <main style={{ flex: 1 }}>본문</main>
    </div>
  );
}
```

```tsx
import { useResizeHandle } from "@dg-design/react/resize-handle";

export function CustomSeparator() {
  const { handleProps } = useResizeHandle({
    orientation: "vertical",
    value: 50,
    min: 30,
    max: 70,
    step: 5,
    onValueChange: (val) => console.log(val),
    onReset: () => console.log("reset"),
    "aria-label": "패널 분할 비율",
  });
  return <div {...handleProps} className="my-custom-handle" />;
}
```

| prop | 기본안 |
| --- | --- |
| `aria-label` / `aria-labelledby` | 둘 중 하나 필수; 구분선 조절 용도 설명 |
| `orientation` | `"vertical" \| "horizontal"`, 기본 `"vertical"` |
| `value` | `number`, 필수 제어값 |
| `min` | `number`, 필수 하한 |
| `max` | `number`, 필수 상한 |
| `step` | `number`, 기본 1 (키보드 1회 이동량) |
| `fromDrag` | `(startValue: number, deltaPixels: number) => number \| null`, 선택. 값 단위로 변환 후 min/max를 적용한다. null은 해당 이동을 무시한다. 생략하면 기존처럼 px를 더한다 |
| `onValueChange` | `(value: number) => void`, 필수 변경 콜백 |
| `onReset` | `() => void`, 선택; 더블클릭 또는 리셋 키 시 호출 |
| `disabled` | `boolean`, 기본 false |
| HTML 속성 | div ref·className·style 전달, role·tabIndex·aria-value는 내부가 소유 |

- `orientation="vertical"`은 좌우를 가르는 세로 손잡이(가로 드래그), `"horizontal"`은 상하를 가르는 가로 손잡이(세로 드래그)다.
- 컴포넌트는 `div` 요소를 기본 렌더하며 `role="separator"`를 부여한다.
- `useResizeHandle` 훅을 함께 export하여 직접 DOM이나 기존 훅을 연결하려는 소비처에 동일한 접근성·포인터 계약을 제공한다.
- 네이티브 태그를 `<hr>`로 고정하지 않는다. W3C 권고에 따라 대화형 separator로 div를 기본화한다.
- 비활성(`disabled`) 시 초점을 잃고 pointer-events가 차단되며 aria-disabled가 부여된다.

## 드래그·초기화·연동 계약

- **포인터 캡처:** `onPointerDown` 시 주 버튼(button === 0)만 감지하고 `setPointerCapture(event.pointerId)`를 실행한다.
- **초점 이동:** 드래그 시작 시 손잡이로 포커스를 옮겨 키보드 연속 조작으로 자연스럽게 이어지게 한다.
- **이동량 계산:** 포인터의 시작 좌표와 현재 좌표의 델타(`clientX` 또는 `clientY`)를 누적하여 새 값을 계산한다.
- **실시간 피드백:** 드래그가 일어나는 동안 `aria-valuenow` 속성을 실시간으로 갱신하며 `onValueChange`를 즉시 호출한다.
- **클릭과 더블클릭 분리:** 드래그 델타가 0인 단순 클릭은 값을 변경하지 않는다. 이로써 `onDoubleClick` 리셋이 안정적으로 작동한다.
- **캡처 해제:** `onPointerUp` 또는 `onPointerCancel` 시 `releasePointerCapture`를 호출하고 드래그 상태를 정리한다.
- **취소 복구:** `onPointerCancel`이 발생하면 드래그 직전의 확정 값으로 복구한다.
- **단위 무관성:** `value`는 px·rem·fr·% 등 특정 단위에 구애받지 않는 숫자다. `fromDrag` 훅 옵션/prop으로 픽셀을 소비자 단위로 환산한 뒤 제한한다(2026-10-27 합동 개선).
- **저장 분리:** localStorage 키나 직렬화 로직은 컴포넌트가 알지 못한다. 저장은 `onValueChange`나 `onReset`을 듣는 소비자가 수행한다.

## 상태 축·키보드·접근성

| 상태/입력 | 계약 |
| --- | --- |
| default | 시각 4px 바, bg-stroke-neutral-weak, 투명 조작 여백 확보 |
| hover | bg-fg-brand 하이라이트, cursor col-resize 또는 row-resize |
| focus-visible | 비입력 2px stroke-focus-ring, bg-fg-brand 하이라이트 |
| dragging | bg-fg-brand 유지, 전역 cursor 일치 및 텍스트 선택 방지(`user-select: none`) |
| disabled | opacity 축소, pointer-events: none, tabIndex=-1, cursor not-allowed |
| ArrowLeft / ArrowDown | orientation 축에 따라 -step 변경 (min 하한 제한) |
| ArrowRight / ArrowUp | orientation 축에 따라 +step 변경 (max 상한 제한) |
| Home / End | min 하한 / max 상한으로 즉시 이동 |
| Enter / Space | `onReset`이 정의되어 있으면 기본값 복원 호출 |
| DoubleClick | `onReset`이 정의되어 있으면 기본값 복원 호출 |

- ARIA 명세: `role="separator"`, `aria-orientation`, `aria-valuenow={Math.round(value)}`, `aria-valuemin={min}`, `aria-valuemax={max}`.
- 접근 이름은 `aria-label` 또는 `aria-labelledby`로 필수로 전달받아 낭독기가 "사이드바 너비 조절, 구분선, 50" 형태로 읽게 한다.
- 값 변경 시 별도의 live region을 띄우지 않는다. separator의 aria-valuenow 변경 자체가 낭독기 값 변경 알림을 소유한다.
- 터치 제스처 충돌을 방지하기 위해 `touch-action: none`을 기본 스타일로 선언한다.

## 토큰·모바일 밀도

| 역할 | 기본안 |
| --- | --- |
| 시각 선 두께 | `--dds-dimension-x1` (4px), 가로/세로 축에 맞춤 |
| 시각 선 모서리 | `--dds-radius-r1` (2px) |
| 기본 선 색상 | `--dds-color-stroke-neutral-weak` |
| 활성/호버 색상 | `--dds-color-fg-brand` |
| 포커스 링 | `--dds-dimension-x0_5` (2px) `--dds-color-stroke-focus-ring` |
| 터치 조작 영역 | `--dds-size-touch-target`, 모바일에서 최소 44px 확보 |

- 신규 토큰은 추가하지 않는다. 기존 dimension·radius·color semantic 토큰을 재사용한다.
- 시각적인 구분선은 4px로 슬림하게 유지하되, `::before` 가상 요소로 히트 영역을 12px(데스크톱) 및 44px(모바일)로 확장한다.
- 44px 히트 영역 확장은 인접 패널 내용의 클릭을 방해하지 않도록 중앙 정렬되며, 필요한 경우 z-index를 조정한다.
- 모바일에서 화면 폭이 협소할 때 분할을 접는 반응형 동작은 상위 레이아웃(소비자)이 결정하며 손잡이는 hidden 처리된다.
- CSS는 `@layer dds`; 라이트·다크 테마에서 semantic 색상이 자동으로 전환된다.

## 테스트·합격 조건

- [ ] user-event 키보드 화살표 입력 시 orientation에 맞게 step 단위로 값이 증감한다.
- [ ] user-event Home 및 End 키 입력 시 각각 min 하한과 max 상한으로 즉시 변경된다.
- [ ] pointerdown → pointermove → pointerup 인터랙션에서 델타 이동량에 따라 정확히 값이 변경된다.
- [ ] 이동이 없는 단순 클릭에서는 값이 변경되지 않으며, 더블클릭 시 onReset이 정확히 호출된다.
- [ ] Enter 또는 Space 키 입력 시 onReset 콜백이 호출된다.
- [ ] separator role, aria-valuenow, aria-valuemin, aria-valuemax, aria-orientation 속성이 올바르게 렌더된다.
- [ ] disabled prop 전달 시 탭 정지점에서 제외되고 키보드/포인터 이벤트가 무시된다.
- [ ] `ResizeHandle--state-matrix`: horizontal·vertical × default·hover·focus-visible·dragging·disabled.
- [ ] 라이트·다크 테마 및 모바일 뷰포트에서 터치 조작 영역 44px와 touch-action: none을 확인한다.
- [ ] VR 기준 png 및 색 txt는 CI visual-baseline 워크플로에서만 생성한다.

## skill-src·배포

- `packages/react/skill-src/resize-handle.tsx`: Flex 좌우 분할, Grid 2열 비율 조절, onReset 초기화의 세 가지 예제.
- 예제에 픽셀/비율 변환 공식과 localStorage 연동 패턴을 주석으로 명시한다.
- 하위 경로 import(`@dg-design/react/resize-handle`), build:skill 생성물, check:skill·타입·스모크를 함께 제공한다.
- changeset: `"@dg-design/react": minor`; 신규 토큰이 없으므로 tokens changeset은 발행하지 않는다.
- B1a 이후 구현하며 barrel 등록은 코디네이터가 담당한다.
- 구현 게이트: generate → build → check:subpaths·check:skill → test → typecheck → publint → CI VR.
- 이 초안은 코드 변경이나 서버 실행 없이 문서만 작성한다.

## 하지 않을 것

- 패널 컨테이너 묶음(Panel, PanelGroup) 컴포넌트나 Grid/Flex 레이아웃 엔진 내장.
- 브라우저 스토리지(localStorage) 자동 읽기·쓰기·동기화 로직.
- 패널 접기/펼치기 토글 버튼이나 서랍형 애니메이션 내장.
- 3개 이상의 패널을 다중 제어하는 복합 매니저 컴포넌트 제공.
- dg-studio의 use-resizable-split.ts 즉각 제거 및 앱 전환 (트랙 C4에서 별도 진행).

## 열린 질문

| 사용자 결정이 필요한 항목 | 기본안·영향 |
| --- | --- |
| 컴포넌트와 저수준 훅 병행 제공 | `ResizeHandle` 컴포넌트와 `useResizeHandle` 훅을 모두 export. 기존 훅 기반 소비처 전환이 쉬워짐 |
| 시각 선 두께 기본값 | 4px 바(`dimension-x1`). 1px 실선보다 호버/포커스 인지가 명확하며 조작 직관성을 높임 |
| 키보드 리셋 단축키 | Enter / Space 키 시 onReset 호출 허용. 키보드만 쓰는 사용자도 초기화 가능 |
| orientation 용어 정의 | vertical = 수직선(가로 방향 조절). W3C ARIA 구분선 명세를 충실히 따름 |

`role="separator"` 명세 준수, 더블클릭 초기화, 모바일 44px 히트 영역, 스토리지 분리는 요청 범위를 유지한다.
