# DDS 토큰 체계와 a11y 기준선

- 날짜: 2026-08-14
- 경로: architectural
- 상태: 결정됨
- 스펙: [docs/specs/archive/2026-08-14-dds-token-system.md](../specs/archive/2026-08-14-dds-token-system.md)
- 선행 결정: [DDS 아키텍처](../specs/archive/2026-08-14-dds-architecture.md)

## 배경

아키텍처 스펙에서 "TS 단일 소스(primitive→semantic) → 코드젠 → tokens.css"까지는 확정됐지만, semantic 토큰의 **이름 문법**과 **어디까지 값을 채울지**는 비어 있었다. 토큰 이름은 npm publish 후 변경하면 breaking change이므로 첫 커밋 전에 정해야 한다. 함께 a11y 기준선(대비 검증, focus/disabled 관습)도 결정했다 — CSS에 박히는 것이라 나중에 바꾸면 시각적 변경이 된다.

## 검토한 선택지

### 1. semantic 토큰을 어디까지 채우나

| 선택지 | 장점 | 단점 | 판정 |
|--------|------|------|------|
| A′. 축 목록은 seed에서 복사해 확정, 값은 Button 필요분만 | 케이스 커버리지는 전체 채우기와 동일(축이 같으므로), 코드량은 최소. 이름 추가는 non-breaking | 컴포넌트 추가 시마다 토큰 값 추가 커밋 발생 | **채택** |
| B. 3축 격자(role × intent × emphasis) 전부 채움 | 컴포넌트 추가 시 토큰을 안 건드림 | 탈락 — seed 실물이 격자가 아니다. `fg-brand-solid`, `stroke-brand-solid-pressed`는 seed에 존재하지 않는다. 격자로 채우면 실재하지 않는 조합 이름을 발명하게 되고, 잘못된 문법이 공개 API로 굳는다 | 탈락 |
| C. 값부터 먼저, 문법은 나중에 정리 | 착수가 빠름 | 탈락 — 문법이 공개 API라 publish 후 정리는 breaking | 탈락 |

조사 근거 (seed `packages/css/vars/color/`):

```
bg     : intent × {solid, weak} + pressed 상태 + 특수(disabled, layer-*, neutral-inverted, neutral-solid-muted)
fg     : intent + contrast 변형 + 특수(disabled, placeholder, neutral-muted, neutral-subtle)
         emphasis 축 없음, state 없음
stroke : intent × {solid, weak} + 특수(focus-ring, neutral-contrast, neutral-muted, neutral-subtle)
         state 없음
```

role마다 축이 다르다. 이 비대칭 자체가 수년간 실제 컴포넌트로 다듬어진 결과이므로 그대로 채택한다.

### 2. hover 축

| 선택지 | 장점 | 단점 | 판정 |
|--------|------|------|------|
| hover 축 정식 추가 (`-hover` / `-pressed` 2단계) | 데스크톱에서 마우스 오버와 클릭이 구분됨 | 상호작용 배경 토큰이 상태당 2개로 늘어남 | **채택** |
| seed 그대로 — `-pressed` 하나를 hover 셀렉터에서도 재사용 | 코드 최소, seed와 100% 동일 | 탈락 — 데스크톱에서 hover와 pressed 색이 같아 클릭 피드백이 사라진다 | 탈락 |
| `color-mix()`로 파생 | 토큰 추가 없음 | 탈락 — 라이트는 어둡게, 다크는 밝게 섞어야 해서 모드마다 반대 공식이 필요하고, 토큰이 단일 진실 소스라는 계약이 깨진다 | 탈락 |
| hover 없이 시작, 나중에 추가 | 0.1.0이 더 작음 | 탈락 — Button은 hover를 실제로 갖는 컴포넌트다. 값 1~2개는 추측이 아니라 실수요 | 탈락 |

조사 근거: seed recipes에 `:hover` 셀렉터가 158회 존재하지만, 그 블록이 참조하는 토큰은 전부 `-pressed`다 (`bg-transparent-pressed` 52회, `bg-neutral-weak-pressed` 20회, `bg-brand-solid-pressed` 10회). seed는 모바일 우선이라 두 상태의 구분을 의도적으로 포기했다. DDS는 개인 웹 프로젝트용이라 이 전제가 다르다.

### 3. 대비 검증

