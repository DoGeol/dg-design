# 어드민 1차 컴포넌트 — Table·Card·Tabs·Pagination·Breadcrumb

## 메타
- 생성: 2026-08-19
- 라운드: 4
- 최종 모호도: 18% (임계값 20%)
- 유형: 브라운필드
- 상태: 통과
- 근거: 0.9.0 검토의 어드민 킷 분석(A5 + shadcn 대비) — 갈래 선택에서 "어드민 1차 컴포넌트 5종" 확정
- 승인: 승인됨 (2026-08-19, 구현 계획 경로)
- 구현: **완료** — 미배포 (2026-08-19). 합격 조건 13/14 확정 + VR 신규 기준 5종은 푸시 후 visual-baseline 워크플로

## 명확도
| 차원 | 점수 | 가중치 | 가중 점수 |
|------|------|--------|-----------|
| 목표 | 0.85 | 0.35 | 0.298 |
| 제약 | 0.80 | 0.25 | 0.200 |
| 성공 기준 | 0.75 | 0.25 | 0.188 |
| 맥락 | 0.90 | 0.15 | 0.135 |
| **모호도** | | | **18%** |

## 구성요소
| 구성요소 | 상태 | 설명 | 커버리지 |
|----------|------|------|----------|
| Table | 진행 | 스타일드 마크업 compound — 데이터 로직 0 | 범위 확정 |
| Card | 진행 | 단일 요소 padding 컨테이너 — 슬롯 없음 | 반론 라운드에서 축소 확정 |
| Tabs | 진행 | automatic 활성화, roving, aria-tabs | 활성화 방식 확정 |
| Pagination | 진행 | 마크업 조각만 — 생략 계산은 소비자 몫 | 권장 뒤집고 확정 |
| Breadcrumb | 진행 | nav 마크업 + separator + aria-current | 관례 파생 |
| 테스트·VR·릴리스 | 진행 | vitest + Playwright + VR + react minor | 관례 |

## 목표

어드민 목록·상세 화면을 조립하는 데 필요한 표·컨테이너·탭·페이지 이동·경로 표시 5종을 기존 토큰·관례만으로 추가한다 — 데이터 로직은 전부 소비자 몫이다.

## 제약

### Table (`packages/react/src/table/`)

- **스타일드 마크업만.** compound: `Root`(table)·`Header`(thead)·`Body`(tbody)·`Footer`(tfoot)·`Row`(tr)·`Head`(th)·`Cell`(td)·`Caption`. 정렬·필터·선택·가상화는 만들지 않는다(tanstack 등 소비자 자유)
- Root는 가로 스크롤 래퍼(div overflow-x:auto)로 감싼다 — 어드민 표는 뷰포트를 넘친다. 래퍼가 있어도 시맨틱은 table 그대로
- 스타일: 행 구분선(stroke-neutral-weak), hover 행 배경(bg-transparent-hover), Head는 fg-neutral-weak + t3. 신규 토큰 0
- 셀 정렬·너비는 소비자 className/style 몫

### Card (`packages/react/src/card/`)

- **단일 요소, 슬롯 없음**(반론 라운드에서 compound 축소). `<div>` + padding·border(stroke-neutral-weak 1px)·radius(r3)·bg-layer-default. `asChild` 지원(Badge류 leaf 관례)
- 내부 구조(제목·본문·푸터)는 소비자 자유 — 표준화가 필요해지면 그때 compound로 확장(비파괴)

### Tabs (`packages/react/src/tabs/`)

- compound: `Root`·`List`·`Trigger`·`Content`. value는 string, `value`/`defaultValue`/`onValueChange` — controlled 판정은 prop 존재(이번 세션에 고친 관례)
- **automatic 활성화**: 화살표로 포커스가 옮겨지면 즉시 그 탭이 활성화된다(APG tabs, Radix 기본). manual 모드·activationMode prop 없음
- roving tabindex는 `internal/roving-focus` 재사용(role="tab"). Home/End 지원. 가로 방향만(orientation prop 없음 — 수요 실측 후)
- aria: List=tablist, Trigger=tab + aria-selected + aria-controls(Content id), Content=tabpanel + aria-labelledby + tabIndex=0(패널 내 포커스 가능 요소가 없을 때 스크롤 접근)
- 비활성 Content는 언마운트가 아니라 hidden(폼 상태 보존). forceMount류 prop 없음
- 인터랙티브 5종 중 유일 — use-overlay 불필요(오버레이가 아니다), primitive 직접 조립

### Pagination (`packages/react/src/pagination/`)

- **마크업 조각만**(권장을 뒤집고 확정): `Root`(nav aria-label)·`List`(ul)·`Item`(li)·`Link`(a 기본 + asChild, `isActive`면 aria-current="page")·`Previous`·`Next`·`Ellipsis`(aria-hidden + sr 텍스트)
- 생략(ellipsis) 계산·페이지 상태는 소비자 몫. onPageChange류 상태 API 없음
- Link 기본 요소는 `<a>` — 어드민은 URL 기반 페이지가 관례. 버튼형이 필요하면 asChild
- 외관은 ghost Button과 동형 계열(활성은 solid weak 계열) — Button CSS 재사용 여부는 위임

### Breadcrumb (`packages/react/src/breadcrumb/`)

