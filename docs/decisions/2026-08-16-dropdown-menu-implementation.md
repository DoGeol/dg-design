# DropdownMenu 구현 중 결정

- 날짜: 2026-08-16
- 스펙: [specs/archive/2026-08-16-dropdown-menu.md](../specs/archive/2026-08-16-dropdown-menu.md)
- 실행: Workflow 병렬 3태스크 (DropdownMenu opus·high / 기능 테스트 sonnet·high / changeset haiku·low)

## 위임돼 구현 중 정해진 값 (ownDecisions)

**로직 핵심**
- 초기 포커스는 Content가 아니라 **첫 활성 항목** — APG menu button 표준, roving에서 Content 포커스는 화살표 한 칸 낭비
- Item은 네이티브 `<button role="menuitem">` — Enter/Space·disabled 차단을 브라우저 위임, 키 핸들러 최소화. disabled는 roving 셀렉터에서 빠져 건너뜀이 자동 성립
- roving은 등록 배열 없이 **DOM 조회** — 항목 순서의 단일 소스가 DOM이라 조건부 렌더에도 동기화 코드 0
- 외부 클릭은 document mousedown 1개 + 트리거 내부 제외 — 트리거 재클릭은 Trigger의 토글만 처리(이중 동작 차단, Playwright 4단 시퀀스로 실측)
- 포커스 복귀는 **포커스가 메뉴 안에 있을 때만** — 외부 클릭으로 이미 옮겨간 포커스를 되끌면 도둑질
- dismissal 끄기 prop 없음 — 액션 메뉴에 "안 닫히는 모드" 수요 없음, Dialog와 의도적 비대칭

**dialog-stack modal 플래그**
- ESC 리스너는 전체 스택 길이, 스크롤 잠금은 **모달 refcount**로 분리
- syncInert는 최상단 모달 기준 + **그 위 비모달 컨테이너 면제** — 면제 없으면 Dialog 안 메뉴가 열리자마자 inert로 죽는다

**floating**
- @floating-ui/dom ^1.8.0, offset 4·flip·shift(padding 8), strategy fixed(portal이 body 직속이라), placement는 Root prop(기본 bottom-start)
- jsdom에 ResizeObserver 없음 → test-setup에 no-op 스텁 (위치 검증은 Playwright·VR 몫)
- Trigger·Content mergeRefs를 useMemo 고정 — 매 렌더 새 콜백 ref면 null 왕복 렌더 루프

**시각**
- 패널 min-width 12rem·padding x1·radius r2, Item min-height x8·t4, 하이라이트는 :hover·:focus-visible 양쪽 bg-transparent-hover(roving과 일관), 애니메이션 fade+scale duration-fast(Dialog보다 빠름)
- onSelect는 `() => void`, 항상 닫힘 — preventDefault 구조는 CheckboxItem 수요 때

## 위험 결과

- dialog-stack 회귀 — **없음**: 수정 직후 기존 33건 단독 재실행으로 선확인, 최종 48/48
- 외부 클릭·토글 경합 — mousedown/click 단계 분리로 해결, 실브라우저 실측
- floating jsdom — 스텁으로 우회, 계획대로 이원화
- changeset YAML — 인용 실검증 지시가 작동, 파싱 통과

## 검증 요약

vitest 48/48(신규 15) · 기능 테스트 9/9(dialog 5 무회귀 + dropdown 4) · typecheck·build·publint 그린. 감독 실측: bottom-start 배치, 첫 항목 포커스, 화살표 이동·disabled 건너뜀, role=menu, **비모달 확증(inert 0·스크롤 잠금 없음)**. VR에 dropdown 스토리 2건 자동 편입 — 기준은 워크플로 대기.
