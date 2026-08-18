# 테마 생성기 + Tailwind 브릿지 보강 — 소비 프로젝트 커스터마이즈

## 메타
- 생성: 2026-08-19
- 라운드: 5
- 최종 모호도: 15% (임계값 20%)
- 유형: 브라운필드
- 상태: 통과
- 근거: 사전 분석 — "소비 프로젝트에서 테마·디자인 추가를 쉽게" 4문항 답변에서 갈래 확정(테마 생성기 + 브릿지 보강 선택)
- 승인: 승인됨 (2026-08-19, 구현 계획 경로)
- 구현: **완료** — 미배포 (2026-08-19). 합격 조건 10/11 + 1건은 전제 수정(노랑 거부 → 360 hue 전수 통과, 결정 기록 참조)

## 명확도
| 차원 | 점수 | 가중치 | 가중 점수 |
|------|------|--------|-----------|
| 목표 | 0.85 | 0.35 | 0.298 |
| 제약 | 0.85 | 0.25 | 0.213 |
| 성공 기준 | 0.85 | 0.25 | 0.213 |
| 맥락 | 0.85 | 0.15 | 0.128 |
| **모호도** | | | **15%** |

## 구성요소
| 구성요소 | 상태 | 설명 | 커버리지 |
|----------|------|------|----------|
| createTheme 생성기 | 진행 | brand hex → 전체 토큰 CSS, WCAG·gamut 검사 통과분만 방출 | 입력·전달·축·실패·스코프 확정 |
| Tailwind 브릿지 보강 | 진행 | @theme에 radius·spacing·typography·모션 바인딩 추가 | 색 유틸 무회귀 조건 포함 |
| 커스터마이즈 계약 문서 | 진행 | 공개/비공개 표면·@layer 규칙·오버라이드 예시 | 범위 확정 |
| 테스트·검증 | 진행 | 기본 팔레트 무회귀 게이트 + 실패 경로 검증 | 게이트 확정 |
| 릴리스 | 진행 | tokens minor changeset | 관례 |

## 목표

소비 프로젝트가 브랜드 hex 하나로 WCAG 검사를 통과한 자기 토큰 CSS를 생성하고, Tailwind 유틸과 문서화된 오버라이드 계약으로 컴포넌트를 안전하게 커스터마이즈할 수 있게 한다.

## 제약

### createTheme (`packages/tokens/`)

- **입력은 brand hex 하나**: `createTheme({ brand: "#FF6F0F" })`. hex에서 OKLCH hue만 추출한다 — lightness 스텝과 chroma는 DDS 규칙으로 재파생하므로 **입력 색 자체가 램프에 그대로 박히지 않을 수 있다**(일관된 톤·대비 보증의 대가). 이 사실을 문서·JSDoc에 명시
- **테마 축은 brand뿐**: gray hue는 현행 규칙대로 brand hue를 따라간다(차가운/따뜻한 중성 자동 연동, `GRAY_CHROMA` 유지). intent 4종·radius·spacing·타이포·모션은 DDS 고정
- **chroma 파생**: 임의 hue의 스텝별 chroma는 per-(L, hue) sRGB 상한 × **brand 실측 비율 프로파일**(0.69 0.54 0.64 0.77 0.84 0.89 0.88 0.89 0.89 0.86 — `tokens.ts:47` 주석의 그 값, 상수로 승격). 상한 계산은 이진 탐색 maxChroma 솔버 신규 — gamut 판정은 기존 `GAMUT_EPS` 재사용
- **기본 팔레트는 불변**: 기존 hue 195의 수작업 `BRAND_CHROMA` 배열은 그대로 둔다. 솔버×프로파일은 커스텀 hue 전용 — 기본 `dist/tokens.css` 산출값 동일이 절대 게이트다
- **검사는 전량 유지, 실패는 거부 + 진단**: 기존 `contrastChecks`·gamut 검사를 생성 전에 전부 실행. 미달 시 throw — 메시지에 실패한 쌍·실측 대비·조정 방향("더 진한/탁한 색을 시도")을 담는다. 자동 보정 없음("통과했다면 정말 통과한 것"이라는 보증이 이 기능의 상품이다). 노랑 계열 고채도 브랜드는 지원 밖으로 문서화(DDS 자신도 warning을 반전 규칙으로 풀었다)
- **전달은 JS 함수 + 얇은 CLI**: 함수가 core(CSS 문자열 반환, 의존성 0 유지), `bin`은 그 위 래퍼 — `npx @dg-design/tokens --brand "#FF6F0F" -o dds-tokens.css`. 실패 시 exit 1 + 진단 stderr
- **출력은 드롭인 교체**: `:root` + `[data-dds-theme="dark"]` 구조가 기존 tokens.css와 동일 — 소비 앱은 둘 중 하나만 로드한다. 다크는 semantic 모드 쌍에서 자동. selector 옵션·다중 브랜드 공존 없음
- **tailwind.css는 재생성 불필요**: 브릿지가 `var(--dds-*)` 참조라 브랜드 무관 — 기존 파일 그대로 쓴다는 것을 문서에 명시
- 내부 재편: `generate.ts`의 색 수학(OKLCH 변환·gamut·대비·CSS 방출)을 createTheme과 공유하도록 추출. 기존 `pnpm generate` 산출 무회귀가 게이트

