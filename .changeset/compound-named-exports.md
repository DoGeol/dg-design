---
"@dg-design/react": minor
---

compound 20종의 서브컴포넌트를 named export로도 내보낸다(`StatePanelRoot`, `TabsContent`, `DialogTrigger` 등). 객체 export는 그대로다. 빌드가 모든 모듈에 `'use client'`를 붙이므로 서버 컴포넌트에서 `StatePanel.Root`처럼 객체 속성으로 접근하면 undefined가 됐던 문제의 해법이다. `Tabs.Content`는 `tabIndex`를 소비자가 덮어쓸 수 있다(기본 0).
