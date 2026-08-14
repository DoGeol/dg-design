import type { Decorator, Preview } from "@storybook/react-vite";

import "@dg-design/tokens/tokens.css";

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

const preview: Preview = {
  decorators: [withTheme],
  globalTypes: {
    theme: {
      name: "Theme",
      description: "DDS 다크 모드 토글 (html[data-dds-theme])",
      toolbar: {
        icon: "circlehollow",
        items: [
          { value: "light", icon: "sun", title: "Light" },
          { value: "dark", icon: "moon", title: "Dark" },
        ],
        showName: true,
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: "light",
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
