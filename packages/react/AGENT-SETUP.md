# dg-design 스킬 설정 가이드 (에이전트용)

이 문서는 코딩 에이전트(Claude Code, Codex 등)가 읽고 따라 하도록 쓴 것이다. 사용자가 "설치된 dg-design의 설정 가이드를 읽고 스킬을 구성해줘"라고 하면 아래 순서대로 진행한다. 사람이 직접 따라 해도 된다.

## 1. 스킬이 무엇이고 어디에 있나

`@dg-design/react` 패키지 안에 사용 가이드 스킬이 들어 있다.

```
<패키지 경로>/skill/dg-design/
  SKILL.md          언제 쓰는지, 설치·로드 규칙, layout 최소 권장, 컴포넌트 목록
  references/*.md   컴포넌트별 목적·쓰지 말 때·핵심 API·접근성·예제(타입 검사를 통과한 코드)
```

패키지 경로는 프로젝트(모노레포면 dg-design을 의존성으로 가진 앱) 폴더에서 이렇게 찾는다.

```sh
node -p "require('path').dirname(require.resolve('@dg-design/react/package.json'))"
```

패키지를 설치해도 스킬은 자동으로 연결되지 않는다. 아래 2~3단계가 연결이다.

## 2. 에이전트별 연결 위치

| 에이전트 | 연결 위치(프로젝트 루트 기준) |
| --- | --- |
| Claude Code | `.claude/skills/dg-design/` |
| Codex | `.agents/skills/dg-design/` |
| 그 밖(Cursor, Copilot 등) | 그 에이전트의 규칙 파일(`AGENTS.md`, `.cursor/rules/*` 등)에 "UI 작업 전에 `<패키지 경로>/skill/dg-design/SKILL.md`를 읽고, 쓸 컴포넌트의 `references/<이름>.md`를 읽는다"를 적는다 |

여러 에이전트를 함께 쓰면 각 위치에 모두 연결한다.

## 3. 연결 방법 — 기본은 심링크

심링크면 패키지를 올릴 때 스킬도 함께 올라간다. 프로젝트 루트에서 실행한다(경로는 1단계에서 찾은 패키지 경로를 프로젝트 루트 기준 상대 경로로 쓴다. 단일 앱이면 보통 `node_modules/@dg-design/react`).

```sh
# Claude Code
mkdir -p .claude/skills
ln -s ../../node_modules/@dg-design/react/skill/dg-design .claude/skills/dg-design

# Codex
mkdir -p .agents/skills
ln -s ../../node_modules/@dg-design/react/skill/dg-design .agents/skills/dg-design
```

- 링크 대상은 **상대 경로**로 둔다. 링크를 커밋하면 다른 사람도 의존성 설치 후 그대로 쓴다.
- 에이전트가 `.claude/`·`.agents/`를 보호 경로로 막을 수 있다(Claude Code 비대화 실행, Codex `workspace-write` 샌드박스에서 확인). 쓰기가 거부되면 우회하지 말고 사용자에게 위 명령을 직접 실행하거나 승인해 달라고 요청한다. 그것도 안 되면 2단계 "그 밖" 방식(규칙 파일에서 SKILL.md 경로 참조)으로 대신하고 그렇게 했다고 알린다.
- 모노레포에서 패키지가 앱 폴더(`apps/web/node_modules/...`)에 있으면 그 경로를 가리킨다.

심링크가 곤란하면(Windows 개발자 모드 꺼짐, 링크를 따라가지 않는 도구 등) **복사**하고 버전을 적는다.

```sh
mkdir -p .claude/skills
cp -R node_modules/@dg-design/react/skill/dg-design .claude/skills/dg-design
node -p "require('@dg-design/react/package.json').version" > .claude/skills/dg-design/VERSION
```

## 4. 프로젝트 layout 규칙 — 별도 로컬 파일에

패키지 스킬은 **고치지 않는다**(심링크면 `node_modules` 안을 고치게 되고, 복사본이어도 다음 업그레이드에서 덮인다). 프로젝트 고유 규칙은 프로젝트 루트의 `dg-design.local.md`에 적는다. SKILL.md는 이 파일이 있으면 먼저 읽으라고 지시한다.

사용자에게 아래를 묻고(이미 코드에서 알 수 있는 것은 확인만 한다) 답을 적는다.

1. 페이지 구조: 헤더·사이드바·콘텐츠 폭·그리드 같은 공통 틀이 있는가, 어느 컴포넌트·파일이 맡는가
2. 밀도: 모바일 밀도(`data-dds-density="mobile"`)를 쓰는가, 어떤 조건에서 루트에 붙이는가
3. 테마: 다크 모드를 지원하는가, `data-dds-theme`를 어디서 바꾸는가
4. 브랜드: 기본 tokens.css인가, `createTheme`으로 만든 CSS인가(파일 위치)
5. 스타일 도구: Tailwind 브릿지(`@dg-design/tokens/tailwind.css`)를 쓰는가, 아니면 CSS 파일·모듈인가
6. React 서버 컴포넌트를 쓰는가(쓰면 compound는 named export로 import)
7. 그 밖에 정한 규칙(금지 패턴, 자주 쓰는 조합, 문구 규칙)

형식 예:

```md
# dg-design 로컬 규칙

- 페이지 틀: `src/app/layout.tsx`의 `AppShell`이 헤더·사이드바를 그린다. 페이지는 내용만 그린다.
- 밀도: 모바일 앱 셸(`/m/*`)만 `<html data-dds-density="mobile">`.
- 테마: 다크 지원. `ThemeToggle`이 `<html data-dds-theme>`를 바꾼다.
- 브랜드: `src/styles/dds-tokens.css`(createTheme 생성)를 tokens.css 대신 로드.
- 스타일: Tailwind 브릿지 사용. 컴포넌트 외관은 className 유틸로만 조정.
- 서버 컴포넌트: 사용. compound는 `DialogContent`처럼 named export로.
```

## 5. 연결 확인과 업그레이드

확인:

```sh
test -f .claude/skills/dg-design/SKILL.md && echo ok   # Claude Code
test -f .agents/skills/dg-design/SKILL.md && echo ok   # Codex
```

- 새 세션에서 에이전트에게 "dg-design 스킬이 보이는가"를 물어 스킬 목록에 `dg-design`이 있는지 본다.
- 결과를 사용자에게 한 줄로 알린다: 연결 위치, 심링크/복사, 로컬 규칙 파일 위치.

패키지를 올릴 때:

- 심링크: 따로 할 일 없다. 스킬도 새 버전이 된다.
- 복사: 3단계 복사를 다시 하고 `VERSION`을 갱신한다.
- 어느 쪽이든 `CHANGELOG.md`에서 바뀐 API를 보고, `dg-design.local.md`에 적은 규칙과 어긋나는 것이 있으면 사용자에게 알린다.
- `@dg-design/tokens`도 함께 올린다(react minor가 tokens minor를 요구한다).
