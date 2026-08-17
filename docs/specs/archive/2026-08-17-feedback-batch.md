# Toast·Alert·Spinner/Progress + Button loading — 알림·피드백 묶음

## 메타
- 생성: 2026-08-17
- 라운드: 5
- 최종 모호도: 18% (임계값 20%)
- 유형: 브라운필드
- 상태: 통과
- 근거: 0.9.0 검토(렌즈 6개 감사)의 기능 공백 A2·A3·A4 + Button loading
- 승인: 승인됨 (2026-08-17, 구현 계획 경로)
- 구현: **완료** — 미배포 (2026-08-17). 합격 조건 17/17

## 명확도
| 차원 | 점수 | 가중치 | 가중 점수 | 남은 구멍 |
|------|------|--------|-----------|-----------|
| 목표 | 0.85 | 0.35 | 0.298 | — |
| 제약 | 0.80 | 0.25 | 0.200 | Toast 지속시간·최대 개수 실값은 위임 |
| 성공 기준 | 0.80 | 0.25 | 0.200 | live region 실효성은 실기기 검증 불가 |
| 맥락 | 0.85 | 0.15 | 0.128 | dialog-stack 면제 구현 방식은 위임 |
| **모호도** | | | **18%** | |

## 구성요소
| 구성요소 | 상태 | 설명 | 커버리지 |
|----------|------|------|----------|
| Toast | 진행 | 훅 호출로 뜨는 일시 알림 + viewport 스택, 모달 위 최상단 | API·모달 관계·액션 범위 확정 |
| Alert | 진행 | 인라인 고정 메시지, intent 6종 | Badge 패턴 재사용 확정 |
| Spinner·Progress | 진행 | 로딩 표현 2종 | 모션 토큰 신설 필요 |
| Button loading | 진행 | Spinner 합성 + disabled + aria-busy | asChild 배타 확정 |
| live region 정책 | 진행 | critical만 assertive, 나머지 polite | 전 컴포넌트 공통 규칙 |
| 테스트·VR | 진행 | vitest + Playwright + VR 기준 | 확립 패턴 |

## 목표

훅으로 띄우는 Toast, 인라인 Alert, Spinner·Progress를 만들고 Button에 loading을 붙여, 앱의 비동기 결과가 화면과 스크린리더 양쪽에 전달되게 한다.

## 제약

### live region 정책 (전 컴포넌트 공통 — 먼저 정한다)

- **critical intent만 `role="alert"`**(암묵적 assertive), 나머지 intent는 **`role="status"`**(암묵적 polite)
- `aria-live`를 따로 얹지 않는다 — `Field.ErrorMessage`가 세운 선례(`role`이 암묵적 politeness를 갖는다)를 그대로 따른다
- 이 규칙은 Toast·Alert 양쪽에 동일 적용. 소비자용 politeness prop은 제공하지 않는다(YAGNI)

### Toast (`packages/react/src/toast/` + `internal/`)

- **API는 훅**: `Toast.Provider`로 감싸고 `useToast()`가 `toast({ intent, title, description })`을 돌려준다. DDS 최초의 트리거 없는 컴포넌트 — compound 관례에서 의도적으로 벗어난다
- Provider 밖에서 `useToast()`를 부르면 명확한 에러(다른 컴포넌트의 context 에러 문구 관례와 동일)
- **viewport는 항상 최상단**: 전용 토큰 `--dds-z-toast`를 신설해 `--dds-z-overlay`보다 위. 그리고 **`dialog-stack`에 "알림 레이어" 면제 개념을 추가**해 모달이 열려도 viewport가 `inert`되지 않게 한다. 모달 안 작업의 결과를 알리는 흔한 흐름이 여기 걸린다
- viewport는 Provider 마운트 시 1회 생성한다 — 기존 6곳의 "열릴 때 만들고 닫히면 없앤다" portal 패턴은 토스트 0개일 때 사라져 스택이 안 되므로 쓸 수 없다
- **닫기 버튼만.** 액션 버튼(실행 취소)은 넣지 않는다 — 자동으로 사라지는 요소 안의 버튼은 키보드 사용자가 도달하기 전에 없어진다
- hover·포커스 시 자동 닫힘 타이머 일시정지(닫기 버튼 도달을 보장하는 최소 장치)
- 지속시간·최대 동시 표시 개수·viewport 위치는 위임(기본값을 정하고 근거를 남긴다). 위치 prop은 만들지 않는다 — 수요 실측 전까지 한 자리 고정
- presence 퇴장은 `internal/use-presence` 재사용(트리거 무관 훅이라 그대로 쓸 수 있다)

### Alert (`packages/react/src/alert/`)

