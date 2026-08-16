---
"@dg-design/react": minor
---

TextArea 자동 확장·RadioGroup 방향·Badge outline 테두리 variant 추가입니다.

**TextArea 자동 높이 제어:**
- 컴포넌트: `<TextArea>` — `<textarea>` 전용, TextField 동형 외관·상태
- 크기: size `medium`/`large` 지원
- 상태: hover·focus·invalid·disabled·readonly 5종 (TextField 패턴 동일)
- autoResize prop: `boolean`, 기본 `false`
  - `false`: 네이티브 `rows` + `resize: vertical` (사용자 수동 조정)
  - `true`: CSS `field-sizing: content` 구현으로 입력 높이에 따라 자동 확장 (Firefox 폴백: scrollHeight 동기화)
- Field 연동: label·describedby·invalid 자동 (TextField 동일)
- CSS: text-field.css 토큰값 완전 재사용
- 새 토큰: 0개

**RadioGroup 화합물 & 방향:**
- 구조: `RadioGroup.Root` 상태·context → `RadioGroup.Item` 라벨 래핑 (Checkbox 동형)
- 네이티브: `input[type=radio]` + 공유 `name` 속성
- Props (`Root`):
  - `value`: 선택값 (제어형)
  - `defaultValue`: 기본값 (비제어형)
  - `onValueChange`: 값 변경 콜백
  - `name`: form 제출용 name 속성
  - `orientation`: `vertical`(기본) / `horizontal` — 화살표 키 네비게이션 축 제어 (세로면 ↑↓, 가로면 ←→)
- 화살표 roving: Checkbox의 roving-focus 재사용, orientation 축 지원 확장 (기존 상하→좌우 추가)
- 네이티브 라디오 기본 동작 우선 — roving과 이중 처리 회피 (`preventDefault` 조정)
- 시각: Checkbox 박스의 원형 라디오닷 (checked = bg-brand-solid 계열)
- disabled·focus-visible: Checkbox 관습 동일 (3중 매칭)
- Controlled/uncontrolled: useControllableState
- 새 토큰: 0개

**Badge outline variant:**
- 기존: `solid` / `weak` (2종 × intent 6 = 12조합)
- 신규: `outline` (배경 투명, 테두리·글자 `fg-{intent}`)
- 토큰: 기존 `fg-{intent}` 재사용 (새 토큰 0개)
- 대비: `fg-{intent} on bg-layer-default` 4.5:1 WCAG AA 검사로 자동 커버 (비텍스트 3:1 기준 충족)
- 기존 24조합 무회귀 (solid·weak 변경 없음)
- Storybook: 매트릭스 스토리에 outline 열 추가 (variant 3 × intent 6 = 18조합)
- VR: 기준 이미지 visual-baseline 워크플로 갱신 (로컬 `-u` 금지)

**CSS & 구현:**
- TextArea: `packages/react/src/text-area/`
  - text-area.css (@layer dds, `.dds-text-area--*` 클래스)
  - use-auto-resize.ts (field-sizing vs scrollHeight 판단 로직)
  - TextArea.tsx (컴포넌트 껍데기)
- RadioGroup: `packages/react/src/radio-group/`
  - radio-group.css (@layer dds, `.dds-radio-group--*` 클래스)
  - roving-focus 재사용 (packages/react/src/internal/roving-focus.ts, orientation 축 지원 확장)
  - RadioGroup.tsx (Root·Item compound)
- Badge: `packages/react/src/badge/badge.css` 수정 (outline variant 스타일 추가)

**테스트 및 VR:**
- vitest:
  - TextArea: autoResize toggle, Field 연동(label·describedby·invalid), disabled·readonly, 상태 5종 × size 2
  - RadioGroup: 선택·화살표 이동(orientation별 축 정확성)·disabled 건너뜀·name 공유·controlled/uncontrolled, roving 포커스 기본
  - Badge: outline variant 렌더 + intent 6종 대비 검사, 기존 solid·weak 24조합 무회귀
  - 기존 74건 무회귀 보증
- Playwright 기능:
  - RadioGroup: 화살표 이동 1~2케이스 (orientation별)
  - 스토리 부재 시 스킵 가드
- VR: StateMatrixStory 관습 (TextArea·RadioGroup·Badge 각 매트릭스 스토리, 자동 편입)

**주의:**
- TextArea `rows` prop: 구현 판단 (기본값 3 또는 사용자 명시)
- RadioGroup roving과 네이티브 화살표 이중 처리: preventDefault 위치 정확히 (두 칸씩 이동 버그 회피)
- Badge 기준 이미지: outline 추가 시 diff 발생 예상 → CI에서 기존 solid·weak 먼저 픽셀 확인 후 갱신
- tokens.css 신규 토큰 불필요 — TextArea·RadioGroup·Badge 모두 기존 토큰 재사용
