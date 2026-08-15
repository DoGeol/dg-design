# 문서 색인

에이전트는 **여기서 필요한 문서를 골라 한 번에 찾아간다.** 전체를 훑지 않는다.

## 규칙

- **결정 기록**(`decisions/`) — "왜 이렇게 했나". 현행 판단의 근거. 여기가 먼저다
- **스펙**(`specs/`) — 진행 중인 작업 명세. 완료되면 `specs/archive/`로 옮긴다
- **아카이브**(`specs/archive/`) — 이력. 현행 규칙의 근거로 삼지 말 것. 구현 결과는 코드가 진실이다
- 인터뷰 기록(`*-interview.md`)은 **재결정할 때만** 읽는다. 구현에는 불필요하다
- 문서 하나가 10KB를 넘으면 분할을 검토한다

## 결정 기록

| 문서 | 상태 | 다루는 것 |
|------|------|-----------|
| [2026-08-14 토큰 체계와 a11y 기준선](decisions/2026-08-14-dds-token-system.md) | 활성 | 토큰 이름 문법, hover 축 추가, 대비 검사 도입, focus/disabled 관습 |
| [2026-08-15 0.1.0 구현 중 결정](decisions/2026-08-15-dds-010-implementation.md) | 활성 | Vite CSS raw copy, lightness/chroma 배열, 컴포넌트 위임값, 브릿지 범위, publish 운영 |
| [2026-08-15 Badge + intent 축](decisions/2026-08-15-badge-intent-axis.md) | 활성 | 컴포넌트 로드맵 A→B→C→D, intent 6종 확정, outline·hover/pressed 제외 근거 |
| [2026-08-15 Badge 구현 중 결정](decisions/2026-08-15-badge-intent-axis-implementation.md) | 활성 | warning solid 반전, chroma 비율 프로파일, Badge 치수·웨이트, hue 실값 |
| [2026-08-15 Checkbox·Switch 구현 중 결정](decisions/2026-08-15-checkbox-switch-implementation.md) | 활성 | stroke 스텝, 컨트롤 치수, vitest 구성·jsdom 함정, dts exclude |
| [2026-08-15 TextField 구현 중 결정](decisions/2026-08-15-textfield-implementation.md) | 활성 | Field context 설계, focus/readonly 스타일, 시각 회귀 인프라 전체 설계 |
| [2026-08-15 Dialog 구현 중 결정](decisions/2026-08-15-dialog-implementation.md) | 활성 | presence computed-길이 방식, portal 컨테이너·inert 규칙, 모션 토큰 값 |

## 스펙

진행 중인 스펙 없음. 새 작업은 `deep-interview`가 여기에 만든다. 미배포 publish 목록은 [HANDOFF.md](HANDOFF.md).

## 아카이브 (완료)

| 문서 | 릴리스 | 다루는 것 |
|------|--------|-----------|
| [DDS 아키텍처](specs/archive/2026-08-14-dds-architecture.md) | 0.1.0 | 토큰 파이프라인·스타일링·빌드/배포·Tailwind 브릿지 |
| [토큰 체계와 Button 0.1.0](specs/archive/2026-08-14-dds-token-system.md) | 0.1.0 | 팔레트 값, 대비 검사 쌍, 비색상 토큰, Button API, 공개 API 범위 |
| [Badge + intent 축](specs/archive/2026-08-15-badge-intent-axis.md) | 0.2.0 | intent 4종 실값화, 대비 24건, Badge(asChild·truncate), 합격 조건 12/12 |
| [Checkbox·Switch + stroke 축](specs/archive/2026-08-15-checkbox-switch-stroke-axis.md) | 0.3.0 | stroke 2종, 폼 컨트롤 2개, vitest 도입, 합격 조건 13/13 |
| [TextField·Field + 시각 회귀](specs/archive/2026-08-15-textfield.md) | 0.4.0 | Field compound, TextField 5상태, Playwright 시각 회귀 도입 |
| [Dialog](specs/archive/2026-08-15-dialog.md) | 0.5.0 | 자체 구현 오버레이(presence·스택·inert), compound 7종, 모션 토큰 |

각 스펙의 인터뷰 기록은 같은 이름 `-interview.md`로 분리돼 있다.
