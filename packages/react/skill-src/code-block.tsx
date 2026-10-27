/**
 * @title CodeBlock
 * @summary 가로 스크롤 가능한 코드 블록 영역과 상단 파일명 표시 및 클립보드 복사 기능을 제공하는 컴포넌트.
 *
 * ## 언제 쓰나
 *
 * - 기술 문서, 블로그 본문, 코드 예제 가이드에서 프로그래밍 코드를 안전하게 렌더링하고 가로 스크롤할 때.
 * - 코드 상단에 파일명(`filename`)을 표시하고 클립보드 복사 버튼(`CopyButton`)을 제공할 때.
 * - 단독 인라인 코드(`CopyButton`)를 탭 바나 튜토리얼 명령어 옆에 배치할 때.
 *
 * ## 쓰지 말 때
 *
 * - 단일 인라인 코드 조각 — 기본 `<code>` 태그 사용.
 * - 편집 가능한 코드 에디터 인터페이스 — Monaco Editor 또는 CodeMirror 사용.
 * - 텍스트 입력 양식 — `TextField` 또는 `TextArea` 사용.
 *
 * ## 핵심 API
 *
 * | 컴포넌트 | 주요 prop | 메모 |
 * | --- | --- | --- |
 * | `CodeBlock` | `children`, `filename`, `copyable`, `copyText`, `label`, `onCopy` | 가로 스크롤 코드 블록 컨테이너 |
 * | `CopyButton` | `text`, `onCopy`, `children`, `disabled` | 실시간 role="status" 피드백 연결 복사 버튼 |
 *
 * ### 필수 규칙 및 동작
 * - **구문 하이라이트 번들 0:** shiki나 Prism 등의 구문 분석기는 내장하지 않으며, 사전 하이라이트된 HTML 또는 `<pre><code>` 노드를 `children`으로 전달받습니다.
 * - **복사 텍스트(`copyText`):** `copyText`가 명시되면 우선 복사되며, 생략 시 단일 문자열 `children`에서 자동 추출됩니다. 복잡한 VNode일 때는 `copyText`를 명시해야 합니다. 생략하면 클립보드를 변경하지 않고 복사 실패를 알립니다.
 * - **상단 헤더:** `filename` 또는 `copyable` 중 하나라도 활성화되면 상단 헤더 바가 렌더링됩니다. 둘 다 없으면 헤더 없이 코드 영역만 렌더링됩니다.
 *
 * ## 접근성
 *
 * - 코드 스크롤 영역은 키보드 사용자 탐색을 위해 `role="region"`, `tabIndex={0}`, 명확한 `aria-label`을 가집니다.
 * - 복사 성공 시 `"코드를 복사했습니다."`, 실패 시 `"복사하지 못했습니다. 코드를 선택해 직접 복사하십시오."` 합쇼체 표준 안내를 `role="status"` 라이브 영역으로 전달합니다.
 * - 전역 접근성 규칙에 따라 `role="status"`에 불필요한 `aria-live` 속성을 중복 부여하지 않습니다.
 */
import { CodeBlock, CopyButton } from "@dg-design/react/code-block";

const sampleCode = `import { Button } from "@dg-design/react/button";

export function Example() {
  return <Button variant="solid">실행</Button>;
}`;

/** 예제 1: 파일명이 있는 기본 코드 블록 */
export function BasicCodeBlock() {
  return (
    <CodeBlock filename="example.tsx" copyText={sampleCode}>
      <pre>
        <code>{sampleCode}</code>
      </pre>
    </CodeBlock>
  );
}

/** 예제 2: 평문 문자열 코드 블록 (copyText 자동 추출) */
export function PlainCodeBlock() {
  return (
    <CodeBlock filename="install.sh">
      pnpm add @dg-design/react @dg-design/tokens
    </CodeBlock>
  );
}

/**
 * 예제 3: 외부 구문 하이라이터(shiki, Prism 등) 연동 코드 블록
 *
 * [shiki 연동 가이드]
 * 1. 서버 또는 빌드 타임에 shiki.codeToHtml(code, { lang: 'tsx', ... })로 HTML 문자열을 생성합니다.
 * 2. 생성된 HTML을 위험한 스크립트 주입 없이 안전하게 정적 마크업 노드로 감싸 children으로 전달합니다.
 * 3. 복사 기능이 온전하게 동작하도록 원본 텍스트를 copyText prop에 전달합니다.
 */
export function SyntaxHighlightedCodeBlock() {
  // 실제 앱에서는 shiki.codeToHtml() 등으로 생성된 결과물을 사용합니다.
  return (
    <CodeBlock
      filename="highlighted-sample.tsx"
      copyText={sampleCode}
      label="사전 하이라이트된 버튼 예제 코드"
    >
      <pre
        className="shiki github-dark"
        style={{ margin: 0, padding: "var(--dds-dimension-x4)" }}
      >
        <code>
          <span style={{ color: "var(--dds-color-fg-brand)" }}>import</span>
          {" { Button } "}
          <span style={{ color: "var(--dds-color-fg-brand)" }}>from</span>
          {' "@dg-design/react/button";\n\n'}
          <span style={{ color: "var(--dds-color-fg-brand)" }}>export</span>
          {" function Example() {\n  return <Button>실행</Button>;\n}"}
        </code>
      </pre>
    </CodeBlock>
  );
}

/** 예제 4: 단독 CopyButton 인라인 소비 */
export function StandaloneCopyButton() {
  const installCommand = "pnpm add @dg-design/react";

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "var(--dds-dimension-x3)",
        padding: "var(--dds-dimension-x2) var(--dds-dimension-x3)",
        borderRadius: "var(--dds-radius-r2)",
        backgroundColor: "var(--dds-color-bg-neutral-weak)",
        border: "1px solid var(--dds-color-stroke-neutral-weak)",
      }}
    >
      <code style={{ fontFamily: "ui-monospace, monospace" }}>
        {installCommand}
      </code>
      <CopyButton text={installCommand} />
    </div>
  );
}
