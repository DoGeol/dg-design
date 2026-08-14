# Badge + intent 축 구현 중 결정

- 날짜: 2026-08-15
- 스펙: [specs/archive/2026-08-15-badge-intent-axis.md](../specs/archive/2026-08-15-badge-intent-axis.md)
- 실행: Workflow 병렬 3태스크 (tokens opus·high / Badge sonnet / changeset haiku·low), 감독 검증·판정

## 감독 판정

**D1. warning solid 반전 승인** — 에이전트 결정. 스펙의 "어두운 contrast fg"를 700 계열 solid에 붙이면 light에서 2.51:1로 깨지고, 어두운 황색은 갈색으로 읽혀 경고 신호가 아니다. `bg-warning-solid`를 light warning-400 / dark warning-300(밝은 황색)으로 뒤집고 `fg-warning-contrast`는 양 모드 gray-1000. 실측 8.65:1(light)·12.57:1(dark). 다크가 한 단계 밝은 방향성은 brand와 동일.

**D2. INTENT_CHROMA를 brand 실측 비율로 재조정** — 감독 직접 수정. 스펙 문구 "상한의 85~90%"는 BRAND_CHROMA 주석에서 온 것인데 실제 brand 값은 밝은 스텝(100~300)에서 상한의 54~77%로 물러나 있었다. 균일 87% 적용 결과 positive-300이 `#50fa64`(네온)로 패밀리 이탈 — brand의 스텝별 비율 프로파일(0.69 0.54 0.64 0.77 0.84 0.89 0.88 0.89 0.89 0.86)을 4개 hue 상한에 곱해 재산출. positive-300 → `#83f289`. "기존 방식 유지"라는 스펙 의도가 문구보다 우선한다고 판정. 대비·gamut 전부 재통과.

## 위임돼 구현 중 정해진 값 (ownDecisions)

- **hue 실값**: 시작점 그대로 확정 — critical 25, positive 145, warning 85, informative 250. 무튜닝 통과. `INTENT_HUES`로 export
- **semantic 스텝 매핑**: brand 패턴 그대로(solid light 700/dark 400, weak light 100/dark 900, fg light 800/dark 300, contrast gray-00/gray-1000). warning만 D1 반전. critical·positive·informative 무조정 통과
- **Badge 치수**: medium = h x5(20px)/r1/t1/pad x1_5, large = h x6(24px)/r1_5/t2/pad x2. Button 최소(small x9)보다 뚜렷이 작게, seed badge 근사
- **variant 웨이트**: solid=bold, weak=regular (seed의 웨이트 대비 관습 축소 반영)
- **Badge 타입**: `React.HTMLAttributes<HTMLSpanElement>` extends — 기본 span, asChild 시 Slot 위임
- **비인터랙티브 CSS**: cursor/user-select 규칙 제외 (Button과 달리 클릭 컨트롤 아님)

## 위험 결과

- "황색 위 황색"(fg-warning on bg-warning-weak) — **실현 안 됨.** LIGHTNESS 공유로 L 격차가 커서 10.02:1
- warning 다크 방향 — 실측으로 확정: dark solid(#facd6d 밝은 황) 위 gray-1000이 12.57:1, 흰 글자였다면 1.4:1
- radix-slot react 19 peer — 문제없음, 설치·빌드·publint 그린
- 부작용 기록: 다크에서 `fg-warning`과 `bg-warning-solid`가 둘 다 warning-300으로 동일값. fg-warning은 weak·layer 배경 전용이라 잘못된 조합 아님. 갈라야 하면 dark solid를 400으로(8.65:1로 여전히 통과)

## 검증 요약

파이프라인 generate(대비 58건 ✓)·typecheck 3/3·build·publint 그린. Storybook 실측: 라이트·다크 24조합, asChild 앵커 렌더, truncate ellipsis 동작(scrollW 134 > clientW 120). 교차 검증: badge.css 참조 토큰명 24/24가 생성된 tokens.css에 존재.
