# Dialog 구현 중 결정

- 날짜: 2026-08-15
- 스펙: [specs/archive/2026-08-15-dialog.md](../specs/archive/2026-08-15-dialog.md)
- 실행: Workflow 병렬 4태스크 (tokens sonnet·high / Dialog opus·high / 기능 테스트 sonnet·high / changeset haiku·low)

## 위임돼 구현 중 정해진 값 (ownDecisions)

**토큰**
- `bg-overlay`: 양 모드 `gray-1000/0.5` 동일 — 오버레이는 표면색이 아니라 균일 감광막(seed도 static alpha 단일값). Tailwind bg-black/50·Material 관례와 일치
- `shadow-overlay`: semantic 분기 없이 비색상 단일 스케일 — 항상 오버레이 위에서만 쓰여 배경 명암 무관. `--dds-shadow-overlay`
- 모션: `duration-fast` 150ms / `duration-base` 200ms / `easing-out`(cubic-bezier(0,0,0.2,1), Material 감속) 1종만 — enter/exit 분리는 수요 오면

**Dialog 핵심 설계**
- **presence 폴백**: 상수가 아니라 Content의 computed animation/transition duration+delay를 읽어 +100ms 마진 — CSS가 길이의 단일 소스라 절단이 구조적으로 불가능. reduced-motion·CSS 미로드 시 계산 길이 0 → 즉시 언마운트 (감지 방식, 타임아웃 아님)
- **portal 컨테이너**: Root마다 body 직속 자기 div — inert 판정이 "body 자식 중 최상단 컨테이너 아닌 전부" 한 줄 규칙이 되고, portal 형제와 이전 다이얼로그를 동시에 커버
- inert는 우리가 부여한 것만 Set 추적 복원 — 원래 inert였던 요소 불간섭
- ESC: document 버블 리스너 1개(모듈 싱글턴). 최상단 closeOnEscape=false면 no-op, 아래로 안 흘러내림
- dismissal prop: `closeOnEscape`·`closeOnOverlayClick` (기본 true)
- 애니메이션: Overlay fade, Content fade+scale 0.96→1+2% 수직, duration-base·easing-out
- Trigger·Close에 asChild (기존 radix-slot 재사용) — DDS Button을 트리거로
- z-index 미지정 — body 마지막 DOM 순서로 해결, 소비자 z-index와의 경합값은 근거 없는 추측이라 보류
- `useControllableState`는 `src/internal/` (dialog 전용 아님)
- Content 치수: min(32rem, 100%−x8), padding x6, radius r4
- 소급 교체 실측: 150ms 하드코딩은 switch.css·text-field.css 2곳 (checkbox.css엔 없었음 — 스펙의 목록이 부정확했던 것)
- barrel이 Dialog 객체 하나뿐이라 Storybook meta.component 불가(TS4023) — 전 스토리 render 사용
- VR 스토리 래퍼에 minHeight:100vh — 루트 요소 스크린샷 bbox가 portal 영역을 덮게. VR 패키지 무수정

**기능 테스트**
- 배경 inert 실효: 클릭 타임아웃 대신 `trigger.focus()` 후 not.toBeFocused() — inert의 포커스 no-op 이용
- 스토리 부재 시 스킵 가드: index.json 미존재까지 스킵 (스크린샷 spec과 달리 하드 요건 아님)
- 오버레이 클릭은 뷰포트 모서리(4,4) — 마크업 세부 비의존

## 위험 결과

- presence 절단 — computed 길이 읽기로 구조 차단 (폴백 상수 자체를 제거)
- 포커스 복귀 대상 unmount — body 폴백 구현·테스트 통과
- inert jsdom 한계 — 계획대로 vitest 속성 + Playwright 실효 이원화, 기능 5/5
- 스펙의 "Checkbox 150ms" — 실제로는 checkbox.css에 트랜지션이 없었다. 대신 text-field.css가 대상

## 검증 요약

vitest 33/33(Dialog 14 신규) · 기능 테스트 5/5(2.1s) · generate(semantic 42) · typecheck · build · publint 그린. 감독 브라우저 실측: 열림(aria-modal·포커스·inert·잠금·0.2s), ESC 닫힘(inert 0·overflow 복원), 중첩(오버레이 누적 육안, ESC 최상단만·잠금 유지). VR에 dialog 스토리 2건 자동 편입 — 기준은 visual-baseline 워크플로 대기.
