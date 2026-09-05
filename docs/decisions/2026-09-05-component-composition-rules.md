# 2026-09-05 컴포넌트 구성 규칙 (leaf · compound · preset)

**상태: 활성.** 새 컴포넌트를 추가하거나 소비 앱(dg-studio 등)의 수제 UI를 DDS로 승격할 때, 어떤 형태로 만들지 판별하는 기준이다. 기존 컴포넌트에서 암묵적으로 따르던 관례(Alert는 leaf, Dialog·Field·Tabs·Avatar는 compound)를 명문화했다.

## 세 가지 형태

| 형태 | 정의 | 기존 예 |
|------|------|---------|
| **leaf** | 단일 컴포넌트. 내용은 prop으로 받고 내부 구조는 고정 | Button, Badge, Alert, Skeleton, Spinner, Progress |
| **compound** | `X.Root` + 서브컴포넌트(dot notation). 소비자가 구조를 조립하고 DDS는 컨텍스트·접근성·스타일만 책임 | Dialog, Field, Tabs, Avatar, Toast, Select |
| **preset** | compound를 특정 조합으로 미리 묶은 얇은 래퍼. 로직 없음, 구조가 어느 앱이든 같을 때만 | (신설) `StatePanel.Loading` |

## 판별 순서

위에서부터 처음 걸리는 것으로 결정한다.

1. **소비 앱의 문구·행동·도메인 데이터가 안에 들어가는가?** 들어가면 DDS에 그 조합을 넣지 않는다. 껍데기만 compound로 제공하고 조합은 앱이 한다. (예: ErrorState의 "기술 정보" details와 digest는 dg-studio 소유)
2. **사용처마다 내부 구조(자식 순서·유무·요소 종류)가 달라지는가?** 달라지면 compound. 서브컴포넌트는 소비자가 순서를 바꾸거나 빼도 접근성이 깨지지 않아야 한다.
3. **자식 사이에 공유 상태나 aria 연결이 필요한가?** (open, value, id 연결, roving focus) 필요하면 compound + context. 필요 없고 구조만 다르면 compound라도 context 없이 클래스만 붙인다.
4. **내용이 텍스트 몇 개와 콜백 하나로 끝나는가?** 그러면 leaf. prop 이름은 `title`·`description`·`onClose`처럼 기존 leaf와 맞춘다. children이 무시되는 leaf는 타입에서 `Omit<..., "children">`으로 차단한다 (NotificationBadge 선례).
5. **네이티브 요소 하나를 감싸는가?** (`input[type=range]`, `hr`) leaf. 네이티브 속성을 그대로 통과시키고 스타일만 얹는다. 라벨·값 표시가 필요하면 새 서브컴포넌트가 아니라 **Field compound와 조합**한다.
6. **기존 compound에 variant 하나로 표현되는가?** 새 컴포넌트를 만들지 않고 variant를 추가한다. (예: SegmentedControl → `RadioGroup variant="segmented"`)

## preset 허용 조건

셋 다 만족할 때만 만든다. 하나라도 어긋나면 소비자 조합으로 남긴다.

- 구조가 앱과 무관하게 동일하다 (Loading = Spinner + 문구, role=status).
- prop이 문구 1~2개 이하다.
- 같은 compound의 서브컴포넌트만으로 구현된다 (새 DOM·새 CSS 없음).

## compound 서브컴포넌트 이름 관례

- 컨테이너: `Root`. 트리거: `Trigger`. 텍스트: `Title`, `Description`. 행동 묶음: `Actions`. 닫기: `Close`. 자유 슬롯: `Footer` 또는 역할명.
- 서브컴포넌트는 전부 `forwardRef` + 해당 HTML 속성 확장. `asChild`는 트리거·닫기처럼 소비자가 요소를 바꿔 끼울 곳에만 둔다.
- Root의 `role`은 기본값을 두되 소비자가 덮어쓸 수 있게 한다 (StatePanel: status/alert 갈림).

## 이번 승격 후보에 적용

| 후보 | 판별 | 결과 |
|------|------|------|
| StatePanel | 1(문구·digest 앱 소유) → 2(Empty/Error 구조 다름) → 3(공유 상태 없음) | **compound, context 없음**: `Root/Icon/Title/Description/Actions/Footer` + preset `Loading` |
| Slider | 5 | **leaf**. label·값 표시는 `Field.Label`·소비자 조합 |
| SegmentedControl | 6 | **RadioGroup `variant="segmented"`**. 신규 컴포넌트 없음 |
| Tabs responsive | 6 | **Tabs.Root `responsive` prop**. 브레이크포인트 이상에서 List 숨김 + Content 전부 표시 |
| SaveStatus | 4 | **leaf**. `dirty`·children(문구)·aria-live |
| Alert + 버튼 | 1·4 경계 | leaf 유지, **`actions` slot prop 추가**. compound로 전환하지 않음 (dg-studio 배너 2곳이 description에 버튼을 끼워 넣는 우회를 제거) |
| MultiSelect creatable | 6 | 기존 compound에 `onCreate` 옵션 |

## 재고 트리거

- preset이 3개를 넘으면 preset 자체를 별도 패키지나 recipes로 분리할지 검토한다.
- 같은 leaf에 slot prop이 3개 이상 쌓이면 compound 전환을 검토한다 (Alert가 `actions` 다음에 `icon`·`footer`까지 요구받으면 그 시점).
