# 조작 색 전환 확대와 Alert 진입 결정

- 날짜: 2026-10-31
- 근거: [조작 모션·오버레이 퇴장·아이콘 확장 결정](./2026-10-28-interaction-motion-and-icons.md)(§1 조작 색 전환은 `motion` prop 밖), [컴포넌트 모션 API 결정](./2026-09-13-component-motion-api.md)(§3 토큰, §6 reduced motion, §7 CSS 불변식)
- 계기: 47개 컴포넌트 전수 모션 조사(2026-10-31). 2026-10-28이 Button·Card·List에만 넣은 색 전환이 나머지 조작 표면에는 없었고, Switch는 노브가 미끄러지는 동안 트랙 색만 즉시 바뀌고 있었다.
- 상태: 활성 · 2026-10-28 §1의 적용 범위를 넓힌다

## 1. 색 전환을 받는 표면

| 컴포넌트 | 전환 속성 | 왜 |
| --- | --- | --- |
| `Switch` 트랙 | `background-color` | 노브 이동(150ms)과 같은 길이. 트랙만 즉시 바뀌면 한 컨트롤 안에서 두 레이어가 따로 논다 |
| `Checkbox` 박스 | `background-color` · `border-color` | 체크 아이콘은 뜨는데 박스 색만 뚝 바뀌던 불일치 |
| `FilterChip` | `background-color` · `box-shadow` · `color` | 켜짐은 셋이 함께 바뀐다(테두리는 inset 그림자) |
| `Chip` 제거 버튼 | `background-color` · `color` | hover 원이 칠해지는 순간 |
| `Tabs.Trigger` | `background-color` · `color` | 밑줄은 이미 움직이는데 비활성 탭 글자·배경만 즉시였다 |
| `Breadcrumb.Link` | `color` | |
| 달력 날짜 | `background-color` · `color` | 날짜 위를 훑을 때 |
| `FileInput` Dropzone·Trigger | `background-color` · `border-color` | 끌어온 파일이 영역에 들어오고 나가는 순간 |

값은 모두 기존 토큰 `--dds-duration-fast`·`--dds-easing-out`. 새 토큰은 만들지 않았다.

전부 `motion` prop 밖이다(2026-10-28 §1). 위치·크기 변화가 아니라 **reduce에서도 그대로 남는다** — Switch 노브 이동만 전처럼 빠진다.

Checkbox는 아이콘과 박스의 규칙이 다르다: 아이콘은 `motion`과 포인터 조작일 때만 움직이고(2026-09-13 §5), 박스 색은 입력 방식과 무관하게 흐른다. 색은 조작 피드백이지 "무엇으로 눌렀는지"의 문제가 아니다.

### Tabs에 `border-color`를 넣지 않은 이유

활성 밑줄은 `Tabs.List`의 이동 표시(WAAPI)가 맡는다. Trigger의 `border-bottom-color`까지 전환하면 표시가 미끄러지는 동안 fallback 밑줄이 유령처럼 남는다. 밑줄은 지금처럼 즉시 바뀐다.

### 이미 전환을 갖고 있던 것

`DatePicker`·`Pagination` 트리거는 `Button`이라 2026-10-28의 색 전환을 그대로 받는다. `ToggleGroup`·`List`·`Card`·`TextField`·`Select`도 자기 전환이 이미 있다.

## 2. Alert 진입 — `@starting-style`

새로 붙은 Alert는 `opacity 0` + 4px 위에서 내려온다(fast). 흐름 안 요소라 presence 배선 없이 CSS만으로 되고, 퇴장은 소비자가 거둬 가므로 없다. reduce에서는 이동만 빼고 페이드는 남긴다(모션 API 결정 §6).

`@starting-style` + `transition`은 Baseline newly available(Chrome 117 · Safari 17.4 · Firefox 129)이고, 미지원 브라우저에서는 지금처럼 즉시 나타난다.

## 3. 일부러 넣지 않은 것

- **메뉴·옵션 항목 hover**(DropdownMenu·ContextMenu·Select·MultiSelect) — 키보드 roving으로 하루 수백 번 지나간다. 전환은 지연으로 읽힌다.
- **Table·DataTable 행 hover** — 읽고 있는 데이터는 움직이지 않는다.
- **Slider 트랙 채움** — 입력에 즉시 따라붙어야 한다.
- **`interpolate-size: allow-keywords`로 높이 전환** — Chromium 전용(2026-10 기준 Firefox·Safari 미지원).
- **`@starting-style`로 `use-presence` 대체** — 퇴장은 여전히 JS가 필요하다. 진입만 CSS로 바꾸면 배선이 두 갈래가 된다.
- **애니메이션 라이브러리(motion.dev 등) 도입** — 2026-09-13 §3 유지. 이번 건 전부 CSS로 끝났고, 토큰 변수를 그대로 쓰는 쪽이 중첩 테마 스코프와 reduce를 공짜로 따른다.
- **Toast 세로 재배치(FLIP)·Sheet 드래그 해제·StatePanel 교차 페이드** — 컴포넌트 안 presence·포인터 배선을 고쳐야 해서 이 배치에서는 빠졌다. 앞의 둘은 [끌어서 닫기·Toast 재배치 결정](./2026-10-31-gesture-dismiss.md)에서 구현했고, StatePanel은 본문이 소비 앱 코드라 넣지 않기로 했다(같은 문서 §6).

## 4. 검증과 VR

- `apps/visual-regression/tests/color-transition-motion.spec.ts` — 전환 속성·길이를 reduce를 켠 채로 재고(색은 reduce에서도 남아야 한다), 새로 붙인 Alert가 페이드·이동하는지와 reduce에서 이동만 빠지는지를 본다. 계산된 `transition`은 jsdom이 못 보므로 유닛 테스트로는 덮을 수 없다.
- VR 정적 기준은 바뀌지 않는다 — 최종 색이 그대로고, 스크린샷은 `animations: "disabled"`로 찍는다. 색 텍스트 스냅샷은 `opacity`를 보지 않는다.
- 단, 색 텍스트 스냅샷은 **전환이 끝날 때까지 기다린 뒤** 읽어야 한다(`stories.spec.ts`). 상태가 두 번째 렌더에 붙는 매트릭스 셀(Checkbox checked·FileInput Field invalid)은 그냥 읽으면 전환 도중 색이 잡혀 매번 값이 달라진다. `animations: "disabled"`는 `toHaveScreenshot` 안에서만 걸리고 `getComputedStyle`에는 영향이 없다. 전환만 기다린다 — Spinner처럼 무한한 애니메이션은 끝나지 않는다.
