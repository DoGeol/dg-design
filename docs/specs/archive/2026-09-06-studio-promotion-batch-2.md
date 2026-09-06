# dg-studio 승격 2차 (SaveStatus · MultiSelect 검색+생성 · FileInput)

## 메타
- 생성: 2026-09-06
- 라운드: 7
- 최종 모호도: 19% (임계값 20%)
- 유형: 브라운필드 (react 0.13.1 + D1·D2 위에 추가, 0.14.0 minor)
- 상태: 통과
- 근거: [컴포넌트 구성 규칙](../../decisions/2026-09-05-component-composition-rules.md) — SaveStatus leaf, MultiSelect 옵션 확장 사전 판정. [잔여 작업 계획](../../plans/2026-09-06-remaining-work.md) 트랙 C
- 출처: dg-studio `src/features/homeground-blog-editor/tag-picker.tsx`, `cover-field.tsx`, `editor-screen.tsx` 툴바 status, `src/features/homeground-resume-editor/resume-editor.tsx` 툴바 status
- 승인: **승인됨 (2026-09-06)**
- 구현: **완료** — react 0.14.0 (2026-09-06). 합격 조건 8/8 (dg-studio 교체 PR #60 머지, 2026-09-06). 결정 기록: [구현 중 결정](../../decisions/2026-09-06-studio-promotion-batch-2-implementation.md)

## 명확도
| 차원 | 점수 | 가중치 | 가중 점수 |
|------|------|--------|-----------|
| 목표 | 0.80 | 0.35 | 0.280 |
| 제약 | 0.75 | 0.25 | 0.188 |
| 성공 기준 | 0.85 | 0.25 | 0.213 |
| 맥락 | 0.85 | 0.15 | 0.128 |
| **모호도** | | | **19%** |

## 구성요소
| 구성요소 | 상태 | 설명 | 커버리지 / 보류 사유 |
|----------|------|------|---------------------|
| SaveStatus | 진행 | 저장 상태 4종 leaf | 상태 축·role 확정, 아이콘은 위임 |
| MultiSelect 검색+생성 | 진행 | 검색 입력(Trigger 안 / Content 상단, 둘 다) + `onCreate` Promise | 두 모드 확정, 키보드는 APG combobox 위임 |
| FileInput | 진행 | compound: 선택·드롭·검증까지. 미리보기는 슬롯 | 업로드·삭제·alt는 소비자 |
| dg-studio 교체 검증 | 진행 | 0.14.0 배포 뒤 실제 교체 PR로 합격 판정 | 트랙 D를 합격 조건에 포함 |

## 목표

dg-studio가 편집기에서 직접 만들어 쓰는 저장 상태 표시·태그 입력·대표 이미지 입력을 DDS 컴포넌트로 옮기되, 서버 호출·문구·도메인 규칙은 dg-studio에 남긴다. 완료의 정의는 DDS 게이트 통과가 아니라 **dg-studio에서 세 곳이 실제로 교체되어 E2E가 통과하는 것**이다.

## 제약

### 1. SaveStatus (`packages/react/src/save-status/`) — leaf

- props: `status: "saved" | "dirty" | "saving" | "error"`, `children: ReactNode`(문구, 필수 — DDS는 한국어 기본 문구를 갖지 않는다), `icon?: ReactNode`(없으면 상태별 기본 아이콘. 기본 아이콘의 형태는 구현 위임), 나머지 `HTMLAttributes<HTMLSpanElement>`.
- 색: saved `fg-neutral-weak`, dirty `fg-warning`, saving `fg-neutral-weak` + Spinner small, error `fg-critical`. 신규 토큰 0.
- live region: 저장소 정책 그대로 — error만 `role="alert"`, 나머지 `role="status"`. `aria-live` 얹지 않는다. **상태가 바뀔 때만 읽히도록** 같은 요소를 유지한다(status에 따라 요소를 갈아끼우지 않는다).
- 색 하나로 상태를 나르지 않는다 — 아이콘(또는 spinner) + 문구가 항상 같이 간다.
- 다항목 상태줄(이력서: 저장 상태 · `content v3` · PDF)은 만들지 않는다. 소비자가 SaveStatus 옆에 span을 나열한다.
- 클래스: `.dds-save-status`, `.dds-save-status--status_{value}`.

### 2. MultiSelect 검색 + 생성 (`multi-select/`, `internal/select-core`)

- `MultiSelectRootProps`에 추가:
  - `search?: "trigger" | "content"` — 기본 `undefined`(현행, 검색 없음).
  - `searchValue?: string`, `defaultSearchValue?`, `onSearchChange?(value)` — controlled/uncontrolled.
  - `filter?: (option, query) => boolean` — 기본은 라벨 `normalize("NFKC")` 소문자 포함 비교. `null`을 주면 필터 안 함(서버 검색용).
  - `onCreate?: (query: string) => Promise<{ value: string; label: ReactNode } | void>`.
  - `createLabel?: (query: string) => ReactNode` — 기본 없음. `onCreate`가 있는데 `createLabel`이 없으면 **렌더하지 않는다**(문구는 소비자 소유). 즉 `onCreate` + `createLabel`이 함께 있어야 "만들기" 항목이 생긴다.
- `search="trigger"`: Trigger 안에 선택 칩 + 인라인 `<input role="combobox" aria-expanded aria-controls aria-autocomplete="list">`. 타이핑하면 열림, Backspace(빈 입력)로 마지막 칩 제거, ↓로 목록 포커스 이동(활성 옵션은 `aria-activedescendant`, DOM 포커스는 입력에 유지), Enter로 활성 옵션 토글, Esc는 닫기 → 한 번 더면 입력 비움 없음(현행 closeOnEscape). 칩의 제거 버튼은 tab 순서에 들어간다.
- `search="content"`: Trigger 현행 유지. Content 첫 자식으로 검색 입력(`role="searchbox"`), 열릴 때 자동 포커스, 키보드는 현행 옵션 목록 roving을 검색 입력에서 ↓로 진입.
- "만들기" 항목: 필터 결과에 정확히 같은 라벨(정규화 비교)이 없고 query가 비어 있지 않을 때 목록 **맨 아래** `role="option"` `data-create`로 렌더. 선택 시 `onCreate(query)` 호출 → 보류 중 항목 `aria-disabled` + Spinner, 입력·다른 옵션은 그대로 조작 가능. resolve가 옵션을 주면 `value`에 추가하고 `onValueChange` 호출 후 query 비움. void면 아무것도 안 한다(소비자가 옵션 목록만 갱신하는 경우). reject면 목록 하단에 `role="alert"` 문구 — 문구는 `createErrorLabel?: (error: unknown, query: string) => ReactNode`(없으면 표시 안 함, 항목만 복구).
- 최대 선택 개수는 DDS가 모른다. 소비자가 `onValueChange`에서 자른다(TagPicker `MAX_TAGS_PER_POST`).
- `Option`이 컴포넌트 children이라 필터는 select-core 등록 목록(라벨 텍스트)을 기준으로 **숨김(hidden)** 처리한다 — 언마운트하지 않는다.
- 클래스: `.dds-multi-select__search`, `.dds-multi-select__chip`, `.dds-multi-select__option--create`.

### 3. FileInput (`file-input/`) — compound

- `FileInput.Root` — props: `accept?`, `multiple?`, `maxSize?: number`(bytes), `maxFiles?: number`, `disabled?`, `onFilesChange(files: File[], rejected: { file: File; reason: "type" | "size" | "count" }[])`, `name?`(네이티브 폼용 hidden input). hidden `<input type="file">`을 소유. 검증은 `accept`(MIME·확장자 둘 다), `maxSize`, `maxFiles` 세 가지만. 통과 파일과 거부 파일을 한 번에 콜백. 검증 실패 문구는 **소비자**가 `Field.ErrorMessage`로 띄운다(DDS는 reason 코드만 준다).
- `FileInput.Dropzone` — `div`, 드래그 진입 시 `data-dragging`, 클릭·Enter·Space로 파일 선택 열기(`role="button"`, `tabIndex=0`). `stroke-neutral-weak` 점선 → dragging `stroke-focus-ring` + `bg-brand-weak`. 드롭도 같은 검증을 탄다. children 자유(안내 문구는 소비자).
- `FileInput.Trigger` — 버튼형 진입. `asChild` 지원. Dropzone 없이 Trigger만 써도 된다(cover-field 형태).
- `FileInput.Preview` — 슬롯 `div`. 이미지 생성 안 함 — 소비자가 `<img>`·파일명을 넣는다.
- `FileInput.Actions` — 가로 flex 슬롯(교체·제거 버튼 자리).
- context: Root ↔ Dropzone/Trigger만 공유(input 열기·disabled). Preview/Actions는 클래스만.
- Field 연동: Root가 `FieldContext`에서 `id`(hidden input에)·`aria-describedby`·`aria-invalid`(Dropzone/Trigger에) 연결.
- 업로드 진행·취소·objectURL·alt 텍스트·서버 삭제는 만들지 않는다.

### 공통

- barrel·서브패스: `save-status`, `file-input` 신규. compound는 D1 규약대로 named export도 함께.
- 파일 300~500줄, `@layer dds`, `.dds-{name}--{axis}_{value}`, `:focus-visible`, disabled 3중 매칭, 테두리 1px, 신규 색 토큰 0, 대비 검사 쌍 추가 없음.
- Storybook: 각 `*--state-matrix`(라이트·다크 VR 편입) + 기능 데모 1개(**닫힌 상태로**).
- vitest(user-event): SaveStatus(role 분기, 요소 유지), MultiSelect(두 모드 필터·생성 Promise resolve/reject·Backspace 칩 제거·activedescendant), FileInput(accept/maxSize/maxFiles 거부 사유, 드롭 검증, Field 연결).
- Playwright 기능 spec: MultiSelect 두 모드 키보드 흐름, FileInput 드롭(`page.dispatchEvent('drop')`).
- changeset: react **minor**. D1·D2 changeset과 합쳐 0.14.0.

## 하지 않을 것

- 다항목 저장 상태줄 compound — 소비자 나열로 충분.
- MultiSelect 서버 검색 디바운스·로딩 표시 — `filter={null}` + 소비자 옵션 갱신으로 가능. 로딩 표시는 두 번째 소비자가 생기면.
- FileInput 미리보기 자동 생성·업로드 진행률·objectURL 관리.
- 최대 선택 개수·태그 이름 정규화 규칙(NFKC 소문자)은 소비자 소유 — 단 기본 `filter`는 같은 정규화를 쓴다.
- 새 색 토큰.

## 합격 조건

- [ ] `pnpm generate && pnpm build && pnpm --filter @dg-design/react test && pnpm typecheck && publint` 그린, VR 기준 CI 생성.
- [ ] `SaveStatus` — 4상태 렌더, error만 `role="alert"`, 상태 전환 시 같은 DOM 노드 유지(테스트로 확인).
- [ ] `MultiSelect search="trigger"` — 타이핑→열림, ↓/Enter 선택, 빈 입력 Backspace로 칩 제거, `aria-activedescendant` 갱신. `search="content"` — 열릴 때 검색 입력 포커스, ↓로 목록 진입.
- [ ] `onCreate` — resolve 옵션이 선택에 추가되고 query가 비워진다. reject 시 항목 복구 + `createErrorLabel` 표시. 보류 중 다른 옵션 조작 가능.
- [ ] `FileInput` — accept·maxSize·maxFiles 위반이 `rejected`로 사유와 함께 오고 통과분만 `files`. Dropzone 키보드로 열림, `data-dragging` 토글. Field 안에서 `aria-describedby`·`aria-invalid` 연결.
- [ ] 신규 색 토큰 0, 대비 검사 쌍 수 불변.
- [x] **dg-studio 교체 PR**(0.14.0 배포 뒤): `tag-picker.tsx` → `MultiSelect search="trigger" onCreate`, 블로그·이력서 툴바 status → `SaveStatus`, `cover-field.tsx` → `FileInput.Root/Trigger/Preview/Actions` + `Field.ErrorMessage`. dg-studio `typecheck·lint·unit·E2E` 전부 통과. 여기까지 끝나야 완료.
- [ ] 구현 중 결정은 `docs/decisions/2026-09-06-studio-promotion-batch-2-implementation.md`.

## 드러난 가정과 결론
| 가정 | 어떻게 흔들었나 | 결론 |
|------|----------------|------|
| `onCreate` 옵션 하나면 TagPicker 교체 가능 | 현행 MultiSelect에 검색 입력이 없음을 확인 | 검색 입력이 선행. 두 모드(Trigger 안·Content 상단) 모두 지원 |
| Content 검색 모드는 소비자가 없다 | 반론 — 그래도 만드나 | 만든다. 기준 소비자 없이 설계하는 위험을 아래에 기록 |
| 생성은 동기 콜백으로 충분 | TagPicker가 busy·error를 내부 관리함을 제시 | Promise 계약. 보류·실패 표시는 DDS, 문구는 소비자 |
| 파일 입력은 버튼 하나(leaf) | cover-field 구조(hidden input+버튼+미리보기+교체/제거) 제시 | compound. 단 DDS 경계는 선택·드롭·검증까지 |
| SaveStatus는 `dirty` boolean이면 된다 | 이력서 3항목·저장 중·실패 상태 제시 | 4상태. 다항목은 소비자 나열 |
| 합격은 DDS 게이트 | 1차에서 D1·D2가 실제 교체 때 드러남 | dg-studio 교체 PR까지 합격 조건 |

## 기술 맥락

- `multi-select/MultiSelect.tsx` 373행 compound(Root/Trigger/Content/Option/Group/Label), `internal/select-core`가 옵션 등록·roving 담당, `use-overlay`가 열림 배선. Trigger 안 입력은 Trigger의 클릭 토글과 충돌하므로 `search="trigger"`일 때 Trigger는 입력 포커스로 열리고 클릭 토글은 칩 영역 빈 곳만.
- `alert/Alert.tsx`·`toast`의 live region 정책, `field/Field.tsx`의 `FieldContext`(TextField·Slider 연결 패턴).
- `spinner/Spinner.tsx` size small.
- dg-studio: `tag-picker.tsx`(TextField + 후보 목록 + 만들기 버튼 + 칩), `cover-field.tsx`(hidden input, 업로드 API, `<img>` 미리보기, alt TextField, 교체/제거), 툴바 status 2곳(`hg-editor-save-status`, `resume-editor-toolbar-status`).

## 남은 위험

- **Content 검색 모드는 기준 소비자가 없다.** API가 실사용에서 어긋날 수 있다. dg-studio에 두 번째 소비자가 생길 때 재검토.
- Trigger 안 입력 + 칩은 MultiSelect Trigger의 역할이 `button`→`combobox` 컨테이너로 바뀐다. 기존 `search` 없음 모드의 DOM·테스트는 불변이어야 한다 — 회귀 테스트 필수.
- FileInput 드롭 검증은 브라우저마다 `DataTransfer` MIME이 비어 올 수 있다 — 확장자 fallback을 `accept` 검증에 포함.
- SaveStatus "같은 노드 유지"는 소비자가 `key`를 바꾸면 깨진다. 문서화.

## 인터뷰 기록
<details><summary>전체 Q&A (7라운드)</summary>

### Round 0
**Q:** 구성요소 4개(SaveStatus, MultiSelect 검색+생성, 파일 입력, dg-studio 교체 검증) 맞나 / **A:** 이대로 맞음
### Round 1
**Q:** 검색 입력 위치 — Trigger 안 / Content 상단 / 둘 다 / **A:** 둘 다 지원(정정) / **모호도:** ~78%
### Round 2
**Q:** 파일 입력 범위 — leaf / compound(드롭존+미리보기) / 드롭존까지 / **A:** compound / **모호도:** ~60%
### Round 3
**Q:** SaveStatus 상태 축 / **A:** 4상태 saved·dirty·saving·error / **모호도:** ~52%
### Round 4 (반론)
**Q:** Content 검색 소비자가 없어도 둘 다 만드나 / **A:** 그래도 둘 다 / **모호도:** ~45%
### Round 5
**Q:** 생성 처리 — Promise / 동기 / 낙관적 / **A:** 추천? → Promise 확정 / **모호도:** ~41%
### Round 6 (단순화)
**Q:** FileInput 최소 경계 / **A:** 선택·드롭·검증까지, 미리보기는 슬롯 / **모호도:** ~26%
### Round 7
**Q:** 합격 조건 수준 / **A:** DDS 게이트 + dg-studio 교체 PR / **모호도:** 19%
</details>
