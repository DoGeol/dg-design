# 문서 색인

에이전트는 **여기서 필요한 문서를 골라 한 번에 찾아간다.** 전체를 훑지 않는다.

## 규칙

- **결정 기록**(`decisions/`) — "왜 이렇게 했나". 현행 판단의 근거. 여기가 먼저다
- **스펙**(`specs/`) — 진행 중인 작업 명세. 완료되면 `specs/archive/`로 옮긴다
- **아카이브**(`specs/archive/`) — 이력. 현행 규칙의 근거로 삼지 말 것. 구현 결과는 코드가 진실이다
- **계획**(`plans/`) — 배치 단위 진행 계획과 결과. 스펙이 "무엇"이면 계획은 "누가 어떤 순서로". 완료된 계획은 상태 줄에 완료를 적고 그대로 둔다
- **QA 기록**(`qa/`) — 배치별 독립 QA 결과. 재발 방지용 근거이지 현행 규칙은 아니다
- 인터뷰 기록(`*-interview.md`)은 **재결정할 때만** 읽는다. 구현에는 불필요하다
- 문서 하나가 10KB를 넘으면 분할을 검토한다

## 후속 작업

[follow-ups.md](follow-ups.md) — DatePicker·Table v2 실기기 QA와 "모르면 첫 시도에서 틀리는" 실측 사실 4가지.

## 계획

| 문서 | 상태 | 다루는 것 |
|------|------|-----------|
| [2026-10-09 flex 적용 구현](plans/2026-10-09-flex-adoption.md) · [인계](handoff/2026-10-09-flex-adoption.md) | 승인 · P0~P2 배포(0.18.0) | P0 문서·가드 → P1 역할 토큰·밀도 → P2 외관 → P3 접근성·API → P4 새 종류 → P5 표시 방식 → P6 폼 확장 → P7 사용 가이드 스킬 |
| [2026-10-06 다크 모드 부유 패널 경계](plans/2026-10-06-dark-overlay-boundary.md) | 구현 완료 · 배포 대기 | 다크에서 패널이 페이지에 묻히는 문제의 실측·원인, 테두리 1px 변경 범위와 검증 |
| [2026-09-27 DatePicker 구현](plans/2026-09-27-datepicker.md) | npm 0.16.1 배포 · 실기기 QA 후속 | 값·DST 기술 게이트, 입력·달력·반응형 패널, 검증 순서와 작업 배정 |
| [2026-09-25 Table v2 사용성·대량 데이터](plans/2026-09-25-table-v2.md) | npm 0.16.0 배포 · 스크린리더 QA 후속 | 데이터 기반 API 2종, 1만 행 가상화, 정렬·필터·선택, 고정 헤더·열의 단계별 계획 |
| [2026-08-28 우선순위 컴포넌트](plans/2026-08-28-priority-components/) | 완료 0.12.0 | 컴포넌트별 계획 5개(accordion·avatar·collapsible·separator·skeleton), QA는 `qa/` 같은 이름 |
| [2026-09-06 잔여 작업](plans/2026-09-06-remaining-work.md) | 완료 | PR #59 스크린샷·D1/D2·승격 2차·dg-studio 교체 네 트랙, 서브에이전트 배정과 결과 |

## 가이드

[customization.md](customization.md) — 소비 프로젝트 커스터마이즈 계약: 공개/비공개 표면, `@layer` 규칙, `createTheme`, 예시 3종.

## 검토

