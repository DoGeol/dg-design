# Checkbox·Switch 구현 중 결정

- 날짜: 2026-08-15
- 스펙: [specs/archive/2026-08-15-checkbox-switch-stroke-axis.md](../specs/archive/2026-08-15-checkbox-switch-stroke-axis.md)
- 실행: Workflow 병렬 4태스크 (tokens·react 각 sonnet·high / CI·changeset haiku·low), 감독 검증

## 위임돼 구현 중 정해진 값 (ownDecisions)

**토큰**
- `stroke-neutral`: light gray-600 / dark gray-500 — 실측 5.03:1 / 5.61:1 (min 3.0). 스펙이 경계값으로 지목한 light gray-500 대신 한 단계 진하게 — 대비 여유 + fg-disabled(gray-500)와 값 분리
- `stroke-neutral-weak`: light gray-200 / dark gray-800 — 검사 없음, bg-neutral-weak-hover 등과 스텝 재사용 (램프 재사용은 기존 관습)

**컴포넌트**
- Checkbox 박스: medium 16px(x4)/r1, large 20px(x5)/r1_5, 라벨 gap x2
- Switch 트랙: medium 32×20/썸 16, large 40×24/썸 20 — 폭≈높이 1.6배, 인셋 x0_5 고정
- Switch unchecked 트랙: `bg-neutral-weak`(+상태쌍) + `stroke-neutral` 테두리 — 상태쌍이 이미 있는 semantic 중 선택
- 썸·체크마크 색: `fg-brand-contrast` 재사용 — neutral·brand 트랙 양쪽에 대칭으로 대비
- indeterminate 시각: 채움 박스 + 가로줄 SVG (Radix/Material 관례 — 미체크와 명확 구분), CSS `:indeterminate` 의사클래스로 토글
- 트랜지션 150ms ease 하드코딩 — 모션 토큰 신설은 범위 밖
- `mergeRefs`를 `src/internal/`로 분리 — Checkbox·Switch 둘 다 forwardRef+내부 ref 병합 필요

**테스트 인프라**
- vitest 4.1.10 / jsdom 30.0.1 / @testing-library/react 16.3.2 / @testing-library/user-event 14.6.3 — 전부 정확 버전 고정(minimumReleaseAge 게이트 리스크 제거)
- **jsdom 버그 실전 확인**: `fireEvent.click()`은 disabled input의 네이티브 activation 차단을 구현하지 않는다 — disabled 테스트가 거짓 통과/실패. user-event의 `user.click()`으로 전체 통일
- jest-dom 미도입 — 네이티브 프로퍼티 직접 비교로 충분
- vitest globals 비활성 → testing-library 자동 cleanup이 안 걸림. `test-setup.ts`에 `afterEach(cleanup)` 명시 (DOM 누적 오류 실제 재현 후 도입)
- vite.config.ts dts에 `exclude: [테스트 파일]` 추가 — 없으면 테스트 d.ts가 dist에 샌다

## 위험 결과

- stroke 3:1 경계값 — 실현 안 됨 (gray-600 선택으로 5:1대 여유)
- Switch 트랙 대비 — 스펙 판단대로 검사 비대상 유지, 시각 실측 문제없음
- indeterminate SSR 프레임 — 계획대로 effect 유지, 테스트는 프로퍼티 반영만 보장
- vitest 의존성 게이트 — 정확 버전 고정으로 회피, 설치 1회 성공

## 검증 요약

generate 56검사 ✓ · vitest 7/7 · typecheck 3/3 · build · publint 그린. Storybook 실측: Checkbox 3상태×2사이즈×disabled, Switch 2상태×2사이즈×disabled, label 클릭 토글, role=switch, 다크 트랙 brand-400. reduced-motion·focus-visible 규칙 존재 확인. 교차: css 참조 토큰명 전건 tokens.css에 존재.
