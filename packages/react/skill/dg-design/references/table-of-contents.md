<!-- 생성 파일 — packages/react/skill-src/table-of-contents.tsx에서 만든다. 직접 고치지 않는다. -->

# TableOfContents

문서나 블로그 본문의 앵커 목록을 보여주고 현재 읽는 위치를 안내하는 목차 컴포넌트.

## 언제 쓰나

- 긴 기술 문서, 가이드, 블로그 글에서 본문 섹션 목록을 표시하고 특정 위치로 빠르게 이동시킬 때.
- 사용자가 스크롤하며 읽고 있는 현재 제목을 시각적으로 강조할 때(`useTableOfContentsActiveId` 훅과 연동).
- 모바일 등 좁은 뷰포트에서 목차를 접어두고 필요할 때 펼치게 할 때(`variant="collapsible"`).

## 쓰지 말 때

- 계층적 상위/하위 페이지 경로 표시 — `Breadcrumb`.
- 동등한 뷰를 전환하는 탭 — `Tabs`.
- 일반 목록 표시 — `List`.

## 핵심 API

| 컴포넌트 / 훅 | 주요 prop / 옵션 | 메모 |
| --- | --- | --- |
| `TableOfContents` | `items`, `label`, `activeId`, `variant` | inline(기본) 또는 collapsible |
| `useTableOfContentsActiveId` | `{ ids, root, offset }` | 기준선을 지난 마지막 제목의 id를 반환 |

### 필수 규칙 및 동작
- `label`: 비어 있지 않은 `string`이 필수입니다. `nav`의 `aria-label`과 헤더/접기 버튼의 표시 텍스트로 사용됩니다.
- `useTableOfContentsActiveId`: SSR 및 첫 렌더에서는 DOM에 접근하지 않고 `null`을 반환하며, 클라이언트 마운트 후 좌표를 측정합니다.
- `items`: `{ id, label, depth }` 배열을 전달합니다. depth(1~6)는 상대 계층이며 건너뜀이 있더라도 중첩 `ol/li`로 안전하게 정규화됩니다.
- `activeId`: 현재 읽고 있는 항목에 `aria-current="location"` 및 왼쪽 표시선과 굵기가 적용됩니다.

## 접근성

- `nav` 랜드마크에 `aria-label`을 전달해 스크린 리더에서 독립된 탐색 영역으로 식별됩니다.
- 제목은 문서 헤딩 계층을 교란하지 않도록 기본 문단(`<p>`)으로 렌더링됩니다.
- 접기 버튼(`variant="collapsible"`)은 `aria-expanded` 및 `aria-controls`를 통해 내용 영역과 연결되며, 닫힌 내용은 `inert`로 처리되어 키보드 초점에서 제외됩니다.

## 예제

```tsx
import {
  TableOfContents,
  type TableOfContentsItem,
  useTableOfContentsActiveId,
} from "@dg-design/react/table-of-contents";

const docItems: readonly TableOfContentsItem[] = [
  { id: "overview", label: "개요", depth: 1 },
  { id: "installation", label: "설치 및 설정", depth: 1 },
  { id: "npm-install", label: "패키지 매니저", depth: 2 },
  { id: "usage", label: "기본 사용법", depth: 1 },
];

/** 예제 1: 정적 앵커 목차 */
export function StaticOutline() {
  return (
    <div>
      <TableOfContents items={docItems} label="문서 목차" />

      <div style={{ marginTop: "var(--dds-dimension-x6)" }}>
        <section id="overview">
          <h3>개요</h3>
          <p>DDS TableOfContents 컴포넌트의 기본 안내입니다.</p>
        </section>
        <section id="installation">
          <h3>설치 및 설정</h3>
          <p>패키지를 설치하고 스타일을 임포트합니다.</p>
        </section>
        <section id="npm-install">
          <h4>패키지 매니저</h4>
          <p>pnpm 또는 npm을 통해 설치할 수 있습니다.</p>
        </section>
        <section id="usage">
          <h3>기본 사용법</h3>
          <p>원하는 항목 배열과 레이블을 넘겨 사용합니다.</p>
        </section>
      </div>
    </div>
  );
}

/** 예제 2: 접기/펼치기(collapsible) 목차 */
export function CollapsibleOutline() {
  return (
    <div>
      <TableOfContents
        variant="collapsible"
        items={docItems}
        label="이 페이지의 목차"
      />

      <div style={{ marginTop: "var(--dds-dimension-x6)" }}>
        <section id="overview">
          <h3>개요</h3>
          <p>접이식 목차는 좁은 화면이나 모바일에서 유용합니다.</p>
        </section>
      </div>
    </div>
  );
}

/** 예제 3: 스크롤 관찰 훅을 연동한 실시간 활성 목차 */
export function ObservedOutline() {
  const activeId = useTableOfContentsActiveId({
    ids: docItems.map((item) => item.id),
    offset: 80,
  });

  return (
    <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: "var(--dds-dimension-x6)" }}>
      <aside>
        <TableOfContents
          items={docItems}
          activeId={activeId}
          label="본문 목차"
        />
      </aside>

      <main>
        <section id="overview" style={{ minHeight: "400px" }}>
          <h3>개요</h3>
          <p>스크롤을 내리면 상단 오프셋을 통과한 제목이 목차에서 활성화됩니다.</p>
        </section>
        <section id="installation" style={{ minHeight: "400px" }}>
          <h3>설치 및 설정</h3>
          <p>해당 섹션이 기준선을 지나면 활성 상태가 갱신됩니다.</p>
        </section>
        <section id="npm-install" style={{ minHeight: "400px" }}>
          <h4>패키지 매니저</h4>
          <p>중첩 항목도 동일하게 관찰됩니다.</p>
        </section>
        <section id="usage" style={{ minHeight: "400px" }}>
          <h3>기본 사용법</h3>
          <p>마지막 섹션입니다.</p>
        </section>
      </main>
    </div>
  );
}
```