| 문서 | 상태 | 다루는 것 |
|------|------|-----------|
| [flex 전체 컴포넌트 시안](design/2026-10-09-flex-all-components/README.md) | 생성 완료 · 구현 전 | 38개 공개 컴포넌트, 10개 채택 보드, 갤러리·프롬프트 |
| [flex 전체 시안 검수](design/2026-10-09-flex-all-components/QA.md) | 시각 검토 | 보드별 존재·상태 확인, 보정3건, 구현 전 차이 |
| [flex → dg-design 적용 검토](reports/flex-adoption-review/README.md) | 제안 · 구현 전 | React 0.17.3 / tokens 0.8.0 기준, 출처와 보존 계약 |
| [컴포넌트 38개 비교](reports/flex-adoption-review/components.md) | 제안 | 유지·확장·새 종류와 앱 조합의 경계 |
| [조합 API 검토](reports/flex-adoption-review/composition.md) | 제안 | 선택·메뉴·작업 패널·모바일·데이터 계약 |
| [토큰 적용 검토](reports/flex-adoption-review/tokens.md) | 제안 | 역할 토큰, 치수 대응, 색·타이포·Tailwind |
| [직접 업데이트 순서](reports/flex-adoption-review/plan.md) | 제안 | 변경 묶음, 완료 조건, 호환성·전환·검증 |
| [컴포넌트별 디자인 적용안](reports/flex-adoption-review/design-application/README.md) | 제안 · 렌더링 검증 전 | 현재 CSS와 적용 후 외형·공통 프로필·신규 종류 |
| [입력·선택 12개 적용안](reports/flex-adoption-review/design-application/forms.md) | 제안 | 폼·선택·날짜·업로드의 치수·상태·모바일 |
| [탐색·메뉴 7개 적용안](reports/flex-adoption-review/design-application/navigation.md) | 제안 | 탭·명령·경로·페이지·접힘의 표현 |
| [표면·레이어 7개 적용안](reports/flex-adoption-review/design-application/surfaces.md) | 제안 | Dialog·Sheet·Popover·Card 등의 구조와 표면 |
| [데이터·피드백 12개 적용안](reports/flex-adoption-review/design-application/data-feedback.md) | 제안 | 표·사람·배지·알림·로딩 표현 |
| [스킬 미사용 재검토 비교](reports/flex-adoption-review/skill-free-comparison/README.md) | 비교 · 구현 전 | 앞선 안과 원문 우선안의 차이, HTML 비교판 |
| [스킬 미사용 38개 컴포넌트 비교](reports/flex-adoption-review/skill-free-comparison/components.md) | 비교 | 변경·유지 판단과 신규 종류의 우선순위 |
| [B 치수 명세](reports/flex-adoption-review/skill-free-comparison/design-application/README.md) | 제안 · 구현 전 | B를 A 수준 구체 치수로 고정, 유도 규칙·A와 차이, Storybook 비교 사용법 |
| [B 입력·선택 12개](reports/flex-adoption-review/skill-free-comparison/design-application/forms.md) | 제안 | 현재·A·B 치수표와 외관·상태·다크·모바일 |
| [B 탐색·메뉴 7개](reports/flex-adoption-review/skill-free-comparison/design-application/navigation.md) | 제안 | 같은 형식 |
| [B 표면·레이어 7개](reports/flex-adoption-review/skill-free-comparison/design-application/surfaces.md) | 제안 | 같은 형식 + 작업 패널 시나리오 |
| [B 데이터·피드백 12개](reports/flex-adoption-review/skill-free-comparison/design-application/data-feedback.md) | 제안 | 같은 형식 + 비교 표 시나리오 |
| [B 새 종류 3개](reports/flex-adoption-review/skill-free-comparison/design-application/new-kinds.md) | 제안 | List·Chip·PropertyField와 폼·사람 선택·객체 목록 시나리오 |
| [A·B 공통 관점 보완](reports/flex-adoption-review/gaps.md) | 검토 | 다크·모바일·box 입력 대비·브랜드 3안·포털·인프라·출처 의존 |
| [A·B 이중검토 종합](reports/flex-adoption-review/review/synthesis.md) | 검토 완료 · 결정 반영 | Claude·Gemini 2라운드 결과, 합의 8개, 사용자 결정 4개, 구현 스펙 후보 순서 |
| [Gemini 1라운드](reports/flex-adoption-review/review/gemini-round1.md) · [Claude 답변](reports/flex-adoption-review/review/claude-round1.md) · [Gemini 2라운드](reports/flex-adoption-review/review/gemini-round2.md) | 검토 기록 | 지적 17건과 판정·조치·재반박 |
| [flex A·B 보강 시안](design/2026-10-09-flex-ab-supplement/README.md) | 11–14 완료 · 구현 전 | A·B 11–14 보드, 범위 결정, codex 한도 경위, 확인된 결함 |
| [flex A·B 보강 시안 브리프](design/2026-10-09-flex-ab-supplement/BRIEF.md) | 생성 지침 | DDS 기반 A·B 보드, 고정 조건과 치수표 |

## 결정 기록

