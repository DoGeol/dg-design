# TableOfContents 스펙 — 문서 내부 탐색

## 메타

- 생성: 2026-10-27
- 유형: 브라운필드 · leaf + 선택형 관찰 훅, 새 공개 하위 경로
- 상태: **승인 (2026-10-27)** — 열린 질문은 기본안으로 결정
- 대상: `@dg-design/react/table-of-contents`; 새 의존성 없음.
- 근거: [구성 규칙](../decisions/2026-09-05-component-composition-rules.md), [flex 방향](../decisions/2026-10-09-flex-adoption-direction.md), [P4](2026-10-09-p4-new-kinds.md).
- 외부 근거: dg-studio `design-a/docs/reports/2026-10-27-design-audit.md` §3, 같은 워크트리 `docs/plans/2026-10-27-design-audit-updates.md` §1·§5.
- 아래 경로는 직접 읽은 `/Users/pdg/WebstormProjects/dg-studio/src/` 기준이다.

## 목표

블로그와 문서가 공유할 앵커 목록·현재 위치·접기·조작 영역을 제공한다.
링크 대상 id와 제목은 소비자가 만들고, sticky·반응형 배치·스크롤 여백도 소비자가 정한다.
스크롤 관찰을 쓰지 않는 정적 목차에도 불필요한 DOM 관찰을 시작하지 않는다.

## 구성요소와 소비처

| 구성요소 | 형태·독립 기능 | 코드로 확인한 소비처 / 처리 |
| --- | --- | --- |
| TableOfContents | leaf · 공개 블로그 본문 탐색 | `features/public-blog/public-blog.tsx:277`의 PublicBlogTableOfContents, 글 상세 모바일 details |
| TableOfContents | leaf · DDS 문서 본문 탐색 | `features/dg-design-docs/ui/docs-toc.tsx:17`의 DocsToc, desktop nav·mobile details |
| 접기 | 비공개 Collapsible 조합 | 두 기능의 details/summary를 같은 접근성·크기로 통일 |
| useTableOfContentsActiveId | 선택형 훅 · 현재 읽는 제목 | DocsToc은 IntersectionObserver를 쓰지만 블로그 목차에는 active 상태가 없음 |
| Chevron | Icon 장식 | B1a의 ChevronDownIcon, 버튼 이름과 중복 낭독하지 않음 |

블로그 모바일/desktop과 DocsToc 모바일/desktop을 각각 별 소비처로 세지 않는다.
블로그·문서라는 두 독립 기능으로 구성 규칙의 근거를 충족한다.
목록 구조는 일정하고 항목 배열·라벨만 다르므로 공개 compound는 만들지 않는다.

## API

```tsx
import { TableOfContents } from "@dg-design/react/table-of-contents";

const items = [
  { id: "overview", label: "개요", depth: 1 },
  { id: "usage", label: "사용 방법", depth: 1 },
  { id: "keyboard", label: "키보드", depth: 2 },
];

export function Outline() {
  return <TableOfContents items={items} label="이 페이지의 목차" variant="collapsible" />;
}
```

```tsx
import { TableOfContents, useTableOfContentsActiveId } from "@dg-design/react/table-of-contents";

export function ObservedOutline() {
  const activeId = useTableOfContentsActiveId({ ids: items.map((item) => item.id), offset: 80 });
  return <TableOfContents items={items} activeId={activeId} label="이 페이지의 목차" />;
}
```

| prop | 기본안 |
| --- | --- |
| `items` | readonly `{ id: string; label: string; depth: 1 \| 2 \| 3 \| 4 \| 5 \| 6 }[]` |
| `label` | 비어 있지 않은 string 필수; nav 이름과 보이는 제목/접기 버튼 문구 |
| `activeId` | `string \| null`, 기본 null; 유효 항목 하나에만 aria-current 부여 |
| `variant` | inline(기본) · collapsible; viewport와 독립 |
| collapsible 상태 | `open?`, `defaultOpen?`(false), `onOpenChange?` |
| HTML 표면 | nav ref·className·style·일반 HTML 속성; label이 접근 이름 소유 |

