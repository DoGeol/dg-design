# DropdownMenu — 비모달 오버레이 + floating 위치

## 메타
- 생성: 2026-08-16
- 라운드: 7
- 최종 모호도: 10% (임계값 10%, --deep)
- 유형: 브라운필드
- 상태: 통과
- 근거: 사전 토론 — 오버레이류 2번째로 DropdownMenu 확정(Dialog 자산 재사용, Select는 이것 기반으로 나중에)
- 승인: 승인됨 (2026-08-16, 구현 계획 경로)
- 구현: **완료** — 0.6.0 준비 (2026-08-16). 합격 조건 15/16 확정 + VR 기준 1건은 푸시 후 워크플로로 완성

## 명확도
| 차원 | 점수 | 가중치 | 가중 점수 |
|------|------|--------|-----------|
| 목표 | 0.90 | 0.35 | 0.315 |
| 제약 | 0.90 | 0.25 | 0.225 |
| 성공 기준 | 0.90 | 0.25 | 0.225 |
| 맥락 | 0.90 | 0.15 | 0.135 |
| **모호도** | | | **10%** |

## 구성요소
| 구성요소 | 상태 | 설명 | 커버리지 |
|----------|------|------|----------|
| floating 위치 | 진행 | @floating-ui/dom — flip·shift·autoUpdate | 의존성 확정, 옵션 위임 |
| 헤드리스 로직 | 진행 | roving tabindex·단일 열림·비모달 스택 등록·dismissal | 방식 전부 확정 |
| DropdownMenu 컴포넌트 | 진행 | compound 6종 + CSS + 모션 토큰 애니메이션 | 범위 확정, 치수 위임 |
| 테스트·VR | 진행 | vitest + Playwright 기능 + 열림 고정 스토리 | 확립 패턴 재사용 |
| 릴리스 0.6.0 | 진행 | tokens 변경 없으면 react minor 단독 | 관례 |

## 목표

트리거 옆에 뜨는 비모달 액션 메뉴 DropdownMenu를 @floating-ui/dom 위치 계산과 roving tabindex 키보드 내비게이션으로 만들어 0.6.0으로 릴리스한다.

## 제약

**floating 위치** (`packages/react`)
- `@floating-ui/dom` 의존성 추가(minimumReleaseAge 3일 게이트 — 성숙 버전 하한). flip·shift 기본, autoUpdate로 스크롤·resize 추적. placement 기본 bottom-start, prop으로 오버라이드(노출 범위 위임)
- vite external은 dependencies 순회라 자동

**헤드리스 로직** (`packages/react/src/dropdown-menu/` — Dialog 파일 규칙 동일: 훅 파일 분리)
- **비모달**: 배경 inert·스크롤 잠금 없음. `dialog-stack`에 modal 플래그 추가 — 비모달 엔트리는 ESC 라우팅만 참여(inert·잠금은 모달 엔트리만 계산). 기존 Dialog 동작 불변이 합격 조건
- **단일 열림**: 다른 메뉴가 열리면 기존 메뉴 닫힘 (메뉴 전용 모듈 레벨 처리)
- **키보드**: roving tabindex — 화살표 상/하 순환, Home/End, Enter/Space 선택, ESC 닫기. typeahead 없음
- **dismissal**: 외부 클릭 닫힘(리스너 구조 위임 — Dialog Overlay 방식과 달리 진짜 outside 판정 필요), ESC(스택 라우팅), 항목 선택 시 닫힘, 트리거 재클릭 토글
- **포커스**: 열릴 때 첫 항목(또는 Content — APG 관례 판단 위임), 닫힐 때 트리거 복귀. presence(use-presence)·모션 토큰 재사용
- controlled/uncontrolled 겸용 — useControllableState 재사용

**DropdownMenu 컴포넌트**
- compound 6종: `Root`·`Trigger`(asChild)·`Content`·`Item`·`Separator`·`Label`. barrel엔 DropdownMenu 하나
- `role="menu"`/`role="menuitem"`, Item disabled 지원(3중 매칭 관습)
- portal — Dialog의 컨테이너 패턴 재사용하되 비모달이라 inert 대상에서 제외됨(스택 modal 플래그가 처리)
- CSS: `@layer dds`, 패널 bg-layer-default + shadow-overlay + radius, Item hover/highlight는 bg-transparent-hover 계열 위임, 열림/닫힘 애니메이션(fade+scale 계열, duration-fast·easing-out — 메뉴는 Dialog보다 빠르게, 사양 위임), reduced-motion 대응
- 치수(패널 min-width·Item 높이·패딩) 위임 — 기존 dimension 토큰

**테스트·VR**
- vitest: 열림/닫힘, roving tabindex 이동·순환, 단일 열림(둘째 열면 첫째 닫힘), 항목 선택 닫힘, disabled 항목 건너뜀, aria role, controlled/uncontrolled
- Playwright 기능(기존 spec 패턴): 열기→화살표→Enter 선택, ESC 닫힘+트리거 복귀, 외부 클릭, **Dialog 안 메뉴에서 ESC가 메뉴만 닫음**(비모달 스택 검증)
- VR: 열림 고정 스토리 라이트·다크 (동적 열거 자동 편입), 기준은 visual-baseline 워크플로
- 스토리 id 규약: `dropdownmenu--functional-demo`·`dropdownmenu--in-dialog-demo`