| 문서 | 상태 | 다루는 것 |
|------|------|-----------|
| [2026-10-09 사용 가이드 스킬](decisions/2026-10-09-usage-skill.md) | 활성 · 구현 전 | dg-design 소유·프로젝트 독립 예제 스킬, 패키지에 스킬 + 에이전트용 설정 가이드 md, layout은 최소 권장사항 + 프로젝트 로컬 파일 |
| [2026-10-09 flex 적용 방향](decisions/2026-10-09-flex-adoption-direction.md) | 활성 · 구현 전 | A 기본 + B 사용례, 모서리 입력 4·버튼 6, outline 기본 + 모바일 확장, 브랜드 createTheme #1550A9 |
| [2026-10-06 부유 패널 테두리](decisions/2026-10-06-floating-panel-border.md) | 활성 | 패널 경계는 그림자가 아니라 테두리 1px, Sheet는 안쪽 변만, 화살표 오프셋 보정 |
| [2026-09-27 DatePicker 구현 결정](decisions/2026-09-27-datepicker-implementation.md) | npm 0.16.1 배포 · 실기기 QA 후속 | 엄격한 날짜 입력·DST 후보, 달력 훅과 DDS 오버레이, 반응형 레이아웃·패키지 export |
| [2026-08-14 토큰 체계와 a11y 기준선](decisions/2026-08-14-dds-token-system.md) | 활성 | 토큰 이름 문법, hover 축 추가, 대비 검사 도입, focus/disabled 관습 |
| [2026-08-15 0.1.0 구현 중 결정](decisions/2026-08-15-dds-010-implementation.md) | 활성 | Vite CSS raw copy, lightness/chroma 배열, 컴포넌트 위임값, 브릿지 범위, publish 운영 |
| [2026-08-15 Badge + intent 축](decisions/2026-08-15-badge-intent-axis.md) | 활성 | 컴포넌트 로드맵 A→B→C→D, intent 6종 확정, outline·hover/pressed 제외 근거 |
| [2026-08-15 Badge 구현 중 결정](decisions/2026-08-15-badge-intent-axis-implementation.md) | 활성 | warning solid 반전, chroma 비율 프로파일, Badge 치수·웨이트, hue 실값 |
| [2026-08-15 Checkbox·Switch 구현 중 결정](decisions/2026-08-15-checkbox-switch-implementation.md) | 활성 | stroke 스텝, 컨트롤 치수, vitest 구성·jsdom 함정, dts exclude |
| [2026-08-15 TextField 구현 중 결정](decisions/2026-08-15-textfield-implementation.md) | 활성 | Field context 설계, focus/readonly 스타일, 시각 회귀 인프라 전체 설계 |
| [2026-08-15 Dialog 구현 중 결정](decisions/2026-08-15-dialog-implementation.md) | 활성 | presence computed-길이 방식, portal 컨테이너·inert 규칙, 모션 토큰 값 |
| [2026-08-16 DropdownMenu 구현 중 결정](decisions/2026-08-16-dropdown-menu-implementation.md) | 활성 | 첫 항목 포커스, DOM 조회 roving, mousedown 외부판정, 스택 모달/비모달 분리 |
| [2026-08-16 Select 구현 중 결정](decisions/2026-08-16-select-implementation.md) | 활성 | use-overlay 추출, 라벨 등록 하이브리드(D1), 키 분기, Trigger CSS 복제 근거 |
| [2026-08-16 소형 묶음 구현 중 결정](decisions/2026-08-16-small-batch-implementation.md) | 활성 | autoResize 배타 설계, 라디오 네이티브 위임, outline 변수 재사용 |
| [2026-08-16 Tooltip·Popover 구현 중 결정](decisions/2026-08-16-tooltip-popover-implementation.md) | 활성 | Provider ref 신호, use-overlay 옵션화 수용(D1), Popover.Arrow 합성 |
| [2026-08-16 소형 묶음 2 구현 중 결정](decisions/2026-08-16-small-batch-2-implementation.md) | 활성 | NB 단층 CSS·children Omit, HC 스케줄 복제·비모달 스택·트리거 a, defaultOpen 데모 |
| [2026-08-16 파생 3종 구현 중 결정](decisions/2026-08-16-batch-3-implementation.md) | 활성 | select-core 추출·useOptionRegistry, Sheet side는 Root·radius 0, ContextMenu primitive 직결, **레시피 코드젠 불채택과 새 트리거** |
| [2026-08-17 알림 묶음 구현 중 결정](decisions/2026-08-17-feedback-batch-implementation.md) | 활성 | inert 면제 범위, z-toast·linear easing 근거, Toast 타이머·마크업, VR reducedMotion 무효 발견 |
| [2026-08-19 테마 생성기 구현 중 결정](decisions/2026-08-19-theme-generator-implementation.md) | 활성 | **솔버 비단조 버그(hue 264)와 노랑 전제 반전**, tsc 방출·index 재수출, Tailwind 실측 3건 |
| [2026-08-19 어드민 1차 구현 중 결정](decisions/2026-08-19-admin-batch-implementation.md) | 활성 | Tabs onFocus 활성화·키 별칭 roving·hidden display 함정, Table border-collapse, barrel 정렬 실수 |
| [2026-08-28 우선순위 컴포넌트 1차 구현 중 결정](decisions/2026-08-28-priority-components-batch-implementation.md) | 활성 | 5종 구현 경계, Accordion duplicate value ID P1 수정, Storybook P2 보완, 최종 검증 |
| [2026-09-05 컴포넌트 구성 규칙](decisions/2026-09-05-component-composition-rules.md) | 활성 | leaf·compound·preset 판별 순서, 서브컴포넌트 이름 관례, dg-studio 승격 후보 판정 |
| [2026-09-05 승격 1차 구현 중 결정](decisions/2026-09-05-studio-promotion-batch-implementation.md) | 활성 | StatePanel compound 형태, Slider 채움 변수, segmented 강제 horizontal, Tabs responsive matchMedia, Alert actions slot |
| [2026-09-06 배포 자동화](decisions/2026-09-06-release-automation.md) | 활성 | npm trusted publishing(OIDC)+changesets/action v2, Version PR 머지=배포 승인, setup-node registry-url·pnpm 11 함정 |
| [2026-09-06 compound named export](decisions/2026-09-06-compound-named-exports.md) | 활성 | RSC 경계에서 객체 export 실패 근거, `{Compound}{Sub}` 규약, Tabs.Content tabIndex override |
| [2026-09-06 승격 2차 구현 중 결정](decisions/2026-09-06-studio-promotion-batch-2-implementation.md) | 활성 | SaveStatus·MultiSelect 검색/onCreate·FileInput 구현 결정, 디자인 검토 5건 전후 값, `[hidden]` vs display 함정 |
| [2026-09-13 컴포넌트 모션 API](decisions/2026-09-13-component-motion-api.md) | 활성 | `motion` prop 6종과 기본값(Avatar만 none), 기존 토큰 재사용, 포인터 대 키보드 판별, 공용 FLIP 헬퍼, VR 기준 CI 전용 갱신 |
| [2026-09-25 Table v2 구현 중 결정](decisions/2026-09-25-table-v2-implementation.md) | 활성 | dual API, 순수 데이터 모델, 네이티브 표 가상화, 접근성·패키지 export 판단 |

