# Skeleton 기획
- 기준 스펙: `docs/specs/archive/2026-08-28-priority-components-batch.md`
- 상태: 구현 완료 — 2026-08-28
## 목표
콘텐츠가 로딩 중임을 나타내는 중립 색상의 장식용 자리표시자를 제공한다. 크기는 소비자가 정하고, radius 4종·shimmer·reduced motion을 DDS 토큰과 CSS 관습으로 지원한다.
## API
```ts
type SkeletonRadius = "none" | "small" | "medium" | "full";
interface SkeletonProps extends React.ComponentPropsWithoutRef<"div"> {
  radius?: SkeletonRadius;
}
```
- 공개 API: `Skeleton`, `SkeletonProps`
- `radius` 기본값: `"medium"`
- 네이티브 `div` 속성, `className`, `style`, `ref`를 전달한다.
- 너비와 높이 전용 prop은 두지 않는다. 소비자가 `style` 또는 `className`으로 지정한다.
## 상태
- radius: `none`, `small`, `medium`, `full`
- motion: 기본 shimmer 무한 반복, reduced motion에서 정지
- 별도 loading/complete 상태나 tone variant는 두지 않는다.
## DOM/ARIA
- 루트는 단일 `div`다.
- 기본 `aria-hidden="true"`로 접근성 트리에서 제외한다.
- 소비자가 `aria-hidden`을 명시하면 해당 값을 보존한다.
- 의미 있는 로딩 상태 알림은 Skeleton 자체가 담당하지 않는다.
## 디자인 토큰
- 배경과 shimmer 명암은 기존 neutral semantic color token만 사용한다.
- radius는 DDS radius token에 대응한다. `none`과 `full`도 공개 radius 축으로 일관되게 표현한다.
- shimmer 시간과 easing은 DDS duration/easing token을 사용한다.
- CSS는 `@layer dds`, `.dds-skeleton`, `.dds-skeleton--radius_*` 관습을 따른다.
- palette token 공개, `magic` intent, 하드코딩 색상은 추가하지 않는다.
## 경계값
- width/height가 0이거나 한 축만 지정되어도 예외를 던지지 않는다.
- 임의의 CSS 단위와 비정형 크기를 허용한다.
- 사용자 `className`, `style`, ARIA 속성과 내부 기본값을 병합하되 명시 prop을 덮어쓰지 않는다.
- SSR·hydration에서 DOM 구조와 기본 속성이 일치해야 한다.
- `prefers-reduced-motion: reduce`에서는 shimmer 애니메이션을 제거한다.
## 구현 파일
- `packages/react/src/skeleton/Skeleton.tsx`
- `packages/react/src/skeleton/skeleton.css`
- `packages/react/src/skeleton/skeleton.test.tsx`
- `apps/storybook/src/Skeleton.stories.tsx`
- 통합: `packages/react/src/index.ts`, `packages/react/package.json`
- 필요 시 VR 기능 검증: `apps/visual-regression/tests/skeleton-functional.spec.ts`
## 테스트
- 기본 radius와 4개 radius variant 렌더링
- 임의 width/height 및 네이티브 속성·className·style·ref 전달
- 기본 `aria-hidden="true"`와 명시값 보존
- reduced-motion CSS에서 애니메이션 제거
- 라이트·다크 StateMatrix의 radius와 다양한 크기
- barrel/subpath import, CSS raw copy, 트리셰이킹 계약
## 비목표
- `magic` 또는 기타 tone variant
- responsive 전용 size prop
- 로딩 상태 관리나 live region 제공
- 아이콘·이미지 형태의 콘텐츠 생성
- 로컬 VR 기준 이미지 갱신
