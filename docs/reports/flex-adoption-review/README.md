# flex → dg-design 적용 검토

검토일: 2026-10-08. 상태: **적용 제안 · 구현 전**. 이 보고서는 승인된 스펙이나 flex 공식 토큰 명세가 아니다.

## 결론

dg-design의 기반을 유지하면서 flex의 구성 원칙을 적용할 수 있다. 간격·높이·반경 후보는 대부분 기존 숫자 토큰에 이미 있다. 필요한 변화는 **역할별 토큰 연결, 선택 트리거의 조합 자유도, 객체 목록과 선택·명령 목록의 구분, 작업형 Dialog와 모바일 Sheet 구조**다.

색과 radius만 바꾸면 외형 일부는 가까워지지만, 사람이 포함된 선택 행·속성 필드·본문 옆 활동 영역 같은 서비스 UI를 안정적으로 조립하기 어렵다. 반대로 선택·날짜·오버레이 로직을 전부 교체할 이유도 없다.

## 기준과 근거

- 코드 기준: dg-design `3789b49404ea146b6499066f0a642d8e87893469`, React **0.17.3**, tokens **0.8.0**. 처음 열었던 로컬 main은 `715b8e1`(React 0.17.2)이었으나 원격 main을 확인해 최신 패널 경계 수정을 포함했다.
- 범위: 공개 컴포넌트 **서브패스 38개** 전체 분류. 토큰·입력·선택·메뉴·Dialog·Sheet·Tabs·DatePicker·DataTable과 공유 로직은 API/CSS를 상세 대조했다. 개별 하위 컴포넌트 개수가 38개라는 뜻은 아니다.
- 방법: 소스·공개 타입·CSS·기존 결정 기록 검토, 토큰 생성 함수의 실제 출력 대조. 이번 검토에서 브라우저 시각 회귀나 실기기 접근성 검증을 새로 수행하지 않았다.
- 출처 구분: **A** 글/이미지에 명시, **B** 래스터 관찰, **C** dg-design 적용을 위한 추정·제안. 치수·타이포 후보는 주로 C다.

| 자료 | 내용 |
| --- | --- |
| [컴포넌트 비교](components.md) | 기존 38개 분류와 새 종류가 필요한 지점 |
| [조합 API 검토](composition.md) | Select·Menu·Dialog·모바일·Table 계약과 보존 조건 |
| [토큰 적용](tokens.md) | 기존 숫자 대응, 역할 토큰, 색·타이포·Tailwind |
| [구현 순서](plan.md) | 변경 파일, 검증, 호환성, 소비 앱 전환 |
| [인벤토리](inventory.json) | 기준 커밋·버전·엔트리·소스 해시 |
| [토큰 출력 증거](token-comparison.json) | 현재 스케일과 기본/블루 테마의 실제 출력 |
| [검토 파일 검증](validation.json) | 링크·문서 크기·38개 대응 범위·소스 보존 확인 |
| [컴포넌트별 디자인 적용안](design-application/README.md) | 38개 각각의 현재 치수·외형 제안·모바일·상태·변경 수준 |
| [디자인 스킬·포니테일 제외 비교](skill-free-comparison/README.md) | 원문 우선 재검토와 앞선 안의 차이, 38개 비교·HTML 표본 |

토큰 출력은 저장소 루트에서 Node 24로 `node docs/reports/flex-adoption-review/collect-token-evidence.mjs`를 실행해 재현한다. [수집 스크립트](collect-token-evidence.mjs)는 기준 커밋 대비 두 패키지의 변경 유무와 38개 엔트리 해시를 확인하고 보고서 JSON만 기록한다. 문서만 추가한 커밋에서는 재실행할 수 있다. 기준 소스가 바뀌면 보고서부터 다시 검토해야 한다.

## 먼저 바꿀 부분

| 우선 | 권고 | 적용 이유 |
| --- | --- | --- |
| 1 | 기존 primitive 위에 control/inset/gap/radius 역할 추가 | 동일한 16px이어도 필드 반경과 본문 여백을 독립 조정 |
| 2 | Select 트리거와 선택값 표현 분리, 풍부한 option 메타데이터 | Button·Chip·PropertyField에서 같은 선택 로직 재사용 |
| 3 | MultiSelect 사각 선택 표시, 목록 바깥 검색/행동 영역 | 단일/복수 선택을 구분하고 목록의 의미 구조 유지 |
| 4 | List·Chip·PropertyField의 공용화 범위 확정 | 객체 탐색·태그 제거·값 선택을 별도 역할로 표현 |
| 5 | Dialog 레이아웃 부품, Sheet 높이·스크롤 정책 | 본문/어사이드와 고정 행동 영역 구성 |
| 6 | Menu 하위 메뉴 API, DataTable 치수 계약 | 단순 CSS로 해결할 수 없는 행동·배치 보완 |

RadioGroup의 segmented, MultiSelect 검색·생성, 중첩 오버레이 기반, DatePicker의 모바일 Sheet는 이미 있다. 글에 없다는 이유로 기존 컴포넌트를 삭제하지 않는다.

## 반드시 보존할 계약

- 선택값, 검증, 키보드·포커스, form 연결은 시각 스타일과 분리한다. hover·focus·selected도 별개다.
- 0.17.3의 부유 패널 1px 경계와 Sheet 안쪽 변 경계를 유지한다. [기존 결정](../../decisions/2026-10-06-floating-panel-border.md)을 우선한다.
- compound 객체와 named export를 함께 제공한다. 기존 prop·ref·className의 도착 지점을 임의로 바꾸지 않는다.
- 도메인 문구·검색 쿼리·저장·승인·라우팅은 소비 앱 소유다. [구성 규칙](../../decisions/2026-09-05-component-composition-rules.md)을 유지한다.

## 연구 원본

원본 이미지와 측정 파일은 이미 커밋된 dg-studio 연구 폴더를 단일 출처로 사용한다.

- [데스크톱 연구와 컴포넌트 규칙](https://github.com/DoGeol/dg-studio/tree/fa3eaa3bc32828ef5e375d4413c4ac5cdd5d6128/docs/design/2026-10-06-flex-research)
- [모바일 연구와 측정](https://github.com/DoGeol/dg-studio/tree/fa3eaa3bc32828ef5e375d4413c4ac5cdd5d6128/docs/design/2026-10-07-flex-mobile-research)
- 원문: [fx](https://jihoonwrks.me/builds/flex-design-system), [서비스](https://jihoonwrks.me/builds/flex-service-design), [fxm](https://jihoonwrks.me/builds/flex-mobile-design-system)

원문은 2021.12–2025.3 작업을 다루며 현재 제품 전체 명세가 아니다. 모바일 글은 일부 미구현 작업과 Origami Studio 인터랙션 예시를 포함한다고 밝힌다. 생성 시안도 참고 이미지이며, 새로운 variant나 행동 API가 필요하다는 근거로 단독 사용하지 않는다.
