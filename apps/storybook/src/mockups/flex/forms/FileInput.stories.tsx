import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Field, FileInput, TextArea } from "@dg-design/react";

import { FlexCompare, FlexPage, FlexSection, FlexSpec, FlexState, flexOf, type Flex } from "../FlexKit";
import { FileIcon, UploadIcon } from "./parts";

const meta = { title: "Mockups/Flex/Forms/FileInput", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;

const full = { width: "100%" } as const;

function Dropzone({ dragging, disabled, invalid, compact, className }: {
  dragging?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  compact?: boolean;
  className?: string;
}) {
  return (
    <Field.Root style={full}>
      <FileInput.Root multiple disabled={disabled}>
        <FileInput.Dropzone className={className} data-dragging={dragging || undefined} aria-invalid={invalid || undefined}>
          <UploadIcon />
          {compact ? (
            <span className="fx-file-hint">끌어다 놓아도 됩니다</span>
          ) : (
            <>
              <b>{dragging ? "놓으면 첨부됩니다" : "파일을 끌어다 놓거나 눌러 고르십시오"}</b>
              <span className="fx-file-hint">PNG·JPG·PDF, 파일당 10MB 이하</span>
            </>
          )}
        </FileInput.Dropzone>
      </FileInput.Root>
      {invalid && <Field.ErrorMessage>10MB를 넘는 파일 1개를 뺐습니다.</Field.ErrorMessage>}
    </Field.Root>
  );
}

/** 파일 행 — 이름·크기·상태·행동이 한 줄. 업로드는 앱 소유라 상태 문구만 보인다. */
function FileRow({ name, size, status }: { name: string; size: string; status: "done" | "uploading" | "error" }) {
  return (
    <div className="fx-file-row" data-status={status}>
      <span className="fx-file-icon"><FileIcon /></span>
      <span className="fx-file-main">
        <span className="fx-file-name">{name}</span>
        <span className="fx-file-meta">
          {size} · {status === "done" ? "첨부됨" : status === "uploading" ? "올리는 중 62%" : "올리지 못했습니다"}
        </span>
      </span>
      {status === "error" ? (
        <Button size="small" intent="neutral" variant="weak">다시 시도</Button>
      ) : (
        <Button size="small" intent="neutral" variant="ghost" disabled={status === "uploading"}>제거</Button>
      )}
    </div>
  );
}

function View({ v }: { v: Flex }) {
  const mobile = v.density === "mobile";
  const isB = v.variant === "b";
  const changed = v.variant !== "current";
  const zone = changed ? "fx-dropzone" : undefined;
  return (
    <FlexPage
      v={v}
      title="FileInput"
      summary={
        isB
          ? "Dropzone·파일 행은 A와 같습니다. 원문이 업로더 외형을 정하지 않아, 문서·댓글 속 첨부 위치에 맞춘 조합을 더합니다."
          : v.variant === "a"
            ? "Dropzone 바탕을 약한 중성으로 두고 경계는 식별할 만큼 유지합니다. 파일은 이름·크기·상태·제거 한 행입니다."
            : "현재 DDS FileInput입니다. 투명 바탕 점선 Dropzone이고 파일 행은 앱이 Preview에 조립합니다."
      }
    >
      <FlexSection
        title={mobile && changed ? "모바일 · 파일 선택 버튼" : "Dropzone 상태"}
        columns={1}
        note={mobile && changed ? "“파일 선택”을 명시하고 끌어놓기 안내의 비중을 줄입니다." : "끌어놓는 중만으로 안내하지 않습니다 — 오류는 문구로도 알립니다."}
      >
        {mobile && changed ? (
          <FlexState label="trigger 우선" block>
            <FileInput.Root multiple>
              <FileInput.Trigger className="fx-file-trigger"><UploadIcon />파일 선택</FileInput.Trigger>
            </FileInput.Root>
          </FlexState>
        ) : (
          <>
            <FlexState label="default" block><Dropzone className={zone} /></FlexState>
            <FlexState label="hover" force="hover" block><Dropzone className={zone} /></FlexState>
            <FlexState label="focus" force="focus" block><Dropzone className={zone} /></FlexState>
          </>
        )}
        <FlexState label="dragging" block><Dropzone className={zone} dragging compact={mobile} /></FlexState>
        <FlexState label="error" block><Dropzone className={zone} invalid compact={mobile} /></FlexState>
        <FlexState label="disabled" block><Dropzone className={zone} disabled compact={mobile} /></FlexState>
      </FlexSection>

      <FlexSection title="파일 행" note={v.variant === "current" ? "현재 없음 — 앱이 Preview에 직접 조립합니다." : "완료·업로드 중·오류(재시도)를 구분합니다."}>
        <FlexState label="완료 · 올리는 중 · 오류" block>
          <div style={{ display: "grid", gap: 8 }}>
            <FileRow name="2026-회고-초안.pdf" size="1.2MB" status="done" />
            <FileRow name="컴포넌트-캡처.png" size="3.4MB" status="uploading" />
            <FileRow name="녹화-원본.mov" size="148MB" status="error" />
          </div>
        </FlexState>
      </FlexSection>

      {isB && (
        <FlexSection title="문맥 첨부 · 댓글" note="첨부는 댓글 입력 아래 작은 행동으로 두고, 선택한 파일은 같은 행 형식으로 붙습니다.">
          <FlexState label="댓글 + 첨부" block>
            <Field.Root style={full}>
              <Field.Label>댓글</Field.Label>
              <TextArea className="fx-box" rows={2} defaultValue="캡처 붙입니다." />
            </Field.Root>
            <div style={{ display: "grid", gap: 8, marginTop: 8 }}>
              <FileRow name="컴포넌트-캡처.png" size="3.4MB" status="done" />
              <div className="fx-toolbar">
                <FileInput.Root multiple>
                  <FileInput.Trigger className="fx-file-trigger"><UploadIcon />첨부</FileInput.Trigger>
                </FileInput.Root>
                <Button className="fx-cta" size="medium">등록</Button>
              </div>
            </div>
          </FlexState>
        </FlexSection>
      )}

      <FlexSpec v={v} roles={changed ? ["list-inset", "button-radius"] : []} extra={[
        ["Dropzone 반경 · 여백", "12 · 24/16px", "D 현재 DDS 값 유지"],
        ["Dropzone 바탕", changed ? "bg-neutral-weak · hover -hover" : "투명 · hover transparent-hover", changed ? "C A 문서 — 약한 중성 바탕" : "현재 DDS 값 유지"],
        ["Dropzone 경계", changed ? "1px 점선 stroke-neutral" : "1px 점선 stroke-neutral-weak", changed ? "C 약한 중성 바탕 위에서 식별되게 한 단계 진하게" : "현재 DDS 값 유지"],
        ["파일 행", "아이콘 20 · 이름/크기·상태 · 행동", changed ? "C A 문서 — 한 행" : "앱 조립"],
      ]} />
    </FlexPage>
  );
}

export const Compare: StoryObj = { render: (_, ctx) => <FlexCompare ctx={ctx} minHeight={900} /> };
export const Specimen: StoryObj = { render: (_, ctx) => <View v={flexOf(ctx)} /> };
