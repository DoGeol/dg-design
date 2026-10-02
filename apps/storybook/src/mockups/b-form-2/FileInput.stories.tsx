import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Field, FileInput } from "@dg-design/react";

import { MockupPage, MockupSection, MockupSpec, MockupState } from "../MockupKit";
import "./overrides.css";

const meta = { title: "Mockups/A/FileInput", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;

function UploadIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 15V4M7.5 8.5L12 4l4.5 4.5M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11.5 2.5H6a1.5 1.5 0 0 0-1.5 1.5v12A1.5 1.5 0 0 0 6 17.5h8a1.5 1.5 0 0 0 1.5-1.5V6.5l-4-4z" />
      <path d="M11.5 2.5v4h4" />
    </svg>
  );
}

const hint = { fontSize: "var(--dds-font-size-t3)", lineHeight: "var(--dds-line-height-t3)" } as const;

function DropzoneBody({ dragging }: { dragging?: boolean }) {
  return (
    <>
      <UploadIcon />
      <span style={{ fontWeight: "var(--dds-font-weight-bold)" }}>
        {dragging ? "놓으면 바로 첨부됩니다" : "파일을 끌어다 놓거나 클릭해 선택"}
      </span>
      <span style={hint}>PNG·JPG·PDF, 파일당 10MB 이하</span>
    </>
  );
}

function Dropzone({ dragging, disabled }: { dragging?: boolean; disabled?: boolean }) {
  return (
    <FileInput.Root multiple disabled={disabled} style={{ width: "100%", padding: 12, boxSizing: "border-box", borderRadius: "var(--dds-radius-r3)", background: "var(--dds-color-bg-layer-default)" }}>
      <FileInput.Dropzone data-dragging={dragging || undefined}><DropzoneBody dragging={dragging} /></FileInput.Dropzone>
    </FileInput.Root>
  );
}

/** 선택된 파일 행. 레이아웃은 소비자 몫이라 토큰만 써서 조립한다. */
function FileRow({ name, size }: { name: string; size: string }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12, padding: "8px 8px 8px 12px",
      border: "1px solid var(--dds-color-stroke-neutral-weak)", borderRadius: "var(--dds-radius-r2)",
      background: "var(--dds-color-bg-layer-default)",
    }}>
      <span style={{ display: "inline-flex", color: "var(--dds-color-fg-neutral-weak)" }}><FileIcon /></span>
      <span style={{ display: "flex", flexDirection: "column", minWidth: 0, flex: 1 }}>
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</span>
        <span style={{ ...hint, color: "var(--dds-color-fg-neutral-weak)" }}>{size}</span>
      </span>
      <Button size="small" intent="critical" variant="ghost">제거</Button>
    </div>
  );
}

