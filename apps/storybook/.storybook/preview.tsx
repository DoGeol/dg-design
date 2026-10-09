import type { Decorator, Preview } from "@storybook/react-vite";

import "@dg-design/tokens/tokens.css";
import "../src/mockups/flex/brand-theme-blue.css";
import "../src/mockups/flex/brand-studio-blue.css";
// flex 시안 외관. 모두 :root[data-flex=…] 범위라 기본값(current)에서는 아무것도 바꾸지 않는다.
// 전역으로 불러와야 툴바 Flex로 기존 컴포넌트 스토리도 A·B·결정안 외관으로 볼 수 있다.
import "../src/mockups/flex/overrides/forms.css";
import "../src/mockups/flex/overrides/navigation.css";
import "../src/mockups/flex/overrides/surfaces.css";
import "../src/mockups/flex/overrides/data-feedback.css";
import "../src/mockups/flex/proto/proto.css";
import { cssVariables, type Density, type Variant } from "../src/mockups/flex/profiles";

const THEME_ATTR = "data-dds-theme";

const withTheme: Decorator = (Story, context) => {
  const theme = context.globals.theme as "light" | "dark" | undefined;

  if (theme === "dark") {
    document.documentElement.setAttribute(THEME_ATTR, "dark");
  } else {
    document.documentElement.removeAttribute(THEME_ATTR);
  }

  return <Story />;
};

let appliedFlexVars: string[] = [];

/**
 * flex 적용안 비교용. 기본값(current·desktop·auto)이면 아무 속성도 달지 않아 기존 스토리와 VR이 그대로다.
 * 안을 고르면 :root에 data-flex와 --fx-* 변수를 달아 어떤 스토리든 A·B 외관으로 볼 수 있다.
 */
const withFlex: Decorator = (Story, context) => {
  const root = document.documentElement;
  const variant = (["a", "b", "final"].includes(context.globals.flex as string) ? context.globals.flex : "current") as Variant;
  const density: Density = context.globals.density === "mobile" ? "mobile" : "desktop";
  const brandGlobal = (context.globals.brand as string | undefined) ?? "auto";
  const brand = brandGlobal === "auto" ? (context.title.startsWith("Mockups/Flex/") ? "theme-blue" : "dds") : brandGlobal;

  for (const name of appliedFlexVars) root.style.removeProperty(name);
  const vars = cssVariables(variant, density);
  for (const [name, value] of Object.entries(vars)) root.style.setProperty(name, value);
  appliedFlexVars = Object.keys(vars);

  const attrs: Record<string, string | null> = {
    "data-flex": variant === "current" ? null : variant,
    "data-flex-density": density === "mobile" ? "mobile" : null,
    "data-flex-brand": brand === "dds" ? null : brand,
  };
  for (const [name, value] of Object.entries(attrs)) {
    if (value === null) root.removeAttribute(name);
    else root.setAttribute(name, value);
  }

  return <Story />;
};

const preview: Preview = {
  decorators: [withTheme, withFlex],
  globalTypes: {
    theme: {
      name: "Theme",
      description: "DDS 다크 모드 토글 (html[data-dds-theme])",
      toolbar: {
        title: "Theme",
        icon: "circlehollow",
        items: [
          { value: "light", icon: "sun", title: "Light" },
          { value: "dark", icon: "moon", title: "Dark" },
        ],
        dynamicTitle: true,
      },
    },
    flex: {
      name: "Flex",
      description: "flex 적용안 — 현재 DDS / A 앞선 적용안 / B 원문 우선 / 결정안",
      toolbar: {
        title: "Flex",
        icon: "component",
        items: [
          { value: "current", title: "현재 DDS" },
          { value: "a", title: "A 앞선 적용안" },
          { value: "b", title: "B 원문 우선" },
          { value: "final", title: "결정안 (A 기본 + B 사용례)" },
        ],
        dynamicTitle: true,
      },
    },
    density: {
      name: "Density",
      description: "flex 프로필 — 데스크톱 / 모바일(390px 기준 값)",
      toolbar: {
        title: "Density",
        icon: "mobile",
        items: [
          { value: "desktop", title: "데스크톱" },
          { value: "mobile", title: "모바일" },
        ],
        dynamicTitle: true,
      },
    },
    brand: {
      name: "Brand",
      description: "브랜드 비교 — auto는 flex 시안에 정본 createTheme 블루(2026-10-09 결정), 나머지는 DDS 기본",
      toolbar: {
        title: "Brand",
        icon: "paintbrush",
        items: [
          { value: "auto", title: "auto" },
          { value: "dds", title: "DDS 기본 teal #196161" },
          { value: "theme-blue", title: "createTheme 블루 #1550A9" },
          { value: "studio-blue", title: "dg-studio 블루 #155EEF" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: "light",
    flex: "current",
    density: "desktop",
    brand: "auto",
  },
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
      },
    },
  },
};

export default preview;
