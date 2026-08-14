# Badge + intent 축 완성

## 메타
- 생성: 2026-08-15
- 라운드: 7
- 최종 모호도: 12% (임계값 20%)
- 유형: 브라운필드
- 상태: 통과
- 근거: [docs/decisions/2026-08-15-badge-intent-axis.md](../../decisions/2026-08-15-badge-intent-axis.md)
- 승인: 승인됨 (2026-08-15, 구현 계획 경로)
- 구현: **완료** — 0.2.0 준비 (2026-08-15). 합격 조건 12/12

## 명확도
| 차원 | 점수 | 가중치 | 가중 점수 |
|------|------|--------|-----------|
| 목표 | 0.90 | 0.35 | 0.315 |
| 제약 | 0.90 | 0.25 | 0.225 |
| 성공 기준 | 0.85 | 0.25 | 0.213 |
| 맥락 | 0.90 | 0.15 | 0.135 |
| **모호도** | | | **12%** |

## 구성요소
| 구성요소 | 상태 | 설명 | 커버리지 |
|----------|------|------|----------|
| 토큰 확장 | 진행 | palette 램프 4개 + semantic 16개 + 대비 검사 24건 | hue 프로세스·warning 전략 확정 |
| Badge 컴포넌트 | 진행 | intent 6 × variant 2 × size 2, asChild, truncate | 축·엘리먼트·오버플로 확정 |
| 릴리스 0.2.0 | 진행 | tokens·react minor changeset | 기존 관례 그대로 |

## 목표

예약만 돼 있던 critical/positive/warning/informative intent에 palette 램프와 semantic 토큰 실값을 넣고, 그 첫 소비자로 텍스트 라벨용 Badge 컴포넌트를 만들어 0.2.0으로 릴리스한다.

## 제약

- **palette**: 새 hue 램프 4개. 시작점 critical≈25(적)·positive≈145(녹)·warning≈85(황)·informative≈250(청), **실값은 gamut 검사(sRGB 이탈 시 생성 실패)와 대비 검사 통과값으로 구현 중 확정**. 기존 `ramp()` + `LIGHTNESS` 공유 + 스텝별 chroma 배열(상한의 85~90%) 방식 유지
- **semantic**: intent당 base 4개 — `bg-{intent}-solid`, `bg-{intent}-weak`, `fg-{intent}`, `fg-{intent}-contrast` = 16개. hover/pressed 없음
- **warning 대비 전략**: `fg-warning-contrast`는 어두운 값(gray-1000 계열) — 황색 solid 위 흰 글자는 4.5:1 불가. 나머지 3종 intent는 brand와 같은 방향(light: gray-00)
- **대비 검사**: intent당 3쌍(`fg-{i}-contrast` on `bg-{i}-solid`, `fg-{i}` on `bg-{i}-weak`, `fg-{i}` on `bg-layer-default`) × 2모드 = 24건. 전부 min 4.5
- **Badge 축**: `intent` 6종(brand·neutral·critical·positive·warning·informative) × `variant`(solid·weak) × `size`(medium·large). 기본값 neutral·weak·medium (seed와 동일)
- **엘리먼트**: `<span>` 기본 + `asChild` prop. Slot은 `@radix-ui/react-slot` 의존성 추가 (조사: 주간 1.78억 DL, 3주 전 릴리스, seed 선례. Base UI는 rc 8개월 정체 + 통짜 패키지라 탈락 — Dialog 단계에서 재검토 가능)
- **truncate prop**: boolean, 기본 false. true면 label에 `max-width: 100%; overflow: hidden; text-overflow: ellipsis`. seed식 maxWidth clamp(폰트 스케일 연동)는 도입하지 않음
- **CSS 관습**: `@layer dds`, `.dds-badge--intent_*` 클래스, 수기 CSS + CVA. 비인터랙티브 — hover/pressed/disabled/focus 규칙 없음
- **빌드**: radix-slot은 `dependencies` 추가 → vite external에 자동 포함(pkg.dependencies 순회). Tailwind 브릿지·타입은 `semanticColors` 순회라 자동 반영

## 하지 않을 것

- outline variant — stroke 토큰 축은 Checkbox 단계에서 신설
- 새 intent의 hover/pressed 토큰 — 인터랙티브 소비자 등장 시. 이름 예약도 안 함
- dot·count 변형 — NotificationBadge는 별개 컴포넌트로 나중에 (seed 구조와 동일)
- size small — 필요해지면 추가는 비파괴적
- maxWidth 자동 말줄임 — truncate opt-in으로 대체
- 테스트 프레임워크 — 로직 컴포넌트 아님, 트리거 전
- Button에 asChild 소급 적용 — 별도 작업으로

## 합격 조건