- 단일 요소 + intent 6종. 인라인 배치라 portal·presence 없음
- CSS는 **Badge의 2층 로컬 변수 구조를 그대로 복제** — 비인터랙티브 + intent 6종이라 조건이 동일하다. `bg-{intent}-weak` + `fg-{intent}` 조합(대비 검사 기존 통과분)만 쓴다 → **신규 색 토큰 0**
- 구성: intent 아이콘 + 제목/본문 + 선택적 닫기 버튼. 아이콘은 인라인 SVG, `currentColor`, `aria-hidden`(Select 방식)
- `role`은 위 live region 정책을 따른다

### Spinner·Progress (`packages/react/src/spinner/`, `progress/`)

- Spinner: 무한 회전. **모션 토큰 신설 필요** — 현재 duration은 150/200ms, easing은 `out` 1종뿐이라 무한 회전에 맞는 값이 없다. `--dds-duration-spin`과 `linear` easing을 추가하고 근거를 남긴다
- Progress: `value`(0~100)·`max`, indeterminate 지원. `role="progressbar"` + `aria-valuenow/min/max`
- 둘 다 `prefers-reduced-motion` 대응 필수 — Spinner는 회전을 멈추거나 크게 늦춘다
- 크기 축은 Button과 맞물릴 최소 2종(위임)

### Button loading (`packages/react/src/button/`)

- `loading?: boolean` — true면 Spinner 표시 + `disabled` + `aria-busy="true"`를 한 번에
- **`asChild`와 배타**: Radix `Slot`은 자식이 하나여야 하는데 Spinner를 넣으면 둘이 된다. 동시 사용 시 개발 환경 경고 + loading 무시(asChild 우선). 타입으로 막지 않고 런타임 경고 — 조건부 prop 타입은 소비자 쪽 추론을 망친다
- CSS: `[data-loading]`을 disabled 3중 매칭 셀렉터에 합류시킨다(11곳 — 누락하면 loading 중 hover 색이 뜬다). 스피너·라벨 간격용 `gap` 추가
- `[data-loading]` 관습은 0.1.0 스펙에서 이미 예약해둔 이름이다

### 테스트·VR

- vitest: Toast(훅 호출로 뜸·자동 닫힘 fake timers·hover 일시정지·닫기·최대 개수·Provider 밖 에러·intent별 role), Alert(intent 클래스·role 분기·닫기), Spinner/Progress(role·aria 값·indeterminate), Button loading(disabled·aria-busy·asChild 배타 경고)
- **회귀 게이트**: 기존 208건 전량 통과 — `dialog-stack` 변경이 모든 오버레이를 관통한다
- Playwright: Dialog 열린 상태에서 토스트가 보이고 닫기 버튼이 **실제로 눌리는지**(inert 면제의 실증). 이건 jsdom이 못 본다
- VR: 4종 매트릭스 + Toast 열림 고정. Toast는 애니메이션이라 기준 촬영 시 정지 필요(위임)
- 색 토큰 변경 없음 → 기존 VR 기준 무영향 예상. Button은 `gap` 추가로 바뀔 수 있어 기준 재촬영 대상

### 릴리스

- 기존 대기 changeset에 합류(react·tokens 둘 다 minor). 신규 토큰이 있으므로 tokens도 minor 유지

## 하지 않을 것

- **Toast 액션 버튼(실행 취소)** — 자동 소멸 요소 안의 버튼은 키보드 도달이 보장되지 않는다(반론 라운드에서 확정). 필요하면 페이지 안 UI로
- **Toast F6 영역 이동** — Radix가 하는 완전한 키보드 경로. 구현량이 크고 DDS에 선례가 없다. 액션이 없으면 필요도 낮다
- **Toast 위치 prop·스와이프 dismiss** — 한 자리 고정, 포인터 제스처 없음
- **전역 함수 `toast()`** — 훅으로 확정. Provider 밖(서비스 레이어)에서 부를 수 없다는 대가를 수용한다
- **politeness prop** — intent로 자동 결정. 소비자가 잘못 고를 여지를 안 연다
- **Button `startIcon`/`endIcon` 범용 슬롯** — loading만 먼저. 아이콘 슬롯 수요는 별개로 실측
- **아이콘 세트·아이콘 컴포넌트** — Alert intent 아이콘은 해당 파일에 인라인. 저장소에 아이콘 모듈이 없고 이번에 만들지 않는다
- **Toast 큐잉·우선순위** — 최대 개수를 넘으면 오래된 것부터 밀어낸다(단순 규칙)

## 합격 조건

