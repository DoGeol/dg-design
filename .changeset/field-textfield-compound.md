---
"@dg-design/react": minor
---

Field 화합물 컴포넌트와 TextField를 추가했습니다. Form 필드의 라벨·설명·에러 메시지를 선언형으로 연결하고, stroke 축의 첫 소비자(error 테두리)로 error 상태를 지원합니다.

**Field 화합물(복합) 컴포넌트:**
- 구조: `<Field.Root>` 래퍼 → context에서 id·invalid 전파
  - `Field.Label` — htmlFor 자동 연결
  - `Field.Description` — aria-describedby 연결, 보조 텍스트
  - `Field.ErrorMessage` — aria-describedby 연결, 에러 시 렌더. `fg-critical` 색상 적용, aria-live="polite" role="status"
- Barrel export: `Field` 하나만 공개, 내부 컴포넌트는 조합 전용
- 테스트: Label 클릭 시 TextField 포커스, aria-describedby 자동 구성, ErrorMessage 존재 시 aria-invalid 반영

**TextField 컴포넌트:**
- 한 줄 `<input>` 전용 — textarea/multiline 없음
- Field 통합: context 활용 시 id·invalid·describedby 자동 연결. **단독 사용도 동작** — useId로 자체 id 생성
- 상태 축: 5종
  - 기본 테두리 `stroke-neutral` + placeholder `fg-disabled` 계열
  - hover: 테두리 강조(스타일 위임)
  - focus: `:focus-visible` 표준 관행(outline)
  - invalid: `stroke-critical` 테두리(ErrorMessage 존재 시 자동)
  - disabled: `:is(:disabled,[disabled],[data-disabled])` 3중 매칭 + `bg-disabled`/`fg-disabled` 토큰, 테두리 무광
  - readonly: `bg-neutral-weak` 계열 배경 적용(입력 불가 시각 분리)
- size 축: medium(기본) · large — 폼 컨트롤 축 통일
- 미포함: prefix/suffix 슬롯, asChild, intent 축

**구현 세부:**
- CSS: `@layer dds` · `.dds-text-field--size_medium` 클래스 · CVA + 수기 CSS (Checkbox·Switch 관습 동형)
- 호버 스타일 구현 (스펙 위임 항목): border-color 강조 — neutral-700(light) / neutral-300(dark)
- focus 상태 구현 (스펙 위임 항목): `:focus-visible` outline 표준 관행 (테두리 전환은 미사용)
- readonly 구분 스타일 구현 (스펙 위임 항목): `bg-neutral-weak` 배경으로 시각적 비활성화 표시

**테스트:**
- Field 통합: Label 클릭 포커스, aria-describedby 포함성, ErrorMessage aria-invalid 연동
- TextField 단독: 자체 id 생성·유지, input 입력·변경 동작
- 기존 관습: user-event 사용(fireEvent 금지), vitest + jsdom
