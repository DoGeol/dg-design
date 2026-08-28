import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar } from "@dg-design/react";

const SIZES = ["small", "medium", "large", "xlarge"] as const;
const AVATAR_DATA_URL =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%239a72ee'/%3E%3Ccircle cx='32' cy='25' r='12' fill='%23f7e7ce'/%3E%3Cpath d='M10 62c4-14 14-21 22-21s18 7 22 21' fill='%233b2a54'/%3E%3C/svg%3E";
const FAILED_AVATAR_SRC = "data:image/svg+xml;base64,not-a-valid-image";

function AvatarBadge() {
  return (
    <Avatar.Badge
      aria-label="온라인"
      style={{
        width: 10,
        height: 10,
        borderRadius: "50%",
        backgroundColor: "var(--dds-color-bg-brand-solid)",
      }}
    />
  );
}

function DemoAvatar({ size = "medium", image = true }: { size?: (typeof SIZES)[number]; image?: boolean }) {
  return (
    <Avatar.Root size={size} aria-label="도겸의 프로필">
      {image ? <Avatar.Image src={AVATAR_DATA_URL} alt="도겸" /> : null}
      <Avatar.Fallback>DG</Avatar.Fallback>
      <AvatarBadge />
    </Avatar.Root>
  );
}

function StateCell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "grid", justifyItems: "center", gap: 8 }}>
      {children}
      <span style={{ font: "500 12px sans-serif" }}>{label}</span>
    </div>
  );
}

const meta = { title: "Avatar" } satisfies Meta;

export default meta;

export const FunctionalDemo: StoryObj<typeof meta> = {
  name: "Functional demo",
  render: () => <div style={{ padding: 24 }}><DemoAvatar size="large" /></div>,
};

export const StateMatrix: StoryObj<typeof meta> = {
  name: "State matrix",
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "end", gap: 24, padding: 24 }}>
      {SIZES.map((size) => (
        <StateCell key={size} label={size}>
          <DemoAvatar size={size} />
        </StateCell>
      ))}
      <StateCell label="성공 · loaded">
        <Avatar.Root size="large" data-testid="avatar-success">
          <Avatar.Image src={AVATAR_DATA_URL} alt="성공한 프로필 이미지" />
          <Avatar.Fallback>OK</Avatar.Fallback>
          <AvatarBadge />
        </Avatar.Root>
      </StateCell>
      <StateCell label="로딩 · loading (Image 없음)">
        <Avatar.Root size="large" data-testid="avatar-loading">
          <Avatar.Fallback>LD</Avatar.Fallback>
          <AvatarBadge />
        </Avatar.Root>
      </StateCell>
      <StateCell label="실패 · error">
        <Avatar.Root size="large" data-testid="avatar-error">
          <Avatar.Image src={FAILED_AVATAR_SRC} alt="실패한 프로필 이미지" />
          <Avatar.Fallback>ER</Avatar.Fallback>
          <AvatarBadge />
        </Avatar.Root>
      </StateCell>
    </div>
  ),
};
