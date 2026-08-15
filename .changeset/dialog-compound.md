---
@dg-design/react: minor
---

Dialog 화합물 컴포넌트와 자체 구현 오버레이 시스템입니다.

**Dialog 화합물 컴포넌트 7종:**
- 구조: `<Dialog.Root>` 상태·context 래퍼 → `Dialog.Trigger` 열기 버튼 → `Dialog.Overlay` 배경 → `Dialog.Content` 다이얼로그 박스 → `Dialog.Title` aria-labelledby 연결 → `Dialog.Description` aria-describedby 연결 → `Dialog.Close` 닫기 버튼
- Barrel export: `Dialog` 하나만 공개 (`Dialog.Root`, `Dialog.Trigger`, 등)
- 상태 모드: `open`+`onOpenChange` 제어형, `defaultOpen` 비제어형 겸용 (useControllableState 훅)
- 포커스 관리: 열림 시 Content 기본 포커스(tabIndex=-1), `initialFocusRef` prop으로 오버라이드 가능. 닫힘 시 열기 전 요소로 복귀
- Dismissal: ESC 키 닫힘(기본), `closeOnEscapeKeyDown` prop으로 끄기 가능. 오버레이 클릭 닫힘(기본), `closeOnBackdropClick` prop으로 끄기 가능
- 중첩 스택: 싱글턴 모듈 레벨 스택으로 관리. ESC 또는 Overlay 클릭은 최상단 다이얼로그만 닫음. 스크롤 잠금은 refcount(첫 열림 시 잠금, 마지막 닫힘 시 해제)
- Focus trap: 배경 inert 속성. 열림 시 스택상 이전 다이얼로그들에 `inert` 부여, 닫힘 시 복원. Tab 순환 코드 없음
- Portal: React.createPortal로 body 직속 렌더

**애니메이션:**
- 열림/닫힘 모두 애니메이션 재생: fade(opacity) + scale(transform) 조합
- CSS 애니메이션만 사용(Web Animations API 미사용)
- 퇴장 애니메이션: animationend/transitionend 이벤트 대기 → unmount, 안전 타임아웃 폴백(500ms)
- `prefers-reduced-motion: reduce` 감지 시 애니메이션 제거, 즉시 표시/숨김

**Accessibility:**
- Content: `role="dialog"` `aria-modal="true"` 자동 부여
- Title/Description: 렌더된 것만 자동 id 생성 및 Content의 `aria-labelledby`/`aria-describedby` 연결
- aria-describedby: Field 패턴처럼 Set으로 관리(실제 마운트된 것만 포함)

**CSS & 토큰:**
- `@layer dds` · `.dds-dialog--root` 클래스
- Overlay: `bg-overlay` 토큰 사용
- Content: `shadow-overlay` + `bg-layer-default` 토큰 사용
- 애니메이션: duration은 `duration-fast`(열림) · `duration-base`(닫힘), easing은 `ease-out-cubic`

**react-dom peer 전환:**
- `peerDependencies.react-dom`의 `optional: true` 제거 (Dialog의 createPortal 필수)
- peerDependenciesMeta 필드 자체는 유지되나 react-dom은 선택 사항 아님

**테스트 및 VR:**
- vitest: 스택 push/pop, ESC 라우팅, presence 타임아웃, controlled/uncontrolled 상태, aria 연결, inert 속성
- Playwright 기능 테스트: 열기→ESC→포커스 복귀, 중첩 ESC 최상단만, 오버레이 클릭, inert 실효
- VR: 열림 고정 스토리 추가 (라이트·다크, 동적 열거 자동 편입)

**구현 파일:**
- `packages/react/src/dialog/` — use-dialog.ts(헤드리스 훅), use-presence.ts(퇴장 presence), dialog-stack.ts(싱글턴 스택), Dialog.tsx(컴포넌트 껍데기)
- `packages/react/src/internal/merge-refs.ts` 재사용
- 기존 Field 패턴(compound, context, aria 연결) 참고·재사용