### Tailwind 브릿지 보강 (`packages/tokens/src/generate.ts` → `dist/tailwind.css`)

- `@theme`에 추가 바인딩: radius(`--radius-r1…r-full` → `rounded-r2` 등), dimension(`--spacing-x1…x16` → `p-x4`·`gap-x2` 등), 타이포(`--text-t1…` — font-size·line-height 쌍), 모션(`--duration-fast/base/spin`, easing), z(`--z-overlay/toast`)
- **Tailwind v4 네임스페이스 실측 필수**: 특히 `--spacing-*` 추가가 기본 spacing 스케일을 대체하지 않는지(공존해야 한다) 실제 Tailwind 빌드로 확인하고, 대체된다면 프리픽스 등 대안을 정해 근거를 남긴다 (위임)
- 기존 색 유틸(`bg-bg-brand-solid` 형태) 무회귀

### 커스터마이즈 계약 문서 (`docs/customization.md` + README 링크)

- **공개 표면**: semantic 토큰(`--dds-color-*` 등 오버라이드 가능), `className` 병합, **`@layer dds` 규칙 — 레이어 밖 소비자 CSS가 특정도 무관하게 이긴다**(현존 최대 저평가 표면), 서브패스 import, createTheme
- **비공개 표면**: `.dds-*` 클래스, 컴포넌트 로컬 변수(`--dds-button-*`), palette 스텝 — 호환 보장 없음 명시
- 오버라이드 예시 3개: ① 토큰 몇 개만 덮기 ② Tailwind 유틸로 개별 인스턴스 ③ createTheme으로 전체 브랜드
- 로드 순서·react 패키지와의 버전 짝(신규 토큰 의존) 주의 포함

### 테스트·검증

