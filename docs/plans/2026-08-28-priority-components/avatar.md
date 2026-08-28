# Avatar 기획
- 기준 스펙: `docs/specs/archive/2026-08-28-priority-components-batch.md`
- 상태: 구현 완료 — 2026-08-28
## 목표
사용자 이미지를 원형으로 표시하고, 이미지 로딩 상태에 따라 소비자 제공 fallback을 전환하며, 모든 크기에서 소비자 제공 badge를 우하단에 합성하는 compound 컴포넌트를 제공한다.
## API
```ts
type AvatarSize = "small" | "medium" | "large" | "xlarge";
type AvatarLoadingState = "loading" | "loaded" | "error";
const Avatar: {
  Root: React.ForwardRefExoticComponent<AvatarRootProps>;
  Image: React.ForwardRefExoticComponent<AvatarImageProps>;
  Fallback: React.ForwardRefExoticComponent<AvatarFallbackProps>;
  Badge: React.ForwardRefExoticComponent<AvatarBadgeProps>;
};
```
- `Root`: 네이티브 `div` 속성, `size?`; 기본 `"medium"`
- 크기: `small` 24px, `medium` 36px, `large` 48px, `xlarge` 64px
- `Image`: 네이티브 `img` 속성과 ref를 전달한다.
- `Fallback`, `Badge`: 네이티브 `div` 속성과 소비자 children을 지원한다.
- 이미지 `alt`, fallback 내용, badge 내용과 색상은 소비자가 제공한다.
## 상태
- 최초: `loading`
- 이미지 로드 성공: `loaded`
- 이미지 로드 실패: `error`
- `Root`, `Image`, `Fallback`에 `data-loading-state`를 노출한다.
- `loading`/`error`에서는 Fallback, `loaded`에서는 Image를 표시한다.
- hydration 뒤 `img.complete`, `naturalWidth`, `naturalHeight`로 캐시 완료 이미지를 판정한다.
## DOM/ARIA
- `Root`가 Image/Fallback/Badge 컨텍스트와 배치를 제공한다.
- `Image`는 네이티브 `img` 계약을 유지한다. 장식 이미지는 `alt=""`, 의미 이미지는 적절한 `alt`를 소비자가 전달한다.
- Image와 Fallback은 원형 영역에서 겹쳐 상태에 따라 가시성을 전환한다.
- Badge는 Root 우하단에 배치하며 24px Root에서도 숨기지 않는다.
- 사용자 `onLoad`, `onError`, ref를 내부 상태 처리와 합성해 모두 보존한다.
## 디자인 토큰
- Root stroke, Fallback 배경·텍스트는 기존 neutral semantic color token만 사용한다.
- Image는 `object-fit: cover`를 사용한다.
- 크기 24/36/48/64px는 공개 size 계약이다.
- CSS는 `@layer dds`, `.dds-avatar-*`, `.dds-avatar--size_*` 관습을 따른다.
- Badge의 내용과 색상은 컴포넌트가 강제하지 않는다.
## 경계값
- SSR 결과는 결정적인 `loading` 상태로 렌더해 hydration mismatch를 만들지 않는다.
- hydration 직후 캐시 이미지 판정 전 Fallback이 잠깐 보일 수 있으며 QA에 기록한다.
- `complete === true`여도 natural size가 0이면 `error`로 본다.
- src 변경 시 새 이미지의 상태를 다시 `loading`부터 판정한다.
- 사용자 이벤트 핸들러와 ref는 성공·실패 양쪽에서 호출/갱신된다.
- Image/Fallback/Badge의 선택적 구성에서도 Root는 예외를 던지지 않는다.
## 구현 파일
- `packages/react/src/avatar/Avatar.tsx`
- `packages/react/src/avatar/avatar-context.ts`
- `packages/react/src/avatar/avatar.css`
- `packages/react/src/avatar/avatar.test.tsx`
- `apps/storybook/src/Avatar.stories.tsx`
- 통합: `packages/react/src/index.ts`, `packages/react/package.json`
- 필요 시 브라우저 검증: `apps/visual-regression/tests/avatar-functional.spec.ts`
## 테스트
- loading → loaded, loading → error 전환과 표시 요소
- hydration 뒤 캐시 성공/실패 판정
- 4개 크기와 24px 포함 Badge 우하단 배치
- 사용자 `onLoad`/`onError`, 네이티브 img 속성, ref 보존
- `data-loading-state` 동기화와 src 변경
- 빈 alt/의미 있는 alt의 네이티브 접근성 계약
- 라이트·다크 StateMatrix 및 barrel/subpath import
## 비목표
- `Avatar.Stack`
- Badge 아이콘·상태·색상 API
- 이미지 업로드·편집·서버 로딩
- 새 아이콘 또는 palette 의존성
- hydration 직후의 짧은 시각 전환 제거를 위한 서버 추측
