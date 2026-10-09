import { Badge, Button, Dialog, Field, Sheet, TextArea } from "@dg-design/react";
import type * as React from "react";

import { CloseIcon } from "./mockups/c-overlay/icons";

/** 작업형 패널 스토리가 같이 쓰는 내용 — 판단 자료가 길어 Body가 스크롤된다. */
export function WorkBody() {
  return (
    <>
      <p style={{ margin: 0, font: "inherit" }}>
        이력서 v3의 공개 범위를 바꿉니다. 바뀐 내용을 확인하고 메모를 남기세요.
      </p>
      {Array.from({ length: 6 }, (_, i) => (
        <p key={i} style={{ margin: 0, color: "var(--dds-color-fg-neutral-weak)" }}>
          변경 {i + 1} — 경력 항목의 기간과 설명이 수정되었습니다. 공개 링크로 들어온 사람에게 바로 보입니다.
        </p>
      ))}
      <Field.Root>
        <Field.Label>메모</Field.Label>
        <TextArea defaultValue="검토 완료" />
      </Field.Root>
    </>
  );
}

export function WorkAside() {
  return (
    <>
      <h3 style={{ margin: "0 0 12px", font: "700 13px/18px inherit" }}>활동</h3>
      <ol style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 12, fontSize: 13 }}>
        <li>김도걸이 공개로 바꿈</li>
        <li>이수민이 메모를 남김</li>
        <li>PDF를 다시 만듦</li>
      </ol>
    </>
  );
}

export function CloseButton({ kind }: { kind: "dialog" | "sheet" }) {
  const Close = kind === "dialog" ? Dialog.Close : Sheet.Close;
  return (
    <Close asChild>
      <Button size="small" intent="neutral" variant="ghost" iconOnly aria-label="닫기">
        <CloseIcon size={16} />
      </Button>
    </Close>
  );
}

export function WorkFooter({ Footer }: { Footer: React.ComponentType<React.HTMLAttributes<HTMLDivElement>> }) {
  return (
    <Footer>
      <Button intent="neutral" variant="weak">
        취소
      </Button>
      <Button>저장</Button>
    </Footer>
  );
}

export const StatusBadge = () => (
  <Badge intent="informative" variant="weak">
    검토 중
  </Badge>
);