| 선택지 | 장점 | 단점 | 판정 |
|--------|------|------|------|
| `generate.ts`에 대비 검사 내장 | 의존성 0(~20줄), 라이트/다크 양쪽 커버, 컴포넌트 테스트 프레임워크 없이 값 실수를 잡는 유일한 자동 검증 | 검사할 쌍을 명시적으로 선언해야 함 | **채택** |
| Storybook에서 눈으로 확인 | 코드 없음 | 탈락 — 다크모드 값을 눈으로 판정하게 되고, 토큰 추가 때마다 재확인 필요 | 탈락 |
| 대비 검사 + Storybook a11y(axe) 애드온 | DOM 레벨까지 커버 | 탈락 — 애드온 의존성 대비, Button 1개에서 axe가 추가로 잡는 것이 거의 없다 | 탈락 |

## 결정

**토큰 축은 seed에서 그대로 복사하되 hover 축을 추가하고, 값은 Button이 실제로 쓰는 것만 채운다. 대비 검증은 코드젠 스크립트에 내장한다.**

결정적 이유: 비싼 것은 값이 아니라 이름 문법이다. 축이 고정되면 값 추가는 언제 해도 non-breaking이므로, 지금 검증할 수 없는 색 20개를 추측으로 고를 이유가 없다.

## 정해진 것

- **토큰 문법**: `--dds-color-{role}-{intent}-{emphasis}[-{state}]`, role별로 축이 다름 (bg는 emphasis+state, fg는 contrast 변형만, stroke는 emphasis만)
- **hover 축 추가**: 상호작용 배경은 `-hover` / `-pressed` 2단계. seed와 의도적으로 갈라지는 유일한 지점
- **값 범위**: 0.1.0은 Button 필요분만, 각각 light/dark 쌍. 값 없는 예약 이름은 CSS에 방출하지 않음 (스펙에서 intent 2개 × variant 3개로 확정되며 semantic 22개로 구체화됨)
- **대비 검사**: `generate.ts`가 선언된 fg/bg 쌍의 WCAG 대비를 light/dark 각각 계산, 미달이면 생성 실패. 4.5:1 단일 기준(size별 폰트 분기는 실익 없음), disabled 쌍은 면제(WCAG 1.4.3이 비활성 컨트롤을 제외)
- **focus 관습**: `:focus-visible` 사용 (seed에서 196회 대 `:focus` 40회)
- **disabled 셀렉터**: `:is(:disabled, [disabled], [data-disabled])` 3중 매칭 (seed 370회 관습)
- **작업 순서**: 워크스페이스 뼈대 → tokens → react(Button) → storybook → 소비 검증 → publish. 의존 관계상 사실상 강제됨

## 안 정해진 것

- **팔레트 실제 색상값**: brand 계열 hue, 중성색 스케일 단계 수. 값을 고르는 문제라 문법 결정과 독립. 스펙 단계에서 확정
- **disabled의 React 구현**: native `disabled` 속성인지 `aria-disabled`인지. CSS 3중 셀렉터가 양쪽을 다 매칭하므로 나중에 바꿔도 CSS를 안 고친다. 접근성 요구가 구체화될 때 결정
- **CI**: 혼자 쓰는 저장소이고 publish 전에는 로컬 실행으로 충분. 외부 기여나 자동 publish가 생기면 도입
- **컴포넌트 테스트 프레임워크**: 대비 검사와 Storybook이 현재 역할을 대체. 로직 있는 컴포넌트(Select, Dialog)가 등장하면 도입
- **시각 회귀 테스트**: 컴포넌트가 5개 이상이 되면 재검토
- **Storybook 버전과 애드온 구성**: 스펙 단계
- **spacing / radius / typography 토큰의 축**: 이번 결정은 color에 한정. Button에 필요한 최소분만 쓰고, 체계화는 두 번째 컴포넌트에서

## 뒤집을 조건

- **hover 축**: DDS 소비 프로젝트가 전부 모바일 웹으로 굳으면 hover 값은 pressed와 동일하게 두고 사실상 죽은 축이 된다. 그때 축을 유지할지 정리할지 재검토
- **대비 검사**: 검사 통과를 위해 디자인 의도와 다른 색을 억지로 고르게 되는 일이 반복되면, 강제 실패에서 경고로 낮춘다
- **값 범위 A′**: 컴포넌트를 추가할 때마다 토큰 커밋이 따라붙는 것이 실제 고통이 되면, 그때 남은 축을 한 번에 채운다 (문법이 같으므로 non-breaking)
