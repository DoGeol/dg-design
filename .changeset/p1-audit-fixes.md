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

**후속 (B1·B2)**

- 목록에서 뺀 옵션이 `Select`의 닫힌 상태 typeahead로 선택되던 문제 — 옵션 등록 캐시가 소비자가 제거한 값을 계속 후보로 들고 있었다
- `Field` 안 `RadioGroup`에 접근 이름이 없던 문제 — `FieldContext.labelId`를 추가하고 그룹이 `aria-labelledby`로 참조한다

**Button (C2·A1·D1)**

- `Button`에 `intent="critical"` 추가 — 삭제·탈퇴 같은 파괴적 액션 버튼을 만들 수 없었다. `critical`에 solid·weak의 hover/pressed 토큰 4종이 함께 신설됐다
- `Button`에 `asChild` 추가 — 링크를 버튼 외관으로 렌더할 수 있다
- `Button` 테스트 신설 — 컴포넌트 중 유일하게 테스트가 없었다

**알림 묶음 (A2·A3·A4)**

- `Toast` 추가 — `useToast()` 훅으로 띄우는 일시 알림. 모달 위에서도 보이고 조작된다
- `Alert` 추가 — intent 6종 인라인 메시지. 신규 색 토큰 0
- `Spinner`·`Progress` 추가, `Button`에 `loading` 추가
- **live region 정책 신설** — critical intent는 `role="alert"`, 나머지는 `role="status"`. DDS에 live region이 하나도 없어 비동기 결과가 스크린리더에 전달되지 않던 문제
- 토큰 `--dds-z-toast`·`--dds-duration-spin`·`--dds-easing-linear` 신설

**버그 수정 (B3~B6)**

- `ContextMenu`가 닫힐 때 포커스가 트리거로 돌아오지 않고 사라지던 문제
- `Tooltip` Provider 그룹에서 다른 툴팁이 열려 있는데도 지연 생략이 풀리던 문제
- `DropdownMenu` 트리거의 ArrowUp이 마지막 항목이 아니라 첫 항목으로 열리던 문제
- 닫히는 오버레이가 퇴장 애니메이션 동안 `inert` 상태가 되던 문제
