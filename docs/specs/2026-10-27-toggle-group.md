# ToggleGroup 스펙 — 보기 옵션 토글 묶음

## 메타

- 생성: 2026-10-27
- 유형: 브라운필드 · 새 compound와 공개 하위 경로
- 상태: **승인 (2026-10-27)** — 열린 질문은 기본안으로 결정
- 대상: `@dg-design/react/toggle-group`; 새 의존성 없음.
- 근거: [구성 규칙](../decisions/2026-09-05-component-composition-rules.md), [flex 방향](../decisions/2026-10-09-flex-adoption-direction.md), [P4](2026-10-09-p4-new-kinds.md).
- 선택 표시 근거: [B 새 종류 §Chip](../reports/flex-adoption-review/skill-free-comparison/design-application/new-kinds.md) — 켜짐은 배경색만으로 표현하지 않는다.
- 외부 근거: dg-studio `design-a/docs/reports/2026-10-27-design-audit.md` §3, 같은 워크트리 `docs/plans/2026-10-27-design-audit-updates.md` §1·§5.
- 아래 앱 경로는 직접 읽은 `/Users/pdg/WebstormProjects/dg-studio/src/` 기준이다.

## 목표

편집 화면의 보기 옵션을 하나 또는 여러 개 고를 때 상태·키보드·선택 표시를 통일한다.
패널 생명주기나 폼 제출 값은 소유하지 않는다. 이를 필요로 하는 화면은 Tabs·RadioGroup을 쓴다.
복수 선택이라는 별도 기능 때문에 새 compound를 제안하며 SegmentedControl 별칭은 만들지 않는다.

## 구성요소와 소비처

| 구성요소 | 형태·독립 기능 | 코드로 확인한 소비처 / 경계 |
| --- | --- | --- |
| Root·Item | compound + context · 블로그 보조 영역 | `features/homeground-blog-editor/editor-screen.tsx:497`의 fieldset와 aria-pressed 버튼 3개 |
| Root·Item | compound + context · 이력서 미리보기 폭 | `features/homeground-resume-editor/resume-editor.tsx:712`의 preset별 버튼 묶음 |
| 단일 토글 검토 | 이력서 배율 맞춤 | `features/homeground-resume-editor/resume-sequential-preview.tsx:229`은 버튼 하나라 독립 그룹 소비처로 세지 않음 |
| multiple 모드 | 신규 기능 요구 | 위 두 앱 기능에서 실제 복수 선택은 확인되지 않음; 이번 요청의 API 범위로만 추가 |
| 선택 마크 | Item 내부 장식 | 켜진 항목마다 체크. 배경·굵기만으로 선택을 구분하지 않음 |

블로그 `side`와 `focused`는 별도 상태다. 집중 해제 시 이전 side 복원은 앱의 어댑터가 책임진다.
이력서의 확대/축소·100% 버튼은 실행 명령이므로 Item으로 바꾸지 않는다.

## Tabs·RadioGroup과 구분

| 목적 | 사용할 API | 이유 |
| --- | --- | --- |
| 하나의 패널만 표시하며 tab ↔ tabpanel을 연결 | Tabs | Content의 id·hidden·포커스 계약 필요 |
| 폼의 배타적 값 선택·제출·필수값 | RadioGroup, 필요 시 segmented | 기존 구성 규칙의 6단계 유지 |
| 화면 도구의 선택 상태·여러 보기 옵션 | ToggleGroup | 패널/폼 없이 상태 공유와 키보드 묶음 제공 |
| 독립 토글 하나 | Button aria-pressed 또는 FilterChip | 불필요한 그룹을 만들지 않음 |

single이 radio 의미를 갖는다고 RadioGroup을 일괄 교체하지 않는다.
블로그 narrow 화면의 기존 Tabs는 그대로 두고 desktop 보조 제어만 전환 후보로 삼는다.

## API

```tsx
import { ToggleGroup } from "@dg-design/react/toggle-group";

export function ViewOptions() {
  return (
    <>
      <ToggleGroup.Root type="single" defaultValue="wide" aria-label="미리보기 너비">
        <ToggleGroup.Item value="narrow">좁게</ToggleGroup.Item>
        <ToggleGroup.Item value="wide">넓게</ToggleGroup.Item>
      </ToggleGroup.Root>
      <ToggleGroup.Root type="multiple" defaultValue={["guides"]} aria-label="표시 옵션">
        <ToggleGroup.Item value="guides">안내선</ToggleGroup.Item>
        <ToggleGroup.Item value="labels">이름</ToggleGroup.Item>
      </ToggleGroup.Root>
    </>
  );
}
```

