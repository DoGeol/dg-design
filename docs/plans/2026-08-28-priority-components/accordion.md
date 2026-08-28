# Accordion 기획
- 기준 스펙: `docs/specs/archive/2026-08-28-priority-components-batch.md`
- 상태: 구현 완료 — 2026-08-28
## 목표
복수 disclosure를 하나의 집합으로 관리하는 접근 가능한 compound 컴포넌트를 제공한다. 배열 기반 single/multiple 상태, controlled/uncontrolled 계약, 키보드 순환, Collapsible 기반 콘텐츠 보존, inline/separated 스타일을 지원한다.
## API
```ts
interface AccordionRootProps extends React.ComponentPropsWithoutRef<"div"> {
  values?: string[];
  defaultValues?: string[];
  onValuesChange?: (values: string[]) => void;
  multiple?: boolean;
  disabled?: boolean;
  variant?: "inline" | "separated";
  size?: "medium" | "large";
}
const Accordion: {
  Root: React.ForwardRefExoticComponent<AccordionRootProps>;
  Item: React.ForwardRefExoticComponent<AccordionItemProps>; // value 필수, disabled 선택
  Header: React.ForwardRefExoticComponent<AccordionHeaderProps>;
  Trigger: React.ForwardRefExoticComponent<AccordionTriggerProps>;
  Content: React.ForwardRefExoticComponent<AccordionContentProps>;
  Body: React.ForwardRefExoticComponent<AccordionBodyProps>;
  Title: React.ForwardRefExoticComponent<AccordionTitleProps>;
  Description: React.ForwardRefExoticComponent<AccordionDescriptionProps>;
  Prefix: React.ForwardRefExoticComponent<AccordionPrefixProps>;
  SuffixIcon: React.ForwardRefExoticComponent<AccordionSuffixIconProps>;
};
```
- 기본 모드는 single, `variant="inline"`, `size="medium"`이며 열린 Item을 다시 누르면 `[]`로 닫을 수 있다.
- controlled 여부는 `values` prop 존재 여부로 판별하며 외부 배열이 항상 진실이다.
- Header는 기본 `h3`이고 `asChild`를 지원한다. Trigger는 기본 `button`이다.
## 상태
- 축: single/multiple, controlled/uncontrolled, open/closed/disabled, inline/separated × medium/large
- single 모드의 다중 controlled 값은 첫 값만 유효하게 표시한다.
- 콜백에는 모드에 맞게 정규화한 다음 배열을 전달한다.
- 중복 Item value는 개발 모드에서 경고한다.
## DOM/ARIA
- Item의 Trigger와 Content에 안정적인 고유 id를 만들고 `aria-controls`/`aria-labelledby`로 연결한다.
- Trigger는 `aria-expanded`, disabled 상태, `data-state`를 갖는다.
- Content는 `Collapsible.Content`를 재사용하고 `role="region"`을 갖는다.
- 닫힌 Content는 DOM에 남지만 `aria-hidden`과 `inert`로 접근성 트리·포커스에서 제외한다.
- ArrowDown/ArrowUp/Home/End는 활성 Trigger 사이를 순환하고 disabled Item을 건너뛴다.
- Enter/Space 토글은 네이티브 button 동작을 사용한다.
## 디자인 토큰
- inline은 Item 사이 neutral separator, separated는 Item별 neutral border·radius와 Root gap을 사용한다.
- Title은 neutral 본문색, Description은 AA를 통과하는 `fg-neutral-weak`, disabled는 `fg-disabled`를 사용한다.
- SuffixIcon은 소비자 아이콘을 감싸며 open에서 180도 회전한다.
- 모션은 DDS duration/easing token을 사용하고 reduced motion에서 즉시 전환한다.
- CSS는 `@layer dds`, `.dds-accordion-*`, variant/size modifier 관습을 따른다.
## 경계값
- single controlled 배열에 값이 여러 개면 첫 값만 open으로 표시하고 다음 콜백도 single 배열로 정규화한다.
- 존재하지 않는 value, 빈 배열, 모든 Item disabled 상태에서도 예외 없이 동작하며 중복 value 경고는 개발 모드에 한정한다.
- Root disabled와 Item disabled 모두 사용자 토글·키보드 탐색을 막되 외부 controlled 값은 반영한다.
- 동적 Item 추가·제거 시 roving 대상과 id 연결을 갱신한다.
- 중첩 Accordion은 지원 계약에 포함하지 않는다.
## 구현 파일
- `packages/react/src/accordion/Accordion.tsx`
- `packages/react/src/accordion/accordion-context.ts`
- `packages/react/src/accordion/accordion.css`
- `packages/react/src/accordion/accordion.test.tsx`
- 재사용: `packages/react/src/collapsible/`, `packages/react/src/internal/roving-focus.ts`
- `apps/storybook/src/Accordion.stories.tsx`
- `apps/visual-regression/tests/accordion-functional.spec.ts`
- 통합: `packages/react/src/index.ts`, `packages/react/package.json`
## 테스트
- single/multiple, controlled/uncontrolled, 재클릭 닫기, 외부 reset
- single 다중 값 정규화와 콜백 배열
- Root/Item disabled, 중복 value 경고, 동적 Item 경계
- ArrowUp/Down/Home/End 순환과 disabled 건너뛰기
- Enter/Space 네이티브 토글
- Item별 Trigger/Content ARIA와 닫힌 콘텐츠 접근성 제외
- inline/separated × medium/large × open/closed/disabled StateMatrix
- 라이트·다크, 브라우저 기능 테스트, barrel/subpath import
## 비목표
- 중첩 Accordion
- 가상화, drag reorder, 서버 데이터 로딩
- 아이콘 패키지 또는 기본 아이콘 제공
- headless 패키지 분리
- recipe 코드 생성과 로컬 VR 기준 이미지 갱신
