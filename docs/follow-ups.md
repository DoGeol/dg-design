# 후속 작업

0.9.0 검토(렌즈 6개 감사)에서 나온 30건 중 **30건 전부 처리됐다.**

근거 문서: [0.9.0 감사 결과](decisions/2026-08-17-feedback-batch-implementation.md) 및 각 구현 결정 기록.

## 남은 것

0.9.0 감사 30건과 dg-studio 도입에서 나온 D1·D2까지 전부 처리됐다.

| 항목 | 상태 | 착수 조건 |
| --- | --- | --- |
| DatePicker 실기기 QA | [릴리스 0.16.1](https://github.com/DoGeol/dg-design/releases/tag/%40dg-design/react%400.16.1) · [QA](qa/2026-09-27-datepicker.md) | npm 배포·Linux 시각 기준 완료. 실제 모바일 가상 키보드와 VoiceOver/TalkBack 청취는 미검증. |
| Table v2 스크린리더 QA | [릴리스 0.16.0](https://github.com/DoGeol/dg-design/releases/tag/%40dg-design/react%400.16.0) · [QA](qa/2026-09-25-table-v2.md) | npm 배포·Linux 시각 기준 완료. 실제 스크린리더 청취는 미검증. |

### 시안 A에서 드러난 공백 (2026-10-02)

시안 A(`apps/storybook/src/mockups/`)를 실제 컴포넌트로 그리면서 소비 측 우회가 필요했던 17건은 `feat/component-gaps`에서 전부 처리했다(근거는 `.changeset/component-gaps.md`). 남긴 것:

| 항목 | 상태 | 착수 조건 |
| --- | --- | --- |
| MultiSelect·Select 래퍼 옵션 | 옵션을 사용자 컴포넌트로 감싸면 첫 열기 전 트리거에 값 문자열(`internal/select-core.ts` 한계). StateMatrix 스토리만 직접 배치로 고침 | 래퍼 옵션 사용처가 생기면 registry 개선 |

### flex 비교 화면에서 드러난 문제 (2026-10-09)

DataTable 선택+hover 색 갈림, 숫자 열 머리글 정렬 불가, Toast 옵션 action 없음, Collapsible·Accordion 높이가 넓어져도 안 줄어듦 등 13건. 목록과 재현 위치는 [A·B 공통 관점 보완 §13](reports/flex-adoption-review/gaps.md#13-비교-화면을-만들며-드러난-현재-dds-문제). 착수 조건: flex 적용 스펙 승인 시 함께, 또는 해당 컴포넌트를 손볼 때.

### dg-studio 모션·아이콘 반영 뒤 남긴 것 (2026-10-28)

근거: [조작 모션·오버레이 퇴장·아이콘 확장 결정](decisions/2026-10-28-interaction-motion-and-icons.md).

| 항목 | 상태 | 착수 조건 |
| --- | --- | --- |
| `ContextMenu.ItemIcon` | `DropdownMenuItemIcon`을 ContextMenu.Item 안에 그대로 쓸 수 있어 대칭 부품은 미추가 | ContextMenu 쪽 요구가 생기면 |
| Alert·Toast 닫기 X 교체 | 14px 로컬 SVG 유지(Icon 스펙 B1b 별도 목록) | 닫기 X 교체 계획 때 |

### 끌어서 닫기 뒤 남긴 것 (2026-10-31)

근거: [끌어서 닫기·Toast 재배치 결정](decisions/2026-10-31-gesture-dismiss.md).

| 항목 | 상태 | 착수 조건 |
| --- | --- | --- |
| 실기기 터치 QA | Playwright 마우스로만 검증. `touch-action`(Toast `pan-y`, `Sheet.Handle` `none`)은 걸었지만 실제 손가락으로 스크롤과의 다툼은 미확인 | 모바일 기기를 잡을 때. DatePicker 실기기 QA와 함께 |
| Sheet 단계 전환 제스처 | 미구현 — `size`는 소비자가 바꾼다 | 끌어서 fit → tall → full을 넘기자는 요구가 생기면(스냅 지점 정의 필요) |

### 사용 가이드 스킬 예제를 쓰며 드러난 문제 (2026-10-09)

P7에서 42개 컴포넌트 예제와 설명을 소스와 대조하다 나온 라이브러리 쪽 문제. 예제·설명은 지금 동작대로 적었다.

| 항목 | 상태 | 착수 조건 |
| --- | --- | --- |
| Button·Accordion 개발 경고 | `console.warn`이 렌더마다, 운영 빌드에서도 나온다 | 경고 정책을 정할 때 |
| DataTable 선택 칸 이름 | `"{caption} {rowKey} 선택"` — rowKey가 내부 id면 그대로 읽힌다 | 행 이름 열 지정 API가 필요해지면 |
| DatePicker 기본 locale | `en-US` | 소비자 기본값 요구가 생기면 |

### 전체 코드 점검 뒤 남긴 것 (2026-11-07)

점검 20건 중 19건은 [#77](https://github.com/DoGeol/dg-design/pull/77)(react 0.30.0·tokens 0.13.1)에서 고쳤다. 아래는 뺀 것.

| 항목 | 상태 | 착수 조건 |
| --- | --- | --- |
| Tooltip Escape | Dialog·Sheet·Popover 안 Tooltip에서 Escape를 누르면 아래 오버레이까지 닫힌다. "스택 미등록" 결정을 유지한다 | 사용처에서 문제가 보고되면 HoverCard처럼 스택에 등록 |
| DatePicker 입력 | ko-KR에서 24시간 입력 불가(`hourCycle` 미노출). 연도 `0000`이 `0001`로 정규화된다. 단일 picker에서 오류 알림이 두 번 뜬다. en-US에서 `2026-2-3`이 파싱되지 않는다 | DatePicker를 손볼 때 |
| Select·MultiSelect Tab | Tab으로 포커스가 나가도 목록이 열린 채 남는다(APG는 닫는다) | 오버레이 닫힘 정책을 정할 때 |
| Accordion 중첩 방향키 | 닫힌 항목 안 중첩 Accordion의 트리거로 ArrowDown이 간다(inert라 포커스가 멈춘다) | Accordion을 손볼 때 |
| Popover 접근 이름 | Content `role="group"`에 이름이 없다(`aria-labelledby` 미연결) | Popover를 손볼 때 |
| Toast 낭독 | 미리 채워진 `role="status"`가 마운트되면 일부 스크린리더가 읽지 않는다 | 스크린리더 QA 때 |
| 작은 동작 | Checkbox: 클릭 후 indeterminate가 복구되지 않음. Button·CodeBlock: pending 중 native disabled로 포커스를 잃음. Button: `asChild`+`iconOnly` 경고 오탐. 끌어서 닫기: 빠른 플릭 일부가 속도 0으로 계산됨. dialog-stack: IME 조합 중 Escape에도 닫힘. Slider: controlled off-step 값의 fill | 해당 컴포넌트를 손볼 때 |
| tokens·빌드·CI | `createTheme` 무채색 판정 임계(1e-4)가 낮다. 테스트 `.d.ts`가 npm에 포함된다. `ci.yml`에 `permissions` 블록이 없다. VR 기준이 없으면 CI에서도 스킵된다 | 배포·CI를 손볼 때 |

## 알아두면 첫 시도에서 안 틀리는 것

실측으로 확인된 것들 — 재현 경로와 근거는 `docs/decisions/`에 있다.

| 사실 | 영향 |
|------|------|
| jsdom은 `animationDuration`이 `auto`라 `use-presence`의 `exitDurationMs`가 **항상 0** | 오버레이 퇴장·재열림은 유닛 테스트로 검증 불가. `apps/visual-regression/tests/overlay-exit.spec.ts`가 그 구간을 담당한다 |
| `playwright.config`의 `use.reducedMotion`이 `matchMedia`에 **반영되지 않는다** | reduced-motion 검증은 테스트마다 `page.emulateMedia()`로 직접 걸어야 한다 |
| VR은 `*--state-matrix`를 우선 집는다 | 기능 테스트용 데모 스토리는 **닫힌 상태로** 둔다(열어두면 오버레이가 트리거를 덮어 클릭이 막힌다) |
| 퇴장 애니메이션 keyframes는 `internal/overlay-motion.css`에 공용으로 있다 | 새 오버레이는 값이 같으면 그것을 참조한다. 진짜 다른 모션만 자기 파일에 |

## 처리된 것

30건 중 30건. 큰 갈래만:

- **P1 6건** — 중첩 오버레이가 조상을 닫던 문제, controlled 리셋 미반영, Field 미연동 3종, z-index 부재, 보조 텍스트 AA 미달, CSS 트리셰이킹 차단
- **기능 공백** — Toast(+ live region 정책 신설) · Alert · Spinner · Progress · Button loading · Button critical intent
- **버그 6건** — 사라진 옵션 선택, RadioGroup 접근 이름, ContextMenu 포커스 소실, Tooltip 그룹 스킵, 닫히는 오버레이 inert, DropdownMenu ArrowUp
- **테스트 인프라** — Button 테스트 신설, 오버레이 퇴장·재열림 Playwright 커버리지
- **다듬기 8건** — keyframes 공용화, 닫힘 prop·`initialFocusRef` 비대칭 해소, `aria-controls`·`aria-hidden` 보강, i18n 경로, 테두리 정책, easing 토큰
- **D1·D2** — compound 서브컴포넌트 named export, `Tabs.Content` tabIndex override. 근거는 [compound named export 결정](decisions/2026-09-06-compound-named-exports.md)
- **C3 색 회귀** — 스크린샷 테스트에 색 텍스트 스냅샷(`*.txt`) 추가. 임계 없음이라 1값 차이도 잡히고 `-u`가 항상 갱신. 근거는 [배포 자동화 결정](decisions/2026-09-06-release-automation.md)의 후속 항목
- **릴리스 운영** — npm trusted publishing + changesets/action으로 자동화. 근거는 [배포 자동화 결정](decisions/2026-09-06-release-automation.md)
- **스킬 예제 점검 4건** — ContextMenuItem `tabIndex`, StatePanel.Loading `aria-live`, FileInput 라벨, Field.ErrorMessage 사용자 `id`. [#58](https://github.com/DoGeol/dg-design/pull/58)(react 0.27.0). StatePanel 스크린리더 청취는 미검증
- **A5 완료** — Tabs에 이어 Skeleton·Avatar·Separator·Collapsible·Accordion 추가. Accordion duplicate value ID P1 수정과 독립 재QA까지 완료
