# 부유 패널 테두리 (2026-10-06)

> 상태: 활성. [Dialog 구현 중 결정](2026-08-15-dialog-implementation.md)의 "shadow-overlay는 항상 오버레이 위에서만 쓰여 배경 명암 무관"을 대체한다.
> 계획과 실측: [다크 모드 부유 패널 경계 복구 계획](../plans/2026-10-06-dark-overlay-boundary.md)

## 결정

부유 패널의 경계는 그림자가 아니라 `stroke-neutral-weak` 테두리 1px가 맡는다. `shadow-overlay`는 그대로 두고 라이트에서 깊이감만 더한다.

- 대상: Dialog, Popover, HoverCard, DropdownMenu(ContextMenu 공유), Select 목록(MultiSelect 공유). DatePicker 팝오버는 Popover 클래스를 물려받는다.
- Sheet는 화면 안쪽 변 하나에만 긋는다. 화면 가장자리에 붙는 변에 선을 남기지 않기 위해서다.
- Tooltip은 반전 배경이라, Toast는 intent weak 배경이 다크에서도 채워진 면으로 보여 제외한다.

## 근거

- `shadow-overlay`는 모드 분기 없는 어두운 알파 그림자라 다크 배경에서 보이지 않는다.
- "항상 백드롭 위에서만 쓰인다"는 전제가 틀렸다. Popover·메뉴·Select 목록·HoverCard에는 백드롭이 없다.
- 다크에서는 `bg-layer-default`와 페이지 배경이 같은 gray-1000이고, `bg-overlay`(gray-1000/0.5)를 그 위에 합성해도 같은 색이다. 백드롭이 있는 Dialog·Sheet도 패널과 주변이 구분되지 않았다.

## 검토하고 고르지 않은 안

- 다크에서만 보이는 새 stroke 토큰: 라이트 픽셀은 그대로지만 공개 토큰이 늘어난다.
- `bg-layer-floating`(다크에서 한 단계 밝은 표면): 대비 검사 행이 배경마다 늘고, gray-900을 쓰면 `bg-neutral-weak` 버튼이 패널에 묻힌다. 필요해지면 따로 결정한다.

## 구현 메모

- 다크 테두리(`#3a3e3e`)는 패널 위에서 1.74:1이다. 패널 경계는 조작 대상이 아니라 WCAG 1.4.11의 3:1 대상이 아니므로 대비 검사 행을 추가하지 않았다. Card가 같은 값을 쓴다.
- 화살표는 패널 padding box 기준으로 놓인다. 테두리가 생기면 중심이 바깥 테두리선보다 안쪽에 와서 화살표 변 끝이 패널 안으로 삐져나온다. `internal/use-overlay-position.ts`가 `floating.clientTop`(테두리 폭)만큼 더 내보낸다.
- VR 스크린샷은 1px 선이 `maxDiffPixelRatio` 0.005 안에 들어가 통과할 수 있다. 테두리 유무는 `overlay-boundary.spec.ts`가 계산값으로 확인한다.
