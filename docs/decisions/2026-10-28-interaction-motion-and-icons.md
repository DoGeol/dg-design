# 조작 피드백 모션·오버레이 퇴장·아이콘 확장 결정

- 날짜: 2026-10-28
- 근거: [컴포넌트 모션 API 결정](./2026-09-13-component-motion-api.md)(§3 토큰, §6 reduced motion, §7 CSS 불변식), [Dialog 구현 중 결정](./2026-08-15-dialog-implementation.md)(presence computed 길이), [Icon 스펙](../specs/2026-10-27-icon.md), [컴포넌트 구성 규칙](./2026-09-05-component-composition-rules.md)
- 계기: dg-studio 프런트엔드 조사(2026-10-28). 버튼·카드·목록 행에 hover/press 전환이 없고, 오버레이 퇴장이 입장과 같은 길이이며, reduce에서 오버레이가 즉시 사라지고, 소비 앱이 아이콘 몇 개를 직접 그리고 있었다.
- 상태: 활성 · 모션 API 결정 §6의 오버레이 부분을 개정

## 1. 조작 색 전환은 `motion` prop 밖에 둔다

Button의 배경·테두리·글자 색 전환과 누름 축소는 **항상** 켠다. `motion` prop은 2026-09-13 결정대로 "로딩 라벨 ↔ Spinner 교차"만 끈다.

- `motion`을 CSS 게이트(`[data-motion]`)로 쓰면 asChild 경로(Slot, `data-motion` 없음)의 링크 버튼만 hover 전환이 빠진다. 같은 모양의 두 버튼이 다르게 반응하면 안 된다.
- 색 전환은 위치·크기 변화가 아니라 reduce에서도 남긴다(§6 원칙: 움직임만 뺀다).
- 값은 기존 토큰 `--dds-duration-fast`·`--dds-easing-out`. 새 토큰(easing-in 등)은 만들지 않았다.

## 2. 누름은 `:active`에만, 개별 `scale` 속성으로

- `scale: 0.98`을 `:active`에만 건다. `[data-pressed]`(상태 매트릭스용 강제 상태)에는 걸지 않아 정적 VR 기준이 그대로다 — 누름 축소는 정적 상태가 아니라 손맛이다.
- `transform` 대신 개별 `scale` 속성이라 소비자가 버튼에 `transform`을 줘도 겹치지 않는다.
- disabled·loading은 축소하지 않는다(눌러도 아무 일이 없는데 반응하면 거짓 피드백).
- Button의 Spinner 내림은 자식 레이어의 `transitionend`에서만 한다. 버튼 자신의 색 전환 종료가 버블링해 Spinner를 한 프레임 일찍 내리지 않게 `event.target !== event.currentTarget`로 거른다.

Card(링크·버튼으로 쓴 경우)는 hover에서 실제로 바뀌는 `border-color`를, List는 Action을 가진 행과 묶음 제목 토글의 `background-color`를 같은 값으로 전환한다. 정적 행·`data-current`만 있는 행은 전환하지 않는다.

## 3. 퇴장은 fast, 입장은 base

Dialog·Sheet·Toast(Overlay 포함)의 `[data-state="closed"]`에 `animation-duration: var(--dds-duration-fast)`를 준다. 닫기는 사용자가 이미 결정한 동작이라 기다리게 하지 않는다. easing은 easing-in 토큰이 없어 easing-out 그대로 둔다(새 토큰 금지). Popover 계열은 원래 입장·퇴장 모두 fast라 바꾸지 않았다.

`use-presence`는 계산된 `animation-duration`을 읽어 대기하므로 코드 변경 없이 짧아진 길이를 따른다.

## 4. reduced motion — 오버레이는 `animation: none`이 아니라 opacity 페이드 (§6 개정)

이전에는 Dialog·Sheet·Toast가 reduce에서 `animation: none`이라 열리고 닫힘이 순간 전환이었다. 이것은 모션 API 결정 §6("위치·확대만 빼고 opacity는 150ms 유지")과 어긋난다. 이제:

