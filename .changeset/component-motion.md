---
"@dg-design/react": minor
---

컴포넌트 모션 6종: `SaveStatus`·`Checkbox`·`RadioGroup.Root`·`Tabs.Root`·`Button`·`Avatar.Root`에 선택적 `motion?: "auto" | "none"` prop을 추가했다(기본값은 `auto`, **`Avatar.Root`만 `none`** — 목록에서 아바타가 한꺼번에 나타나지 않게). 기존 `--dds-duration-fast`(150ms)·`--dds-easing-out` 토큰만 쓰고 `opacity`/`transform`만 바꾼다. SaveStatus는 저장 완료 교차 페이드, Checkbox는 포인터로 누른 변경의 아이콘 전환, RadioGroup segmented 배경과 Tabs 활성 밑줄은 선택 항목으로 이동(FLIP), Button은 로딩 라벨↔중앙 Spinner 교차, Avatar는 네트워크로 새로 받은 이미지 페이드인이다. 선택 컨트롤은 포인터 조작만 움직이고 키보드·프로그램 변경·최초 렌더는 즉시 반영하며, `reduce`에서는 위치·확대 전환을 빼고 opacity만 남는다. 곁들여 Button은 로딩 중 폭이 변하지 않도록 Spinner를 흐름 밖으로 옮겼고, Checkbox와 Avatar는 숨긴 요소가 레이아웃에 남던 `[hidden]` 문제를 고쳤다(자세한 내용은 `docs/decisions/2026-09-13-component-motion-api.md`).
