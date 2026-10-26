# CodeBlock 스펙 — 코드 블록 스크롤 영역과 복사

## 메타

- 생성: 2026-10-27
- 유형: 브라운필드 · leaf 컴포넌트와 보조 복사 버튼, 새 공개 하위 경로
- 상태: **승인 (2026-10-27)** — 열린 질문은 기본안으로 결정
- 대상: `@dg-design/react/code-block`; 새 의존성 없음.
- 근거: [구성 규칙](../decisions/2026-09-05-component-composition-rules.md), [flex 방향](../decisions/2026-10-09-flex-adoption-direction.md), [P4](2026-10-09-p4-new-kinds.md).
- 외부 근거: dg-studio `design-a/docs/reports/2026-10-27-design-audit.md` §3, 같은 워크트리 `docs/plans/2026-10-27-design-audit-updates.md` §1·§5.
- 아래 앱 경로는 직접 읽은 `/Users/pdg/WebstormProjects/dg-studio/src/` 기준이다.

## 목표

가로 스크롤 가능한 코드 블록에 이름 있는 키보드 포커스 영역과 복사 기능을 표준화한다.
하이라이트 엔진(shiki 등)을 내장하지 않고 하이라이트 결과물을 children으로 받아 번들과 의존성을 0으로 유지한다.
복사 성공·실패 피드백을 `role="status"` 라이브 영역으로 스크린리더에 전달하며 합쇼체 표준 안내를 제공한다.

## 구성요소와 소비처

| 구성요소 | 형태·독립 기능 | 코드로 확인한 소비처 / 처리 |
| --- | --- | --- |
| CodeBlock | leaf · 블로그 본문 코드 블록 | `shared/blog-renderer/renderer.tsx:239`, `renderer.css:138` — 키보드 접근성(tabIndex, aria-label)이 빠진 `<pre><code>`를 이름 있는 포커스 가능 영역으로 교체 |
| CodeBlock | leaf · DDS 문서 가이드 코드 블록 | `features/dg-design-docs/ui/code-block.tsx:44`, `code-block.css:1`, `copy-button.tsx:13` — filename 헤더, shiki 하이라이트 children, 복사 버튼 피드백 통합 |
| 복사 피드백 | 내부 live region | `features/dg-design-docs/ui/copy-button.tsx:43`의 `role="status"` 피드백 메시지 표준화 |
| CopyButton | 보조 leaf export | `install-tabs.tsx:42`, `example-frame.tsx:89` 등 단독 복사 버튼 소비처에 재사용 가능한 서브 컴포넌트 제공 |

블로그 렌더러와 DDS 문서라는 두 독립 기능으로 구성 규칙 근거를 충족한다.
shiki·Prism 등 외부 구문 하이라이터는 번들 크기와 Cloudflare Worker WASM 제약 때문에 앱의 몫으로 남긴다.
하이라이트가 끝난 pre/code 또는 평문 텍스트 노드를 children 슬롯으로 안전하게 렌더한다.

## API

```tsx
import { CodeBlock } from "@dg-design/react/code-block";

export function Snippet() {
  const code = 'import { Button } from "@dg-design/react/button";';

  return (
    <CodeBlock
      filename="example.tsx"
      copyable
      copyText={code}
      label="버튼 가져오기 예제 코드"
    >
      <pre>
        <code>{code}</code>
      </pre>
    </CodeBlock>
  );
}
```

```tsx
import { CodeBlock, CopyButton } from "@dg-design/react/code-block";

export function InlineInstall() {
  return (
    <div className="install-row">
      <code>pnpm add @dg-design/react</code>
      <CopyButton text="pnpm add @dg-design/react" />
    </div>
  );
}
```

| prop | 기본안 |
| --- | --- |
| `children` | `React.ReactNode`, 필수 (하이라이트된 pre/code 또는 코드 텍스트) |
| `filename` | `string`, 선택; 상단 헤더에 파일 이름 노출 |
| `copyable` | `boolean`, 기본 true; 복사 버튼 표시 여부 |
| `copyText` | `string`, 선택; 복사할 원본 문자열 (생략 시 string children에서 추출 시도) |
| `label` | `string`, 선택; 코드 영역 접근 이름 (생략 시 filename 기반 자동 생성) |
| `onCopy` | `(success: boolean) => void`, 선택; 복사 완료 시 콜백 |
| HTML 속성 | div ref·className·style 전달 |