- compound: `Root`(nav aria-label)·`List`(ol)·`Item`(li)·`Link`(a + asChild)·`Page`(현재 위치 — span + aria-current="page")·`Separator`(aria-hidden, 기본 "/" 위임)
- 로직 0. 긴 경로 생략(중간 …)은 소비자 몫

### 공통

- 전부 `@layer dds`·`.dds-x__part` 클래스·className 병합·서브패스 export(barrel + package.json exports — 감독 직결)
- **신규 색·치수 토큰 0** — 기존 것만. 대비 검사 개수 불변이 게이트
- asChild는 Slot 재사용. 라우터 Link 연동이 5종의 실사용 전제(Pagination.Link·Breadcrumb.Link)

### 테스트·VR

- vitest: Tabs(automatic 활성화 — 화살표 즉시 전환, Home/End, controlled/uncontrolled, hidden 보존, aria 배선), Pagination(isActive→aria-current, asChild), Breadcrumb(Page aria-current, separator aria-hidden), Table(래퍼 overflow + 시맨틱 구조), Card(asChild)
- Playwright: Tabs 실 키보드 순회 1건(jsdom 밖 검증 가치가 있는 유일한 지점)
- VR: 5종 StateMatrix 라이트·다크(신규 기준은 워크플로 경로). 기능 데모는 닫힌 상태 관례 해당 없음(오버레이 아님)
- 기존 263건 무회귀

### 릴리스

- react minor changeset(인용 표기). 서브패스 5개 추가

## 하지 않을 것

- **Table 데이터 로직**(정렬·선택·필터·가상화·sticky) — tanstack 등 소비자 연결. 수요 실측 후 재고
- **Card compound**(Header·Title·Footer 슬롯) — 단일 요소로 시작, 표준화 수요가 보이면 비파괴 확장
- **Pagination 생략 계산·상태 API** — 조각만. 계산 내장은 수요 실측 후
- **Tabs manual 모드·orientation·forceMount** — automatic 가로 고정
- **Breadcrumb 자동 생략** — 소비자 몫
- **신규 토큰** — 전부 기존 재사용

## 합격 조건

- [ ] Tabs: 화살표 이동 즉시 패널 전환(automatic), Home/End, 순환 (vitest)
- [ ] Tabs: controlled 값을 undefined로 되돌려도 UI 반영(prop 존재 판정 관례) (vitest)
- [ ] Tabs: 비활성 패널이 hidden으로 남고 내부 입력 상태가 보존된다 (vitest)
- [ ] Tabs: tab/tablist/tabpanel + aria-selected/controls/labelledby 배선 (vitest)
- [ ] Tabs: 실 브라우저 키보드 순회 (Playwright 1건)
- [ ] Pagination: isActive에 aria-current="page", asChild로 임의 링크 교체 (vitest)
- [ ] Breadcrumb: Page에 aria-current="page", Separator aria-hidden (vitest)
- [ ] Table: 래퍼가 overflow-x:auto, table 시맨틱 유지(getByRole table/row/columnheader/cell) (vitest)
- [ ] Card: asChild 동작 (vitest)
- [ ] 신규 색·치수 토큰 0 — generate의 palette 61·semantic 47 불변
- [ ] 기존 vitest 263건 무회귀 + Playwright 기존 41건 무회귀
- [ ] VR 신규 기준 5종(워크플로 경유) 포함 파이프라인 그린
- [ ] Storybook 5종 데모 + StateMatrix
- [ ] barrel + 서브패스 exports 5개(감독 직결), react minor changeset

## 드러난 가정과 결론

| 가정 | 어떻게 흔들었나 | 결론 |
|------|----------------|------|
| Tabs도 DDS roving 관례(Enter 확정) | 탭 UI의 지배적 관례(브라우저·Radix 기본) 제시 | automatic — 포커스 = 활성. 메뉴와 탭은 다른 물건 |
| Table은 정렬 정도 내장 | shadcn·DDS 철학(로직은 수요 후) 대조 | 스타일드 마크업만 |
| Pagination은 계산 내장이 편하다(권장) | — | **사용자가 뒤집음**: 마크업만, 계산은 소비자 |
| Card는 compound가 표준 | 로직 0·토큰 조합에 불과함을 반론 | **단일 요소만** — 표준화 수요 보이면 확장 |

## 기술 맥락

- `internal/roving-focus.ts` — role 파라미터라 "tab"으로 그대로 재사용
- `internal/use-controllable-state.ts` — controlled: "value" in props 관례(이번 세션 확립)
- asChild·Slot — Button·Badge·Trigger 전반 관례. Pagination.Link·Breadcrumb.Link가 라우터 연동 지점
- 5종 모두 오버레이 아님 — use-overlay·portal·presence·dialog-stack 불사용, 이번 배치에 공유 자산 변경 0
- Button ghost/weak CSS 계열이 Pagination 항목 외관의 참고

## 남은 위험

- Tabs의 aria-controls/labelledby id 배선이 SSR에서 useId 기반이어야 함 — 기존 관례 준수로 해소
- Pagination 외관을 Button CSS 재사용으로 갈 경우 클래스 결합 방향 주의(MultiSelect→select.css 선례 참고)
- 5종 동시 병렬 시 barrel·exports 충돌 — 감독 직결 관례로 해소

## 인터뷰 기록

[2026-08-19-admin-batch-interview.md](2026-08-19-admin-batch-interview.md) 참조 (4라운드).