- 입장·퇴장 모두 공용 `dds-overlay-fade-in`/`-out`(overlay-motion.css), 길이 fast.
- Dialog 중앙 정렬 `transform`은 base 규칙에 있어 fade keyframes만으로 제자리다.
- Sheet는 side별 규칙보다 구체적이어야 해서 `:is(.dds-sheet--side_*)`로 덮는다. 높이 단계 전이(`transition: height`)는 크기 변화라 reduce에서 계속 끈다.
- Toast.tsx가 overlay-motion.css를 import한다(전에는 쓰지 않아 없었다).
- Popover·Tooltip·HoverCard·DropdownMenu(·ContextMenu)·Select도 같은 방식이다 — reduce에서 `dds-overlay-pop-*`(확대) 대신 `dds-overlay-fade-*`. 길이는 원래 fast라 그대로다. 2026-09-13 계획은 그 배치의 범위로 "일괄 수정하지 않는다"를 골랐을 뿐이고, 상시 규칙은 §6이다.
- presence는 reduce에서도 페이드 길이만큼 기다린 뒤 언마운트한다. 길이 0(즉시 언마운트)은 이제 CSS 미로드뿐이다.
- 곁들여, ContextMenu.tsx가 overlay-motion.css를 import하지 않아 ContextMenu만 쓰는 앱에서는 keyframes가 없었다(애니메이션 이름만 있고 animationend가 오지 않아 presence가 길이+100ms 타이머로 정리). import를 추가했다.

## 5. 아이콘 — Alert 상태 글리프를 공개 세트로, 16종 추가

- Alert가 파일 안에 그리던 상태 4종을 `InfoIcon`·`PositiveIcon`·`WarningIcon`·`CriticalIcon`으로 공개했다. 이름은 DDS intent 어휘(informative는 관용대로 Info)를 따른다. brand(반짝임)·neutral(말풍선)은 상태가 아니라 Alert 안 비공개 글리프로 남겼다.
- 20 grid·선 1.5를 24 grid로 ×1.2 옮겼다. 선은 아이콘 세트 공통(`--dds-stroke-icon-width`, 24 grid에서 2)이라 20px에서 약 1.67px로 **조금 굵어졌다** — Icon 스펙의 B1b가 이미 받아들인 차이다. 공개 `IconProps`는 strokeWidth를 막아 두어 1.5를 유지하려면 세트 밖 예외가 필요했고, 세트 일관성을 택했다.
- 새 아이콘 12종은 자체 좌표로 그렸다(외부 세트 경로 복사 없음). MoreIcon은 DragHandle처럼 채운 점이다.
- Alert의 14px 닫기 X는 Icon 스펙대로 별도 계획(Toast/Alert 닫기)에 남긴다.

## 6. DropdownMenu.ItemIcon — 서브컴포넌트로

메뉴 항목 앞 아이콘은 prop(`icon`)이 아니라 `DropdownMenu.ItemIcon` 서브컴포넌트다. 기존 `Shortcut`이 같은 방식(항목 안 자유 배치 span)이고, 구성 규칙 2(사용처마다 구조가 다름)에 맞는다.

- `aria-hidden="true"` 고정 — 항목 이름은 글자가 맡는다.
- 16×16 자리이고 안의 `svg`를 100%로 맞춰, 소비자가 아이콘 size를 무엇으로 주든 체크·라디오 표식 열(16)과 글자 시작선이 같다.
- ContextMenu는 같은 CSS 클래스를 쓰므로 `DropdownMenuItemIcon`을 ContextMenu.Item 안에 그대로 써도 된다. 대칭 `ContextMenu.ItemIcon`은 요구가 생기면 추가한다.

## 7. 검증과 VR

- 단위: Button transitionend 거름, ItemIcon 접근성, 아이콘 32종 장식/label 계약.
- 브라우저(`apps/visual-regression/tests`): Button 누름 0.98·reduce 시 none, 퇴장 길이 fast·입장 base, reduce에서 오버레이 8종이 fade keyframes를 쓰고 Dialog가 페이드 뒤 언마운트, ItemIcon 안 아이콘이 실제 16px로 그려짐.
- VR 기준 갱신 대상(CI `visual-baseline`만, light·dark 각 PNG·TXT): `alert--state-matrix`(선 굵기, 색 txt에 `dds-icon` 추가), `compact-sizes--state-matrix`(neutral Alert 한 개), `icon--state-matrix`(행 추가). 버튼·카드·목록·오버레이의 정적 상태는 그대로다.