- [ ] palette에 critical/positive/warning/informative 램프 40개 값 추가, `pnpm generate` gamut 검사 통과
- [ ] semantic 토큰 16개 추가, light/dark 쌍 완비
- [ ] `fg-warning-contrast`가 어두운 값으로 warning solid 위 4.5:1 통과 (양 모드)
- [ ] 대비 검사 24건 추가되고 전부 통과 — 검사 목록에 명시적으로 존재 (규칙 생성 아님)
- [ ] `tokens.css`·`tailwind.css`·`index.d.ts`에 새 토큰 자동 반영 확인
- [ ] Badge: intent 6 × variant 2 × size 2 = 24조합 렌더, 기본값 neutral·weak·medium
- [ ] `asChild`로 `<a>` 등 임의 엘리먼트에 클래스·스타일 위임 동작
- [ ] `truncate` true + 좁은 컨테이너에서 말줄임, false면 nowrap 유지
- [ ] `@dg-design/react`에 `@radix-ui/react-slot` 의존성, vite external 반영, publint 통과
- [ ] Storybook: intent × variant 매트릭스 스토리 + 다크 토글에서 24조합 확인
- [ ] `pnpm generate`·`typecheck`·`build` 전부 그린
- [ ] tokens·react minor changeset 작성 (0.2.0)

## 드러난 가정과 결론

| 가정 | 어떻게 흔들었나 | 결론 |
|------|----------------|------|
| hue는 스펙에서 실값 확정해야 한다 | gamut 검사가 이미 생성 게이트라 프로세스만 정하면 됨 | 관례 hue 근방 시작, 검사 통과값으로 구현 중 확정 |
| warning도 흰 fg | 황색 4.5:1 물리적 불가 지적 | 어두운 fg — intent별 contrast 토큰이라 문법 안 깨짐 |
| dot·count는 Badge 변형 | seed가 별개 컴포넌트로 분리한 구조 제시 (반론 라운드) | 제외, NotificationBadge로 나중에 |
| span 고정이면 충분 | 사용자가 다형성 요구 | asChild 채택, Slot은 radix 단품 (Base UI 비교 조사 후 확정) |
| 말줄임은 내장 or 소비자 책임 양자택일 | 단순화 라운드에서 사용자가 제3안 제시 | `truncate` boolean prop, 기본 false |

## 기술 맥락

- `packages/tokens/src/tokens.ts` — `ramp()`, `LIGHTNESS`, `BRAND_CHROMA` 패턴, `semanticColors`, `contrastChecks` 명시 배열. 여기만 고치면 generate가 CSS·타입·검사 전부 처리
- `packages/tokens/src/generate.ts` — gamut 검사(`GAMUT_EPS`)·대비 검사 내장, 수정 불필요 예상
- `packages/react/src/button/` — Button.tsx(CVA + forwardRef)·button.css가 관습 원본. Badge는 `src/badge/`에 동형 구조
- `packages/react/vite.config.ts` — external이 `pkg.dependencies` 키 순회라 radix-slot 자동 처리
- `apps/storybook/src/Button.stories.tsx` — 스토리 관습 참조
- 대비 검사 상세는 [결정 기록](../../decisions/2026-08-15-badge-intent-axis.md)과 [2026-08-14 토큰 체계](../../decisions/2026-08-14-dds-token-system.md) 참조

## 남은 위험

- `fg-warning` on `bg-warning-weak`(황색 계열 위 황색 글자) 4.5:1도 만만치 않다 — fg를 800~900 스텝까지 눌러야 할 수 있음. gamut·대비 검사가 게이트라 조용히 깨질 수는 없음
- warning 다크 모드에서 어두운 fg 방향이 역전되는지(dark solid는 밝은 황색 → fg는 여전히 어두운 값이 맞는지) 구현 중 검증 필요
- radix-slot의 React 19 호환은 주간 1.78억 DL이 사실상 보증하나, peer 범위는 설치 시 확인

## 인터뷰 기록
<details><summary>전체 Q&A (7라운드)</summary>

### Round 0
**Q:** 구성요소 3개(토큰 확장·Badge·릴리스 0.2.0) 맞나 / **A:** 이대로 맞음

### Round 1
**Q:** hue 실값 확정 방식 / **A:** 관례 hue + gamut으로 구현 중 확정 / **모호도:** 42%

### Round 2
**Q:** size 축 / **A:** medium·large 2단 (seed 동일) / **모호도:** 27%

### Round 3
**Q:** warning solid 대비 전략 / **A:** 어두운 fg / **모호도:** 22%

### Round 4 (반론)
**Q:** dot·count가 Badge여야 하나 — seed는 별개 컴포넌트 / **A:** 제외, 나중에 별개로 / **모호도:** 19%

### Round 5
**Q:** 렌더 엘리먼트 / **A:** asChild 패턴 / **모호도:** 19%

### Round 6
**Q:** Slot 조달 (radix vs Base UI 조사 요청 → 실측 비교 제시) / **A:** @radix-ui/react-slot / **모호도:** 15%

### Round 7 (단순화)
**Q:** 말줄임 내장 vs 소비자 책임 / **A:** (제3안) truncate prop, 기본 false / **모호도:** 12%
</details>
