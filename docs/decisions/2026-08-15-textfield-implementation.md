# TextField·Field + 시각 회귀 구현 중 결정

- 날짜: 2026-08-15
- 스펙: [specs/archive/2026-08-15-textfield.md](../specs/archive/2026-08-15-textfield.md)
- 실행: Workflow 병렬 4태스크 (tokens sonnet / Field·TextField sonnet·high / VR opus·high / changeset haiku·low)

## 위임돼 구현 중 정해진 값 (ownDecisions)

**토큰**
- `stroke-critical`: light critical-600(5.59:1) / dark critical-500(5.08:1) — stroke-neutral과 스텝·여유 프로파일 동형, 기존 critical 스텝과 값 분리

**Field·TextField**
- Field는 `export const Field = { Root, Label, Description, ErrorMessage }` 객체 하나만 barrel 노출
- aria-describedby: Root가 Set으로 **실제 마운트된** description/error id만 보관, register가 해제 클로저 반환. invalid는 `has(errorId)`에서 파생 — StrictMode 이중 실행에 구조적으로 안전
- ErrorMessage `role="alert"` (암묵 aria-live=assertive), 별도 aria-live 없음
- focus는 outline 관습 채택 — Button·Checkbox·Switch와 통일. hover 테두리는 fg-neutral 재사용
- readonly: bg-neutral-weak + stroke-neutral-weak 테두리 — disabled와 시각 구분
- 치수: Button medium/large 스텝 그대로(h x10/x13), padding-inline x3/x4, width 100%
- `type` prop: text·email·password·tel·url·search·number 좁힌 유니언 (multiline만 금지라는 스펙 해석)
- vite lib.entry 미등록 — barrel 정적 re-export로 preserveModules 그래프 자동 포함 (기존 컴포넌트들도 동일했음)

**시각 회귀 (핵심 설계)**
- `apps/visual-regression` private 패키지, @playwright/test 1.62.1 정확 고정
- 서빙: 신규 의존성 없이 `vite preview --outDir storybook-static` (localhost 바인딩 실측)
- 스토리 열거: index.json 동적 — `/matrix|combination/i` 필터 + 컴포넌트당 첫 스토리 폴백. 새 컴포넌트는 이 패키지 무수정 자동 편입
- 다크: `?globals=theme:dark` (직접 속성 주입은 데코레이터가 지움) + `data-dds-theme` 실검증으로 조용한 실패 차단
- **스냅샷 경로에 {platform}** — git엔 linux/만. macOS 로컬은 구조적으로 '기준 없음 스킵', 폰트 거짓 diff가 정책이 아니라 경로로 차단
- `updateSnapshots: "none"` 명시 (기본 'missing'이면 기준이 조용히 생김), 갱신 모드 + 비linux = 코드 가드로 에러
- 기준 없음 = 경고 스킵(exit 0) — 첫 도입에 main CI 레드 방지
- 임계값 maxDiffPixelRatio 0.005, 플레이크 대응: animations disabled·fonts.ready 대기·요소 스크린샷(#storybook-root)·뷰포트 고정
- 갱신 경로는 visual-baseline.yml(workflow_dispatch, bot 커밋) 단독 — 로컬 갱신 진입점 자체를 안 만듦

## 위험 결과

- CI ubuntu 첫 기준 생성은 설계상 로컬 검증 불가 — 푸시 후 워크플로 첫 실행이 남은 유일한 미검증 경로
- Field context+forwardRef 타입 — mergeRefs 재사용으로 무사고
- 에이전트가 캡처 경로를 -u 우회로 실촬영 검증 후 전량 삭제 (저장소 이미지 0장, 다크 테마 주입 실작동 확인됨)

## 검증 요약

generate 58검사 ✓ · vitest 18/18(4파일) · typecheck 3/3 · build · publint 그린. VR 드라이런: TextField 자동 편입 10테스트(5컴포넌트×2테마) 전부 기준 없음 스킵 exit 0. Storybook 실측: 4상태×2사이즈 매트릭스, invalid 빨간 테두리, readonly 구분, Field 3필드 데모의 aria 연결(label 포커스·describedby 렌더분만·invalid 파생) 전부 정확.
