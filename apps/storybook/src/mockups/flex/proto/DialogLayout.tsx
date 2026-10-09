import * as React from "react";
import { Badge, Button, Dialog, Field, Select, Sheet, TextArea, TextField } from "@dg-design/react";

import { CloseIcon } from "../../c-overlay/icons";

/**
 * 작업형 Dialog 레이아웃 부품(Toolbar·Body·Aside·Footer)의 Storybook 전용 프로토타입. packages/react에 없다.
 * 실제 Dialog.Content·Sheet.Content에 className="fx-dialog-frame"을 주고 안에 그대로 넣거나,
 * StaticFrame으로 여러 보기를 한 화면에 나란히 그린다. 외관은 overrides/surfaces.css의 .fx-dialog-*.
 */

/** 프레임이 놓이는 자리. center·side·full은 Dialog 보기, sheet·sheet-full은 모바일 하단 Sheet 단계. */
export type View = "center" | "side" | "full" | "sheet" | "sheet-full";
export type Kind = "dialog" | "sheet";

const part = (base: string) =>
  function Part({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return <div className={className ? `${base} ${className}` : base} {...props} />;
  };

export const DialogToolbar = part("fx-dialog-toolbar");
/** Body+Footer 열과 Aside 열. 패널 폭이 좁으면(560 미만) Aside가 본문 뒤로 내려간다. */
export const DialogSplit = part("fx-dialog-split");
export const DialogMain = part("fx-dialog-main");
/** 스크롤은 여기서만 생긴다. Toolbar·Footer는 고정. */
export const DialogBody = part("fx-dialog-body");
/** Body 아래에만 붙는다 — Aside 밑으로 이어지지 않는다. */
export const DialogFooter = part("fx-dialog-footer");
export function DialogAside({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return <aside className={className ? `fx-dialog-aside ${className}` : "fx-dialog-aside"} {...props} />;
}

/**
 * 실제 모달이 아닌 정적 프레임. 닫힌 Root가 Title·Description·Close의 문맥만 준다.
 * today는 오늘 DDS 모양(p24·gap12·내용 전체 스크롤), 아니면 부품 레이아웃이다.
 */
export function StaticFrame({ kind = "dialog", view, today, height, label, children }: {
  kind?: Kind;
  view: View;
  today?: boolean;
  height?: number | string;
  label: string;
  children: React.ReactNode;
}) {
  const frame = (
    <div className="fx-dialog-frame" data-kind={kind} data-view={view} data-today={today ? "" : undefined} role="group" aria-label={label} style={{ height }}>
      {children}
    </div>
  );
  return kind === "sheet" ? <Sheet.Root>{frame}</Sheet.Root> : <Dialog.Root>{frame}</Dialog.Root>;
}

/** 프레임 뒤의 가상 화면 — 딤 위에 보기별 위치로 프레임을 둔다. zoom은 데스크톱 좁은 열에서 0.5로 줄인다. */
export function Screen({ view, height, zoom, children }: { view: View; height: number; zoom?: boolean; children: React.ReactNode }) {
  const screen = <div className="fx-dialog-screen" data-view={view} style={{ height }}>{children}</div>;
  return zoom ? <div className="fx-dialog-zoom">{screen}</div> : screen;
}

/* ───── 같은 작업 하나 — Dialog·Sheet·시나리오가 같은 데이터를 쓴다 ───── */

export const MEMO = "선택 상태와 hover 구분을 확인했습니다.";

const parts = (kind: Kind) => (kind === "sheet" ? Sheet : Dialog);

export function ExpandIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7" />
    </svg>
  );
}

export function TaskHead({ kind = "dialog" }: { kind?: Kind }) {
  const P = parts(kind);
  return (
    <div className="fx-dialog-head">
      <P.Title>컴포넌트 디자인 기록</P.Title>
      <P.Description>변경 내용을 확인한 뒤 검토를 완료하십시오.</P.Description>
    </div>
  );
}

/** 판단 자료 — 대상·상태 다음, 실행 전에 읽는 내용. */
export function TaskChanges() {
  return (
    <div className="fx-dialog-activity">
      <h3 className="fx-dialog-aside-title">변경 내용</h3>
      <ol>
        <li>Select 선택 체크와 hover 배경을 나눴습니다.</li>
        <li>선택 패널 반경을 14로 바꿨습니다.</li>
        <li>다크 모드에서도 패널 경계 1px을 유지합니다.</li>
      </ol>
    </div>
  );
}