| Root prop | 기본안 |
| --- | --- |
| `type` | 필수 `"single" \| "multiple"` 판별자 |
| single `value/defaultValue` | `string \| null`; null은 선택 없음, 기본 null |
| single `onValueChange` | `(value: string \| null) => void` |
| multiple `value/defaultValue` | `readonly string[]`; 기본 빈 배열 |
| multiple `onValueChange` | `(value: string[]) => void`; 중복 없이 Item DOM 순서 |
| `disallowEmptySelection` | single 기본 true, multiple 기본 false; 사용자 조작에만 적용 |
| `size` | `small \| medium \| large`, 기본 medium |
| `orientation` | `horizontal \| vertical`, 기본 horizontal |
| `disabled` | 그룹 전체 비활성, 기본 false |
| 접근 이름 | `aria-label` 또는 `aria-labelledby` 필수 |

- Item: `value: string`, `disabled?`, children, 버튼 속성, button ref.
- Root: div ref·HTML 속성. Item의 역할·선택 ARIA·type·tabIndex는 내부가 소유한다.
- children 안 링크·입력·중첩 버튼은 금지한다. 아이콘만 있으면 Item에 aria-label을 준다.
- `value` prop 존재 여부로 제어형을 구분한다. 제어형은 부모 값이 갱신돼야 표시가 바뀐다.
- disallowEmptySelection은 초기/외부 null을 자동으로 첫 항목으로 바꾸지 않는다.
- 비활성 항목의 이미 선택된 값은 유지한다. 사용자 조작만 막는다.
- 중복 Item value는 개발 경고, 알 수 없는 외부 값은 선택 표시하지 않는다.
- 객체 `ToggleGroup.Root/Item`과 named `ToggleGroupRoot/ToggleGroupItem`을 모두 export한다.
- `asChild`, 폼용 name/required, Panel, 별도 Indicator 슬롯은 첫 버전에 넣지 않는다.

## React Aria 사용 여부 — 확인 결과

