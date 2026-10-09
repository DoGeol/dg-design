# flex 적용 방향 (2026-10-09)

> 상태: 활성 · **구현 전**. 이 결정은 다음 구현 스펙의 출발점이다. 코드와 토큰은 아직 바꾸지 않았다.
> 근거: [A·B 이중검토 종합](../reports/flex-adoption-review/review/synthesis.md) · [B 치수 명세](../reports/flex-adoption-review/skill-free-comparison/design-application/README.md) · [A·B 공통 관점 보완](../reports/flex-adoption-review/gaps.md) · Storybook `Mockups/Flex`

## 결정

| 항목 | 결정 |
| --- | --- |
| 출발점 | **A 기본 + B 사용례 흡수.** A의 외부 라벨 outline 입력과 역할 토큰 연결을 기본으로 둔다. B가 먼저 설계한 List·SectionHeader, Chip(제거·필터·툴박스), PropertyField, Sheet 단계 전환(간단·상세·전체), 설정 행을 새 종류와 조합으로 더한다 |
| 컨트롤 모서리 | **B: 입력 4 · 버튼 6** (데스크톱 medium 기준). flex 원본 측정(DS024 7.5·11.5 raster ÷1.75)에 가장 가까운 단계다. 모바일은 두 안이 같은 입력 14~16 · 버튼 12 범위에서 구현 스펙이 정한다 |
| 폼 입력 형태 | **outline 기본 + 모바일 확장.** 기본은 외부 라벨 outline이다. 모바일 상세 화면에 한해 box(경계 1px 포함)·속성 행·line을 추가 형태로 허용한다. 데스크톱은 outline 하나 |
| 브랜드 정본 | **createTheme #1550A9.** `createTheme({ brand: "#2B7FFF" })` 결과로, 생성기의 대비·gamut 검사를 통과한다. 중성색도 함께 블루 계열로 바뀐다. 소비 앱의 수동 덮어쓰기(dg-studio #155EEF)는 앱의 선택으로 남긴다 |

## 두 검토자가 합의한 전제

결정과 함께 지킨다. 출처는 [이중검토 종합](../reports/flex-adoption-review/review/synthesis.md)의 합의 8개다.

- 입력 경계(`stroke-neutral` 1px)는 접근성 계약이라 box 형태에서도 지우지 않는다(WCAG 1.4.11).
- 새 값은 DDS 2px 스케일 안에서 고른다.
- 모바일 최소 조작 영역 44, 데스크톱 단독 조작 대상 24를 컴포넌트 계약으로 둔다.
- 부유 패널은 [0.17.3 결정](2026-10-06-floating-panel-border.md)대로 1px 경계 + overlay 그림자를 유지한다.
- 판정의 정본은 Storybook 렌더이고, 생성 이미지는 방향 참고다.

## 검토하고 고르지 않은 안

- **B 전면 채택**: box·line·속성 행을 데스크톱 기본으로 두면 기존 outline 기반 소비 화면과 충돌하고 전환 비용이 크다.
- **A만 채택**: B가 먼저 설계한 목록·선택·작업 패널 사용례를 잃는다. 두 검토자 모두 이 부분은 B가 낫다고 판정했다.
- **모서리 A(6·8) 또는 현재 8 유지**: 결함이 아닌 취향 판단이었고, 사용자가 원본에 가까운 B를 골랐다.
- **브랜드 dg-studio #155EEF 또는 teal 유지**: #155EEF는 수동 덮어쓰기라 생성기 대비 검사를 거치지 않고 중성색이 teal로 남는다. teal은 블루로 옮겨 온 제품 방향과 맞지 않는다.

## 다음

- Storybook Brand 툴바의 auto를 createTheme 블루로 맞췄다(`apps/storybook/.storybook/preview.tsx`). 보강 이미지는 #155EEF로 그렸으므로 색은 참고하지 않는다.
- 구현 스펙 후보 순서는 [이중검토 종합](../reports/flex-adoption-review/review/synthesis.md)의 "구현 스펙 후보 순서"를 따른다. 스펙은 `docs/specs/`에 새로 쓴다.
- profiles.ts는 A·B 비교용 정본으로 남긴다. 혼합안의 확정 치수는 구현 스펙에서 역할 토큰으로 옮길 때 정한다.
