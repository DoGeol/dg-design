# TextField·Field + 시각 회귀

## 메타
- 생성: 2026-08-15
- 라운드: 6
- 최종 모호도: 16% (임계값 20%)
- 유형: 브라운필드
- 상태: 통과
- 근거: [docs/decisions/2026-08-15-badge-intent-axis.md](../../decisions/2026-08-15-badge-intent-axis.md) (로드맵 C)
- 승인: 승인됨 (2026-08-15, 구현 계획 경로)
- 구현: **완료** — 0.4.0 준비 (2026-08-15). 합격 조건 13/15 확정 + 2건(기준 이미지 생성·CI 실행)은 푸시 후 워크플로로 완성

## 명확도
| 차원 | 점수 | 가중치 | 가중 점수 |
|------|------|--------|-----------|
| 목표 | 0.85 | 0.35 | 0.298 |
| 제약 | 0.80 | 0.25 | 0.200 |
| 성공 기준 | 0.85 | 0.25 | 0.213 |
| 맥락 | 0.85 | 0.15 | 0.128 |
| **모호도** | | | **16%** |

## 구성요소
| 구성요소 | 상태 | 설명 | 커버리지 |
|----------|------|------|----------|
| TextField + Field 계열 | 진행 | compound Field + 한 줄 input | 구조·범위·상태 축 확정 |
| stroke-critical 토큰 | 진행 | error 테두리용, 3:1 검사 | 동형 확장 |
| 시각 회귀 인프라 | 진행 | Playwright 로컬, 기준 이미지 git | 도구 확정, 스토리 범위 위임 |
| 릴리스 0.4.0 | 진행 | tokens·react minor changeset | 관례 |

## 목표

Field compound(Label·Description·ErrorMessage)와 한 줄 TextField를 만들고, 컴포넌트 5개 도달로 발동된 시각 회귀 트리거를 Playwright 스크린샷 테스트로 이행해 0.4.0으로 릴리스한다.

## 제약

**토큰**
- `stroke-critical` — error 테두리. light/dark 쌍(critical 램프 스텝 위임), 대비 검사 `stroke-critical on bg-layer-default` min 3.0 × 2모드. stroke-neutral과 동형

**Field** (`packages/react/src/field/`)
- compound: `Field.Root`·`Field.Label`·`Field.Description`·`Field.ErrorMessage`. barrel은 `Field` 하나만 export
- Root가 React context로 id·invalid를 전파: Label→htmlFor, Description·ErrorMessage→aria-describedby 목록, ErrorMessage 렌더 존재 = invalid
- ErrorMessage는 `fg-critical`, role/aria-live는 구현 중 표준 관행으로 판단해 ownDecisions에

**TextField** (`packages/react/src/text-field/`)
- 한 줄 `<input>` 전용. textarea 없음, multiline prop 없음
- Field 안: context에서 id·invalid·describedby 자동 연결. **단독 사용도 동작** — context 없으면 자체 id 생성(useId)
- 상태 축: 기본 → hover(테두리 강조) → focus(기존 focus-visible 관습 또는 테두리 전환 — 구현 중 결정, ownDecisions) → invalid(`stroke-critical` 테두리) → disabled(기존 3중 매칭 + disabled 토큰) → **readonly(구분 스타일 정의** — bg-neutral-weak 계열 위임)
- 기본 테두리 `stroke-neutral`, placeholder는 `fg-disabled` 계열 위임
- size: medium(기본)·large — 폼 컨트롤 축 통일, 치수 위임
- prefix/suffix 슬롯 없음, asChild 없음, intent 축 없음(invalid는 상태지 intent가 아님)

**시각 회귀** (신규 디렉터리 — `apps/visual-regression` 또는 storybook 내 통합, 구현 판단)
- Playwright로 Storybook 정적 빌드의 매트릭스 스토리를 스크린샷 — 5개 컴포넌트 × 라이트·다크
- 기준 이미지 git 보관. **기준 생성·갱신은 CI 러너(ubuntu)에서만** — macOS 로컬 렌더링과의 폰트 차이로 인한 거짓 diff 방지. 갱신 절차를 README 또는 AGENTS에 문서화
- diff 임계값(maxDiffPixels 등) 위임 — 플레이크와 민감도 균형
- CI에 단계 추가: 스크린샷 diff 실패 시 빌드 레드 + diff 아티팩트 업로드

**테스트 (vitest)**
- Field 연결: Label 클릭 포커스, aria-describedby에 description·error id 포함, ErrorMessage 존재 시 aria-invalid
- TextField 단독: 자체 id 생성, 입력 동작
- 기존 관습 유지: user-event 사용 (fireEvent 금지)

## 하지 않을 것

