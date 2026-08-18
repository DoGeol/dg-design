# 테마 생성기 구현 중 결정 (createTheme·브릿지·계약 문서)

- 날짜: 2026-08-19
- 스펙: [테마 생성기](../specs/archive/2026-08-19-theme-generator.md)
- 상태: 활성

웨이브 0(색 수학 재편) → 웨이브 1 병렬 3. createTheme 에이전트가 API 과부하(529)로 두 번 죽어 **본체는 감독이 직접 구현**했다. 나머지는 에이전트 산출.

## 가장 중요한 발견 — 솔버 비단조 버그와 스펙 전제의 반전

gamut 경계가 chroma에 대해 단조라는 가정이 **hue 264(진청)에서 깨진다**. linear R 채널이 chroma의 3차식이라 중간에서 음수로 파였다 되돌아온다(c≈0.167 밖 → c≈0.188 안). 순수 이진 탐색은 "되돌아온 지점"을 최대치로 잡아, 그 아래 비율점(× CHROMA_RATIO_PROFILE)이 gamut 밖에 걸렸다.

거친 스캔(1e-3)으로 첫 이탈 구간을 찾고 그 안에서만 이진 탐색하는 **전 구간 안전 접두** 방식으로 고쳤다 — 결과 이하의 모든 chroma가 안전해져 비율 곱이 항상 통과한다.

고치고 나니 **360개 hue 전수 스윕이 전부 대비 검사를 통과**했다. 스펙이 "노랑 계열 미지원"을 전제로 거부 경로를 설계했는데, 매핑이 lightness 고정이라 hue만으로는 검사가 깨지지 않는다 — **어떤 유채색 브랜드든 지원**이 실측 결론이다. 거부 경로는 무채색(hue 추출 불가)·파싱 오류에서 실동작하고, 대비 실패 진단 형식은 셀프체크가 계약으로 고정한다(회귀 시 스윕 단언이 알려준다).

## createTheme

- hue 추출은 color-core의 OKLab 행렬 역방향을 직접 구현(의존성 0 유지). 무채색(a·b ≈ 0)은 hue가 무의미하므로 임의값 대신 거부
- 헤더가 소비자용으로 다르므로 `tokensCss(palette, header?)`로 파라미터화 — 기본값이 현행 문자열이라 generate 산출 불변(diff 0 재확인)
- 런타임 방출: 신규 devDep 없이 기존 tsc(`rewriteRelativeImportExtensions`)로 dist에 JS+d.ts. TS6은 `rootDir` 명시 필수(TS5011)
- index.js/index.d.ts는 generate가 방출하므로 재수출 줄을 그 문자열에 추가 — 타입 union(생성물)과 런타임 export의 이원화를 한 파일에서 해소
- CLI shebang은 publint가 잡았다 — bin 파일은 `#!/usr/bin/env node` 필수
- 셀프체크는 tokens `build` 체인에 편입(대비 검사와 같은 지위) — 러너 추가 없이 Node assert

## 에이전트 산출분 (웨이브 0·1)

- color-core 분할은 파일 하나(216줄) — 더 쪼개면 import만 는다. palette만 인자화, 나머지는 직접 import(팩토리 없음)
- 무회귀 검증은 sha256 + HEAD 버전 재실행 교차까지 — 기준 자체를 검증했다
- Tailwind 실측 3건: `rounded-r-full`이 Tailwind 방향 접두 문법과 충돌(r-full 바인딩 제외, 네이티브 rounded-full로 충분) · `--spacing-x*`는 기본 배수 변수(`--spacing`)와 키가 달라 공존 · duration/z는 v4 theme 네임스페이스가 아님(괄호 임의값 `z-(--dds-z-toast)` 문법 안내)
- 문서의 @layer 주장은 브라우저 렌더 + Tailwind 소스 실물로 실증

## 릴리스 메모

changeset은 tokens minor 단독(react 무변경). 커밋 분리에서 브릿지가 재편 커밋에 합류했다 — 웨이브 0이 둘을 같은 파일(color-core)로 함께 냈고, 한 파일을 두 역사로 쪼개는 것은 오류 위험이 커서다.
