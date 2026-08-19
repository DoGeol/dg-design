---
"@dg-design/react": minor
---

어드민 1차 컴포넌트 5종 — Table·Card·Tabs·Pagination·Breadcrumb

5종 전체가 "로직은 소비자, DDS는 마크업·스타일·접근성"의 결이다.

- `Table`: 스타일드 마크업 compound(가로 스크롤 래퍼 내장). 정렬·선택·필터는 소비자 몫(tanstack 등 자유)
- `Card`: 단일 요소 컨테이너 + `asChild`. 내부 구조는 자유
- `Tabs`: **automatic 활성화**(화살표 포커스 = 즉시 전환, APG tabs)·Home/End·roving. 비활성 패널은 hidden이라 폼 상태가 보존된다
- `Pagination`: 마크업 조각(Root·List·Item·Link·Previous·Next·Ellipsis). `isActive` → `aria-current="page"`, `asChild`로 라우터 Link 연동. 생략 계산은 소비자 몫
- `Breadcrumb`: nav 마크업 + `Page`(aria-current) + `Separator`(aria-hidden)

신규 토큰 0. 서브패스 5개 추가(`@dg-design/react/tabs` 등).
