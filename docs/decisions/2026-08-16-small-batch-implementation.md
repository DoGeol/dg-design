# 소형 묶음 구현 중 결정

- 날짜: 2026-08-16
- 스펙: [specs/archive/2026-08-16-small-batch.md](../specs/archive/2026-08-16-small-batch.md)
- 실행: Workflow 병렬 4태스크 (TextArea·Badge sonnet / RadioGroup sonnet·high / changeset haiku·low), barrel은 감독 직결

## 위임돼 구현 중 정해진 값 (ownDecisions)

**TextArea**
- autoResize: CSS `field-sizing: content` 1순위 + `CSS.supports` 모듈 스코프 1회 검사로 미지원 브라우저만 scrollHeight 폴백(use-auto-resize.ts) — 두 경로가 height를 동시에 만지면 싸우므로 배타. 폴백 트리거는 onInput(controlled 무관)
- maxRows 상한 미구현(스펙 위임 최소화) — 필요 시 소비자 max-height
- rows 기본 3, 세로 패딩 medium x2/large x3 (TextField에 없던 축)

**RadioGroup — 경합 해결**
- **네이티브 위임 채택**: 같은 name 그룹의 화살표 이동=선택·disabled 건너뜀은 브라우저가 이미 APG대로 구현. roving-focus 미사용. orientation 축 제어만 Root onKeyDown에서 반대축 키 preventDefault(vertical→좌우 차단, horizontal→상하 차단). Home/End는 라디오 표준 아님 — 미구현
- 시각은 Checkbox 동형의 원형(radius 9999px) + 내부 dot, 새 토큰 0. size 축 없음(스펙 미기재 — medium 고정)
- name 미지정 시 useId 자동 생성

**Badge outline**
- 테두리·글자 색은 신규 변수 없이 기존 `--dds-badge-weak-fg` 재사용(6개 intent 블록에서 fg-{intent}와 동일값) — "새 토큰 금지"를 CSS 변수 레벨까지 적용
- font-weight는 weak와 동일 regular. box-sizing: border-box 기존 규칙 덕에 1px 테두리에도 높이 불변
- 기존 solid·weak 규칙 diff 0 (git diff로 `-` 라인 없음 확인)

## 감독 처리

- barrel 3줄 직결 + 알파벳 재정렬 (병렬 경합 회피 설계대로)
- **VR 기능 spec 수정 1건**: 라디오 input이 시각적으로 숨겨져 Playwright 직접 클릭 타임아웃 — label 클릭으로 교체(실사용자 경로). 15/15 회복

## 위험 결과

- 라디오 roving 경합 — 네이티브 위임으로 원천 소멸 (에이전트가 jsdom에서 네이티브 동작 사전 실험 후 설계)
- field-sizing 미지원 — 폴백 구현됨, 지원 브라우저 실측 77→172px 확장 확인
- Badge VR — solid·weak 코드 diff 0으로 픽셀 무변화 보장. 스토리 확장(24→36조합)으로 **badge 기준 이미지 diff는 예정된 것** — 푸시 후 첫 CI의 VR 실패가 badge 스크린샷에 한정되는지 확인 후 기준 갱신이 정상 경로

## 사후 발견 2건 (푸시 후 CI에서)

- **VR 임계 민감도 한계**: outline 열 추가(12셀, 얇은 테두리+글자)가 1248×1037 기준에서 ~0.4% 변경이라 maxDiffPixelRatio 0.005 아래로 통과 — "예정된 diff"가 안 났고 기준이 24조합 구본으로 잔류(-u도 통과 스냅샷은 재촬영 안 함). 구본 삭제 → 재촬영으로 정정. 교훈: 가벼운 요소 추가는 VR이 놓칠 수 있다 — 스토리 확장 시 기준을 능동 삭제·재촬영하는 것이 정직한 경로
- **기능 테스트 레이스**: Field.Label 클릭이 버튼 활성화로 Select를 여는데 spec이 과도기 상태(트리거 포커스)를 단언 — 같은 코드가 CI에서 복불복. 최종 상태(열림+옵션 포커스) 단언으로 교체, 3연속 그린 확인

## 검증 요약

vitest 101/101(신규 27: textarea 10·radio 9·badge 8) · 기능 테스트 15/15(radio 2 신규) · typecheck 3/3 · build·publint 그린. 감독 실측: autoResize 실브라우저 확장 확인.