- `filename` 또는 `copyable`이 활성화되면 상단 헤더 바가 렌더된다. 둘 다 없으면 헤더 없이 코드 영역만 렌더된다.
- `copyText`를 우선 복사 텍스트로 사용한다. 생략되고 children이 단일 문자열이면 해당 문자열을 복사한다.
- `CopyButton` 컴포넌트를 named export하여 단독 인라인 코드 복사나 탭 헤더 복사에 재사용할 수 있게 한다.
- 내부 코드 스크롤 컨테이너는 기본 `div` 또는 `section`으로 렌더하며 `tabIndex={0}`과 `role="region"`을 부여한다.
- 위험한 HTML 주입(`dangerouslySetInnerHTML`)은 컴포넌트가 소유하지 않으며, 소비자가 children 내부에 전달한다.

## 복사 동작과 피드백 계약

- **클립보드 쓰기:** 복사 버튼 클릭 시 `navigator.clipboard.writeText(text)`를 비동기로 호출한다.
- **성공 피드백:** 쓰기 성공 시 복사 상태를 `"copied"`로 전환하고 2초 후 `"idle"`로 자동 복귀한다.
- **실패 안내:** 권한 거부나 HTTP 환경 등의 이유로 실패하면 `"error"` 상태로 전환하고 4초 후 복귀한다.
- **표준 안내 문구:**
  - 성공: `"코드를 복사했습니다."`
  - 실패: `"복사하지 못했습니다. 코드를 선택해 직접 복사하십시오."` (합쇼체 준수)
- **Live Region 계약:**
  - 피드백 메시지는 `role="status"` 엘리먼트에 출력한다.
  - DDS 전역 규칙에 따라 `aria-live` 속성은 명시하지 않는다(`role="status"` 고유의 암묵적 politeness 활용).
  - `aria-atomic="true"`를 부여해 문구 전체가 완전하게 낭독되도록 한다.
- **버튼 접근 이름:** 기본 상태에서는 `aria-label="코드 복사"`, 복사 직후에는 `aria-label="복사됨"`을 부여한다.
- **Icon 세트 연동:** B1a의 `CopyIcon` 및 `CheckIcon`과 결합한다. B1a 구현 전에는 텍스트 라벨로 fallback을 제공한다.

## 상태 축·키보드·접근성

| 상태/입력 | 계약 |
| --- | --- |
| default | 외곽 1px stroke-neutral-weak, 헤더 bg-neutral-weak, 본문 bg-layer-default |
| focus-visible (복사 버튼) | 비입력 2px stroke-focus-ring 바깥 표시 |
| focus-visible (코드 영역) | 안쪽 2px stroke-focus-ring 표시 (가로 스크롤 가능 인지) |
| copy pending | 복사 버튼 비활성(`disabled`), 중복 클릭 방지 |
| copy success | CheckIcon 전환 + "복사됨" 시각 피드백 + role="status" 낭독 |
| copy error | role="status" 실패 안내 노출 + 버튼 원상태 유지 |
| Tab / Shift+Tab | 복사 버튼 → 코드 스크롤 영역 순으로 키보드 초점 이동 |
| ArrowLeft / ArrowRight | 포커스된 코드 영역 내부를 키보드로 가로 스크롤 |
| PageUp / PageDown | 포커스된 코드 영역 내부를 키보드로 세로 스크롤 |

- 코드 영역 접근 이름: `label`이 있으면 해당 문구, 없으면 `filename`이 있을 때 `${filename} 코드`, 둘 다 없으면 `"코드"`를 기본 부여한다.
- 코드 영역은 키보드만 사용하는 사용자가 가로로 긴 코드를 읽을 수 있도록 반드시 `tabIndex={0}` 탭 정지점을 가진다.
- 복사 버튼은 `aria-describedby`로 피드백 `role="status"` 엘리먼트와 연결되어 상태 변화를 즉시 추적할 수 있게 한다.
- 시각적으로 숨겨진 상태 메시지는 레이아웃을 밀어내지 않도록 VisuallyHidden 기법을 적용한다.

## 토큰·모바일 밀도

| 역할 | 기본안 |
| --- | --- |
| 모서리 반경 | `--dds-radius-r3` (12px), `overflow: hidden` 클리핑 |
| 외곽 테두리 | 1px solid `--dds-color-stroke-neutral-weak` |
| 헤더 표면 | `--dds-color-bg-neutral-weak` |
| 본문 코드 표면 | `--dds-color-bg-layer-default` |
| 본문/파일명 글자 | `--dds-font-size-t2`, `--dds-line-height-t3` |
| 글꼴 | `ui-monospace, monospace` 고정 모노스페이스 스택 |
| 복사 버튼 조작 영역 | `--dds-size-touch-target`, 모바일에서 최소 44px 확보 |

