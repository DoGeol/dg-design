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

## 스펙

진행 중인 스펙 없음. 새 작업은 `deep-interview`가 여기에 만든다.

## 아카이브 (완료)

| 문서 | 릴리스 | 다루는 것 |
|------|--------|-----------|
| [DDS 아키텍처](specs/archive/2026-08-14-dds-architecture.md) | 0.1.0 | 토큰 파이프라인·스타일링·빌드/배포·Tailwind 브릿지 |
| [토큰 체계와 Button 0.1.0](specs/archive/2026-08-14-dds-token-system.md) | 0.1.0 | 팔레트 값, 대비 검사 쌍, 비색상 토큰, Button API, 공개 API 범위 |

각 스펙의 인터뷰 기록은 같은 이름 `-interview.md`로 분리돼 있다.
