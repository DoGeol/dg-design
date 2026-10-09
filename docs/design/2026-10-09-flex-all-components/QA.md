# 시안 검수 기록

2026-10-09 · 시각 검토. 실제 DDS 컴포넌트나 접근성 테스트의 통과 기록은 아니다.

## 보드별 확인

| 보드 | 확인한 내용 | 결과 |
| --- | --- | --- |
| 01 Controls | Button·Checkbox·RadioGroup·Switch·Slider, 선택/부분선택/비활성, 중성 설정 행, slider 값/미리보기 | 5개 확인. v2에서 ghost 외곽선과 loading 문구 보정 |
| 02 Fields | Field의 label/helper/error, box/line TextField·TextArea, FileInput의 첨부/오류 | 4개 확인. 안내·오류와 대상이 식별됨 |
| 03 Selection | field/button/chip 진입, Select 체크, MultiSelect 사각 체크2개와 표시2명, 달력 범위12–14 | 3개 확인. 2026년10월 날짜 배치와 선택/포커스 구분 확인 |
| 04 Navigation | Product Header 안 Breadcrumb·Tabs, DropdownMenu Sub, ContextMenu, Pagination | 5개 확인. 명령과 값 선택의 표현 구분 |
| 05 Structure | Accordion 펼침/접힘, Collapsible 양 상태, Card 기본/포커스, Separator 수평/수직 | 4개 확인 |
| 06 Modal | Dialog 툴바·본문·Aside·본문 아래 Footer, Sheet 간단/상세/전체 개념 | 2개 확인. 화면 전체 높이/입력 보존은 실제 동작으로 검증한 것이 아님 |
| 07 Floating | Popover, HoverCard, 반전 표면 Tooltip과 트리거 맥락 | 3개 확인. hover 대체 접근 문구 포함 |
| 08 Data | Table와 DataTable 구분, 한 행 선택, Avatar, Badge, NotificationBadge dot/count | 5개 확인. v2에서 전체 선택 mixed 표시와 Table hover 중성화 |
| 09 Feedback | 지속 Alert, 결과 Toast, 데이터 없음/검색 없음 StatePanel, SaveStatus 상태 표본 | 4개 확인. 상태 이름과 표시가 구분됨 |
| 10 Loading | 값이 있는 Progress와 불확정 Progress, Spinner, 같은 행 구조의 Skeleton 전후 | 3개 확인. v2에서 줄무늬 제거·loading 문구 보정 |

현재 package.json의 38개 공개 컴포넌트 subpath와 prompts/manifest의 범위가 정확히 일치한다. 컴포넌트 이름만 나열한 것이 아니라 위 보드에서 실제 UI 표본이 존재하는지도 생성 결과를 보고 확인했다.

## 보정 이력

| 원본 | 채택 | 보정 |
| --- | --- | --- |
| 01-controls.png | [01-controls-v2.png](01-controls-v2.png) | 더 보기의 ghost 처리, 버튼 폭을 유지한 spinner 중심 loading |
| 08-data.png | [08-data-v2.png](08-data-v2.png) | 헤더 선택을 indeterminate로, 일반 Table의 hover를 중성으로 |
| 10-loading.png | [10-loading-v2.png](10-loading-v2.png) | 불확정 진행률을 이동 구간의 정적 표본으로, loading 버튼의 텍스트 제거 |

최초 파일은 덮어쓰지 않았다. 갤러리·README·manifest는 채택본을 가리킨다. 생성·보정 문구는 [prompts.json](prompts.json), [corrections.json](corrections.json)에 보존한다.

## 구현 전 대조할 차이

- box/line·내부 label, 풍부한 Option, Chip형 Select Trigger, Menu.Sub와 설정 항목, Dialog 보기/레이아웃, 확장 SaveStatus는 일부 현 API 밖의 **설계 제안**이다.
- 일부 보조 버튼이 테두리형으로 생성됐다. 그 자체가 새로운 outline variant의 확정은 아니다. 구현할 때 기존 weak/ghost 또는 명시적으로 선택한 API와 대조한다.
- Badge의 캡슐 외형, Tooltip 그림자·pointer 위치 등은 시각 제안이다. 기존 숫자 토큰을 바꿀 근거로 이미지 픽셀을 직접 사용하지 않는다.
- Sheet의 세 패널은 종류와 정보량 비교다. 안전 영역, 키보드, drag handle 실제 동작, full viewport, 포커스 복귀를 구현한 화면은 아니다.
- 로딩은 정지 화면이다. Spinner의 열린 호·회전, 불확정 Progress 구간 폭(현 DDS40%)·속도는 현 코드/승인 스펙으로 확정한다. 모델이 그린 비율을 정확한 CSS 값으로 간주하지 않는다.
- 도메인별 원본이 부족한 Spinner·Toast 등은 기존 DDS의 역할을 유지한 계열 정렬안이다. flex의 실제 해당 컴포넌트라고 주장하지 않는다.

## 검증 범위

검증한 것: 이미지13개 파일 존재·PNG 크기·해시, 채택10개, 범위38개 중복/누락 없음, 문서 링크, 주요 내용/상태의 시각 일치.

갤러리는 브라우저에서 전체10보드/38개 표시, Select 검색 시1보드/2개 일치, 없는 이름 검색 시0개·빈 상태, 전체 보기 복원을 확인했다. [갤러리 캡처](preview/gallery.png)는 생성 보드13개와 별도의 브라우저 미리보기다. 구조 검증 결과는 [validation.json](validation.json)에 있다.

검증하지 않은 것: 키보드·포커스·폼 제출·live region·실제 색 대비·픽셀 단위 토큰 일치·모션·실기기·다크 테마·모든 size/intent/하위 export 조합. 이미지 내 인물·문서·파일·날짜는 설명을 위한 가상 데이터다.
