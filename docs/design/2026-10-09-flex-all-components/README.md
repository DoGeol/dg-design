# flex 원문 우선 · 전체 컴포넌트 시안

2026-10-09 · **시각 검토용 · 구현 전**. 현재 React 0.17.3의 공개 컴포넌트 서브패스 38개를 10개 보드에 나눠 생성했다. DateRangePicker 등의 하위 export까지 각각 한 장씩 만든 것은 아니다.

[갤러리 열기](gallery.html) · [검수 기록](QA.md) · [프롬프트](prompts.json) · [보정 프롬프트](corrections.json) · [파일·해시](manifest.json) · [생성 기록](generation-records.json)

## 적용 기준

- [스킬 제외 재검토 B안](../../reports/flex-adoption-review/skill-free-comparison/README.md)과 [38개 비교](../../reports/flex-adoption-review/skill-free-comparison/components.md)를 기준으로 했다. 디자인 스킬과 포니테일은 적용하지 않았고, imagegen은 이미지 제작 도구로만 사용했다.
- 브랜드 블루, 단일/복수 선택 구분, 중성 설정 행, box/line 입력, 문맥형 선택 트리거, 본문 아래 모달 Footer와 Aside를 반영했다.
- flex 공식 토큰이나 현재 DDS 렌더링을 복제한 결과는 아니다. 그림의 반경·색·크기·문구·상태 지원 여부를 그대로 구현 계약으로 삼지 않는다.
- 10장은 built-in image_gen으로 각각 생성했다. 01/08/10은 상태 보정을 한 번씩 거쳐 v2를 최종 선택했다. 원본 10장+보정 3장, 총13 PNG를 보관한다.
- 모든 그림은 1448×1086 래스터다. 전체 개요가 아닌 유형별 상세 보드로 나눠 읽을 수 있는 크기를 확보했다.
- 사람·문서·날짜·파일명은 시안용 예시 데이터다. 제품 코드·토큰·의존성은 변경하지 않았다.

## 선택된 보드

| 이미지 | 포함된 현재 컴포넌트 |
| --- | --- |
| [01 · Controls](01-controls-v2.png) | Button · Checkbox · RadioGroup · Switch · Slider |
| [02 · Fields](02-fields.png) | Field · TextField · TextArea · FileInput |
| [03 · Selection](03-selection.png) | Select · MultiSelect · DatePicker |
| [04 · Navigation & Menus](04-navigation.png) | DropdownMenu · ContextMenu · Tabs · Breadcrumb · Pagination |
| [05 · Structure](05-structure.png) | Accordion · Collapsible · Card · Separator |
| [06 · Dialog & Sheet](06-modal.png) | Dialog · Sheet |
| [07 · Floating Information](07-floating.png) | Popover · HoverCard · Tooltip |
| [08 · Data & Identity](08-data-v2.png) | Table · DataTable · Avatar · Badge · NotificationBadge |
| [09 · Feedback](09-feedback.png) | Alert · Toast · StatePanel · SaveStatus |
| [10 · Loading](10-loading-v2.png) | Progress · Spinner · Skeleton |

## 컴포넌트별 찾기

| 공개 subpath | 이름 | 보드 |
| --- | --- | --- |
| `accordion` | Accordion | [05](05-structure.png) |
| `alert` | Alert | [09](09-feedback.png) |
| `avatar` | Avatar | [08](08-data-v2.png) |
| `badge` | Badge | [08](08-data-v2.png) |
| `breadcrumb` | Breadcrumb | [04](04-navigation.png) |
| `button` | Button | [01](01-controls-v2.png) |
| `card` | Card | [05](05-structure.png) |
| `checkbox` | Checkbox | [01](01-controls-v2.png) |
| `collapsible` | Collapsible | [05](05-structure.png) |
| `context-menu` | ContextMenu | [04](04-navigation.png) |
| `data-table` | DataTable | [08](08-data-v2.png) |
| `date-picker` | DatePicker | [03](03-selection.png) |
| `dialog` | Dialog | [06](06-modal.png) |
| `dropdown-menu` | DropdownMenu | [04](04-navigation.png) |
| `field` | Field | [02](02-fields.png) |
| `file-input` | FileInput | [02](02-fields.png) |
| `hover-card` | HoverCard | [07](07-floating.png) |
| `multi-select` | MultiSelect | [03](03-selection.png) |
| `notification-badge` | NotificationBadge | [08](08-data-v2.png) |
| `pagination` | Pagination | [04](04-navigation.png) |
| `popover` | Popover | [07](07-floating.png) |
| `progress` | Progress | [10](10-loading-v2.png) |
| `radio-group` | RadioGroup | [01](01-controls-v2.png) |
| `save-status` | SaveStatus | [09](09-feedback.png) |
| `select` | Select | [03](03-selection.png) |
| `separator` | Separator | [05](05-structure.png) |
| `sheet` | Sheet | [06](06-modal.png) |
| `skeleton` | Skeleton | [10](10-loading-v2.png) |
| `slider` | Slider | [01](01-controls-v2.png) |
| `spinner` | Spinner | [10](10-loading-v2.png) |
| `state-panel` | StatePanel | [09](09-feedback.png) |
| `switch` | Switch | [01](01-controls-v2.png) |
| `table` | Table | [08](08-data-v2.png) |
| `tabs` | Tabs | [04](04-navigation.png) |
| `text-area` | TextArea | [02](02-fields.png) |
| `text-field` | TextField | [02](02-fields.png) |
| `toast` | Toast | [09](09-feedback.png) |
| `tooltip` | Tooltip | [07](07-floating.png) |

## 원문과 연결

원문·이미지·측정은 [기존 연구](https://github.com/DoGeol/dg-studio/tree/fa3eaa3bc32828ef5e375d4413c4ac5cdd5d6128/docs/design/2026-10-06-flex-research)와 [모바일 연구](https://github.com/DoGeol/dg-studio/tree/fa3eaa3bc32828ef5e375d4413c4ac5cdd5d6128/docs/design/2026-10-07-flex-mobile-research)에 있다. 이번 새 보드는 그 자료를 텍스트 브리프로 옮겨 생성했으며, 보정 호출만 생성된 이미지를 입력으로 사용했다.

새 export 후보인 List·Chip·PropertyField는 현재38개에 포함시키지 않았다. 사람 선택의 칩, 속성형 입력 배치 등은 기존 컴포넌트의 조합 맥락으로만 등장한다. 그 후보들에 대한 별도 완성 시안을 만들었다고 집계하지 않는다.

다크 전용, 모든 size/intent 조합, 모든 하위 export, 키보드·모션·실제 화면 반응형은 이번 정적 보드의 검증 범위 밖이다. 구현할 때는 [직접 업데이트 순서](../../reports/flex-adoption-review/plan.md)와 현 DDS 계약을 대조한다.