- **채택 기본안:** `react-aria`의 `useToggleButtonGroup`·`useToggleButtonGroupItem`, `react-stately`의 `useToggleGroupState`.
- `packages/react/package.json`에 react-aria 3.52.1, react-stately 3.50.0이 이미 직접 의존성으로 있다.
- 로컬 `react-aria/dist/types/exports/useToggleButtonGroup.d.ts`에서 두 훅 export를 확인했다.
- 로컬 `dist/private/button/useToggleButtonGroup.js`는 single에 radiogroup/radio·aria-checked를 반환한다.
- multiple은 useToolbar의 toolbar(상위 toolbar 안에서는 group)와 button·aria-pressed를 반환한다.
- 같은 설치본 useToolbar는 방향키 초점 이동·Tab 그룹 이탈을 처리하며 방향키로 선택하지 않는다.
- Home/End는 설치본에 없으므로 DDS에서 활성 Item의 첫/끝 이동을 보완한다.
- 공개 `value`는 훅의 selectedKeys로 변환한다. 의존성의 Set/Key 타입은 공개하지 않는다.
- 계약이 확인된 공식 문서: [React Aria useToggleButtonGroup](https://react-aria.adobe.com/ToggleButtonGroup/useToggleButtonGroup.html).
- 훅이 radio 역할을 반환한다는 사실을 감추려고 role만 button으로 덮어쓰지 않는다.

## 상태 축·키보드·접근성

| 상태/입력 | 계약 |
| --- | --- |
| default | 투명 배경, fg-neutral, 선택 마크 공간 예약 |
| hover / pressed | bg-transparent-hover / pressed, disabled 제외 |
| selected | 체크 + bg-brand-weak·fg-brand, selected+hover는 brand-weak-hover |
| focus-visible | 비입력 2px stroke-focus-ring, 선택 체크와 동시에 보임 |
| disabled | native disabled + aria-disabled + data-disabled, hover·선택 변경 차단 |
| Tab / Shift+Tab | 그룹 진입과 이탈; 상위 toolbar 안에서는 상위 탐색 체계와 조합 |
| 방향키 | 해당 orientation의 이전/다음 enabled Item으로 초점만 이동, 끝에서는 멈춤 |
| Home / End | 첫/마지막 enabled Item으로 초점 이동 |
| Space / Enter / click | 현재 Item 선택·해제; 값 변경당 콜백 한 번 |

- single: Root radiogroup, Item radio·aria-checked. multiple: toolbar/group, Item button·aria-pressed.
- 가로 RTL은 React Aria locale 방향을 따른다. DOM dir만 바꾸는 예제 대신 locale 환경도 맞춘다.
- 첫 진입은 훅의 포커스 규칙을 따르고 재진입은 마지막 초점을 복원한다.
- 선택 변경 알림용 live region은 추가하지 않는다. radio/pressed 상태가 변경을 알린다.
- 그룹이 비었거나 전부 disabled이면 탭 정지점이 없다.
- Group 방향키를 상위 toolbar와 중복 처리하지 않는 시나리오를 별도 검증한다.
- 선택 체크는 색 외 단서로 항상 보인다. 마크 공간을 예약해 선택 전후 폭이 바뀌지 않는다.

## 토큰·모바일 밀도

| 역할 | 기본안 |
| --- | --- |
| Item 시각 높이 | small 32(`dimension-x8`), medium 40(`x10`), large 48(`x12`) |
| 글자 | small t3, medium t4, large t5; 기존 font-size/line-height 쌍 |
| 좌우 여백·마크 간격 | dimension-x3 / x1_5 |
| 반경 | `--dds-radius-button` |
| 마크 | `--dds-size-mark`; B1a 뒤에는 CheckIcon 사용 |
| 조작 영역 | `--dds-size-touch-target`, 모바일에서 최소 44 |

- 신규 토큰 없이 기존 semantic·dimension·역할 토큰으로 시작한다.
- 모바일 밀도에서 small은 medium 40으로 올리고 투명 영역을 44로 확장한다.
- 항목 사이 최소 간격 4를 확보해 40→44 확장이 겹치지 않게 한다.
- 가로 그룹은 줄바꿈을 허용하지 않는다. 폭이 부족하면 그룹 안 가로 스크롤을 제공한다.
- 포커스 Item은 보이는 범위로 스크롤하며 페이지 전체의 가로 넘침은 만들지 않는다.
- 앱이 375px에서 Select로 바꾸는 것은 앱 결정이다. DDS가 viewport를 보고 의미를 바꾸지 않는다.
- dg-studio는 밀도 속성을 도입하지 않기로 했으므로 앱의 화면별 44px 확장을 유지한다.
- CSS는 `@layer dds`; disabled 3중 매칭, 라이트·다크 semantic만 참조한다.

## 테스트·합격 조건

- [ ] user-event로 single 다른 항목 선택·재선택, disallowEmptySelection true/false를 검증한다.
- [ ] multiple 추가·제거·DOM 순서 반환, 제어형/비제어형, disabled 조합을 검증한다.
- [ ] 방향키 초점 이동은 값 콜백을 부르지 않고 Space/Enter는 한 번만 부른다.
- [ ] Home/End·RTL·세로·Tab 이탈·상위 toolbar 안의 탐색을 검증한다.
- [ ] 외부 null/빈 배열 갱신, 선택 항목 삭제, 전부 disabled 때의 초점을 검증한다.
- [ ] role/aria-checked/aria-pressed, 그룹 이름, 아이콘 전용 Item 이름을 검사한다.
- [ ] `ToggleGroup--state-matrix`: single·multiple × 크기 × selected·hover·focus·disabled.
- [ ] 매트릭스에 라이트·다크·모바일·긴 문구·가로/세로를 포함한다.
- [ ] Playwright로 375px 가로 넘침·focus 스크롤·44px 히트 영역 비중첩을 확인한다.
- [ ] VR 기준 png·색 txt는 CI visual-baseline에서만 생성한다.

## skill-src·배포

- `packages/react/skill-src/toggle-group.tsx`: 단일 보기 폭·복수 표시 옵션·제어형 예제.
- Tabs/RadioGroup 선택 표, single의 radio 의미, 방향키 후 Space 선택을 사용 가이드에 적는다.
- 예제는 하위 경로 import로 작성하고 build:skill·check:skill·타입·vitest 스모크에 포함한다.
- changeset: `"@dg-design/react": minor`; 토큰 추가가 없으면 tokens changeset 없음.
- B1a 이전 구현은 선택 마크 연결 지점을 남기고 병합 게이트 전 CheckIcon으로 통일한다.
- 구현 게이트: generate → build → check:subpaths·check:skill → test → typecheck → publint → CI VR.
- barrel 등록은 코디네이터가 담당한다. 이 초안에서는 코드·테스트를 실행하지 않는다.

## 하지 않을 것

- Tabs·RadioGroup 리팩터링, radio 의미를 숨기는 role 덮어쓰기, SegmentedControl 별칭.
- 폼 제출·유효성 검사, 옵션 검색·가상화·중첩 그룹, 선택 표식 이동 애니메이션.
- 앱의 focused/side 상태 복원, 미리보기 zoom 상태, 사용 중인 Tabs 대체.
- dg-studio 수정·배포; 실제 전환은 C2에서 별도 검증한다.

## 열린 질문

| 사용자 결정이 필요한 항목 | 기본안·영향 |
| --- | --- |
| single 의미·빈 선택 | 훅 그대로 radio, 기본 해제 금지. 기존 aria-pressed 소비처에는 의미 변경이 있음 |
| multiple 소비처 부재 | 요청 범위대로 제공하되 중립 예제 검증, 실제 앱 사용으로 검증됐다고 주장하지 않음 |
| 크기 단계 | 32/40/48, 모바일 small은 40+44 조작 영역. Button과 완전히 같은 치수는 아님 |
| 좁은 폭 처리 | 한 줄 가로 스크롤. 앱이 Select 전환을 원하면 C2에서 화면별 결정 |

구성 규칙의 단순 segmented=RadioGroup 결정은 유지한다. 이 스펙은 별도 토글 기능의 추가 승인안이다.
