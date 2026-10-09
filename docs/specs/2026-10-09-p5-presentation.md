# P5 표시 방식 스펙 — Dialog·Sheet 작업형 부품, Sheet 높이 단계, Select 모바일 Sheet

## 메타

- 생성: 2026-10-09
- 유형: 브라운필드 · 공개 API 추가만(기존 확인형 Dialog·Sheet·Select 기본 동작 불변)
- 상태: **구현 완료(2026-10-09)** — 열린 질문 셋 다 제안대로 결정
- 근거: [구현 계획 P5](../plans/2026-10-09-flex-adoption.md) · [B 표면 명세](../reports/flex-adoption-review/skill-free-comparison/design-application/surfaces.md) · [관점 보완 §13](../reports/flex-adoption-review/gaps.md) · [조합 API](../reports/flex-adoption-review/composition.md) · 시안 `apps/storybook/src/mockups/flex/proto/DialogLayout.tsx` · Storybook `Mockups/Flex/Surfaces/{Dialog,Sheet}`

## 소비처 (구성 규칙)

| 대상 | dg-studio(react 0.17.3) 실사용 | 판정 |
| --- | --- | --- |
| Footer(행동 줄) | 수제 `*-dialog-actions` 4곳 — `resume-version-dialog-actions`, `resume-editor-dialog-actions`, `hg-blog-dialog-actions`, `resume-pdf-preview-actions` | 두 곳 이상 ✓ |
| Toolbar(제목·닫기 줄) | PDF 미리보기 모달 `resume-pdf-preview-header`, 위젯 Sheet `resume-widget-sheet-header` | 두 곳 ✓ |
| Body만 스크롤·큰 패널 | PDF 모달(54rem·90vh, padding 0으로 덮어씀), 위젯 Sheet(내용 높이·최대 80dvh로 덮어씀), DDS DatePicker Sheet(90dvh) | 두 곳 이상 ✓ |
| Aside | 없음 | B 시안만 |
| Sheet 단계 전환(간단→상세→전체) | 없음 | B 시안만 |
| Select 모바일 Sheet | 없음(DatePicker는 DDS 안에서 이미 Sheet 전환) | gaps §13 · B 시안 |

## 1. 작업형 부품 (Dialog·Sheet 공용)

```tsx
<Dialog.Content size="large">
  <Dialog.Toolbar>
    <Dialog.Title>이력서 PDF 미리보기</Dialog.Title>
    <Dialog.Close asChild><Button iconOnly … aria-label="닫기" /></Dialog.Close>
  </Dialog.Toolbar>
  <Dialog.Body>…</Dialog.Body>            {/* 스크롤은 여기만 */}
  <Dialog.Aside aria-label="활동">…</Dialog.Aside>
  <Dialog.Footer>
    <Button intent="neutral" variant="weak">취소</Button>
    <Button>저장</Button>
  </Dialog.Footer>
</Dialog.Content>
```

- 부품 4개: `Toolbar`(위, 아래 경계 1px, 세로 8·끝 12·시작 = 본문 여백) · `Body`(여기만 스크롤, 여백 `panel-inset`/Sheet는 `sheet-inset`) · `Aside`(`<aside>`, 16rem, 왼쪽 경계 1px, 여백 20) · `Footer`(Body 열 아래에만, 위 경계 1px, 세로 16, 행동 끝 정렬).
- 부품이 하나라도 있으면 Content가 작업형 배치(padding 0·gap 0, grid — Toolbar 위 전체, Body·Footer 왼쪽 열, Aside 오른쪽 열)로 바뀐다(`:has()`). 부품이 없으면 지금 확인형 그대로(p24·gap12·전체 스크롤) — 기존 소비자 무변화.
- 좁은 패널(좌우 Sheet, 화면 폭 35rem 미만): 한 열로 쌓여 Aside가 Body 뒤로 내려가 함께 스크롤되고 Toolbar·Footer는 sticky. 컨테이너 쿼리 대신 미디어 쿼리 — Content에 container를 걸면 크기 계산이 바뀐다.
- Sheet: `Sheet.Toolbar·Body·Aside·Footer`는 같은 컴포넌트(별칭). 하단 Sheet의 Footer 아래 `max(16, env(safe-area-inset-bottom))`. 모바일 Footer 버튼은 폭을 나눠 채운다(`cta-height`).
- export: 객체 속성 + `DialogToolbar` 등 named export.

