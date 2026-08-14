# @dg-design/tokens

Dogeol Design System(DDS)의 토큰 패키지. OKLCH 파생 팔레트에서 생성한 CSS 변수와 Tailwind v4 브릿지를 제공한다.

## 설치

```sh
pnpm add @dg-design/tokens
```

## 사용법

`tokens.css`는 자동 로드되지 않는다. 앱 진입점에서 직접 import한다 — 수동 로드가 설계 의도이며, 로드 순서 제어권을 소비 앱에 둔다.

```ts
import "@dg-design/tokens/tokens.css";
```
다크 모드는 `<html data-dds-theme="dark">`로 전환한다. 시스템 감지는 소비 앱 책임이다.

## Tailwind v4 브릿지

`tokens.css` 선로드 후 브릿지를 `@import`한다 (값을 복제하지 않고 변수만 재바인딩).

```css
@import "@dg-design/tokens/tokens.css";
@import "@dg-design/tokens/tailwind.css";
```
유틸 예시: `<div class="bg-bg-brand-solid">`

## 토큰 문법

`--dds-{category}-{role}-{intent}-{emphasis}[-{state}]` (예: `--dds-color-bg-brand-solid-hover`). role마다 축이 달라 모든 조합이 존재하진 않는다.

`--dds-color-palette-*`는 **내부 구현이며 공개 API가 아니다.** 직접 참조하지 말 것.

## 공개 API (semver 대상)

| 공개 | 비공개 |
|------|--------|
| semantic 색 토큰 · dimension/radius/typography 스케일 · `data-dds-theme` · exports 경로 | `--dds-color-palette-*` |
