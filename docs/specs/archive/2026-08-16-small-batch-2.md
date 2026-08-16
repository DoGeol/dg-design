# 소형 묶음 2 — NotificationBadge·HoverCard

## 메타
- 생성: 2026-08-16
- 라운드: 4
- 최종 모호도: 19% (임계값 20%)
- 유형: 브라운필드
- 상태: 통과
- 근거: 이전 스펙의 명시적 이월 — Badge 스펙("dot·count는 NotificationBadge로 나중에") + Tooltip·Popover 스펙("HoverCard는 별개 수요")
- 승인: 승인됨 (2026-08-16, 구현 계획 경로)
- 구현: **완료** — 0.9.0 준비 (2026-08-16). 합격 조건 10/12 확정 + VR 신규 기준 2건은 visual-baseline 워크플로로 완성

## 명확도
| 차원 | 점수 | 가중치 | 가중 점수 |
|------|------|--------|-----------|
| 목표 | 0.85 | 0.35 | 0.298 |
| 제약 | 0.75 | 0.25 | 0.188 |
| 성공 기준 | 0.80 | 0.25 | 0.200 |
| 맥락 | 0.85 | 0.15 | 0.128 |
| **모호도** | | | **19%** |

## 구성요소
| 구성요소 | 상태 | 설명 | 커버리지 |
|----------|------|------|----------|
| NotificationBadge | 진행 | count·dot 알림 배지, critical 기본 + brand | 색 축·count API·0 처리 확정 |
| HoverCard | 진행 | hover 전용 리치 프리뷰, 콘텐츠 hover 유지 | 키보드 정책·정체 확정 |
| 테스트·VR | 진행 | vitest + Playwright + VR 기준(워크플로 경로) | 확립 패턴 |
| 릴리스 0.9.0 | 진행 | react minor changeset | 관례 |

## 목표

count·dot 알림 배지(NotificationBadge)와 hover 전용 리치 프리뷰 오버레이(HoverCard)를 만들어 0.9.0으로 릴리스한다.

## 제약

**NotificationBadge** (`packages/react/src/notification-badge/`)
- 단일 요소 span + `asChild` (Badge 관례)
- props: `count?: number`, `max?: number = 99`, `isShowEmpty?: boolean = false`, `intent?: "critical" | "brand" = "critical"`
- 렌더 규칙: `count` 생략 → dot(무라벨) / `count > max` → `"{max}+"` / `count === 0` → 기본 미렌더, `isShowEmpty`면 "0" 표시
- 색: intent 2종 × solid만 — `bg-{intent}-solid` + `fg-{intent}-contrast` 재사용. **신규 토큰 0**, 대비 검사 기존 쌍 커버
- 치수: dot·pill 크기는 위임(seed 참고 — dot 6px, pill min 18px). 토큰 스케일에 6px 스텝이 없어 하드코딩 허용(Badge의 1px 테두리와 같은 관례). radius는 `r-full`
- CSS: `@layer dds`, `.dds-notification-badge--intent_critical` 등 기존 클래스 문법
- a11y: count 텍스트는 그대로 읽힘. dot은 장식 전제 — 의미 전달은 소비자가 aria-label 등으로(문서화). 접근 이름 자동 부여 안 함
- barrel: `NotificationBadge` + `NotificationBadgeProps` — **barrel 수정은 감독 직결** (AGENTS.md)

**HoverCard** (`packages/react/src/hover-card/`)
- compound: `Root`·`Trigger`(asChild)·`Content`(+arrow). barrel엔 HoverCard 하나(값만)
- 트리거: **hover 전용** — 포커스로 안 열림, 터치 미지원. Radix 관례대로 "시각 사용자 전용 보조 UI, 콘텐츠는 다른 경로로도 도달 가능해야 함"을 문서화
- **콘텐츠 hover 유지가 정체성**: 트리거→콘텐츠로 포인터 이동 시 열림 유지(closeDelay 안에 진입하면 닫힘 취소). Tooltip과의 차이가 정확히 이 지점
- 지연: openDelay 700 / closeDelay 300 기본(콘텐츠 이동 시간 확보 — Tooltip의 150보다 길게). prop으로 조정 가능
- Provider 그룹 없음 (Radix HoverCard에도 없음 — YAGNI)
- 닫힘: 포인터 이탈 + ESC. ESC 처리 방식(dialog-stack 비모달 등록 vs Tooltip식 자체 리스너)은 구현 판단 위임 — 인터랙티브 콘텐츠라 비모달 스택 등록을 우선 검토
- 포커스 이동 없음 — autoFocus 없음(hover 시맨틱, 포커스를 뺏으면 안 됨)
- 패널 스타일: Popover 계열 재사용(bg-layer + shadow-overlay + radius). **신규 토큰 0**
- arrow 포함(Tooltip·Popover 관례), 형태·기본값 위임. presence 애니메이션 + reduced-motion 재사용
- 재사용 경계: `use-tooltip-schedule` 일반화 vs 복제, `use-overlay` 부분 재사용 여부는 구현 판단(Tooltip 때와 같은 위임)

