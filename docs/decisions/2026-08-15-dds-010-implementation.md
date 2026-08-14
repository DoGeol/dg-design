# DDS 0.1.0 구현 중 결정 기록

- 날짜: 2026-08-14 (구현 당일) / 기록 2026-08-15
- 상태: 반영 완료 — 전부 0.1.0에 포함됨
- 스펙: [아키텍처](../specs/archive/2026-08-14-dds-architecture.md) · [토큰 체계](../specs/archive/2026-08-14-dds-token-system.md)

스펙이 위임했거나 구현 중 드러난 결정들. 스펙 단계에서 이미 판정된 것은 여기 없다.

## 빌드·배포 결정

| 결정 | 선택 | 이유 |
|------|------|------|
| Vite lib mode에서 CSS side-effect 소실 | CSS를 `rollupOptions.external`(`/\.css$/`)로 파이프라인에서 제외 + `closeBundle`에서 `src/**/*.css`를 dist로 raw copy하는 자체 플러그인 | preserveModules가 `import "./button.css"`를 `/* empty css */`로 지워버림 — 스펙 "남은 위험" 적중. seed는 CSS 패키지를 bunchee로 따로 빌드해 회피하지만 DDS는 한 패키지라 우회 채택. 컴포넌트 증가 시 자동 커버 |
| tokens 생성물(dist) 커밋 여부 | gitignore 유지 | CI가 generate → build 순서라 클린 체크아웃 문제 없음. npm tarball에는 `files: ["dist"]`로 포함 |
| tokens npm `files` | `["dist"]`로 한정 | src TS 원본이 exports 미노출인데 tarball 절반 차지. 소스는 공개 저장소가 담당 |
| tokens `publishConfig.access` | `public` 명시 | scoped 패키지 기본값 restricted — publish 시점 거부 예방 |
| storybook 앱 패키지명 | `@dg-design/storybook`으로 개명 | `"storybook"`이 devDep storybook과 동명 → changesets 그래프 빌더가 자기 자신을 의존성으로 오인해 크래시. version 필드 추가는 증상만 가리고 개명이 근본 해결 |
| tokens 타입 체크 | devDependency 0 유지 (tsc 없음) | generate 실행 자체가 런타임 검증이고 대비 검사가 값 오류를 잡음. 타입 표면은 소비 검증 앱의 tsc가 커버 (잘못된 variant가 TS2322로 잡히는 것까지 확인) |
| Storybook TypeScript 버전 | 5.9.3 (7.x 보류) | react-docgen-typescript 플러그인의 TS7 호환 미검증. 문제없음이 확인되면 올림 |

## 토큰 값 결정 (스펙이 "구현 시 확정"으로 위임)

| 항목 | 값 | 이유 |
|------|-----|------|
| palette lightness 배열 | `[0.970, 0.929, 0.869, 0.760, 0.640, 0.540, 0.450, 0.360, 0.270, 0.180]` (비선형, 어두운 쪽 밀집) | 균등 분할이면 700이 흰 글씨 4.5:1을 아슬아슬하게 통과 — 700을 L 0.45로 내려 7.18:1 확보. 다크 모드 weak 계열(700~900)도 검사 대상이라 아래쪽 여유가 우선 |
| brand chroma 곡선 | 스텝별 sRGB 상한의 85~90% (`0.030~0.100`) | 균일 chroma는 gamut 검사가 즉시 실패시킴 (brand-700 linear R < 0). hue 195의 최대 chroma는 L≈0.87 정점에서 양끝으로 급감 |
| `fg-brand-contrast` | light 흰색 / dark `gray-1000` | 다크에서 solid가 밝은 청록이라 흰 글씨는 대비 미달 — 모드 분기 필수 |
| 스펙 "남은 위험" 완화책 | 미사용 | chroma 낮추기·밝은 청록 fg 없이 흰 글씨 + solid 700 유지로 통과 |

## 컴포넌트 값 결정 (스펙이 위임)

| 항목 | 값 |
|------|-----|
| 가로 패딩 | small `x3`(12px) / medium `x4`(16px) / large `x5`(20px) |
| size별 타이포 | small `t3` / medium `t4` / large `t6` (seed action-button 매핑 참고) |
| 포커스 링 | `outline 2px + offset 2px` (`x0_5` 재사용, seed 동일) |
| pressed data-attribute | `[data-pressed]` (seed의 `[data-active]` 대신 — DDS 어휘가 pressed로 일관) |
| 라벨 font-weight | bold 고정 (seed 동일) |

## Tailwind 브릿지

| 결정 | 선택 | 이유 |
|------|------|------|
| 브릿지 범위 | semantic 색 22개만 (dimension/radius 제외) | 합격 조건은 `bg-*` 유틸만 요구. 추가는 언제든 non-breaking |
| 유틸명 이중 접두 (`bg-bg-brand-solid`) | 유지 | `@theme` 키 = 토큰 이름 1:1 원칙. 접두를 벗기면 fg/bg가 하나의 `--color-*` 네임스페이스에서 충돌 |

## 운영 메모

- publish는 npm 웹 재인증이 필요해 계정 소유자가 터미널에서 직접 실행해야 한다
- 신규 패키지는 publish 직후 read 레플리카 전파에 수 분 걸린다 — `npm view` 404여도 재publish가 403("cannot publish over previously published")이면 성공한 것
