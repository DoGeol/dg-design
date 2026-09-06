# 완료 스펙 아카이브

이력이다. 현행 규칙의 근거로 삼지 말 것 — 구현 결과는 코드가 진실이고, 판단 근거는 `../../decisions/`에 있다.

| 문서 | 릴리스 | 다루는 것 |
|------|--------|-----------|
| [DDS 아키텍처](2026-08-14-dds-architecture.md) | 0.1.0 | 토큰 파이프라인·스타일링·빌드/배포·Tailwind 브릿지 |
| [토큰 체계와 Button 0.1.0](2026-08-14-dds-token-system.md) | 0.1.0 | 팔레트 값, 대비 검사 쌍, 비색상 토큰, Button API, 공개 API 범위 |
| [Badge + intent 축](2026-08-15-badge-intent-axis.md) | 0.2.0 | intent 4종 실값화, 대비 24건, Badge(asChild·truncate), 합격 조건 12/12 |
| [Checkbox·Switch + stroke 축](2026-08-15-checkbox-switch-stroke-axis.md) | 0.3.0 | stroke 2종, 폼 컨트롤 2개, vitest 도입, 합격 조건 13/13 |
| [TextField·Field + 시각 회귀](2026-08-15-textfield.md) | 0.4.0 | Field compound, TextField 5상태, Playwright 시각 회귀 도입 |
| [Dialog](2026-08-15-dialog.md) | 0.5.0 | 자체 구현 오버레이(presence·스택·inert), compound 7종, 모션 토큰 |
| [DropdownMenu](2026-08-16-dropdown-menu.md) | 0.6.0 | 비모달 오버레이, floating-ui, roving tabindex, 스택 modal 플래그 |
| [Select](2026-08-16-select.md) | 0.7.0 | 폼 단일 선택, typeahead, Field 연동, use-overlay 공통 추출 |
| [소형 묶음](2026-08-16-small-batch.md) | 0.8.0 | TextArea(autoResize)·RadioGroup(네이티브 위임)·Badge outline |
| [Tooltip·Popover](2026-08-16-tooltip-popover.md) | 0.8.0 | Provider 그룹 지연, autoFocus 겸용, arrow, 탭 포커스 열림(표준 이탈) |
| [소형 묶음 2](2026-08-16-small-batch-2.md) | 0.9.0 | NotificationBadge(count·max·isShowEmpty)·HoverCard(hover 전용, 콘텐츠 유지) |
| [알림 묶음](2026-08-17-feedback-batch.md) | 0.10.0 | Toast(훅 API·모달 위)·Alert·Spinner·Progress·Button loading, live region 정책 |
| [테마 생성기](2026-08-19-theme-generator.md) | tokens 0.6.0 | createTheme(hex→WCAG 통과 테마)·CLI·브릿지 보강·커스터마이즈 계약 |
| [어드민 1차](2026-08-19-admin-batch.md) | 0.11.0 | Table·Card·Tabs·Pagination·Breadcrumb — 로직은 소비자, automatic 탭 |
| [파생 3종](2026-08-16-multi-select-sheet-context-menu.md) | 0.9.0 | MultiSelect(요약 트리거·토글)·Sheet(4방향)·ContextMenu(마우스 전용) + internal 추출 |
| [우선순위 컴포넌트 1차](2026-08-28-priority-components-batch.md) | 0.12.0 | Skeleton·Avatar·Separator·Collapsible·Accordion, 합격 조건 20/20 |
| [dg-studio 승격 1차](2026-09-05-studio-promotion-batch.md) | 0.13.0 | StatePanel compound, Slider, RadioGroup segmented, Tabs responsive, Alert actions |
| [dg-studio 승격 2차](2026-09-06-studio-promotion-batch-2.md) | 0.14.0 | SaveStatus 4상태 · MultiSelect search 2모드+onCreate Promise · FileInput compound(검증까지) · 합격 조건에 dg-studio 교체 PR |

인터뷰 기록이 분리된 스펙은 같은 이름 `-interview.md`가 옆에 있다(없는 것은 스펙 안에 접혀 있다).
