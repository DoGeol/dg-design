<!-- 생성 파일 — packages/react/skill-src/dialog.tsx에서 만든다. 직접 고치지 않는다. -->

# Dialog

화면 위에 띄우는 모달 — 짧은 확인(기본)과 편집·검토 같은 작업형 패널(Toolbar·Body·Aside·Footer).

## 언제 쓰나

- 삭제·나가기처럼 계속하기 전에 한 번 확인받는다 — `Title` + `Description` + 행동 버튼.
- 현재 화면을 막고 끝내야 하는 작업(편집, 검토)은 `Dialog.Content size="large"` 또는 `"full"`과 작업형 부품.
- 크기를 바꿔도 같은 요소라 입력값·포커스가 남는다. 단계별 확장은 `size`만 바꾼다.

## 쓰지 말 때

- 화면 옆에 붙는 상세·보조 패널(side view)은 `Sheet`(`side="right"`)를 쓴다.
- 트리거 바로 옆의 작은 인터랙티브 영역은 `Popover`.
- 결과 알림은 `Toast`, 페이지 안 안내는 `Alert`.

## 핵심 API

| 부품 | 주요 prop | 메모 |
| --- | --- | --- |
| `Dialog.Root` | `open`·`defaultOpen`·`onOpenChange`·`initialFocusRef`·`closeOnEscape`·`closeOnOverlayClick` | 기본은 uncontrolled |
| `Dialog.Trigger` · `Dialog.Close` | `asChild` | 자식(Button)에 동작만 얹는다 |
| `Dialog.Overlay` | — | 뒤 배경. Content와 함께 둔다 |
| `Dialog.Content` | `size`: `default`(확인형) · `large`(작업형) · `full` | 열리면 Content가 포커스를 받는다 |
| `Dialog.Title` · `Dialog.Description` | — | 있으면 `aria-labelledby`·`aria-describedby`가 자동 연결 |
| `Dialog.Toolbar` · `Body` · `Aside` · `Footer` | — | Content 직속. 하나라도 쓰면 작업형 배치, Body만 스크롤 |

## 접근성

- 항상 `Dialog.Title`을 둔다. 이름 없는 모달은 스크린리더가 무엇인지 알리지 못한다.
- 모달이라 배경은 inert, Esc·Overlay 클릭으로 닫히고 닫히면 트리거로 포커스가 돌아온다.
- 서버 컴포넌트 파일에서는 객체 속성(`Dialog.Content`) 대신 named export(`DialogContent`)를 쓴다.

## 예제

```tsx
import { Button } from "@dg-design/react/button";
import {
  DialogAside,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogOverlay,
  DialogRoot,
  DialogTitle,
  DialogToolbar,
  DialogTrigger,
} from "@dg-design/react/dialog";
import * as React from "react";

/** 삭제 확인 — 제목, 설명, 취소와 위험 행동 */
export function ConfirmDelete({ onConfirm }: { onConfirm?: () => void }) {
  return (
    <DialogRoot>
      <DialogTrigger asChild>
        <Button intent="critical" variant="weak">
          문서 삭제
        </Button>
      </DialogTrigger>
      <DialogOverlay />
      <DialogContent>
        <DialogTitle>문서를 삭제할까요?</DialogTitle>
        <DialogDescription>삭제하면 되돌릴 수 없습니다.</DialogDescription>
        <div style={{ display: "flex", gap: "var(--dds-dimension-x2)", justifyContent: "flex-end" }}>
          <DialogClose asChild>
            <Button intent="neutral" variant="weak">
              취소
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button intent="critical" onClick={onConfirm}>
              삭제
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </DialogRoot>
  );
}

/** 작업형 패널 — Toolbar·Body·Aside·Footer, Body만 스크롤된다 */
export function WorkPanel() {
  return (
    <DialogRoot>
      <DialogTrigger asChild>
        <Button intent="neutral" variant="weak">
          항목 검토
        </Button>
      </DialogTrigger>
      <DialogOverlay />
      <DialogContent size="large">
        <DialogToolbar>
          <DialogTitle>프로젝트 검토</DialogTitle>
        </DialogToolbar>
        <DialogBody>
          <p>검토할 내용이 여기에 길게 이어집니다.</p>
        </DialogBody>
        <DialogAside>
          <p>활동 기록·참고 자료</p>
        </DialogAside>
        <DialogFooter>
          <DialogClose asChild>
            <Button intent="neutral" variant="weak">
              닫기
            </Button>
          </DialogClose>
          <Button type="submit">승인</Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
}

/** 단계별 확장 — 같은 Dialog에서 size만 바꾸면 입력값·포커스가 남는다 */
export function ExpandableSize() {
  const [full, setFull] = React.useState(false);
  return (
    <DialogRoot>
      <DialogTrigger asChild>
        <Button intent="neutral" variant="weak">
          메모 작성
        </Button>
      </DialogTrigger>
      <DialogOverlay />
      <DialogContent size={full ? "full" : "large"}>
        <DialogToolbar>
          <DialogTitle>메모</DialogTitle>
          <Button intent="neutral" variant="ghost" size="small" onClick={() => setFull((v) => !v)}>
            {full ? "줄이기" : "전체 화면"}
          </Button>
        </DialogToolbar>
        <DialogBody>
          <textarea aria-label="메모 내용" style={{ width: "100%", minHeight: "8rem" }} />
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button>저장</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
}

/** 제어 모드 — 저장 중에는 닫히지 않게 막는다 */
export function Controlled({ saving = false }: { saving?: boolean }) {
  const [open, setOpen] = React.useState(false);
  return (
    <DialogRoot open={open} onOpenChange={(next) => setOpen(saving ? true : next)}>
      <DialogTrigger asChild>
        <Button>설정 변경</Button>
      </DialogTrigger>
      <DialogOverlay />
      <DialogContent>
        <DialogTitle>설정</DialogTitle>
        <DialogDescription>변경 사항을 저장합니다.</DialogDescription>
        <Button loading={saving} onClick={() => setOpen(false)}>
          저장
        </Button>
      </DialogContent>
    </DialogRoot>
  );
}
```