## 스펙

| 문서 | 상태 | 다루는 것 |
|------|------|-----------|
| [2026-09-27 DatePicker 스펙](specs/2026-09-27-datepicker.md) | npm 0.16.1 배포 · 실기기 QA 후속 | 단일/범위 × 날짜/시간, 시간대, 모바일 시트, 프리셋, 합격 조건 |
| [2026-09-25 Table v2 구현 스펙](specs/2026-09-25-table-v2.md) | npm 0.16.0 배포 · 스크린리더 QA 후속 | 공개 API, 구현 경계, 합격 조건 |

## QA

| 문서 | 상태 | 다루는 것 |
|------|------|-----------|
| [2026-09-27 DatePicker QA](qa/2026-09-27-datepicker.md) | npm 0.16.1 배포 · 실기기 QA 대기 | 값·DST·브라우저·모바일 자동 검증과 남은 실기기 검증 |
| [2026-09-25 Table v2 QA](qa/2026-09-25-table-v2.md) | npm 0.16.0 배포 · 스크린리더 QA 대기 | 1만 행·고정 열·접근성·브라우저 성능 실측과 남은 스크린리더 검증 |

## 아카이브 (완료)

[specs/archive/README.md](specs/archive/README.md) — 릴리스별 완료 스펙 17건 목록. 현행 규칙의 근거로 삼지 말 것.
