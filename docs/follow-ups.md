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

시안 A(`apps/storybook/src/mockups/`)를 실제 컴포넌트로 그리면서 소비 측 우회가 필요했던 것. 시각 보정과 Badge truncate·Accordion hover radius는 처리됨.

| 우선 | 컴포넌트 | 공백 | 착수 조건 |
| --- | --- | --- | --- |
| 1 | Pagination | Previous·Next `disabled` prop 없음 — 지금은 `aria-disabled`+`data-disabled` 수동 | 바로 |
| 1 | DatePicker | `open`·`defaultOpen`·`onOpenChange` 없음(내부 state) | 바로 |
| 1 | DropdownMenu·ContextMenu | Item critical intent·단축키 슬롯 없음 — 소비 측 인라인 스타일 | 바로 |
| 2 | Popover·HoverCard | 화살표가 테두리·그림자 없는 흰 사각형이라 흰 배경에서 안 보임 | 바로 |
| 2 | Pagination | 현재 쪽 배경 대비 1.07:1 (`aria-current`는 있음) | 바로 |
| 2 | Checkbox·RadioGroup | `aria-invalid`는 걸리지만 오류 외관 없음. 회색 면 위 unchecked·disabled 식별 약함 | 바로 |
| 3 | MultiSelect | 옵션을 래퍼 컴포넌트로 감싸면 첫 열기 전 트리거에 값 문자열(`select-core.ts` 한계). 기존 StateMatrix 스토리가 이 패턴 | 스토리 수정 vs registry 개선 결정 후 |
| 3 | ContextMenu | `defaultOpen`만 주면 (0, 0)에 열림 | 초기 좌표 요구 시 |
| 3 | Button | 아이콘 전용 변형 없음 | 소비 요청 시 |
| 3 | Toast | 단독 렌더 API 없음, 표시 3개 고정(`MAX_VISIBLE`) | 소비 요청 시 |
| 3 | TextField·TextArea | 접두·접미 슬롯, 글자 수 표시 없음 | 소비 요청 시 |
| 3 | Switch | 라벨 왼쪽 배치 없음 | 소비 요청 시 |
| 3 | Breadcrumb | 기본 구분자 `/`·`…`가 텍스트 글리프, 생략 로직은 소비자 몫 | 소비 요청 시 |
| 3 | FileInput·Card | Dropzone·Trigger hover/pressed 없음, `asChild` 링크 카드 hover/focus 없음 | 소비 요청 시 |
| 3 | Accordion | Prefix가 있을 때 본문 시작선이 제목과 어긋남 | 바로 |
| 3 | Avatar | 크기 24/36/48/64가 토큰 아닌 고정 px | 토큰 정리 시 |
| 3 | Dialog | 열릴 때 프로그램 포커스에 링이 보임 — 시안 자동 열기 탓일 수 있음 | 실기기 확인 후 |

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
- **A5 완료** — Tabs에 이어 Skeleton·Avatar·Separator·Collapsible·Accordion 추가. Accordion duplicate value ID P1 수정과 독립 재QA까지 완료
