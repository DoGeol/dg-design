# compound 서브컴포넌트 named export (D1·D2)

- 날짜: 2026-09-06
- 상태: 활성
- 출처: dg-studio 0.13.1 도입(PR #59)에서 실측. [follow-ups](../follow-ups.md) D1·D2

## D1 — 객체 export가 React Server Component에서 안 풀린다

react 빌드는 barrel을 제외한 모든 모듈에 `'use client'` 배너를 붙인다(`vite.config.ts` `renderBanner`). 서버 컴포넌트가 client 모듈에서 **컴포넌트 자체**를 import하면 client reference로 정상 렌더되지만, `StatePanel`처럼 **객체**를 import해 `StatePanel.Root`로 접근하면 속성이 `undefined`라 "Element type is invalid"가 난다. dg-studio `state.tsx`는 이 때문에 `"use client"`를 붙여 우회했다.

### 결정

compound 20종의 서브컴포넌트를 `{Compound}{Sub}` 이름으로 named export한다. 객체 export는 유지 — 소비자가 고른다. 서브패스(`@dg-design/react/state-panel`)와 barrel 양쪽에서 같은 이름이 보인다.

- 검토한 대안: "compound는 client 컴포넌트에서만"으로 문서화하고 끝내기. 서버 페이지에서 EmptyState 같은 정적 패널을 못 쓰는 건 실제 비용이라 탈락.
- 이름 규약이 이미 내부 const 이름과 일치해 alias export는 0건. 서브컴포넌트 선언 앞에 `export`만 붙였다.
- `Toast`는 `ToastProvider`만 해당(나머지는 훅 `useToast`).

## D2 — `Tabs.Content`의 `tabIndex` override

`{...props}` 뒤에 `tabIndex={0}`을 고정하던 것을 props 기본값으로 바꿨다. 패널 안에 포커스 가능한 자식이 많으면 패널 자체의 tab stop은 잡음이라(APG는 포커스 가능한 자식이 없을 때만 패널을 tabbable로 둔다) 소비자가 `-1`을 줄 수 있어야 한다. 기본값 0은 유지.
