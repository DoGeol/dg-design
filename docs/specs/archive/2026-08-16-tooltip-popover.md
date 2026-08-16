# Tooltip·Popover — 경량 오버레이 2종

## 메타
- 생성: 2026-08-16
- 라운드: 4
- 최종 모호도: 11% (임계값 20%)
- 유형: 브라운필드
- 상태: 통과
- 근거: 사전 토론 — use-overlay 자산으로 경량 오버레이 2종을 한 릴리스(0.9.0)로 확정
- 승인: 승인됨 (2026-08-16, 구현 계획 경로)
- 구현: **완료** — 0.9.0 준비 (2026-08-16). 합격 조건 11/12 확정 + VR 기준 1건은 워크플로로 완성

## 명확도
| 차원 | 점수 | 가중치 | 가중 점수 |
|------|------|--------|-----------|
| 목표 | 0.90 | 0.35 | 0.315 |
| 제약 | 0.85 | 0.25 | 0.213 |
| 성공 기준 | 0.90 | 0.25 | 0.225 |
| 맥락 | 0.90 | 0.15 | 0.135 |
| **모호도** | | | **11%** |

## 구성요소
| 구성요소 | 상태 | 설명 | 커버리지 |
|----------|------|------|----------|
| Tooltip | 진행 | hover+focus, Provider 그룹 지연 스킵, arrow | 트리거·지연·터치 확정 |
| Popover | 진행 | 자유 콘텐츠 비모달, autoFocus 겸용, arrow | 포커스 정책 확정 |
| 테스트·VR | 진행 | hover는 Playwright 필수, 열림 고정 스토리 | 확립 패턴 |
| 릴리스 0.9.0 | 진행 | react minor changeset | 관례 |

## 목표

use-overlay 자산 위에 Tooltip(Provider 그룹 지연·hover/focus 트리거)과 Popover(자유 콘텐츠·autoFocus 겸용)를 arrow 포함으로 만들어 0.9.0으로 릴리스한다.

## 제약

**Tooltip** (`packages/react/src/tooltip/`)
- compound: `Tooltip.Provider`(지연 그룹 스코프)·`Root`·`Trigger`(asChild)·`Content`(+arrow). barrel엔 Tooltip 하나
- **Provider + 그룹 스킵**: openDelay 기본 ~700ms(위임), 그룹 내 하나가 열려 있으면 인접 트리거 이동 시 지연 생략. closeDelay 소값 위임. Provider 밖 사용 시 단독 지연으로 동작(에러 금지)
- 트리거: hover(mouseenter/leave) + **focus(탭 포커스 포함 — `:focus` 기반, focus-visible 한정 아님)**. blur·ESC·스크롤에서 닫힘(위임 범위)
- 접근성: `role="tooltip"` + 트리거에 `aria-describedby` 자동 연결
- 색: `bg-neutral-solid` + `fg-neutral-contrast` 재사용(표준 반전 외관) — 새 토큰 0. 크기·radius·타이포 위임(작게 — t2 계열)
- 비인터랙티브 콘텐츠 전제 — 툴팁 안에 포커스 가능 요소 금지(문서화)
- 스택 미등록: 툴팁은 ESC 라우팅 대상이 아니라 자체 ESC 처리(열려 있을 때만)

**Popover** (`packages/react/src/popover/`)
- compound: `Root`·`Trigger`(asChild, 클릭 토글)·`Content`(+arrow)·`Close`. barrel엔 Popover 하나
- use-overlay 그대로: 비모달 스택 등록(ESC 라우팅)·외부 클릭 닫힘·presence·floating·단일 열림
- **autoFocus?: boolean 기본 true** — true면 열릴 때 Content 포커스 + 닫힐 때 트리거 복귀(Dialog 관례, inert 없음), false면 포커스 이동 없음
- 닫힘 prop: Dialog 관례대로 closeOnEscape·closeOnOutsideClick(이름 위임 — DropdownMenu는 의도적 미제공이었으나 Popover는 자유 콘텐츠라 제공)
- 패널: bg-layer-default + shadow-overlay + radius (DropdownMenu 계열), role 기본 dialog 아님 — 위임(role 없음 or group)

**공통 — arrow**
- floating-ui arrow 미들웨어 + 회전 사각형(또는 svg — 위임). flip 시 위치 자동. Tooltip 기본 on, Popover는 prop(기본값 위임)
- 애니메이션: duration-fast·easing-out, reduced-motion 대응

