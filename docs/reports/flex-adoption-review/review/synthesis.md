# A·B 이중검토 종합

2026-10-09 · Claude(작성자)와 Gemini 3.8 Flash High(비판 검토자, Antigravity)의 2라운드 토론 결과.

| 문서 | 내용 |
| --- | --- |
| [Gemini 1라운드](gemini-round1.md) | 지적 17건, 주제별 판정 13개 |
| [Claude 1라운드 답변](claude-round1.md) | 수용 8 · 부분 수용 4 · 반박 3 · 보류 1 · 해소 1(합 17), 조치 반영 |
| [Gemini 2라운드](gemini-round2.md) | 조치 검증 7건, 쟁점별 최종 입장, 남은 불일치 4개 |

검토 입력은 문서, [profiles.ts](../../../../apps/storybook/src/mockups/flex/profiles.ts), Storybook 비교 캡처 138장(1라운드)과 수정 뒤 재캡처 45장(2라운드), [보강 이미지](../../../design/2026-10-09-flex-ab-supplement/README.md)였다.

## 결론

**두 검토자 모두 "A를 출발점으로 두고 B의 사용례를 흡수"하는 혼합안으로 모였다.** A의 외부 라벨 outline·현재 반경 계열을 기본으로 두고, B가 먼저 설계한 List·Chip·PropertyField·Sheet 단계 전환·설정 행을 새 종류와 조합으로 더한다. Gemini 2라운드는 B 12·13 보드의 모바일 폼(내부 라벨 box + 속성 행 + 하단 CTA)과 Sheet 단계 전환을 A보다 낫다고 평가했다.

## 토론으로 바뀐 것

| 바뀐 것 | 계기 | 반영 위치 |
| --- | --- | --- |
| B box 입력에 현재 입력 경계 `stroke-neutral` 1px 복원 | 면만으로 1.09:1(다크 1.25:1), WCAG 1.4.11 미달 | `overrides/forms.css` 끝 규칙, B forms 문서 |
| DS024 외 이미지에서 옮긴 B 값 15개 등급 B → C(교차 배율) | 배율 1.75는 DS024에서만 확인 | profiles.ts, 모든 치수표 |
| B 선택 패널 반경 14 → 12 | 관계식으로 규칙 1(가장 가까운 단계)을 뒤집었다 | profiles.ts, 규칙 2를 "거리가 같을 때만"으로 좁힘 |
| 모바일 아이콘 버튼·Chip 제거에 44 조작 영역 | 36·32px로 미달 | `proto/proto.css` 끝 규칙(시안 전용) |
| A 특성화 정정 | "proposed 세트를 그대로 택했다"는 과장 | B 치수 명세 README |
| 규칙 5에 데스크톱 24(WCAG 2.5.8) 명시 | Chip 24의 근거 누락 | B 치수 명세 README |
| DataTable 390px 잘림, Select 모바일 Sheet 전환 부재 | Gemini가 찾은 현재 DDS 문제 | gaps.md §13 |

## Gemini 2라운드의 사실 오류

Gemini 2라운드 결론의 대부분은 캡처·코드와 일치했다. 다음은 확인 결과 틀렸다.

| Gemini 주장 | 확인 결과 |
| --- | --- |
| #16 "B는 탭 부품 패딩을 0으로 만들어 부모 패딩에 기댄다" | 틀림. B 탭 좌우 여백은 현재 값 8(`tab-inset` D)이다. B 열의 페이지 헤더는 Specimen 안 조합이고 Tabs CSS는 바꾸지 않았다(`overrides/navigation.css` 4–8행) |
| #13 근거 "`forms.css:289`의 `.dds-mock-datepicker__trigger--kind_box`" | 그런 클래스는 없다. 실제 규칙은 `.fx-date-box > .dds-button`이다. 경계가 보인다는 결론은 맞다(재캡처 다크 확인) |
| 쟁점 #4를 "1.75 배율 연쇄 가정"으로 기술하고 "작성자 반박"이라 함 | 1라운드 #4는 11번 보드 불일치였다. 배율 문제(#2)는 작성자가 수용해 C로 내렸다 |
| 남은 불일치 ④ "1.75 배율 통합 밀도 시스템을 규칙으로 채택할지" | 작성자는 1.75를 시스템 규칙으로 제안한 적이 없다. B 치수를 유도한 가정일 뿐이다. 실제로는 합의 사항이다 |
| 다크 패널 "stroke-neutral-weak 1px + shadow-overlay 복합 처리를 강제해야" | 그것이 이미 0.17.3의 현재 계약이다([부유 패널 경계 결정](../../../decisions/2026-10-06-floating-panel-border.md)). 대안이 아니라 합의다 |
| 남은 불일치 ③ "B는 브랜드 색을 필터·배지·선택 전반에 적극 주입" | 근거 약함. B 설정 행은 오히려 중성 선택점을 쓰고, 필터 칩 켜짐은 A·B 모두 brand-weak다. 실제 쟁점은 브랜드 정본(어느 블루인가)이다 |

