# Collapsible 기획
- 기준 스펙: `docs/specs/archive/2026-08-28-priority-components-batch.md`
- 상태: 구현 완료 — 2026-08-28
## 목표
단일 콘텐츠 영역을 공개하거나 접는 독립 compound primitive를 제공한다. controlled/uncontrolled 상태, 접근 가능한 Trigger/Content 연결, 닫힌 콘텐츠의 폼 상태 보존, 실제 콘텐츠 높이에 맞춘 전환을 지원한다.
## API
```ts
interface CollapsibleRootProps extends React.ComponentPropsWithoutRef<"div"> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
}
const Collapsible: {
  Root: React.ForwardRefExoticComponent<CollapsibleRootProps>;
  Trigger: React.ForwardRefExoticComponent<CollapsibleTriggerProps>;
  Content: React.ForwardRefExoticComponent<CollapsibleContentProps>;
};
```
- Trigger는 기본 `button`이고 `asChild`를 지원한다.
- Root와 Content는 네이티브 `div` 속성과 ref를 전달한다.
- controlled 여부는 `open` prop의 값이 아니라 prop 존재 여부로 판별한다.
- controlled 모드에서는 외부 `open` 값이 항상 진실이다.
## 상태
- `open`, `closed`
- `enabled`, `disabled`
- `uncontrolled`, `controlled`
- Root/Trigger/Content에 필요한 `data-state="open|closed"`를 노출한다.
- disabled에서는 사용자 입력으로 상태를 변경하지 않지만 외부 controlled 갱신은 반영한다.
## DOM/ARIA
- Trigger에 `aria-expanded`, `aria-controls`, `disabled`, `data-state`를 배선한다.
- Content에는 안정적인 id를 부여해 Trigger의 `aria-controls`와 연결한다.
- Content는 닫혀도 DOM에 유지한다.
- 닫힌 Content에는 `aria-hidden="true"`와 `inert`를 적용해 접근성과 포커스를 차단한다.
- Trigger 또는 Content를 생략해도 Root는 예외를 던지지 않는다.
- Trigger/Content를 Root 밖에서 사용하면 개발 오류를 명확히 던진다.
## 디자인 토큰
- 높이와 opacity 전환은 DDS duration/easing token을 사용한다.
- 실제 `scrollHeight`를 CSS 변수에 기록해 높이 전환에 사용한다.
- `prefers-reduced-motion: reduce`에서는 즉시 전환한다.
- CSS는 `@layer dds`, `.dds-collapsible-*`, 상태 data attribute 관습을 따른다.
- primitive 자체는 제품별 배경·border·타이포를 강제하지 않는다.
## 경계값
- controlled `open={false}`도 controlled로 판별하며 사용자 토글 뒤 외부 값이 바뀌기 전에는 닫힘을 유지한다.
- 외부 controlled reset은 사용자 입력·disabled 여부와 관계없이 그대로 반영한다.
- 닫았다 열어도 Content 내부 input 값과 DOM 상태가 유지된다.
- 콘텐츠 크기 변경을 관찰해 열린 상태의 높이 CSS 변수를 갱신한다.
- jsdom의 실제 레이아웃 부재를 보완하기 위해 동적 높이는 브라우저에서 검증한다.
- disabled `asChild` Trigger에서도 상태 변경과 포커스 가능 여부가 계약에 맞아야 한다.
## 구현 파일
- `packages/react/src/collapsible/Collapsible.tsx`
- `packages/react/src/collapsible/collapsible-context.ts`
- `packages/react/src/collapsible/collapsible.css`
- `packages/react/src/collapsible/collapsible.test.tsx`
- `apps/storybook/src/Collapsible.stories.tsx`
- `apps/visual-regression/tests/collapsible-functional.spec.ts`
- 통합: `packages/react/src/index.ts`, `packages/react/package.json`
## 테스트
- uncontrolled 초기값·토글과 controlled 값·콜백·외부 reset
- disabled 사용자 입력 차단과 controlled 갱신 반영
- Trigger/Content id, `aria-expanded`, `aria-controls`, `aria-hidden`, `inert`
- 닫힌 Content의 포커스 차단과 내부 input 값 보존
- Trigger `asChild`, 생략 가능한 하위 요소, Root 밖 사용 오류
- ResizeObserver 기반 동적 높이와 reduced motion
- 라이트·다크 StateMatrix, 브라우저 기능 테스트, barrel/subpath import
## 비목표
- 복수 disclosure 상태 관리
- 제품별 카드·목록 스타일
- Content unmount 옵션
- 중첩 애니메이션 조율
- 서버 데이터 로딩, 가상화, drag reorder
