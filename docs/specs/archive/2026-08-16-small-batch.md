# 소형 묶음 — TextArea·RadioGroup·Badge outline

## 메타
- 생성: 2026-08-16
- 라운드: 3
- 최종 모호도: 22% (임계값 35%, --quick)
- 유형: 브라운필드
- 상태: 통과
- 근거: 사전 토론 — 오버레이 연속 뒤 가벼운 회수전으로 소형 3종 확정
- 승인: 승인됨 (2026-08-16, 구현 계획 경로)
- 구현: **완료** — 0.8.0 준비 (2026-08-16). 합격 조건 5/6 확정 + VR 기준 1건은 워크플로로 완성

## 명확도
| 차원 | 점수 | 가중치 | 가중 점수 |
|------|------|--------|-----------|
| 목표 | 0.85 | 0.35 | 0.298 |
| 제약 | 0.80 | 0.25 | 0.200 |
| 성공 기준 | 0.75 | 0.25 | 0.188 |
| 맥락 | 0.90 | 0.15 | 0.135 |
| **모호도** | | | **22%** |

## 구성요소
| 구성요소 | 상태 | 설명 | 커버리지 |
|----------|------|------|----------|
| TextArea | 진행 | TextField 동형 + autoResize prop | 높이 제어 확정 |
| RadioGroup | 진행 | Checkbox 관습 + roving + orientation | 방향 확정 |
| Badge outline | 진행 | variant 추가, fg-{intent} 테두리 | 토큰 매핑 확정 |
| 릴리스 0.8.0 | 진행 | react minor changeset | 관례 |

## 목표

TextArea(자동 확장 옵션)·RadioGroup(방향 옵션)·Badge outline variant를 기존 관습 재사용으로 만들어 0.8.0으로 릴리스한다.

## 제약

**TextArea** (`packages/react/src/text-area/`)
- `<textarea>` 전용, TextField 동형 외관·상태 5종(hover·focus·invalid·disabled·readonly)·size 2단·Field 연동 — text-field.css 토큰값 재사용(TextField의 CSS 복제 관례)
- `autoResize?: boolean` 기본 false — true면 입력량 따라 높이 확장. 구현 방식(CSS `field-sizing: content` vs scrollHeight 동기화) 위임 — 브라우저 지원 판단 포함, ownDecisions에. false면 네이티브 `rows` + `resize: vertical`
- maxRows류 상한 위임

**RadioGroup** (`packages/react/src/radio-group/`)
- compound: `RadioGroup.Root`(value·onValueChange·name·orientation)·`RadioGroup.Item`(label 래핑 — Checkbox 구조 동형). 네이티브 `input[type=radio]` + name 공유
- `orientation`: vertical(기본)·horizontal — 화살표 roving도 방향 따라(상하/좌우). 네이티브 라디오의 화살표 기본 동작과 충돌 없게 설계(roving-focus 재사용 or 네이티브 위임 판단 — ownDecisions)
- 시각: Checkbox 박스 관습의 원형 버전(radio dot), checked = bg-brand-solid 계열, disabled·focus-visible 관습 동일
- controlled/uncontrolled 겸용 — useControllableState

**Badge outline** (`packages/react/src/badge/` 기존 수정)
- `variant`에 `outline` 추가: 배경 투명, 테두리·글자 `fg-{intent}` — 새 토큰 0개. 대비는 기존 `fg-{intent} on bg-layer-default` 4.5:1 검사가 커버(비텍스트 3:1 기준 자동 충족)
- 기존 Badge 24조합 무회귀 — VR 기준과 diff 없어야 함(기존 스토리 매트릭스에 outline 열 추가는 diff 유발 — **기준 갱신 필요**를 전제로 스토리 확장)

**공통**
- vitest: TextArea(autoResize 토글·Field 연동), RadioGroup(선택·화살표 방향별 이동·disabled·name 공유), Badge(outline 렌더·기존 무회귀). 기존 74건 무회귀
- Playwright 기능: RadioGroup 화살표 이동 1~2케이스 정도(위임), 스토리 부재 스킵 가드
- Storybook: 각 매트릭스 스토리(StateMatrixStory 관습 — VR 자동 편입). Badge 스토리는 outline 포함 확장
- changeset 1건, frontmatter 인용 + YAML 실검증

## 하지 않을 것

- TextArea 문자 수 카운터·최대 길이 UI — 범위 밖
- RadioGroup 가로 랩핑·카드형 라디오 — 수요 시
- Badge outline 외 신규 variant — 없음
- intent별 stroke 토큰 신설 — fg 재사용으로 대체 (반론 없이 확정)

## 합격 조건

- [ ] TextArea: 상태 5종 × size 2 렌더, Field 연동(label·describedby·invalid), autoResize on/off 동작
- [ ] RadioGroup: 선택·화살표 이동(orientation별 축)·disabled 건너뜀·name 공유·controlled/uncontrolled
- [ ] Badge outline: intent 6종 렌더, 기존 solid·weak 24조합 무회귀
- [ ] vitest 신규 그린 + 기존 74건 무회귀
- [ ] Playwright 기능(RadioGroup) 그린, VR 스토리 3벌 기준(워크플로 경유 — Badge는 기존 기준 갱신 포함)
- [ ] 파이프라인 전부 그린 + react minor changeset

## 드러난 가정과 결론

| 가정 | 어떻게 흔들었나 | 결론 |
|------|----------------|------|
| TextArea는 rows 고정이 최소 | 사용자가 제3안 — prop 토글 | autoResize?: boolean 기본 false |
| RadioGroup 세로 고정 | orientation과 roving 방향 연동 제시 | orientation prop, 세로 기본 |
| outline엔 stroke 토큰 필요 | fg 재사용 시 검사까지 기존 커버 지적 | fg-{intent} 재사용, 새 토큰 0 |

## 기술 맥락

- `src/text-field/` — TextArea 외관·Field 소비 원본. `src/checkbox/` — RadioGroup 구조 원본. `src/badge/` — outline 추가 대상
- `internal/roving-focus.ts` — orientation 축 지원 여부 확인 필요(현재 상하 전제면 좌우 확장)
- Badge 스토리 확장 → 기존 VR 기준과 diff → visual-baseline 갱신이 정상 경로

## 남은 위험

- 네이티브 라디오는 화살표 이동·선택이 브라우저 기본 동작 — roving과 이중 처리 시 두 칸씩 이동. 네이티브 위임 vs preventDefault+roving 중 하나로 통일해야 한다
- autoResize의 field-sizing은 Firefox 미지원 가능성 — 폴백 판단 위임
- Badge VR 기준 갱신이 "무회귀" 검증과 섞이면 회귀를 가릴 수 있다 — solid·weak 조합의 픽셀 무변화를 갱신 전 CI에서 먼저 확인

## 인터뷰 기록
<details><summary>전체 Q&A (3라운드)</summary>

### Round 0
**Q:** 구성요소 4개 / **A:** 이대로 맞음

### Round 1
**Q:** TextArea 높이 / **A:** (제3안) autoResize prop 토글 / **모호도:** 40%

### Round 2
**Q:** RadioGroup 방향 / **A:** orientation prop, 세로 기본 / **모호도:** 33%

### Round 3
**Q:** outline 테두리 색 / **A:** fg-{intent} 재사용 / **모호도:** 22%
</details>
