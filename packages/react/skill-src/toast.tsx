/**
 * @title Toast
 * @summary 행동 결과를 잠깐 알리는 알림 — Provider 하나와 `useToast()` 훅.
 *
 * ## 언제 쓰나
 *
 * - 저장·삭제·복사 같은 행동의 결과를 흐름을 막지 않고 알린다.
 * - 되돌리기 같은 짧은 행동 하나는 `action`으로 붙인다.
 * - 앱 루트에 `Toast.Provider`를 한 번만 둔다(viewport는 Provider가 만든다).
 *
 * ## 쓰지 말 때
 *
 * - 꼭 읽거나 처리해야 하는 내용 — 토스트는 5초 뒤 사라진다. `Dialog`나 페이지 안 `Alert`.
 * - 폼 필드 오류 — `Field`의 오류 문구.
 * - 토스트의 `action`은 같은 일을 하는 다른 경로가 화면에 있어야 한다(WCAG 2.2.1).
 *
 * ## 핵심 API
 *
 * | 부품 | 주요 prop | 메모 |
 * | --- | --- | --- |
 * | `Toast.Provider` | `closeLabel`·`max` | `closeLabel` 기본 "닫기", `max` 기본 3 — 넘치면 오래된 것부터 밀려난다 |
 * | `useToast()` | 반환: `(options) => void` | Provider 밖에서 부르면 에러 |
 * | options | `title`(필수)·`description`·`intent`·`action: { label, onClick }` | `intent`: `neutral`(기본)·`brand`·`positive`·`warning`·`informative`·`critical` |
 * | `Toast.View` | `intent`·`title`·`description`·`action`(ReactNode)·`onClose`·`closeLabel`·`live` | 타이머 없는 정적 표시(문서·시안용). 닫기 버튼은 `onClose`가 있을 때만 |
 *
 * ## 접근성
 *
 * - `critical`만 `role="alert"`(즉시 읽음), 나머지는 `role="status"`(차분히 읽음). `aria-live`는 얹지 않는다.
 * - 포인터를 올리거나 포커스가 있는 동안 자동 닫힘이 멈춘다.
 * - 모달이 열려 있어도 토스트는 inert되지 않는다.
 */
import { Button } from "@dg-design/react/button";
import { Toast, useToast } from "@dg-design/react/toast";

function SaveButton() {
  const toast = useToast();
  return <Button onClick={() => toast({ intent: "positive", title: "저장했습니다" })}>저장</Button>;
}

/** 앱 루트 — Provider 하나로 감싼다 */
export function AppRoot() {
  return (
    <Toast.Provider>
      <SaveButton />
    </Toast.Provider>
  );
}

function DeleteButton() {
  const toast = useToast();
  return (
    <Button
      intent="neutral"
      variant="weak"
      onClick={() =>
        toast({
          title: "문서를 삭제했습니다",
          description: "휴지통에서 복구할 수 있습니다.",
          action: { label: "되돌리기", onClick: () => {} },
        })
      }
    >
      삭제
    </Button>
  );
}

/** 되돌리기 action이 붙은 토스트 */
export function WithUndo() {
  return (
    <Toast.Provider>
      <DeleteButton />
    </Toast.Provider>
  );
}

function FailButton() {
  const toast = useToast();
  return (
    <Button
      intent="critical"
      onClick={() => toast({ intent: "critical", title: "저장하지 못했습니다", description: "잠시 뒤 다시 시도하세요." })}
    >
      저장 실패 보기
    </Button>
  );
}

/** 오류 토스트 — critical은 role="alert"로 바로 읽힌다 */
export function ErrorToast() {
  return (
    <Toast.Provider max={2}>
      <FailButton />
    </Toast.Provider>
  );
}

/** 정적 표시 — 문서·시안에서 live region 없이 */
export function StaticView() {
  return <Toast.View live={false} intent="informative" title="새 버전이 있습니다" description="새로 고치면 적용됩니다." />;
}