## 합의

1. 입력 경계는 접근성 계약이다. box 형태라도 지우지 않는다.
2. 측정 근거는 등급으로 투명하게 남긴다. 교차 배율 값은 C다.
3. 새 값은 DDS 2px 스케일 안에서 고른다(10·14 포함). 홀수·중간값은 만들지 않는다.
4. 모바일 최소 조작 영역 44는 시안 CSS가 아니라 컴포넌트 계약(아이콘 버튼·제거 버튼)으로 옮긴다.
5. 데스크톱 24(WCAG 2.5.8)는 정당한 하한이다.
6. 부유 패널은 다크에서도 1px 경계 + overlay 그림자를 유지한다(현재 계약).
7. 판정의 정본은 Storybook 렌더다. 생성 이미지는 방향 참고(무드보드)이며 구현 스펙이 참조하지 않는다. 그래서 보강 이미지의 확인된 결함(B 12 오타, B 14 이중 경계 등)은 다시 그리지 않는다.
8. 메뉴 체크·토글 항목은 `menuitemcheckbox`·`menuitemradio` 계약이 생기기 전까지 표현 시안으로만 둔다.

## 사용자 결정 (2026-10-09)

출발점은 A 기본 + B 사용례 흡수, 모서리는 B(입력 4 · 버튼 6), 폼은 outline 기본 + 모바일 확장, 브랜드는 createTheme #1550A9로 정했다. [flex 적용 방향 결정](../../../decisions/2026-10-09-flex-adoption-direction.md)에 기록했다. 아래는 결정 당시의 선택지다.

### 결정 전 선택지

| 결정 | 선택지 | 두 검토자 의견 |
| --- | --- | --- |
| 출발점 | A 기본 + B 사용례 흡수 / B 전면 / A만 | 둘 다 혼합 |
| 모서리 톤 | A 입력 6·버튼 8 / B 입력 4·버튼 6 / 현재 8 유지 | 결함이 아닌 취향 판단. 사용자 결정 |
| 폼 문법 | outline 단일 / outline 기본 + 모바일 상세에 box·속성 행·line 허용 / B 전면 | Gemini: 데스크톱 단일, 모바일에 한해 허용. 작성자: 기본값 outline, 나머지는 추가 형태 |
| 브랜드 정본 | createTheme #1550A9 / dg-studio #155EEF / teal 유지 | 작성자 권고: 패키지는 createTheme(대비 검사 경로), 앱 덮어쓰기는 앱 선택 |

## 구현 스펙 후보 순서

결정 뒤 `docs/specs/`로 옮길 후보다. 괄호는 근거가 된 지적 번호(G1·G2 = Gemini 라운드, gaps = 관점 보완).

1. **역할 토큰 도입** — profiles.ts의 확정값을 `tokens.ts` 역할 토큰으로 옮긴다. Tailwind 브릿지 이름 정정 포함 (gaps §9)
2. **접근성 선행 계약** — 아이콘 버튼·제거 버튼 최소 조작 영역, 메뉴 체크·라디오 항목, Select 표시 이름·검색 텍스트·행 표현 분리 (G1 #5·#14, gaps §4)
3. **새 종류** — List·SectionHeader, Chip(제거·필터·툴박스), PropertyField. 실제 소비처 두 곳 확인 후 (G2 §5-1, gaps §4)
4. **모바일 presentation** — Sheet 단계 전환(간단·상세·전체)과 Select·MultiSelect의 좁은 화면 Sheet 전환 (G1 #11, G2 §5-1·5)
5. **Dialog 작업 레이아웃** — Toolbar·Body·Aside·Footer (A·B 공통)
6. **폼 형태 확장** — 결정에 따라 box(경계 포함)·line·속성 행을 추가 형태로 (G2 남은 불일치 ②)
7. **현재 DDS 문제 수정** — DataTable 색 갈림·머리글 정렬·좁은 폭, Toast action, Collapsible 높이 등 (gaps §13)
8. **소비 앱 전환** — dg-studio 0.17.2 → 새 배포판, 앱 임시 덮어쓰기 정리 (gaps §10)
9. **사용 가이드 스킬** — dg-design 소유의 프로젝트 독립 예제 스킬과 에이전트용 설정 가이드 md를 패키지에 포함한다. 각 단계의 API 변경과 같은 묶음에서 예제를 갱신한다 ([사용 가이드 스킬 결정](../../../decisions/2026-10-09-usage-skill.md))