- 신규 토큰은 추가하지 않는다. 기존 semantic 색상·반경·치수 토큰을 온전히 활용한다.
- 모바일 375px 대응: `max-width: 100%`, `min-width: 0`을 지정하여 긴 단일 코드 행이 페이지 전체 폭을 깨뜨리지 않게 한다.
- 헤더의 파일명이 긴 경우 `overflow-wrap: anywhere`를 적용해 줄바꿈을 허용하고 복사 버튼과 겹치지 않게 분리한다.
- 모바일 밀도에서 복사 버튼의 터치 영역을 최소 44px로 유지한다.
- CSS는 `@layer dds`; 라이트·다크 테마에서 shiki 문법 테마와 DDS 컨테이너 색상이 어긋나지 않게 배경을 중립 계층으로 고정한다.

## 테스트·합격 조건

- [ ] user-event Tab 키 입력 시 복사 버튼과 코드 영역에 순서대로 포커스가 이동한다.
- [ ] 코드 영역의 role="region", tabIndex=0, aria-label 속성이 올바르게 렌더된다.
- [ ] filename prop 유무에 따라 헤더 렌더링 및 aria-label 기본값이 달라짐을 검증한다.
- [ ] 복사 버튼 클릭 시 clipboard.writeText가 호출되고 role="status" 피드백이 노출된다.
- [ ] clipboard 쓰기 실패 모킹 시 합쇼체 실패 메시지가 role="status"에 출력된다.
- [ ] copyText 미지정 시 문자열 children에서 텍스트를 올바르게 추출하여 복사한다.
- [ ] `CodeBlock--state-matrix`: filename 있음/없음, copyable true/false, 긴 한 줄 코드 가로 스크롤.
- [ ] 매트릭스에 라이트·다크 테마 및 모바일 뷰포트(375px) 넘침 방어를 포함한다.
- [ ] 단독 CopyButton 렌더링 및 접근성 연결을 별도 테스트로 검증한다.
- [ ] VR 기준 png 및 색 txt는 CI visual-baseline 워크플로에서만 생성한다.

## skill-src·배포

- `packages/react/skill-src/code-block.tsx`: 파일명 있는 블록, 평문 블록, 사전 하이라이트된 블록, 단독 CopyButton 예제.
- 예제에 shiki 또는 Prism과 같은 외부 구문 하이라이터와의 연동 가이드를 주석으로 작성한다.
- 하위 경로 import(`@dg-design/react/code-block`), build:skill 생성물, check:skill·타입·스모크를 함께 제공한다.
- changeset: `"@dg-design/react": minor`; 신규 토큰이 없으므로 tokens changeset은 발행하지 않는다.
- B1a 이후 구현하며 barrel 등록은 코디네이터가 담당한다.
- 구현 게이트: generate → build → check:subpaths·check:skill → test → typecheck → publint → CI VR.
- 이 초안은 코드 변경이나 서버 실행 없이 문서만 작성한다.

## 하지 않을 것

- shiki, Prism, highlight.js 등 구문 하이라이트 엔진 내장 및 번들링.
- 줄 번호(line numbers) 자동 생성 및 특정 코드 행 강조(line highlighting) 기능.
- 편집 가능한 웹 에디터(Monaco/CodeMirror/Textarea) 기능.
- 실시간 언어 감지(auto language detection) 기능.
- dg-studio 블로그 렌더러 즉각 전환 (트랙 C5에서 별도 진행).

## 열린 질문

| 사용자 결정이 필요한 항목 | 기본안·영향 |
| --- | --- |
| copyText 생략 시 텍스트 추출 | children이 단일 문자열일 때만 자동 추출, 복잡한 VNode일 때는 빈 문자열 경고. copyText 명시 권장 |
| filename 없이 copyable만 있을 때 | 상단 헤더 바를 얇게 띄워 우측에 복사 버튼 배치. 헤더 완전 제거 옵션은 copyable=false |
| 단독 CopyButton 공개 여부 | `CodeBlock`과 함께 named export로 제공. 인라인 코드 및 탭 바 등 다양한 복사 인터페이스에 재사용 |
| 코드 컨테이너 HTML 태그 | W3C 명세에 따라 `role="region"`을 가진 `div`로 렌더하고 내부에 `<pre><code>` 배치 권장 |

하이라이터 미내장, 이름 있는 스크롤 영역, role="status" 피드백, 모바일 44px 확보는 요청 범위를 유지한다.
