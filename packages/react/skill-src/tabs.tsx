/**
 * @title Tabs
 * @summary 같은 화면 안에서 관련 패널을 전환하는 탭. 포커스가 닿으면 곧바로 활성화된다.
 *
 * ## 언제 쓰나
 *
 * - 한 객체의 여러 측면(기본 정보 / 연락처 / 권한)을 한 자리에서 전환할 때.
 * - 패널 안의 폼 상태가 탭을 오가도 살아야 할 때 — 비활성 패널은 언마운트되지 않고 `hidden`이다.
 * - 넓은 화면에서는 모든 패널을 펼치고 좁은 화면에서만 탭으로 바꾸려면 `responsive`(px).
 *
 * ## 쓰지 말 때
 *
 * - 설정 값을 고르는 세그먼트 선택(2~4개)은 `RadioGroup` — 탭은 패널을 전환하는 용도다.
 * - 다른 페이지로 이동하는 메뉴는 링크 내비게이션.
 * - 본문을 접고 펴는 목록은 `Accordion`·`Collapsible`.
 *
 * ## 핵심 API
 *
 * | 부품 | 주요 prop | 메모 |
 * | --- | --- | --- |
 * | `Tabs.Root` | `value` · `defaultValue` · `onValueChange` · `responsive` · `motion` | `responsive`: 이 px 이상에서 List 숨김 + 모든 Content 표시. `motion="none"`이면 밑줄 이동 애니메이션 끔 |
 * | `Tabs.List` | `aria-label` | `role="tablist"`. 이름을 준다 |
 * | `Tabs.Trigger` | `value`(필수) · `disabled` | 같은 `value`의 Content와 짝 |
 * | `Tabs.Content` | `value`(필수) | `role="tabpanel"`. 비활성은 `hidden` |
 *
 * ## 접근성
 *
 * - 자동 활성화: 방향키(좌우)·Home·End로 포커스를 옮기면 그 탭이 바로 선택된다. 선택 후 별도 Enter가 필요 없다.
 * - 탭 목록에는 `aria-label`을 준다. Trigger와 Content는 `value`로 `aria-controls`/`aria-labelledby`가 자동 연결된다.
 * - 선택 값이 없으면 모든 탭이 초점을 받고, 하나가 선택되면 선택된 탭만 Tab 정지점이다.
 * - `responsive`로 넓은 화면에서 List가 숨겨지면 패널 role이 빠진다.
 */
import { Tabs } from "@dg-design/react/tabs";
import * as React from "react";

/** 비제어 기본 탭 */
export function BasicTabs() {
  return (
    <Tabs.Root defaultValue="basic">
      <Tabs.List aria-label="사용자 설정">
        <Tabs.Trigger value="basic">기본 정보</Tabs.Trigger>
        <Tabs.Trigger value="contact">연락처</Tabs.Trigger>
        <Tabs.Trigger value="permission" disabled>
          권한
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="basic">이름과 소개를 관리합니다.</Tabs.Content>
      <Tabs.Content value="contact">이메일과 전화번호를 관리합니다.</Tabs.Content>
      <Tabs.Content value="permission">권한을 관리합니다.</Tabs.Content>
    </Tabs.Root>
  );
}

/** 제어 탭 — 선택 값을 부모가 갖는다(예: URL 쿼리와 동기화) */
export function ControlledTabs() {
  const [tab, setTab] = React.useState("summary");
  return (
    <Tabs.Root value={tab} onValueChange={setTab}>
      <Tabs.List aria-label="프로젝트">
        <Tabs.Trigger value="summary">요약</Tabs.Trigger>
        <Tabs.Trigger value="activity">활동</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="summary">현재 탭: {tab}</Tabs.Content>
      <Tabs.Content value="activity">최근 활동 목록</Tabs.Content>
    </Tabs.Root>
  );
}

/** 넓은 화면(768px 이상)에서는 모든 패널을 펼치고, 좁으면 탭으로 */
export function ResponsiveTabs() {
  return (
    <Tabs.Root defaultValue="a" responsive={768} motion="none">
      <Tabs.List aria-label="요약 보기">
        <Tabs.Trigger value="a">개요</Tabs.Trigger>
        <Tabs.Trigger value="b">세부</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="a">개요 내용</Tabs.Content>
      <Tabs.Content value="b">세부 내용</Tabs.Content>
    </Tabs.Root>
  );
}
