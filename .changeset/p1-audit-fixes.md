---
"@dg-design/tokens": minor
"@dg-design/react": minor
---

검토에서 나온 P1 6건 수정

**버그 수정**

- 중첩 오버레이가 조상을 닫던 문제 — `Popover` 안에서 `Select`·`DropdownMenu`를 열면 팝오버가 닫히며 자식까지 언마운트됐다. 단일 열림 싱글턴을 스택으로 바꾸고, 자손 패널 클릭을 바깥 클릭 판정에서 면제했다. 형제 단일 열림 계약은 그대로다
- `Select`·`RadioGroup`의 controlled 값을 `undefined`로 되돌려도 UI가 따라오지 않던 문제 — 폼 리셋 시 옛 값을 계속 표시했다. controlled 판정을 값이 아니라 prop 존재로 바꿨다
- `Checkbox`·`Switch`·`RadioGroup`이 `Field`와 연동되지 않던 문제 — 라벨 클릭이 컨트롤을 조작하지 못하고 `aria-invalid`·`aria-describedby`도 걸리지 않았다

**토큰**

- `--dds-z-overlay` 신설 — 오버레이가 전부 `z-index: auto`라 소비 앱의 sticky 헤더 밑에 깔렸다
- `--dds-color-fg-neutral-weak` 신설 — `fg-disabled`가 비활성 컨트롤과 보조 텍스트를 겸해 `Field` 설명문·그룹 라벨이 WCAG AA에 미달(3.36:1)했다. 신규 토큰은 5.03:1(라이트)·5.61:1(다크)이고 대비 검사에도 추가됐다

**패키징**

- 컴포넌트별 서브패스 export 추가 — `@dg-design/react/button`처럼 딥임포트가 가능해져 CSS 트리셰이킹이 동작한다(Button만 쓸 때 41.4KB → 4.3KB). 기존 `@dg-design/react` 진입점은 그대로다
