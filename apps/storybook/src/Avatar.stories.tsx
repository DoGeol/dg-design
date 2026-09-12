import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar } from "@dg-design/react";
import * as React from "react";

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

const GREEN_AVATAR_DATA_URL =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%232f8f6f'/%3E%3Ccircle cx='32' cy='25' r='12' fill='%23f7e7ce'/%3E%3Cpath d='M10 62c4-14 14-21 22-21s18 7 22 21' fill='%23123'/%3E%3C/svg%3E";

/**
 * 모션 데모: 기본값은 none이고 motion="auto"인 아바타만 네트워크로 새로 받은 이미지를 페이드인한다.
 * 처음은 정지 상태(이미지 하나가 이미 표시된 상태)이며 버튼을 눌러야 src가 바뀐다.
 *
 * "네트워크 이미지"는 storybook-static에 없는 경로라 평소에는 오류 fallback으로 끝난다 —
 * 브라우저 기능 테스트가 이 요청을 가로채 지연 응답을 만들어 지연 로드 경로를 검증한다.
 */
function MotionDemoView() {
  const [src, setSrc] = React.useState(AVATAR_DATA_URL);
  const [motion, setMotion] = React.useState<"auto" | "none">("auto");
  const [networkVersion, setNetworkVersion] = React.useState(0);

  return (
    <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16, alignItems: "flex-start" }}>
      <div style={{ display: "flex", gap: 24 }}>
        <div data-testid="motion-auto">
          <Avatar.Root size="xlarge" motion={motion}>
            <Avatar.Image src={src} alt="모션 프로필" />
            <Avatar.Fallback>DG</Avatar.Fallback>
            <AvatarBadge />
          </Avatar.Root>
        </div>
        <div data-testid="motion-none">
          <Avatar.Root size="xlarge">
            <Avatar.Image src={src} alt="기본 모션 프로필" />
            <Avatar.Fallback>NM</Avatar.Fallback>
            <AvatarBadge />
          </Avatar.Root>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button type="button" data-testid="src-cached" onClick={() => setSrc(AVATAR_DATA_URL)}>
          캐시된 이미지
        </button>
        <button type="button" data-testid="src-other" onClick={() => setSrc(GREEN_AVATAR_DATA_URL)}>
          다른 이미지
        </button>
        <button
          type="button"
          data-testid="src-network"
          onClick={() => {
            setNetworkVersion((version) => version + 1);
            setSrc(`./avatar-motion.svg?v=${networkVersion + 1}`);
          }}
        >
          네트워크 이미지
        </button>
        <button type="button" data-testid="src-broken" onClick={() => setSrc(FAILED_AVATAR_SRC)}>
          깨진 이미지
        </button>
        <button
          type="button"
          data-testid="toggle-motion"
          onClick={() => setMotion((value) => (value === "auto" ? "none" : "auto"))}
        >
          motion 토글(현재 {motion})
        </button>
      </div>
    </div>
  );
}

export const MotionDemo: StoryObj<typeof meta> = {
  name: "Motion demo",
  render: () => <MotionDemoView />,
};
