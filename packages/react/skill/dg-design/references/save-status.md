<!-- 생성 파일 — packages/react/skill-src/save-status.tsx에서 만든다. 직접 고치지 않는다. -->

# SaveStatus

자동 저장 상태(저장됨·변경됨·저장 중·오류)를 아이콘과 문구로 보여 주는 한 줄 표시.

## 언제 쓰나

- 편집기·설정 화면의 헤더 구석에 자동 저장 진행을 알릴 때.
- `status`만 바꿔 같은 자리에서 상태를 갱신한다.

## 쓰지 말 때

- 사용자가 읽고 조치해야 하는 지속 메시지 — `Alert`.
- 저장 완료를 일회성으로 알림 — `Toast`.
- 영역 전체의 오류·빈 상태 — `StatePanel`.
- 버튼을 눌러 저장하는 폼의 진행 — `Button loading`.

## 핵심 API

| prop | 값 | 메모 |
| --- | --- | --- |
| `status` | `saved` · `dirty` · `saving` · `error` | 필수. `error`만 `role="alert"`, 나머지는 `role="status"` |
| `children` | ReactNode | 문구. 기본 문구가 없으므로 필수 |
| `icon` | ReactNode | 기본 아이콘 대체 |
| `motion` | `auto`(기본) · `none` | `auto`는 저장 중 → 저장됨에서만 150ms 교차 페이드. 잦은 저장이 거슬리면 `none` |

## 접근성

- `status`가 바뀌어도 같은 요소가 유지돼야 스크린 리더가 변경을 읽는다. `key`를 status에 연동하지 않는다.
- 아이콘은 장식이고 문구가 의미를 나른다. 문구를 생략하지 않는다.
- `role`·`aria-live`를 직접 얹지 않는다.

## 예제

```tsx
import { SaveStatus, type SaveStatusValue } from "@dg-design/react/save-status";

const LABELS: Record<SaveStatusValue, string> = {
  saved: "저장됨",
  dirty: "변경 사항 있음",
  saving: "저장 중...",
  error: "저장하지 못했어요",
};

/** status를 받아 문구와 함께 표시 — key는 주지 않는다 */
export function Basic({ status = "saved" }: { status?: SaveStatusValue }) {
  return <SaveStatus status={status}>{LABELS[status]}</SaveStatus>;
}

/** 네 가지 상태 */
export function AllStatuses() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--dds-dimension-x2)" }}>
      {(Object.keys(LABELS) as SaveStatusValue[]).map((status) => (
        <SaveStatus key={status} status={status}>
          {LABELS[status]}
        </SaveStatus>
      ))}
    </div>
  );
}

/** 잦은 자동 저장 — 전환 효과 끄기 */
export function NoMotion() {
  return (
    <SaveStatus status="saved" motion="none">
      저장됨
    </SaveStatus>
  );
}
```