- [ ] `useToast().toast()` 호출로 토스트가 뜨고, 지정 시간 뒤 자동으로 사라진다 (fake timers)
- [ ] hover·포커스 중에는 타이머가 멈춘다 (fake timers)
- [ ] 최대 개수를 넘기면 오래된 것부터 사라진다
- [ ] Provider 밖에서 `useToast()` 호출 시 명확한 에러
- [ ] **Dialog가 열린 상태에서 토스트가 보이고 닫기 버튼이 눌린다** (Playwright — inert 면제 실증)
- [ ] intent별 role: critical은 `alert`, 나머지는 `status` (Toast·Alert 양쪽 vitest)
- [ ] Alert: intent 6종 클래스 전환, 신규 색 토큰 0 (`pnpm generate`의 semantic 개수 불변)
- [ ] Spinner: `prefers-reduced-motion`에서 회전이 멈추거나 크게 늦춰진다
- [ ] Progress: `role="progressbar"` + `aria-valuenow/min/max`, indeterminate 시 valuenow 없음
- [ ] Button `loading`: Spinner 표시 + `disabled` + `aria-busy="true"`
- [ ] Button `loading` + `asChild` 동시 사용 시 경고하고 loading을 무시한다
- [ ] loading 중 hover·pressed 색이 뜨지 않는다 (CSS 셀렉터 누락 검증)
- [ ] **기존 208건 전량 통과** (dialog-stack 변경 무회귀)
- [ ] Playwright 기존 28건 무회귀 + 신규 그린
- [ ] VR 신규 기준(워크플로 경유) 포함 파이프라인 그린
- [ ] Storybook: 4종 데모 + 매트릭스
- [ ] changeset 합류 (`changeset status` 확인)

## 드러난 가정과 결론

| 가정 | 어떻게 흔들었나 | 결론 |
|------|----------------|------|
| Toast도 compound(Root·Trigger) | 트리거가 없는 유일한 컴포넌트임을 지적 | 훅 API 채택, 관례에서 의도적 이탈 |
| Toast는 다른 오버레이와 같은 층 | dialog-stack의 inert가 viewport를 죽인다는 구조적 충돌 제시 | 전용 z 층 + inert 면제, 공유 자산 변경 수용 |
| live region은 전부 polite가 안전 | assertive/polite의 실제 차이와 APG 권장 제시 | intent로 분기 — critical만 assertive |
| Button loading은 단순 추가 | asChild 충돌·셀렉터 11회·모션 토큰 부재 제시 (반론) | 그래도 채택, 단 asChild와 배타 |
| Toast에 실행 취소 액션 | 자동 소멸 요소의 키보드 도달 문제 제시 | 닫기 버튼만 |

## 기술 맥락

- `internal/use-presence.ts:39` — 시그니처가 `usePresence(open)`뿐이라 트리거·portal을 모른다. Toast 항목마다 재사용 가능
- `internal/dialog-stack.ts:92-97` — `syncInert()`가 body 직속 자식 전체를 훑는다. **Toast viewport 면제가 이번의 유일한 공유 자산 변경**
- `internal/use-overlay.ts` — 트리거 전제(onOpenFocus 필수·트리거 기준 배치·닫힐 때 트리거 포커스)라 Toast에 못 쓴다. AGENTS.md의 "클릭 토글·트리거 기준 배치가 아니면 primitive 직결" 규칙에 해당
- portal 컨테이너 생성이 6곳에 동일 복붙 — Toast viewport는 생명주기가 달라(마운트 1회) 그대로 못 쓴다
- `badge.css:13-76` — intent 6블록 × 로컬 변수 4개 + variant 3블록. Alert가 그대로 복제할 구조
- 아이콘 관례: 인라인 SVG + `currentColor` + `stroke` 1.5. 저장소에 아이콘 모듈 없음
- 모션 토큰은 `duration.fast/base` + `easing.out` 1종 — Spinner용 신설 필요
- 퇴장 패턴이 이미 6개 CSS에 복붙. Toast를 더하면 7개 — 재고 트리거(8개)에 근접

## 남은 위험

- **dialog-stack 면제가 모든 오버레이를 관통한다** — 회귀 게이트는 기존 208건과 Dialog·DropdownMenu의 inert 테스트뿐. 면제 조건을 좁게 잡지 않으면 모달 격리가 뚫린다
- Toast viewport가 항상 최상단이므로, 모달 위에 뜬 토스트가 모달의 포커스 트랩 밖에 있다 — Tab으로 도달할 수 없는 상태에서 보이기만 한다. 닫기 버튼만 두는 결정이 이 위험을 줄이지만 완전히 없애지는 않는다
- Spinner의 무한 애니메이션이 VR을 불안정하게 만들 수 있다 — 기준 촬영 시 정지 방법 필요
- 신규 모션 토큰(`linear` easing)이 "easing 1종으로 충분(YAGNI)"이라는 기존 결정을 뒤집는다 — 근거를 결정 기록에 남겨야 한다

## 인터뷰 기록

[2026-08-17-feedback-batch-interview.md](2026-08-17-feedback-batch-interview.md) 참조 (5라운드).
