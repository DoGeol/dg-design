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

[follow-ups.md](follow-ups.md) — 남은 것 0건, 그리고 "모르면 첫 시도에서 틀리는" 실측 사실 4가지.

## 계획

| 문서 | 상태 | 다루는 것 |
|------|------|-----------|
| [2026-08-28 우선순위 컴포넌트](plans/2026-08-28-priority-components/) | 완료 0.12.0 | 컴포넌트별 계획 5개(accordion·avatar·collapsible·separator·skeleton), QA는 `qa/` 같은 이름 |
| [2026-09-06 잔여 작업](plans/2026-09-06-remaining-work.md) | 완료 | PR #59 스크린샷·D1/D2·승격 2차·dg-studio 교체 네 트랙, 서브에이전트 배정과 결과 |

## 가이드

[customization.md](customization.md) — 소비 프로젝트 커스터마이즈 계약: 공개/비공개 표면, `@layer` 규칙, `createTheme`, 예시 3종.

## 결정 기록

| 문서 | 상태 | 다루는 것 |
|------|------|-----------|
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

## 스펙

진행 중인 스펙 없음. 새 스펙은 `deep-interview` 스킬이 `specs/`에 만든다.

## 아카이브 (완료)

[specs/archive/README.md](specs/archive/README.md) — 릴리스별 완료 스펙 17건 목록. 현행 규칙의 근거로 삼지 말 것.