- **절대 게이트: 기본 산출 무회귀** — 재편 후 `pnpm generate`의 `dist/tokens.css`·`tailwind.css`(기존 색 부분)가 값 동일
- createTheme 검증(tokens 관례대로 의존성 0 셀프체크 스크립트, 러너 추가 여부는 위임): 임의 hue hex(보라 계열 등)로 palette 61·semantic 47 전량 생성 + 검사 통과 / 노랑 계열(#FFD400급) 거부 + 진단 메시지 형식 / hex 파싱 경계(#fff 축약형·잘못된 문자열)
- CLI 스모크: 파일 출력·실패 exit 1
- 브릿지: 신규 유틸이 실제 Tailwind 빌드에서 동작하는지 스모크(스크래치 프로젝트), 기존 스토리북 무회귀
- 생성 CSS 드롭인 실증: 스토리북에서 tokens.css를 생성본으로 갈아끼워 렌더 확인(수동 1회, 근거 스크린샷 불요)

### 릴리스

- tokens minor changeset(인용 표기). react 무변경이면 tokens만

## 하지 않을 것

- **intent hue 커스터마이즈** — 의미색은 브랜드와 독립(R3). 수요 실측 시 별도
- **자동 보정** — 검사 실패를 스텝 재매핑으로 넘기지 않는다(R4). 예측 가능성이 보증의 일부
- **selector 옵션·다중 브랜드 공존·런타임 테마 전환 API** — 드롭인 교체만(R5). 수요 미실측
- **입력 hex의 램프 앵커링** — 정확한 색 일치 보장 안 함, hue만 취한다
- **노랑 계열 고채도 브랜드 지원** — 반전 규칙 자동화는 범위 밖, 문서로 한계 명시
- **비 Tailwind 프레임워크 전용 브릿지** — CSS 변수 자체가 중립이라 불필요
- **radius·spacing·타이포의 테마 축화** — 색만. 밀도 테마는 별개 수요

## 합격 조건

- [ ] 재편 후 `pnpm generate` 산출(`dist/tokens.css` 값)이 현행과 동일 — 기본 팔레트 무회귀
- [ ] `createTheme({ brand: "<보라 계열 hex>" })`가 palette 61·semantic 47 전량 생성, 대비·gamut 검사 전량 통과
- [ ] 생성 CSS가 `:root`+`[data-dds-theme="dark"]` 구조로 기존 tokens.css와 드롭인 호환(스토리북 갈아끼워 렌더 확인)
- [ ] 노랑 계열 고채도 hex 입력 시 생성 거부 + 진단(실패 쌍·실측 대비·조정 방향 포함)
- [ ] hex 경계 처리: `#fff` 축약형 허용, 파싱 불가 문자열은 명확한 에러
- [ ] CLI: `npx @dg-design/tokens --brand ... -o ...`로 파일 생성, 실패 시 exit 1 + stderr 진단
- [ ] 함수·CLI 모두 의존성 0 유지
- [ ] Tailwind 브릿지: `rounded-r2`·`p-x4`·`text-t4`·`duration-fast`급 유틸이 실제 빌드에서 동작(스모크), `--spacing-*` 공존 여부 실측 보고
- [ ] 기존 색 유틸·스토리북 무회귀, 파이프라인 그린
- [ ] `docs/customization.md`: 공개/비공개 표면 + @layer 규칙 + 예시 3종, README에서 링크
- [ ] tokens minor changeset(인용 표기)

## 드러난 가정과 결론

| 가정 | 어떻게 흔들었나 | 결론 |
|------|----------------|------|
| 생성기 입력은 hue 숫자 | 소비자가 가진 건 브랜드 hex라는 현실 제시 | hex 입력, hue만 추출 — 색 그대로 안 박힘을 문서화 |
| 전달은 함수 하나면 된다 | 비 Node 진입장벽 vs 표면 비용 | 함수 core + 얇은 CLI 래퍼 |
| 테마 축은 넓을수록 좋다 | 검사 매트릭스·특수 규칙(warning 반전) 파손 위험 | brand만, gray 자동 연동 |
| 검사 실패는 개발자 상황(관례 그대로) | 소비자 hex가 걸리는 경우(노랑 계열)를 반론으로 | 거부 유지 + 진단 메시지 — 자동 보정 없음 |
| 다중 브랜드 스코프 필요할 것 | 수요 미실측 지적 | 드롭인 교체만 |

## 기술 맥락

- `packages/tokens/src/tokens.ts` — `ramp(name, hue, chroma)` 파생 함수, `LIGHTNESS` 고정 스텝, hue 195 수작업 `BRAND_CHROMA`, intent는 "sRGB 상한 × 비율 프로파일" 방식이 주석으로 문서화됨(`:46-49`) — 이 방식을 임의 hue로 일반화하는 것이 핵심
- `packages/tokens/src/generate.ts` — OKLCH→sRGB(`:36`), gamut 판정(`GAMUT_EPS`, `:55-57`), 대비 계산(`:72-86`), alpha 합성(`:86`), CSS 방출(`tokensCss :149`, `tailwindCss :188`) 전부 존재하나 **스크립트 내부 함수** — 공유 모듈로 추출 필요. **maxChroma 솔버만 신규 수학**
- tokens 패키지: 의존성 0, bin 없음, 런타임 export는 타입뿐 — createTheme이 첫 런타임 공개 API
- 브릿지 `dist/tailwind.css`: `@theme`에 색만 바인딩, 전부 `var()` 참조라 테마 무관
- 컴포넌트 CSS 21종 전부 `@layer dds` — 소비자 CSS 우선 규칙의 근거
- react 서브패스 export(0.10.0)·`className` clsx 병합 — 문서화할 기존 표면

## 남은 위험

- **솔버×프로파일이 특정 hue에서 뭉개진 램프(저채도·회색화)를 낼 수 있다** — 검사는 대비·gamut만 보지 시각 품질은 못 본다. 스토리북 수동 확인을 문서에 권고로 남길 것
- Tailwind v4 `--spacing-*` 네임스페이스가 기본 스케일을 대체할 가능성 — 실측 전까지 미확정, 대체 시 명명 대안 필요
- 생성 CSS와 react 패키지의 버전 어긋남(구 생성본에 신규 토큰 누락) — 계약 문서의 버전 짝 절로 완화

## 인터뷰 기록

[2026-08-19-theme-generator-interview.md](2026-08-19-theme-generator-interview.md) 참조 (5라운드).
