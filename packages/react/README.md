# @dg-design/react

Dogeol Design System(DDS)의 React 컴포넌트 패키지.

## 설치

```sh
pnpm add @dg-design/react @dg-design/tokens
```

peer dependency: `react` / `react-dom` `^18 || ^19`

배포는 GitHub Actions에서 npm trusted publishing으로 이뤄지며, 각 버전에 provenance가 첨부된다.

컴포넌트 CSS는 side-effect import로 자동 로드되지만, 토큰 값(`--dds-*`)은 별도 패키지에 있다. 소비 앱이 진입점에서 `@dg-design/tokens/tokens.css`를 직접 로드해야 한다.

```ts
import "@dg-design/tokens/tokens.css";
```

## 사용

컴포넌트는 배럴(`@dg-design/react`)과 서브패스(`@dg-design/react/<컴포넌트>`) 두 방식으로 가져올 수 있다. 배럴은 편하지만 가져온 컴포넌트와 무관하게 모든 컴포넌트의 CSS가 번들에 함께 실린다 — 번들 크기가 중요하면 서브패스를 쓴다.

### Button

```tsx
import { Button } from "@dg-design/react/button";

<Button intent="brand" variant="solid" size="medium">확인</Button>
<Button intent="neutral" variant="weak" size="small">취소</Button>
<Button variant="ghost" disabled>비활성</Button>
```

- `intent`: `"brand" | "neutral"` (기본 `"brand"`)
- `variant`: `"solid" | "weak" | "ghost"` (기본 `"solid"`)
- `size`: `"small" | "medium" | "large"` (기본 `"medium"`)
- `disabled`: native `disabled` 속성

### Dialog

```tsx
import { Button } from "@dg-design/react/button";
import { Dialog } from "@dg-design/react/dialog";

<Dialog.Root>
  <Dialog.Trigger asChild>
    <Button>열기</Button>
  </Dialog.Trigger>
  <Dialog.Overlay />
  <Dialog.Content>
    <Dialog.Title>제목</Dialog.Title>
    <Dialog.Description>설명</Dialog.Description>
    <Dialog.Close asChild>
      <Button variant="weak" intent="neutral">닫기</Button>
    </Dialog.Close>
  </Dialog.Content>
</Dialog.Root>
```

### Select

```tsx
import { Select } from "@dg-design/react/select";

<Select.Root name="fruit" onValueChange={(value) => console.log(value)}>
  <Select.Trigger placeholder="과일을 고르세요" />
  <Select.Content>
    <Select.Option value="apple">Apple</Select.Option>
    <Select.Option value="banana">Banana</Select.Option>
  </Select.Content>
</Select.Root>
```

나머지 컴포넌트(Badge, Checkbox, ContextMenu, DropdownMenu, Field, HoverCard, MultiSelect, NotificationBadge, Popover, RadioGroup, Sheet, Switch, TextArea, TextField, Tooltip)도 같은 규칙 — `@dg-design/react/<kebab-case 이름>`(예: `./context-menu`, `./text-field`)으로 가져온다. 전체 목록은 패키지 `package.json`의 `exports`를 참고.

배럴에서 한 번에 가져와도 된다:

```ts
import { Button, Dialog, Select } from "@dg-design/react";
```

## 번들러 요구사항

컴포넌트 CSS는 side-effect import(`import "./button.css"`)로 자동 로드된다. **`.css` import를 처리하는 번들러(Vite, webpack, Next.js 등)가 있어야 하며**, 없는 환경(Jest 기본 설정, 순수 Node 실행, `tsx` 스크립트 등)에서는 스타일이 빠지는 게 아니라 `ERR_UNKNOWN_FILE_EXTENSION`으로 **크래시한다**.

Jest에서는 `moduleNameMapper`로 CSS import를 빈 모듈로 돌린다:

```js
// jest.config.js
module.exports = {
  moduleNameMapper: {
    "\\.css$": "<rootDir>/test/style-mock.js",
  },
};
```

```js
// test/style-mock.js
module.exports = {};
```

## 스타일 오버라이드

`className` prop으로 오버라이드한다. 컴포넌트가 방출하는 CSS 클래스 이름(`.dds-button--variant_solid` 등)은 **공개 API가 아니며** 예고 없이 바뀔 수 있다 — 직접 참조하지 말 것.

`className`과 컴포넌트 CSS(`@layer dds`)가 실제로 어떤 순서로 이기는지, 토큰 오버라이드·`createTheme` 전체 브랜드 교체까지 포함한 계약 전체는 [docs/customization.md](../../docs/customization.md) 참고.