/** few는 간단 단계(메모·상태만), all은 상세·전체 단계. 메모 값은 단계가 바뀌어도 같다. */
export function TaskFields({ few }: { few?: boolean }) {
  return (
    <div className="fx-dialog-fields">
      <Field.Root>
        <Field.Label>검토 메모</Field.Label>
        <TextArea rows={few ? 2 : 3} defaultValue={MEMO} />
      </Field.Root>
      {!few && (
        <>
          <Field.Root>
            <Field.Label>담당자</Field.Label>
            <Select.Root defaultValue="minseo">
              <Select.Trigger />
              <Select.Content>
                <Select.Option value="minseo">김민서</Select.Option>
                <Select.Option value="dogeol">편도걸</Select.Option>
              </Select.Content>
            </Select.Root>
          </Field.Root>
          <Field.Root>
            <Field.Label>마감일</Field.Label>
            <TextField defaultValue="2026. 10. 16." />
          </Field.Root>
          <Field.Root>
            <Field.Label>참고 링크</Field.Label>
            <TextField defaultValue="dogeol.dev/blog/components" />
            <Field.Description>검토자가 바로 열어 볼 수 있습니다.</Field.Description>
          </Field.Root>
        </>
      )}
    </div>
  );
}

const LOG = [
  ["편도걸", "검토를 요청했습니다.", "10월 8일"],
  ["김민서", "내용을 확인했습니다.", "10월 9일"],
  ["김민서", "메모를 고쳤습니다.", "방금"],
] as const;

export function TaskActivity() {
  return (
    <div className="fx-dialog-activity">
      <h3 className="fx-dialog-aside-title">활동</h3>
      <ol>
        {LOG.map(([who, what, when]) => (
          <li key={what}><strong>{who}</strong> {what}<span>{when}</span></li>
        ))}
      </ol>
    </div>
  );
}

export function TaskToolbar({ kind = "dialog", extra }: { kind?: Kind; extra?: React.ReactNode }) {
  const P = parts(kind);
  return (
    <DialogToolbar>
      <span className="fx-dialog-context">검토 요청 · 블로그</span>
      <Badge intent="informative">검토 중</Badge>
      <span className="fx-dialog-spacer" />
      {extra}
      <P.Close asChild>
        <Button size="small" intent="neutral" variant="ghost" iconOnly aria-label="닫기"><CloseIcon /></Button>
      </P.Close>
    </DialogToolbar>
  );
}

export function TaskActions({ kind = "dialog", mobile }: { kind?: Kind; mobile?: boolean }) {
  const P = parts(kind);
  return (
    <>
      {!mobile && <P.Close asChild><Button intent="neutral" variant="weak">취소</Button></P.Close>}
      <Button className={mobile ? "fx-cta" : undefined}>검토 완료</Button>
    </>
  );
}

/** 부품 레이아웃 전체 — Toolbar / (Body + Footer) | Aside. */
export function TaskParts({ kind = "dialog", mobile, few, toolbarExtra }: {
  kind?: Kind;
  mobile?: boolean;
  few?: boolean;
  toolbarExtra?: React.ReactNode;
}) {
  return (
    <>
      <TaskToolbar kind={kind} extra={toolbarExtra} />
      <DialogSplit>
        <DialogMain>
          <DialogBody>
            <TaskHead kind={kind} />
            {!few && <TaskChanges />}
            <TaskFields few={few} />
          </DialogBody>
          <DialogFooter><TaskActions kind={kind} mobile={mobile} /></DialogFooter>
        </DialogMain>
        {!few && <DialogAside><TaskActivity /></DialogAside>}
      </DialogSplit>
    </>
  );
}

/** 오늘 DDS로 같은 작업을 조립한 모양 — Title·Description·Close뿐이라 활동과 버튼까지 한 덩어리로 스크롤된다. */
export function TaskToday({ kind = "dialog" }: { kind?: Kind }) {
  return (
    <>
      <TaskHead kind={kind} />
      <TaskChanges />
      <TaskFields />
      <TaskActivity />
      <div className="fx-dialog-today-actions"><TaskActions kind={kind} /></div>
    </>
  );
}
