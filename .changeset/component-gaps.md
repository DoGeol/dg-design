---
"@dg-design/react": minor
---

시안 A에서 드러난 컴포넌트 공백을 채웁니다.

- Pagination: `Previous`·`Next`에 `disabled`를 추가하고, 현재 쪽을 brand solid로 바꿔 흰 배경에서도 구분되게 합니다. 생략 기호는 SVG입니다.
- Breadcrumb: 기본 구분자를 `/` 텍스트에서 셰브론 SVG로 바꿉니다. children으로 교체하는 방식은 그대로입니다.
- DatePicker·DateRangePicker: `open`·`defaultOpen`·`onOpenChange`를 추가합니다.
- DropdownMenu·ContextMenu: `Item`에 `intent="critical"`, 단축키 표기용 `Shortcut`(`DropdownMenuShortcut`·`ContextMenuShortcut`)을 추가합니다. ContextMenu가 커서 좌표 없이 열리면 트리거 왼쪽 위를 기준으로 뜹니다.
- Dialog·Sheet·Popover: 열릴 때 프로그램 포커스를 받는 패널 자체에는 focus 링을 그리지 않습니다.
- Popover·HoverCard: 화살표의 바깥 두 변에 연한 테두리를 그려 흰 배경에서도 보이게 합니다.
- TextField: `prefix`·`suffix`를 추가합니다. 둘 다 없으면 DOM은 그대로입니다. 있으면 input을 감싸는 요소가 생기고 테두리·`className`이 그 요소로 옮겨 갑니다(ref와 나머지 props는 input).
- TextArea: `showCount`를 추가합니다. `maxLength`가 있으면 "현재/최대"로 표시합니다.
- Checkbox·RadioGroup: `aria-invalid`(Field 오류)일 때 테두리를 critical로 표시합니다.
- Switch: `labelPlacement="start"`로 라벨을 트랙 왼쪽에 둘 수 있습니다.
- Button: 정사각형 아이콘 전용 버튼 `iconOnly`를 추가합니다. 접근 이름(`aria-label`)이 없으면 경고합니다.
- Toast: `ToastProvider`에 `max`(기본 3), Provider 없이 그리는 정적 표시 `Toast.View`(`ToastView`)를 추가합니다.
- FileInput: Dropzone·Trigger에 hover·pressed 배경을 추가합니다.
- Card: `asChild`로 링크나 버튼이 되면 hover·focus 외관을 갖습니다.
- Accordion: Prefix가 있으면 펼친 본문을 제목 시작선에 맞춥니다. Prefix 칸은 최소 24px(`--dds-accordion-prefix-size`)이라 더 좁은 prefix를 쓰던 항목은 제목이 조금 오른쪽으로 옮겨 갑니다.
- Avatar: 크기를 dimension 토큰으로 바꿉니다(값 변화 없음).
