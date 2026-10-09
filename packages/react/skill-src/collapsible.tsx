/**
 * @title Collapsible
 * @summary 하나의 영역을 열고 닫는 최소 disclosure. 트리거 하나 + 내용 하나.
 *
 * ## 언제 쓰나
 *
 * - "고급 옵션", "자세히 보기"처럼 한 덩어리를 접어 두었다 펼칠 때.
 * - 트리거 모양을 직접 정하고 싶을 때(`asChild`로 버튼·링크 등에 입힌다).
 *
 * ## 쓰지 말 때
 *
 * - 같은 모양의 항목이 여러 개이고 하나씩만 열리게 하려면 `Accordion`.
 * - 목록 묶음을 접는 것은 `List.Section collapsible`.
 * - 떠 있는 패널은 `Popover`, 화면을 가리는 것은 `Dialog`.
 *
 * ## 핵심 API
 *
 * | 부품 | 주요 prop | 메모 |
 * | --- | --- | --- |
 * | `Collapsible.Root` | `open` · `defaultOpen`(기본 닫힘) · `onOpenChange` · `disabled` | 비제어/제어 |
 * | `Collapsible.Trigger` | `asChild` | `aria-expanded`·`aria-controls` 자동 |
 * | `Collapsible.Content` | — | 닫히면 `aria-hidden`+`inert`. 내용은 마운트된 채 유지 |
 *
 * `Trigger`·`Content`는 `Root` 안에서만 쓸 수 있다(밖이면 에러).
 *
 * ## 접근성
 *
 * - Trigger는 실제 `button`이고 `aria-expanded`로 상태를 알린다. 라벨 텍스트는 열림/닫힘에 따라 바꾸지 않는다.
 * - 닫힌 내용은 `inert`라 초점을 받지 않는다.
 * - `disabled`면 Root 전체의 Trigger가 꺼진다.
 */
import { Button } from "@dg-design/react/button";
import { Collapsible } from "@dg-design/react/collapsible";
import * as React from "react";

/** 비제어 — 기본은 닫힘 */
export function AdvancedOptions() {
  return (
    <Collapsible.Root>
      <Collapsible.Trigger>고급 옵션</Collapsible.Trigger>
      <Collapsible.Content>
        <p>캐시 시간, 재시도 횟수 같은 세부 설정이 들어갑니다.</p>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}

/** 제어 — 열림 상태를 부모가 갖고 Button 모양 트리거 사용 */
export function ControlledWithButton() {
  const [open, setOpen] = React.useState(false);
  return (
    <Collapsible.Root open={open} onOpenChange={setOpen}>
      <div style={{ display: "flex", gap: "var(--dds-dimension-x2)", alignItems: "center" }}>
        <Collapsible.Trigger asChild>
          <Button intent="neutral" variant="weak" size="small">
            변경 내역
          </Button>
        </Collapsible.Trigger>
        <span>{open ? "펼쳐짐" : "접힘"}</span>
      </div>
      <Collapsible.Content>
        <ul>
          <li>토큰 이름 정리</li>
          <li>문서 오타 수정</li>
        </ul>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
