# 컴포넌트 시안 브리프 (2026-10-02)

시안이 없는 DDS 컴포넌트 33종의 이미지 시안을 만들기 위한 공용 브리프다. 생성 이미지는
시각 방향 참고용이며 픽셀 스펙이 아니다. 구현 기준은 계속 `packages/tokens`의 토큰이다.

## 디자인 가이드 출처

- dg-studio `DESIGN.md` — 공통 규칙·표현 규칙
- dg-studio `docs/decisions/2026-09-09-brand-primary-blue.md` — 브랜드 프라이머리
- 스타일 참고 이미지: dg-studio `docs/design/2026-09-09-primary-blue/dg-design-light-v4.png`

## 고정 값 (이미지 생성기는 CSS 변수를 못 읽으므로 실값으로 쓴다)

| 역할 | 값 |
| --- | --- |
| 브랜드 프라이머리 (가이드) | `lab(54.17% 13.34 -74.68)` ≈ #2B7FFF. 실제 적용은 `createTheme({ brand: "#2B7FFF" })` 결과를 쓴다 — brand solid **#1550A9**(2026-10-02 결정, 흰 글자 대비 통과값) |
| 브랜드 약한 배경 | 연한 블루 ≈ #E8F1FF |
| 텍스트 기본 / 약함 / 비활성 | #242727 / #6B706F / #898D8D |
| 표면 / 약한 표면 / 비활성 표면 | #FFFFFF / #F1F6F6 / #E4E9E8 |
| 테두리 강 / 약 | #6B706F / #E4E9E8 |
| critical (fg·solid·stroke) | #731115 · #9B1C22 · #C7272D, 약한 배경 #FCF3F2 |
| positive · warning · informative | #196623 · #D4AB4F(어두운 글자) · #175891, 약한 배경 #E7FCE7 · #FCF4E5 · #F0F6FC |
| 오버레이 딤 | rgb(15 18 18 / 0.5) |
| 오버레이 그림자 | 0 12px 32px rgba(15,15,15,.18), 0 4px 8px rgba(15,15,15,.08) |
| radius | 4 · 6 · 8 · 12 · 16 · full. 카드 12, 인라인 박스 8 |
| 컨트롤 높이 | small 36 · medium 40 · large 52 (px) |
| 간격 | 4px 그리드 (4·8·12·16·20·24·32) |
| 타이포 | 산세리프. 11·12·13·14·16·18·20·22·24·26px, 굵기는 regular·bold 두 단계뿐 |

현재 코드 토큰의 브랜드는 teal(#196161)이다. 가이드의 블루는 아직 런타임 토큰에 적용되지
않았다. 시안은 **가이드의 블루**를 쓴다.

## 공통 규칙

- 입력류(TextField·TextArea·Select·MultiSelect·DatePicker 필드) focus는 바깥 링 없이 테두리로만 표시한다(2026-10-02 결정): 기본 1px #8A8C8F → hover 1px #545558 → focus 2px #1550A9, 오류는 같은 두께에 critical. 비입력 컨트롤(Button·Checkbox·Switch 등)은 기존 2px 링을 유지한다.
- 아이콘은 단일 stroke SVG 스타일. 이모지·텍스트 글리프(↑ ↓ ⋮ ›)를 아이콘으로 쓰지 않는다.
- 문구는 최소화한다. 라벨 자리는 회색 막대(placeholder bar)로 그려도 된다. 글자를 쓰면 짧은
  한국어 합쇼체이고, 말줄임표·과장 표현은 쓰지 않는다.
- 상태: 해당하면 default · hover · focus · disabled · error(critical)를 함께 보인다.
- 버튼 위계: 저장·확정 = 브랜드 solid, 취소·닫기 = neutral weak, 삭제 = critical.

## 시안 구성 — 한 장에 3안

컴포넌트마다 **이미지 1장(라이트 모드, 가로 3열)** 을 만든다. 각 열 상단에 `A`·`B`·`C`만
표기한다(다른 제목·홍보 문구 없음). 배경은 단색 연한 회색 또는 파스텔 블루.

| 안 | 방향 |
| --- | --- |
| A — 정돈 | 현재 구조(Linux VR 기준 스크린샷)를 유지하고 가이드 블루와 아래 일관성 보정만 적용 |
| B — 부드러움 | 소개 시안 v4 톤. 더 둥근 모서리(pill·16px), 넉넉한 여백, 연한 표면 대비 |
| C — 밀도 | 어드민·데이터 화면용. 작은 radius(4~6px), 촘촘한 간격, 선 중심 구분 |

## 비교 결과 — 시안이 보정해야 할 불일치

`packages/react/src/*/*.css`의 토큰 사용을 비교한 결과다.

| 항목 | 현재 | 시안 A의 기준 |
| --- | --- | --- |
| 오버레이 radius | Dialog 16 · Popover/HoverCard/DropdownMenu/Select 목록 8 · Tooltip 6 · Sheet 0 | 패널형(Dialog·Sheet 안쪽 모서리) 16, 부유형(Popover·HoverCard·Menu·Select 목록) 12, Tooltip 8 |
| 작은 요소 radius | 목록 항목(메뉴·옵션) 6, 칩 6, Tabs·Breadcrumb·Collapsible 포커스 4 | 유지(항목 6, 포커스 링 4) |
| 컨트롤 높이 | Button 36/40/52, TextField·Select 40/52, 목록 항목 32 | 유지. 입력류에는 small(36)이 없다 |
| 폼 radius | Button·TextField·TextArea·Select 트리거 8(large 12) | 유지 |
| 브랜드 색 | teal | 가이드 블루를 `createTheme`로 파생. solid 배경은 대비 검사(흰 글자 4.5:1)를 통과하는 #1550A9, 원색 #2B7FFF는 흰 글자 대비 3.7:1이라 solid에 못 쓴다 |

## HTML 시안 (2026-10-02)

이미지 시안은 방향 비교용으로만 쓰고, 개발 기준 시안은 실제 DDS 컴포넌트로 렌더한
Storybook `Mockups/A/*` 스토리다(`apps/storybook/src/mockups/`). 시안 테마와 보정 CSS는
`:root:has([data-mockup="a"])` 범위라 다른 스토리에 새지 않고, 시각 회귀 대상에서도 빠진다.