**테스트·VR**
- vitest: count 렌더 규칙 전체(생략·0·isShowEmpty·max 초과), intent 클래스, fake timers로 HoverCard 지연·콘텐츠 hover 유지·포커스 미열림. 기존 테스트 무회귀
- Playwright 기능: 실 hover 열림→콘텐츠 진입 유지→이탈 닫힘, ESC
- VR: NotificationBadge 매트릭스(dot·count·99+·intent 2종), HoverCard 열림 고정(arrow 포함) 라이트·다크. **신규 스토리는 기준 없음→스킵→visual-baseline 워크플로 생성 경로**

**릴리스**
- react minor changeset — frontmatter `@` 키 따옴표 인용 필수

## 하지 않을 것

- **NotificationBadgePositioner** — 소비 앱이 없어 부착 수요·오프셋 값 검증 불가(반론 라운드에서 제외 확정). Storybook 데모의 인라인 absolute 예시로 대체. 수요 실측 시 추가
- intent 6종 전체 — critical·brand 2종만. 실수요 없는 조합(warning dot 등)의 CSS·VR 비용 회피
- size 축 — dot/pill 구분은 count 유무로 충분. seed의 small/large 축은 안 가져옴
- HoverCard 포커스 열림·콘텐츠 탭 진입 — hover 전용 보조 UI로 확정(Radix 관례)
- HoverCard Provider 그룹·Close 버튼 — 수요 없음
- 터치 전용 UX — Tooltip 때와 동일
- 신규 색·치수 토큰 — 전부 기존 재사용

## 합격 조건

- [ ] NotificationBadge: count 생략 시 dot, count=5 시 "5", count=150·max=99 시 "99+" 렌더 (vitest)
- [ ] count=0 기본 미렌더, `isShowEmpty` 시 "0" 렌더 (vitest)
- [ ] intent 기본 critical, brand 지정 시 클래스 전환. 신규 토큰 0개 (vitest + generate 그린)
- [ ] HoverCard: hover 진입 openDelay 후 열림, 이탈 closeDelay 후 닫힘 (fake timers)
- [ ] 트리거→콘텐츠 포인터 이동 시 열림 유지 (fake timers + Playwright 실측)
- [ ] 포커스로 안 열림 (vitest)
- [ ] ESC 닫힘, 포커스 이동 없음 (vitest)
- [ ] arrow 배치 정상(VR로 확인)
- [ ] vitest 신규 그린 + 기존 무회귀, Playwright 기능 그린
- [ ] VR 신규 기준(워크플로 경유) 포함 파이프라인 그린
- [ ] Storybook: 두 컴포넌트 데모(NotificationBadge 부착 예시 포함) + 매트릭스
- [ ] react minor changeset(인용 표기), barrel 갱신은 감독 직결

## 드러난 가정과 결론

| 가정 | 어떻게 흔들었나 | 결론 |
|------|----------------|------|
| 알림색은 brand(seed) 아니면 축 전체 | 중간 갈래 제시 | critical 기본 + brand 선택, 2종만 |
| HoverCard도 Tooltip처럼 탭 포커스 열림 | 포털 탭 순서 단절·Radix 규정 제시 | hover 전용, 보조 UI 전제 문서화 |
| 오버플로는 소비자 몫(seed) | 관례 동작 내장 갈래 제시 | count·max 내장 + `isShowEmpty` (사용자 명명) |
| Positioner는 seed 따라 포함 | 반론: 검증할 소비 앱이 없다 | 제외, 데모로 대체 |

## 기술 맥락

- Badge 패턴: `packages/react/src/badge/Badge.tsx` CVA + intent 로컬 변수 2층 CSS — NotificationBadge가 그대로 따름 (intent 2종이라 더 작음)
- Tooltip 스케줄: `packages/react/src/tooltip/use-tooltip-schedule.ts` openDelay/closeDelay 타이머 — HoverCard가 일반화 또는 복제. Tooltip은 콘텐츠 hover 유지가 **없는** 구조(비인터랙티브 전제)라 HoverCard와 정확히 상보
- `internal/use-overlay.ts`는 클릭 중심(hover 옵션 없음) — Tooltip처럼 부분 재사용 판단 위임
- Popover 패널 스타일: `packages/react/src/popover/popover.css` — HoverCard Content 외관 재사용
- 토큰: intent별 solid·contrast 세트 기존재(`packages/tokens/src/tokens.ts`), 대비 검사 generate 내장
- seed 참고: `seed-design/packages/react/src/components/NotificationBadge/` (치수 참고용, Positioner·size 축은 안 가져옴)

## 남은 위험

- HoverCard ESC/스택 등록 방식이 구현 위임 — Tooltip(자체)·Popover(스택) 어느 쪽이든 기존 패턴 안이라 위험 낮음
- 트리거→콘텐츠 hover 이동의 CI 타이밍 플레이크 — Tooltip 때와 같은 마진 전략 필요
- dot 6px 하드코딩 — 토큰 스케일 밖 값(수용된 관례)

## 인터뷰 기록

[2026-08-16-small-batch-2-interview.md](2026-08-16-small-batch-2-interview.md) 참조 (4라운드).