export const Overview: StoryObj = {
  render: () => (
    <MockupPage title="FileInput" summary="파일을 끌어다 놓거나 눌러서 고릅니다. 검증은 컴포넌트가 하고, 미리보기·업로드 진행·파일 행은 소비자가 Preview·Actions 슬롯에 조립합니다.">
      <MockupSection title="Dropzone 상태" note="흰 표면 위에 둔 모습입니다. 드래그 중에는 테두리가 브랜드 색으로 바뀌고 약한 브랜드 배경이 깔립니다. hover·pressed 표현은 없습니다.">
        <MockupState label="default"><Dropzone /></MockupState>
        <MockupState label="dragging · data-dragging"><Dropzone dragging /></MockupState>
        <MockupState label="focus" force="focus"><Dropzone /></MockupState>
        <MockupState label="error">
          <div style={{ width: "100%" }}>
            <Field.Root>
              <FileInput.Root multiple style={{ padding: 12, borderRadius: "var(--dds-radius-r3)", background: "var(--dds-color-bg-layer-default)" }}>
                <FileInput.Dropzone><DropzoneBody /></FileInput.Dropzone>
              </FileInput.Root>
              <Field.ErrorMessage>보고서.hwp는 지원하지 않는 형식입니다.</Field.ErrorMessage>
            </Field.Root>
          </div>
        </MockupState>
        <MockupState label="disabled"><Dropzone disabled /></MockupState>
      </MockupSection>

      <MockupSection title="Trigger" columns={4} note="버튼 하나로 고를 때 씁니다. asChild로 DDS Button에 동작만 얹을 수 있습니다.">
        <MockupState label="기본 Trigger">
          <FileInput.Root><FileInput.Trigger>파일 선택</FileInput.Trigger></FileInput.Root>
        </MockupState>
        <MockupState label="focus" force="focus">
          <FileInput.Root><FileInput.Trigger>파일 선택</FileInput.Trigger></FileInput.Root>
        </MockupState>
        <MockupState label="disabled">
          <FileInput.Root disabled><FileInput.Trigger>파일 선택</FileInput.Trigger></FileInput.Root>
        </MockupState>
        <MockupState label="asChild · Button neutral weak">
          <FileInput.Root>
            <FileInput.Trigger asChild><Button intent="neutral" variant="weak">이미지 선택</Button></FileInput.Trigger>
          </FileInput.Root>
        </MockupState>
      </MockupSection>

      <MockupSection title="선택된 파일" columns={2} note="제거는 다시 고르면 되돌릴 수 있어 확인 없이 critical ghost로 둡니다.">
        <MockupState label="empty">
          <FileInput.Root style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <FileInput.Trigger asChild><Button intent="neutral" variant="weak">이미지 선택</Button></FileInput.Trigger>
            <FileInput.Preview><span style={{ color: "var(--dds-color-fg-neutral-weak)" }}>선택된 파일이 없습니다.</span></FileInput.Preview>
          </FileInput.Root>
        </MockupState>
        <MockupState label="파일 행 · 제거 버튼">
          <FileInput.Preview style={{ width: "100%" }}>
            <FileRow name="2026년 3분기 운영 보고서.pdf" size="2.4MB" />
            <FileRow name="회의록-사진.jpg" size="860KB" />
          </FileInput.Preview>
        </MockupState>
      </MockupSection>

      <MockupSection title="사용 예" columns={2}>
        <MockupState label="문의 작성 · 첨부 파일">
          <div style={{ width: "100%" }}>
            <Field.Root>
              <Field.Label>첨부 파일</Field.Label>
              <FileInput.Root multiple maxFiles={3} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <FileInput.Dropzone><DropzoneBody /></FileInput.Dropzone>
                <FileInput.Preview>
                  <FileRow name="오류 화면 캡처.png" size="1.2MB" />
                </FileInput.Preview>
              </FileInput.Root>
              <Field.Description>최대 3개까지 첨부할 수 있습니다.</Field.Description>
            </Field.Root>
          </div>
        </MockupState>
        <MockupState label="프로필 · 대표 이미지(Trigger + Actions)">
          <div style={{ width: "100%" }}>
            <Field.Root>
              <Field.Label>대표 이미지</Field.Label>
              <FileInput.Root accept="image/png,image/jpeg" style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{
                  width: 64, height: 64, borderRadius: "var(--dds-radius-r3)", flex: "none",
                  background: "linear-gradient(135deg, #C4D5F0, #1550A9)",
                }} role="img" aria-label="대표 이미지 미리보기" />
                <FileInput.Preview style={{ flex: 1, minWidth: 0 }}>
                  <span>cover-2026.png</span>
                  <span style={{ ...hint, color: "var(--dds-color-fg-neutral-weak)" }}>1080 × 1080 · 640KB</span>
                </FileInput.Preview>
                <FileInput.Actions>
                  <FileInput.Trigger asChild><Button size="small" intent="neutral" variant="weak">교체</Button></FileInput.Trigger>
                  <Button size="small" intent="critical" variant="ghost">제거</Button>
                </FileInput.Actions>
              </FileInput.Root>
              <Field.Description>PNG·JPEG, 5MB 이하입니다.</Field.Description>
            </Field.Root>
          </div>
        </MockupState>
      </MockupSection>

      <MockupSpec rows={[
        ["Dropzone 패딩 · 간격", "24px 16px · 세로 간격 8px", "--dds-dimension-x6 / x4, x2"],
        ["Dropzone radius", "12px", "--dds-radius-r3"],
        ["Dropzone 테두리", "1px dashed #E5E8EB", "--dds-color-stroke-neutral-weak"],
        ["Dropzone 배경 / 글자", "투명 / #6D6F72", "--dds-color-fg-neutral-weak"],
        ["dragging", "테두리 #1550A9 · 배경 #F1F5FC", "--dds-color-stroke-focus-ring / bg-brand-weak"],
        ["error", "테두리 #C7272D · 문구 13px #731115", "--dds-color-stroke-critical / fg-critical"],
        ["disabled", "배경·테두리 #E5E8EB · 글자 #8A8C8F", "--dds-color-bg-disabled / fg-disabled"],
        ["focus ring", "2px #1550A9 outline, offset 2px", "--dds-color-stroke-focus-ring"],
        ["Trigger", "패딩 8px 16px · radius 8px(A 보정, 현재 12) · 1px #E5E8EB · bold · 글자 #252629", "--dds-dimension-x2 / x4, --dds-radius-r2"],
        ["Trigger disabled", "글자 #8A8C8F · 테두리 #E5E8EB", "--dds-color-fg-disabled / bg-disabled"],
        ["Preview / Actions 간격", "8px (Preview 세로, Actions 가로)", "--dds-dimension-x2"],
        ["파일 행(소비자 조립)", "1px #E5E8EB · radius 8px · 제거는 Button small critical ghost", "--dds-color-stroke-neutral-weak, --dds-radius-r2"],
        ["아이콘", "업로드 24px · 파일 20px, stroke 1.5", "—"],
      ]} />
    </MockupPage>
  ),
};
