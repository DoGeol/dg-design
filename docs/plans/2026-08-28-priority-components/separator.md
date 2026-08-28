# Separator 기획
- 기준 스펙: `docs/specs/archive/2026-08-28-priority-components-batch.md`
- 상태: 구현 완료 — 2026-08-28
## 목표
기본적으로 장식용인 중립 구분선을 제공하고, 문서 구조상 의미가 필요할 때만 separator semantics를 opt-in한다. 수평·수직 배치를 단일 컴포넌트로 지원한다.
## API
```ts
interface SeparatorProps extends React.ComponentPropsWithoutRef<"div"> {
  orientation?: "horizontal" | "vertical";
  decorative?: boolean;
}
```
- 공개 API: `Separator`, `SeparatorProps`
- `orientation` 기본값: `"horizontal"`
- `decorative` 기본값: `true`
- 네이티브 `div` 속성, `className`, `style`, `ref`를 전달한다.
## 상태
- orientation: `horizontal`, `vertical`
- semantics: decorative, semantic
- interaction과 disabled 상태는 없다.
## DOM/ARIA
- 루트는 단일 `div`다.
- decorative이면 기본 `aria-hidden="true"`이며 `role`을 부여하지 않는다.
- semantic이면 기본 `role="separator"`와 현재 orientation의 `aria-orientation`을 부여한다.
- 소비자가 명시한 ARIA 속성은 보존한다.
- semantic opt-in은 `decorative={false}`로 표현한다.
## 디자인 토큰
- 선 색상은 기존 neutral weak stroke semantic token을 사용한다.
- 수평: 기본 `width: 100%`, `height: 1px`
- 수직: 기본 `width: 1px`, `align-self: stretch`
- CSS는 `@layer dds`, `.dds-separator`, `.dds-separator--orientation_*` 관습을 따른다.
- palette token이나 별도 intent/강도 variant를 공개하지 않는다.
## 경계값
- 수직 Separator는 부모의 교차축 크기에 의존하며, 소비자 레이아웃에서 stretch 가능해야 한다.
- 사용자 style로 길이나 정렬을 재정의할 수 있다.
- decorative/semantic 전환 시 불필요한 role 또는 ARIA 기본값이 남지 않는다.
- 명시된 `role`, `aria-hidden`, `aria-orientation`은 보존한다.
- SSR·hydration에서 orientation과 semantics가 동일하게 렌더되어야 한다.
## 구현 파일
- `packages/react/src/separator/Separator.tsx`
- `packages/react/src/separator/separator.css`
- `packages/react/src/separator/separator.test.tsx`
- `apps/storybook/src/Separator.stories.tsx`
- 통합: `packages/react/src/index.ts`, `packages/react/package.json`
- 필요 시 VR 기능 검증: `apps/visual-regression/tests/separator-functional.spec.ts`
## 테스트
- 기본 decorative 수평 렌더링
- decorative의 `aria-hidden`과 role 부재
- semantic opt-in의 role·`aria-orientation`
- 명시 ARIA 속성 보존
- 수평 100%×1px, 수직 1px×stretch 레이아웃
- className·style·ref·네이티브 속성 전달
- 라이트·다크 StateMatrix 및 barrel/subpath import
## 비목표
- 클릭·드래그 가능한 splitter
- 텍스트가 포함된 divider
- thickness·intent·tone variant
- 레이아웃 컨테이너 역할
- 로컬 VR 기준 이미지 갱신