**테스트·VR**
- vitest: 지연 타이머(fake timers)·Provider 그룹 스킵·describedby·Popover autoFocus 양쪽·닫힘 prop·단일 열림. hover 이벤트는 jsdom 한계 내(mouseenter 디스패치)
- Playwright 기능 3~4: 실 hover 열림/이탈 닫힘(지연 포함), focus 열림, Popover 클릭 토글·외부 클릭, ESC
- VR: 열림 고정 스토리(arrow 포함) 라이트·다크. 스토리 id: `tooltip--functional-demo`·`popover--functional-demo` + StateMatrixStory
- **VR 교훈 적용**: 신규 스토리는 기준 없음 → 스킵 → 워크플로 생성 경로. 기존 기준 무영향
- changeset frontmatter 인용 + YAML 실검증

## 하지 않을 것

- 터치 전용 UX(long-press 등) — 탭 포커스 경로로 열리는 것까지만
- Tooltip 안 인터랙티브 콘텐츠 — 그건 Popover의 일
- HoverCard(리치 프리뷰) — 별개 수요
- Popover 모달 모드 — Dialog가 있다
- 전용 색 토큰 — 기존 재사용

## 합격 조건

- [ ] Tooltip: hover 진입 후 openDelay 경과 시 열림, 이탈 시 닫힘 (fake timers + Playwright 실측)
- [ ] Provider 그룹: 하나 열린 상태에서 인접 트리거 이동 시 지연 생략 (vitest)
- [ ] focus로 열림(탭 포커스 포함), blur 닫힘
- [ ] role=tooltip + aria-describedby 자동 연결
- [ ] Popover: 클릭 토글·외부 클릭·ESC 닫힘, 비모달(inert 0·잠금 0)
- [ ] autoFocus 기본 Content 포커스+복귀, false면 트리거 유지 (vitest 양쪽)
- [ ] arrow가 배치별로 올바른 변에 위치(flip 포함 — Playwright 또는 VR)
- [ ] 애니메이션 + reduced-motion, presence 재사용
- [ ] vitest 신규 그린(기존 101 무회귀) + Playwright 기능 3~4 그린
- [ ] VR 열림 고정 스토리 기준(워크플로 경유)
- [ ] Storybook: 두 컴포넌트 데모 + 매트릭스
- [ ] 파이프라인 그린 + react minor changeset(인용 표기)

## 드러난 가정과 결론

| 가정 | 어떻게 흔들었나 | 결론 |
|------|----------------|------|
| 단일 지연이면 충분 | 사용자가 Provider 그룹 스킵 선택 | Radix식 Provider 채택 |
| 포커스 정책은 한쪽 | 사용자가 겸용 요구 | autoFocus prop 기본 true |
| 터치 미지원(:focus-visible) | 탭 동작 질문 → 설명 후 선택 | **탭 포커스도 열림**(:focus 기반) — 표준과 의도적 이탈 |
| arrow는 사치 | 툴팁 관례 제시 | 둘 다 포함 |

## 기술 맥락

- `internal/use-overlay.ts` — Popover는 거의 그대로(onOpenFocus만 autoFocus 분기). Tooltip은 hover 트리거라 use-overlay의 클릭 중심 배선 중 일부만 재사용(스택 미등록·presence·floating) — 부분 재사용 판단 위임
- floating-ui arrow 미들웨어 — 이미 의존성에 있음
- 기존 테스트 101건 무회귀 게이트
- VR 임계 교훈(0.5% 아래 조용한 통과) — 신규 기준이라 무관하나 문서화된 관습 준수

## 남은 위험

- 탭 포커스 열림 채택으로 터치에서 "버튼 액션 + 툴팁 동시 발생" — 수용된 트레이드오프, 문서화 필요
- Tooltip이 use-overlay를 부분 재사용할 때 경계가 애매하면 복제가 나을 수 있다 — 구현 판단
- hover 지연 테스트의 CI 타이밍 플레이크 — Playwright 로케이터 대기 + 넉넉한 지연 마진 필요

## 인터뷰 기록
<details><summary>전체 Q&A (4라운드)</summary>

### Round 0
**Q:** 구성요소 4개 / **A:** 이대로 맞음

### Round 1
**Q:** 지연 설계 / **A:** Provider + 그룹 스킵 (권장안 뒤집음) / **모호도:** 45%

### Round 2
**Q:** Popover 포커스 / **A:** (제3안) autoFocus prop 겸용 / **모호도:** 36%

### Round 3
**Q:** arrow / **A:** 둘 다 포함 / **모호도:** 28%

### Round 4 (반론)
**Q:** 터치 미지원이 표준 (탭 동작 설명 경유) / **A:** 탭 포커스도 열림 / **모호도:** 11%
</details>