- prefix/suffix 슬롯 — Icon 컴포넌트 등장 때 패딩 보정과 함께 설계 (반론 라운드)
- textarea/multiline — 수요 시 별도 TextArea 컴포넌트
- Checkbox·Switch의 Field 통합 — Field는 이번엔 TextField 전용 검증, 확장은 다음
- Chromatic 등 관리형 시각 회귀 — 외부 계정·과금 의존 회피 (로컬 Playwright 채택)
- 문자 수 카운터·클리어 버튼 — 범위 밖

## 합격 조건

- [ ] `stroke-critical` semantic 추가, 3:1 검사 × 2모드 통과, dist 3종 반영
- [ ] Field compound 4종 렌더, context로 id·invalid 전파
- [ ] Field.Label 클릭 시 TextField 포커스 (htmlFor 자동)
- [ ] Description·ErrorMessage가 aria-describedby로 연결
- [ ] ErrorMessage 존재 시 input aria-invalid + 테두리 stroke-critical
- [ ] TextField 단독 사용 시 자체 id로 동작
- [ ] 상태 5종(hover·focus·invalid·disabled·readonly) 시각 정의, readonly 구분 스타일 포함
- [ ] size medium·large 렌더
- [ ] vitest 신규 케이스 그린 (Field 연결 3건+ · 단독 1건+)
- [ ] Playwright 시각 회귀: 5개 컴포넌트 × 라이트·다크 스크린샷, 기준 이미지 git 커밋
- [ ] CI에 시각 회귀 단계, diff 실패 시 레드 + 아티팩트
- [ ] 기준 이미지 갱신 절차 문서화 (CI 러너 생성 원칙 포함)
- [ ] Storybook: TextField·Field 매트릭스 스토리, 라이트·다크 확인
- [ ] `pnpm generate`·`test`·`typecheck`·`build`·publint 그린
- [ ] tokens·react minor changeset (0.4.0)

## 드러난 가정과 결론

| 가정 | 어떻게 흔들었나 | 결론 |
|------|----------------|------|
| 올인원 props가 단순 | 사용자가 seed식 분리 선택 | Field compound + context — 첫 context 로직 |
| prefix/suffix는 기본 | 반론 — Icon도 없는데 선투자 | 제외, Icon 때 함께 |
| TextField가 textarea 포함 | 타입·높이 복잡도 지적 | input 전용, TextArea는 별도 |
| readonly는 시각 생략이 최소 | 단순화 제안 — 사용자가 정의 포함 선택 | readonly 구분 스타일 정의 |
| 시각 회귀는 관리형이 편함 | 외부 의존 vs 자급 비교 | Playwright 로컬 + CI 기준 이미지 |

## 기술 맥락

- `packages/tokens/src/tokens.ts` — stroke-neutral 패턴 그대로 stroke-critical 추가
- `packages/react/src/checkbox/` — label·상태 CSS·테스트 관습 원본. 신규 `src/field/`·`src/text-field/`
- vitest·user-event 인프라 0.3.0에서 확보됨 — 재사용
- Storybook 정적 빌드(`storybook build`)가 CI에서 이미 돎 — Playwright가 이 산출물을 서빙해 스크린샷
- CI: `.github/workflows/ci.yml` — 시각 회귀는 별 단계, Playwright 브라우저 설치 캐시 고려
- minimumReleaseAge 게이트 — @playwright/test 하한을 성숙 버전으로

## 남은 위험

- 시각 회귀 플레이크: 폰트 로딩·안티앨리어싱 — 임계값 튜닝 필요, 첫 도입이라 기준 워크플로가 자리 잡기까지 시행착오 예상
- Field context + forwardRef 조합의 타입 복잡도
- focus 스타일: input은 outline 관습(Button)과 테두리 전환 관습(일반 폼) 중 선택 위임 — 결과가 이상하면 재논의
- Playwright 브라우저 바이너리가 CI 시간을 늘린다 — 캐시로 완화

## 인터뷰 기록
<details><summary>전체 Q&A (6라운드)</summary>

### Round 0
**Q:** 구성요소 4개(TextField·stroke-critical·시각 회귀·0.4.0) / **A:** 이대로 맞음

### Round 1
**Q:** label·설명·에러 구조 / **A:** seed식 Field 분리 (올인원 추천 뒤집음) / **모호도:** 42%

### Round 2
**Q:** 시각 회귀 도구 / **A:** Playwright 로컬 / **모호도:** 33%

### Round 3
**Q:** Field API 형태 / **A:** compound (Field.Root/Label/Description/Error) / **모호도:** 27%

### Round 4 (반론)
**Q:** prefix/suffix가 검증된 필요인가 / **A:** 이번엔 없음 / **모호도:** 23%

### Round 5
**Q:** textarea 포함 여부 / **A:** input만 / **모호도:** 20%

### Round 6 (단순화)
**Q:** readonly 시각 생략이 최소 아닌가 / **A:** 스타일 정의 포함 (추천 뒤집음) / **모호도:** 16%
</details>
