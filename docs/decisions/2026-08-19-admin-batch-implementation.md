# 어드민 1차 구현 중 결정 (Table·Card·Tabs·Pagination·Breadcrumb)

- 날짜: 2026-08-19
- 스펙: [어드민 1차](../specs/archive/2026-08-19-admin-batch.md)
- 상태: 활성

단일 웨이브 병렬 6(공유 자산 변경 0). 에스컬레이션 0건 — 전부 barrel·changeset 등 감독 직결 항목 안내였다.

## Tabs (유일한 인터랙티브)

- **활성화를 List keydown이 아니라 Trigger `onFocus`에 걸었다** — 화살표·Home/End·클릭·프로그래매틱 포커스가 한 핸들러로 덮인다. Safari의 버튼 클릭 무포커스 대비로 onClick에도 같은 setValue(멱등)
- 좌우 화살표는 `roving-focus`를 고치지 않고 **키 별칭**(ArrowRight→ArrowDown)으로 재사용 — 순환·disabled 건너뜀이 기존 유틸 그대로, 공유 자산 변경 0 유지
- 선택이 없으면(controlled undefined) 모든 Trigger가 tabIndex 0 — 전부 -1이면 tablist가 키보드 도달 불가. automatic이라 첫 포커스에 단일 tab stop으로 복구
- **`.dds-tabs__content`에 display를 정하지 않았다** — 정하면 @layer 규칙이 UA `[hidden]{display:none}`을 이겨 비활성 패널이 보인다
- 밑줄 2px 하드코딩 — "테두리 1px" 관례는 컨트롤 테두리 얘기고, 1px 인디케이터는 바로 밑 1px 레일과 구분이 안 된다. `margin-bottom:-1px`로 레일 위에 겹쳐 전환 시 레이아웃 흔들림 없음
- id는 `${useId()}-trigger-${value}` — value에 공백이 오면 aria-controls가 깨진다(Radix 동일 수준, 방어 없음)

## Table

- Root의 ref·className은 `<table>`로 간다. 래퍼 div는 고정 클래스만 — 커스텀은 @layer 이스케이프로
- **`border-collapse: collapse` 명시** — 없으면 tr의 border-bottom이 렌더되지 않는다(separate 모드에서 tr 테두리 무시). 전역 리셋을 전제하지 않는 컴포넌트 CSS의 몫
- th 기본 `scope="col"`·`text-align:left`(UA 기본 center 뒤집기) — 옵션이 아니라 기본값 지정, 소비자 prop/className으로 덮음
- hover는 섹션 구분 없이 Row 전체 — Row가 자기 위치를 모르는 순수 마크업이라 분기를 안 넣는 게 "로직 0"과 정합

## Pagination·Breadcrumb·Card

- Pagination 외관은 자체 CSS(Button import 안 함) — ghost 계열 시각만 차용. isActive는 weak 계열
- Ellipsis: sr-only 텍스트를 컴포넌트 CSS 안 클래스로 해결(저장소에 sr-only 유틸 없음)
- Card padding x4(16px), Caption·Head 등 보조 텍스트는 Field.Description과 동일 언어(fg-neutral-weak + t3)

## 감독 확인

- Playwright의 전제(탭 데모에 텍스트 입력 필수)를 스토리가 충족하는지 교차 확인 — Tabs.stories에 TextField 3개, 실 실행에서 4건 통과
- barrel 첫 삽입에서 Breadcrumb이 Badge 앞에 들어가는 정렬 실수 — export 이름 기준 정렬로 재생성해 수정