- inline에서 open 관련 props는 받지 않는 판별 유니언으로 만든다.
- id는 `#` 없는 문서 내 요소 id이다. 링크는 `#${encodeURIComponent(id)}`로 만든다.
- 항목 label은 텍스트만 허용해 링크 안 버튼/링크 중첩을 막는다.
- 유효 항목이 0개면 null, 빈 nav·접기 버튼을 만들지 않는다.
- 빈 id/label은 제외하고 개발 경고, 중복 id는 첫 항목만 유지하고 개발 경고한다.
- depth는 문서 내 상대 계층이다. h2/h3 소스는 소비자가 1/2로 변환한다.
- 첫 항목 depth가 1이 아니면 1로 정규화한다. 앞 항목보다 2단계 이상 깊으면 1단계만 내려간다.
- 정규화한 계층을 중첩 ol/li로 렌더한다. 임의의 빈 부모 링크는 만들지 않는다.
- 알 수 없는 activeId는 아무 링크도 current로 만들지 않는다.
- 링크 활성화 시 open을 자동으로 닫지 않는 기본안이다. 읽던 위치와 초점을 유지한다.

## 선택형 스크롤 관찰 계약

- 훅을 별도 파일에서 named export한다. TableOfContents 자체는 훅을 호출하지 않는다.
- 입력: `ids: readonly string[]`, `root?: HTMLElement | null`, `offset?: number`(기본 0px).
- root 생략/null은 viewport, Element이면 해당 스크롤 컨테이너를 기준으로 잰다.
- 반환: `string | null`; SSR/첫 렌더는 null, effect에서 첫 계산한다.
- 문서 순서의 대상 중 top이 기준선(root 상단 + offset)을 지난 마지막 제목을 고른다.
- 지난 제목이 없으면 첫 유효 제목, 유효 대상이 없으면 null이다.
- 존재하지 않는 id는 무시한다. ids 변경 시 다시 찾고 활성 후보를 재계산한다.
- 기본 구현안은 scroll을 passive로 듣고 requestAnimationFrame당 한 번만 좌표를 읽는다.
- window resize·root 크기 변경에도 재계산하며 cleanup에서 listener·frame·observer를 해제한다.
- IntersectionObserver entry의 전달 순서를 활성 우선순위로 쓰지 않는다.
- 동적 제목 추가/변경은 ids 갱신이 신호다. 본문 DOM 전체 MutationObserver는 넣지 않는다.
- 앱의 라우터/별도 관찰기가 더 적절하면 activeId만 전달한다. 두 관찰기를 중복 실행하지 않는다.
- 이 선택 알고리즘은 **신규 제안**이다. 현재 DocsToc의 rootMargin/threshold 동작과 같다고 주장하지 않는다.

## 상태 축·접근성 계약

| 상태 | 계약 |
| --- | --- |
| default | nav 안 제목·목록·일반 anchor; URL fragment 기본 탐색 |
| hover | 링크에 bg-transparent-hover, fg-neutral |
| pressed | bg-transparent-pressed; 링크 의미 유지 |
| focus-visible | 링크/접기 버튼에 비입력 2px stroke-focus-ring |
| active | 링크 aria-current="location" + 왼쪽 표시선 + 굵기, 색만으로 구분하지 않음 |
| collapsed | 버튼 aria-expanded=false, aria-controls로 내용 연결, 링크 탐색 제외 |
| expanded | 목록 노출, 버튼 aria-expanded=true; 활성 위치 변경으로 열림을 바꾸지 않음 |
| disabled·selected | 제공하지 않음; 탐색 링크는 disabled 버튼/선택 옵션이 아님 |

- nav에 label을 붙이고 보이는 제목은 기본 p로 둔다. 문서 heading 레벨을 임의로 추가하지 않는다.
- `Collapsible.Root/Trigger/Content`로 접기를 조립하되 하나의 nav만 만든다.
- 열린 내용은 기본 링크 Tab 순서, Enter는 이동, 접기 버튼 Space/Enter는 열림 토글이다.
- 펼칠 때 첫 링크로 강제 초점 이동하지 않는다.
- 프로그램으로 접힐 때 초점이 내용 안에 있으면 트리거로 복귀한 다음 숨긴다.
- 숨김은 기존 Collapsible의 inert/aria-hidden 계약을 따른다.
- 별도 display 규칙과 hidden을 함께 쓰게 되면 바로 옆 `[hidden] { display:none }`을 둔다.
- active 변경으로 live region·자동 초점·history 변경을 만들지 않는다.
- 네이티브 fragment 탐색을 가로채지 않는다. 제목 focus 관리가 필요하면 소비자 정책으로 추가한다.
- heading의 scroll-margin과 sticky header 오프셋은 소비자가 맞춘다.

## 토큰·모바일 밀도

