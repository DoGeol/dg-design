# P6 폼 확장 스펙 — TextField·TextArea box·line 형태

## 메타

- 생성: 2026-10-09
- 유형: 브라운필드 · 공개 API 추가만(기본 outline 동작 불변)
- 상태: **승인(2026-10-09)** — 적용 범위는 모바일 밀도에서만, 범위 밖 두 가지는 빼기로 결정
- 근거: [구현 계획 P6](../plans/2026-10-09-flex-adoption.md) · [flex 적용 방향 "폼 입력 형태"](../decisions/2026-10-09-flex-adoption-direction.md) · [관점 보완 §1 대비표](../reports/flex-adoption-review/gaps.md) · [조합 API Field](../reports/flex-adoption-review/composition.md) · 시안 `apps/storybook/src/mockups/flex/overrides/forms.css`(`.fx-box`·`.fx-line`) · Storybook `Mockups/Flex/Forms/{TextField,TextArea,Field}`

## 소비처 (구성 규칙)

| 대상 | dg-studio(react 0.17.3) 실사용 | 판정 |
| --- | --- | --- |
| box | draft-chat 실험 화면 입력창 1곳(raw input, `bg-neutral-weak` + 1px 경계) | 1곳 |
| line | 없음(경계 없는 입력은 3곳 있지만 아래 경계도 없다) | 0곳 |
| 모바일 밀도 | `data-dds-density` 사용처 없음 | — |

구성 규칙(두 곳 이상)에 못 미친다. **사용자 결정(2026-10-09)으로 P4처럼 예외로 넣고 "초기 API"로 배포한다.**

## API

```tsx
<Field.Root>
  <Field.Label>제목</Field.Label>
  <TextField variant="box" defaultValue="컴포넌트 디자인 기록" />
</Field.Root>

<TextArea variant="line" rows={2} />
```

- `TextField`·`TextArea`에 `variant?: "outline" | "box" | "line"`, 기본 `"outline"`.
- 클래스 `dds-text-field--variant_{v}`·`dds-text-area--variant_{v}`. prefix/suffix가 있으면 wrapper에, `showCount`면 textarea에 붙는다(지금 size 클래스와 같은 자리).
- Field 연결(id·describedby·invalid)·autoResize·showCount·affix 계약은 그대로다.

## 외관

| 상태 | box | line |
| --- | --- | --- |
| 기본 | 표면 `bg-neutral-weak`, 경계 `stroke-neutral` 1px(WCAG 1.4.11 — 면 차이만으로는 1.09:1) | 아래 경계만 `stroke-neutral` 1px(5.03:1), 반경 0, 좌우 여백 0, 표면 투명 |
| hover | 경계 `fg-neutral`(outline과 같음) | 아래 경계 `fg-neutral` |
| focus | outline과 같음(경계 1px + 안쪽 1px 그림자) | 아래 경계 focus 색 + `inset 0 -1px 0 0` 그림자(아래만 2px) |
| 오류 | 경계 `stroke-critical`, focus 시 안쪽 그림자도 critical | 아래 경계 critical |
| 비활성 | outline과 같음(`bg-disabled`, 경계 weak) | 표면 투명, 아래 경계 weak, 글자 disabled |
| 읽기 전용 | outline 읽기 전용과 같음(`bg-neutral-weak` + 경계 weak) | 표면 투명, 아래 경계 weak |

- line TextArea는 `resize: none`(손잡이가 아래 경계를 가린다). 글자 수는 지금처럼 아래에 둔다.
- 높이·글자·반경(box)은 size 축과 역할 토큰을 그대로 따른다 — 모바일 밀도면 `field-height` 56·`radius-field` 14·`field-inset` 16.

## 적용 범위

- box·line은 **모바일 밀도(`[data-dds-density="mobile"]` 안)에서만 적용**되고, 그 밖에서는 outline으로 그린다. 방향 결정의 "데스크톱은 outline 하나"를 패키지가 지키고, 반응형 앱은 한 마크업으로 모바일만 box·line이 된다.

## 하지 않을 것

- 내부 라벨 box(`.fx-inbox` — 라벨이 상자 안 위에 오는 형태). Field 배치를 바꾸는 일이고 소비처가 없다.
- Select·MultiSelect 트리거 box. 계획 P6 행은 TextField·TextArea만이다.
- 시안 `forms.css`는 결정 당시 기록으로 둔다.

## 공통

- 테스트 먼저(vitest + user-event): variant 클래스(단독·affix wrapper·showCount), 기본 outline 클래스 불변, Field 연결 유지.
- Storybook: TextField·TextArea 상태 매트릭스에 모바일 밀도 box·line 행(기본·hover 없음·focus·오류·비활성·읽기 전용). 데스크톱 밀도에서 variant를 줘도 outline인 행.
- VR 기능 테스트: 모바일 box 경계 색이 `stroke-neutral`, line은 위·좌·우 경계 0, 데스크톱은 outline과 계산 스타일이 같음.
- changeset react minor. tokens 변화 없음.

## 결정 (2026-10-09)

1. box·line은 모바일 밀도에서만 적용한다. 데스크톱은 variant를 줘도 outline이다.
2. 내부 라벨 box, Select·MultiSelect 트리거 box는 이번에 넣지 않는다.

## 합격 조건

1. variant 없는 TextField·TextArea는 지금과 픽셀·동작이 같다(기존 테스트·VR 통과).
2. 모바일 밀도에서 box는 낮은 표면 + `stroke-neutral` 1px, line은 아래 경계만이다. 상태 표대로 바뀐다.
3. 데스크톱 밀도에서 variant를 줘도 outline과 같다.
4. Field 라벨·설명·오류 연결, affix, showCount, autoResize가 세 형태 모두에서 동작한다.
