import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@dg-design/react/button";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  CloseIcon,
  CopyIcon,
  CriticalIcon,
  DownloadIcon,
  DragHandleIcon,
  ExternalLinkIcon,
  EyeIcon,
  GlobeIcon,
  InfoIcon,
  LockIcon,
  MenuIcon,
  MinusIcon,
  MoonIcon,
  MoreIcon,
  PanelLeftIcon,
  PanelRightIcon,
  PencilIcon,
  PlusIcon,
  PositiveIcon,
  RedoIcon,
  SearchIcon,
  SettingsIcon,
  SunIcon,
  TrashIcon,
  UndoIcon,
  UploadIcon,
  WarningIcon,
} from "@dg-design/react/icon";
import * as React from "react";

import { Caption, DensityColumns } from "./new-kinds-frame";

const meta = {
  title: "Icon",
} satisfies Meta;

export default meta;

const ICONS = [
  { name: "ChevronUp", Comp: ChevronUpIcon },
  { name: "ChevronDown", Comp: ChevronDownIcon },
  { name: "ChevronLeft", Comp: ChevronLeftIcon },
  { name: "ChevronRight", Comp: ChevronRightIcon },
  { name: "Close", Comp: CloseIcon },
  { name: "Menu", Comp: MenuIcon },
  { name: "ExternalLink", Comp: ExternalLinkIcon },
  { name: "Plus", Comp: PlusIcon },
  { name: "Minus", Comp: MinusIcon },
  { name: "Sun", Comp: SunIcon },
  { name: "Moon", Comp: MoonIcon },
  { name: "DragHandle", Comp: DragHandleIcon },
  { name: "Check", Comp: CheckIcon },
  { name: "Copy", Comp: CopyIcon },
  { name: "Search", Comp: SearchIcon },
  { name: "Settings", Comp: SettingsIcon },
  { name: "Trash", Comp: TrashIcon },
  { name: "Pencil", Comp: PencilIcon },
  { name: "Download", Comp: DownloadIcon },
  { name: "Upload", Comp: UploadIcon },
  { name: "Undo", Comp: UndoIcon },
  { name: "Redo", Comp: RedoIcon },
  { name: "More", Comp: MoreIcon },
  { name: "Eye", Comp: EyeIcon },
  { name: "Lock", Comp: LockIcon },
  { name: "Globe", Comp: GlobeIcon },
  { name: "PanelLeft", Comp: PanelLeftIcon },
  { name: "PanelRight", Comp: PanelRightIcon },
  { name: "Info", Comp: InfoIcon },
  { name: "Positive", Comp: PositiveIcon },
  { name: "Warning", Comp: WarningIcon },
  { name: "Critical", Comp: CriticalIcon },
] as const;

/** 조작 요소 안의 아이콘 동작 데모. 기본적으로 닫힌 상태. */
export const FunctionalDemo: StoryObj<typeof meta> = {
  name: "Functional demo",
  render: function Render() {
    const [copied, setCopied] = React.useState(false);
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 24 }}>
        <Button
          iconOnly
          aria-label={copied ? "복사됨" : "코드 복사"}
          intent="neutral"
          variant="ghost"
          onClick={() => setCopied(!copied)}
        >
          {copied ? <CheckIcon size={20} /> : <CopyIcon size={20} />}
        </Button>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 14 }}>
          <SunIcon size={16} /> 라이트 테마
        </span>
        <ChevronDownIcon size={24} label="아래 방향" />
      </div>
    );
  },
};

function IconGrid({ disabled = false }: { disabled?: boolean }) {
  const SIZES = [16, 20, 24] as const;
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "100px repeat(3, 40px)",
        gap: 8,
        alignItems: "center",
        color: disabled ? "var(--dds-color-fg-disabled)" : "var(--dds-color-fg-neutral)",
      }}
    >
      <div style={{ font: "600 11px monospace", color: "var(--dds-color-fg-neutral-weak)" }}>
        Name \ Size
      </div>
      {SIZES.map((s) => (
        <div
          key={s}
          style={{ font: "600 11px monospace", color: "var(--dds-color-fg-neutral-weak)", textAlign: "center" }}
        >
          {s}
        </div>
      ))}
      {ICONS.map(({ name, Comp }) => (
        <React.Fragment key={name}>
          <div style={{ font: "12px monospace", overflow: "hidden", textOverflow: "ellipsis" }}>
            {name}
          </div>
          {SIZES.map((size) => (
            <div
              key={size}
              style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <Comp size={size} />
            </div>
          ))}
        </React.Fragment>
      ))}
    </div>
  );
}

function MatrixContent() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <Caption>기본 (상속 fg-neutral)</Caption>
        <IconGrid />
      </div>
      <div>
        <Caption>비활성 색 상속 (fg-disabled)</Caption>
        <IconGrid disabled />
      </div>
      <div
        data-dds-theme="dark"
        style={{
          background: "var(--dds-color-bg-layer-default)",
          color: "var(--dds-color-fg-neutral)",
          padding: 16,
          borderRadius: 8,
        }}
      >
        <Caption>다크 모드 스코프</Caption>
        <IconGrid />
      </div>
    </div>
  );
}

/**
 * VR 기준: 16종 × 크기 3개(16, 20, 24), 라이트·다크·모바일·상속 disabled 색 매트릭스.
 */
export const StateMatrix: StoryObj<typeof meta> = {
  name: "State matrix",
  render: () => <DensityColumns>{() => <MatrixContent />}</DensityColumns>,
};