## 하지 않을 것

- Sub(중첩 서브메뉴) — hover 인텐트·측면 포지셔닝 복합 난도, 수요 시 별도
- CheckboxItem·RadioItem — 선택형 항목은 수요 오면 비파괴 추가
- typeahead — Select 때 제대로 설계 (그쪽이 진짜 수요처)
- 모바일 시트 전환 — Sheet 컴포넌트 생긴 뒤 별도
- ContextMenu(우클릭) — 별개 컴포넌트
- Tooltip/Popover — floating-ui 기반은 같지만 별도 작업

## 합격 조건

- [ ] @floating-ui/dom 의존, 트리거 기준 배치 + 화면 경계에서 flip·shift 동작
- [ ] compound 6종 렌더, barrel엔 DropdownMenu 하나
- [ ] roving tabindex: 화살표 순환·Home/End·disabled 건너뜀 (vitest)
- [ ] Enter/Space·클릭 선택 시 onSelect 호출 + 닫힘 + 트리거 포커스 복귀
- [ ] 외부 클릭 닫힘, 트리거 재클릭 토글
- [ ] 단일 열림: 둘째 메뉴 열면 첫째 닫힘 (vitest)
- [ ] 비모달: 열려도 배경 inert 없음·스크롤 잠금 없음 (vitest 속성)
- [ ] dialog-stack modal 플래그 — 기존 Dialog 테스트 33건 전부 그린 유지
- [ ] Dialog 안 메뉴: ESC 1회에 메뉴만 닫힘 (Playwright)
- [ ] 열림/닫힘 애니메이션 + presence 재사용, reduced-motion 즉시
- [ ] role=menu/menuitem, aria 연결
- [ ] vitest 신규 그린 + Playwright 기능 3~4케이스 그린
- [ ] VR 열림 고정 스토리 라이트·다크 기준 (워크플로 경유)
- [ ] Storybook: functional·in-dialog 데모
- [ ] `pnpm generate`·`test`·`typecheck`·`build`·publint·`vr` 그린
- [ ] react minor changeset (0.6.0) — **frontmatter는 `"@dg-design/react": minor` 인용 표기** (0.5.0 때 YAML 미인용으로 version 실패한 이력)

## 드러난 가정과 결론

| 가정 | 어떻게 흔들었나 | 결론 |
|------|----------------|------|
| Dialog 스택 전면 재사용 | 반론 — 메뉴 관례는 단일 열림 | 단일 열림 + 스택엔 비모달 등록(ESC만) |
| floating 자체 구현(seed식) | radix-slot 전례·후속 재사용처 제시 | @floating-ui/dom 채택 |
| activedescendant가 현대적 | APG 메뉴 표준은 roving | roving tabindex |
| typeahead·Sub·모바일 시트 기본 포함 | 단순화 — 액션 메뉴 규모 지적 | 전부 제외, 수요 시 |

## 기술 맥락

- `packages/react/src/dialog/` — use-presence·use-controllable-state·portal 컨테이너·모션 토큰 재사용 원본. dialog-stack.ts에 modal 플래그 추가(기존 동작 불변 필수)
- `apps/visual-regression/tests/dialog-functional.spec.ts` — 기능 테스트 패턴 원본
- 스토리 매트릭스·StateMatrixStory 네이밍 → VR 자동 편입
- changeset frontmatter 인용 필수 — 0.5.0 사고 이력

## 남은 위험

- dialog-stack 수정이 기존 Dialog 회귀를 낼 수 있다 — 기존 vitest 33건 유지가 게이트
- 외부 클릭 판정과 트리거 재클릭 토글의 경합(외부 클릭이 트리거에서 발생하면 닫힘+재열림 이중 동작) — mousedown/click 단계 설계 주의
- floating autoUpdate의 jsdom 동작 — vitest에서는 mock 또는 위치 무관 로직만, 배치는 Playwright·VR
- 첫 항목 vs Content 초기 포커스는 APG 세부 해석 위임 — 구현 중 ownDecisions

## 인터뷰 기록
<details><summary>전체 Q&A (7라운드)</summary>

### Round 0
**Q:** 구성요소 5개 / **A:** 이대로 맞음

### Round 1
**Q:** floating 위치 계산 / **A:** @floating-ui/dom / **모호도:** 50%

### Round 2
**Q:** 키보드 포커스 모델 / **A:** roving tabindex / **모호도:** 43%

### Round 3
**Q:** compound 범위 / **A:** 기본 5종 + Label / **모호도:** 36%

### Round 4 (반론)
**Q:** Dialog 스택 재사용이 맞나 — 메뉴는 단일 열림 / **A:** 단일 열림 + 비모달 스택 등록 / **모호도:** 30%

### Round 5
**Q:** 서브메뉴(Sub) / **A:** 제외 / **모호도:** 25%

### Round 6 (단순화)
**Q:** typeahead / **A:** 제외 / **모호도:** 21%

### Round 7
**Q:** 모바일 시트 전환 / **A:** 제외 / **모호도:** 10% (잔여 위임 항목 정리 포함)
</details>