| 역할 | 기본안 |
| --- | --- |
| 링크 글자 | `--dds-font-size-body`, `--dds-line-height-body` |
| 링크 최소 높이 | 기존 `--dds-size-option-height` 36/48 |
| 접기 버튼 최소 높이 | `max(--dds-size-tab-height, --dds-size-touch-target)` |
| 계층 들여쓰기·안쪽 여백 | `--dds-dimension-x3` / `x2` |
| 현재 표시선 | dimension-x0_5 두께, fg-brand 색 |
| 표면·경계 | bg-layer-default, stroke-neutral-weak, radius-option |

- 신규 토큰 없음. `@layer dds`·semantic 색으로 라이트/다크를 지원한다.
- 모바일 밀도에서 링크는 48, 접기 버튼은 최소 44; 인접 대상과 겹치지 않는다.
- 375px과 긴 한글/영문은 줄바꿈하고 `min-width:0`으로 페이지 넘침을 막는다.
- 깊이가 커지면 들여쓰기 누적을 3단계까지만 시각적으로 적용한다. DOM 계층은 유지한다.
- variant는 화면 크기 이름이 아니다. inline을 모바일에, collapsible을 데스크톱에 써도 동작한다.
- dg-studio의 화면별 44px 확장은 C3에서 이어받는다. 밀도 속성 도입은 하지 않는다.
- sticky top·최대 높이·외부 세로 스크롤·본문 열 배치는 소비자 CSS가 소유한다.

## 테스트·합격 조건

- [ ] user-event로 링크 순서·Enter 탐색 의도·접기 Space/Enter·초점 복귀를 확인한다.
- [ ] activeId에 해당하는 anchor 하나만 aria-current=location이고 변경 시 초점은 유지된다.
- [ ] 빈 배열·중복 id·빈 label·depth 건너뜀·알 수 없는 activeId를 검증한다.
- [ ] 제어형/비제어형 open, 접힌 내용의 Tab 제외와 중첩 목록을 검증한다.
- [ ] 훅의 좌표 판정은 fixture로, listener 정리·ids 갱신·root 변경은 단위 테스트로 검증한다.
- [ ] Playwright에서 실제 fragment 이동·뒤로 가기·offset·컨테이너 스크롤을 검증한다.
- [ ] `TableOfContents--state-matrix`: inline/접힘/펼침, active 없음/있음, 깊은 계층·긴 제목.
- [ ] 라이트·다크·모바일, focus-visible·hover를 상태 매트릭스에 포함한다.
- [ ] 기능 데모는 접힌 상태에서 시작하고 44px hit 영역·375px 넘침을 확인한다.
- [ ] 새 VR png·색 txt는 CI visual-baseline만 사용한다. 실기기 낭독 검증은 별도로 기록한다.

## skill-src·배포

- `packages/react/skill-src/table-of-contents.tsx`: 정적 앵커, 접기, 관찰 훅 사용의 세 예제.
- 예제 본문에 실제 id를 두고 sticky 없이도 동작하게 한다.
- SSR에서 DOM에 접근하지 않는 훅과 label 필수 규칙을 가이드에 적는다.
- 하위 경로 import, build:skill 생성물, check:skill·타입·스모크를 함께 제공한다.
- changeset: `"@dg-design/react": minor`; tokens 변경 없음.
- B1a 뒤 구현하며 barrel 등록은 코디네이터가 담당한다.
- 구현 게이트: generate → build → check:subpaths·check:skill → test → typecheck → publint → CI VR.
- 이 초안은 코드·서버·테스트 실행 없이 문서만 작성한다.

## 하지 않을 것

- markdown/블로그 block에서 제목 추출, slug 생성, 중복 heading id 수정.
- 라우팅·sticky·화면 breakpoint·본문 너비·scroll-margin·검색·가상화.
- 트리뷰 키보드 모델, 항목 disabled, 강제 smooth scroll·자동 접힘·초점 강탈.
- 블로그와 문서가 같은 관찰 정책을 써야 한다는 강제, dg-studio 코드 전환.

## 열린 질문

| 사용자 결정이 필요한 항목 | 기본안·영향 |
| --- | --- |
| 관찰 훅의 첫 버전 범위 | 선택형 훅을 함께 제공. root/offset 지원으로 약간의 구현·브라우저 검증 추가 |
| 링크 선택 뒤 접힘 | 열린 상태 유지. 자동 닫기를 원하면 focus 정책과 함께 별도 승인 |
| depth 범위 | 상대 1~6, 중첩 ol. 기존 h2/h3 데이터는 1/2 변환 필요 |
| 활성 판정 | 기준선을 지난 마지막 제목. 기존 DocsToc 관찰 결과와 달라질 수 있음 |

inline·collapsible, aria-current=location, 모바일 44, sticky 소비자 소유는 요청 범위를 유지한다.
