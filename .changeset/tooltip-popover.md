---
"@dg-design/react": minor
---

Tooltip·Popover 경량 오버레이 2종 추가입니다.

**Tooltip — 자동 지연·hover/focus 트리거:**
- 구조: `Tooltip.Provider`(지연 그룹 스코프) + `Tooltip.Root` + `Tooltip.Trigger`(asChild) + `Tooltip.Content`(+arrow)
- Provider 그룹 스킵: openDelay 기본값 위임, 그룹 내 하나가 열려 있으면 인접 트리거 이동 시 지연 생략
- 트리거: hover(mouseenter/leave) + focus(탭 포커스 포함, `:focus` 기반)
- 닫힘: blur·ESC·스크롤에서 닫힘
- 접근성: `role="tooltip"` + 트리거에 `aria-describedby` 자동 연결
- 색: `bg-neutral-solid` + `fg-neutral-contrast` 재사용 (새 토큰 0개)
- 비인터랙티브: 툴팁 안 포커스 가능 요소 금지 (문서화)
- arrow: floating-ui 미들웨어 기본 활성, 회전 사각형·flip 시 위치 자동
- 애니메이션: duration-fast·easing-out, reduced-motion 대응
- 스택: ESC 라우팅 미등록, 자체 ESC 처리

**Popover — 자유 콘텐츠 비모달:**
- 구조: `Popover.Root` + `Popover.Trigger`(asChild, 클릭 토글) + `Popover.Content`(+arrow) + `Popover.Close`
- use-overlay 재사용: 비모달 스택 등록(ESC 라우팅)·외부 클릭 닫힘·presence·floating·단일 열림
- autoFocus prop: 기본 `true`, true면 열릴 때 Content 포커스 + 닫힐 때 트리거 복귀(Dialog 관례)
- 닫힘 prop: closeOnEscape·closeOnOutsideClick (이름 위임)
- 패널: bg-layer-default + shadow-overlay + radius (DropdownMenu 계열), role 기본 미지정(위임)
- arrow: floating-ui 미들웨어 prop(기본값 위임), 회전 사각형·flip 시 위치 자동
- 애니메이션: duration-fast·easing-out, reduced-motion 대응

**공통:**
- 새 토큰: 0개 (기존 재사용)
- 파일 구조:
  - Tooltip: `packages/react/src/tooltip/` (tooltip.css, use-delay.ts, Tooltip.tsx + Provider)
  - Popover: `packages/react/src/popover/` (popover.css, Popover.tsx)
  - 공유: `packages/react/src/internal/use-overlay.ts` (상태·presence·portal·floating·단일열림·비모달 스택·바깥클릭·복귀)

**테스트 및 VR:**
- vitest:
  - Tooltip: 지연 타이머(fake timers)·Provider 그룹 스킵·describedby·focus(탭 포커스)·blur·ESC·스크롤
  - Popover: autoFocus 양쪽(true/false)·클릭 토글·외부 클릭·ESC·단일 열림
  - hover 이벤트는 jsdom 한계(mouseenter 디스패치)
  - 기존 101건 무회귀 보증
- Playwright 기능:
  - Tooltip: 실 hover 열림/이탈 닫힘(지연 포함), focus 열림
  - Popover: 클릭 토글·외부 클릭, ESC
- VR:
  - 신규 스토리는 기준 없음 → 스킵 → visual-baseline 워크플로 경유
  - 스토리 id: `tooltip--functional-demo`, `popover--functional-demo`
  - arrow 포함 라이트·다크 매트릭스
  - 기존 기준 무영향
- Storybook: 두 컴포넌트 데모 + StateMatrixStory

**주의:**
- Tooltip Provider 밖 사용 시 단독 지연으로 동작(에러 금지)
- 탭 포커스 열림 채택으로 터치에서 "버튼 액션 + 툴팁 동시 발생" — 트레이드오프 수용, 문서화 필요
- hover 지연 테스트 CI 타이밍: Playwright 로케이터 대기 + 넉넉한 지연 마진