## 2. 크기 축

- `Dialog.Content size`: `"default"`(지금 min(32rem)) · `"large"`(min(48rem, 화면−32), 최대 높이 90dvh — 작업형) · `"full"`(화면 전체, r0, 테두리 없음).
- `Sheet.Content size`(상하 Sheet만 의미): `"default"`(지금 min(20rem) 고정) · `"fit"`(내용 높이, 최대 90dvh) · `"tall"`(90dvh 고정) · `"full"`(100%, r0, 테두리 없음). 좌우 Sheet는 무시.
- 단계 전환(간단→상세→전체)은 소비자가 `size`를 바꾸는 것으로 한다 — 같은 Content가 유지돼 값·포커스가 남는다. 넓히기 버튼·뒤로가기 정책은 앱 소유(구성 규칙 1단계). 높이 전환 모션은 `height` 전이(`--dds-duration-base`), reduced motion이면 없음.
- DatePicker Sheet는 그대로 둔다 — 자기 높이(min(90dvh, 100%−1rem))가 `tall`(min(90dvh, 100%−32))과 달라 바꾸면 픽셀이 변한다.
- B의 Dialog "측면 보기"는 새 축을 두지 않고 `Sheet side="right"` + 같은 부품으로 쓴다.

## 3. Select·MultiSelect 모바일 Sheet

```tsx
<Select.Root presentation="auto">…</Select.Root>
```

- `presentation?: "popover" | "sheet" | "auto"`. `sheet`면 목록 패널이 하단 Sheet(`size="fit"`, 이름 = Field 라벨 또는 트리거, 모달 포커스 가두기)로 열린다. 보이는 제목은 `Content title`로 준다(선택). `auto`는 루트(`document.documentElement`)의 `data-dds-density="mobile"`이면 Sheet, 아니면 popover — 밀도를 정하는 건 앱이고 Select는 따른다. 속성 변화는 MutationObserver로 따라간다.
- listbox·option·키보드·typeahead·값 계약은 그대로다. 옵션 행은 모바일 밀도 `option-height`(48).
- MultiSelect `search="trigger"`는 Sheet 표시에서 검색 입력을 Sheet 안 위로 옮긴다(트리거는 요약 버튼이 된다) — 키보드가 올라와도 목록이 보이게.
- 선택하면 Select는 닫히고 초점은 트리거로. MultiSelect는 열린 채 유지(지금과 같음), Sheet의 닫기·Overlay로 닫는다.

## 공통

- 테스트 먼저(vitest + user-event): 부품 유무에 따른 클래스/배치 속성, Body만 스크롤(스타일), size 클래스, Sheet presentation 시 role=dialog 안 listbox·선택·닫힘·초점 복귀, 기존 Dialog·Sheet·Select 테스트 전부 통과.
- Storybook: Dialog·Sheet 상태 매트릭스에 작업형(부품·large·full, 좁은 패널)·Sheet size 4종, Select·MultiSelect Sheet 표시 스토리. VR 기능 테스트로 Body만 스크롤·Footer 고정·safe area 자리.
- 시안 `proto/DialogLayout.tsx`는 P4처럼 결정 기록으로 둔다.
- changeset react minor. tokens 변화 없음.

## 결정 (2026-10-09)

1. 부품은 Toolbar·Body·Footer·Aside 넷 다.
2. 상하 Sheet `default`는 지금 20rem 그대로, 내용 높이는 `size="fit"`으로 고른다.
3. Select·MultiSelect `presentation` 기본은 `"popover"`, `"auto"`는 루트 `data-dds-density="mobile"`이면 Sheet.

## 합격 조건

1. 부품 없는 Dialog·Sheet는 지금과 픽셀·동작이 같다(기존 테스트·VR 통과).
2. 부품을 쓰면 Body만 스크롤되고 Toolbar·Footer가 고정된다. 560 미만에서 Aside가 Body 뒤로 간다.
3. `size` 값마다 정해진 폭·높이·반경이다. size를 바꿔도 입력값·포커스가 남는다.
4. `presentation="sheet"` Select는 role=dialog 안 listbox로 열리고, 선택 시 닫히며 초점이 트리거로 돌아온다. MultiSelect는 열린 채 다중 선택된다.
5. 기존 공개 API 동작 변화 없음.
