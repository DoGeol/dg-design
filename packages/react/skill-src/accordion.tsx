/**
 * @title Accordion
 * @summary 제목 줄을 눌러 본문을 펼치는 항목 묶음. 기본은 한 번에 하나, `multiple`이면 여러 개.
 *
 * ## 언제 쓰나
 *
 * - FAQ, 설정 그룹처럼 같은 구조의 항목이 여러 개이고 본문이 긴 경우.
 * - 제목 + 보조 설명 + 접힌 본문 구조(`Accordion.Title`·`Description`).
 *
 * ## 쓰지 말 때
 *
 * - 접을 영역이 하나뿐이면 `Collapsible`.
 * - 패널을 전환해 보는 것은 `Tabs`.
 * - 객체 목록 묶음을 접는 것은 `List.Section collapsible`.
 *
 * ## 핵심 API
 *
 * | 부품 | 주요 prop | 메모 |
 * | --- | --- | --- |
 * | `Accordion.Root` | `values` · `defaultValues` · `onValuesChange` · `multiple` · `disabled` · `variant`(`inline` 기본·`separated`) · `size`(`medium` 기본·`large`) | 값은 항목 `value` 배열. `multiple`이 아니면 첫 값 하나만 열린다 |
 * | `Accordion.Item` | `value`(필수, Root 안에서 유일) · `disabled` | 같은 값이 겹치면 콘솔 경고(환경 구분 없음) |
 * | `Accordion.Header` | `asChild` | 제목 요소(heading) 래퍼. Trigger를 감싼다 |
 * | `Accordion.Trigger` | `asChild` | 펼침 버튼 |
 * | `Accordion.Content` | — | 본문 영역. 안에 `Accordion.Body`를 둔다 |
 * | `Accordion.Body` · `Title` · `Description` · `Prefix` · `SuffixIcon` | — | 트리거 안의 텍스트·아이콘 슬롯 |
 *
 * ## 접근성
 *
 * - 구조는 `Item > Header > Trigger`와 `Item > Content`다. Header가 heading이라 문서 개요에 들어간다.
 * - Content는 `role="region"`으로 Trigger 이름을 받는다. 꾸미는 아이콘에는 `aria-hidden`.
 * - 위아래 화살표·Home·End 키보드 이동은 컴포넌트가 처리한다.
 * - `Item` 값은 Root 안에서 유일하게 둔다.
 */
import { Accordion } from "@dg-design/react/accordion";
import * as React from "react";

function Entry({ value, title, description, children }: { value: string; title: string; description?: string; children: React.ReactNode }) {
  return (
    <Accordion.Item value={value}>
      <Accordion.Header>
        <Accordion.Trigger>
          <Accordion.Body>
            <Accordion.Title>{title}</Accordion.Title>
            {description ? <Accordion.Description>{description}</Accordion.Description> : null}
          </Accordion.Body>
          <Accordion.SuffixIcon aria-hidden>⌄</Accordion.SuffixIcon>
        </Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Content>
        <Accordion.Body>{children}</Accordion.Body>
      </Accordion.Content>
    </Accordion.Item>
  );
}

/** 한 번에 하나만 — 기본 inline */
export function SingleOpen() {
  return (
    <Accordion.Root defaultValues={["profile"]}>
      <Entry value="profile" title="프로필" description="이름과 소개를 관리합니다.">
        프로필 설정 내용
      </Entry>
      <Entry value="notice" title="알림" description="받을 알림을 고릅니다.">
        알림 설정 내용
      </Entry>
    </Accordion.Root>
  );
}

/** 여러 개 동시에, 카드처럼 분리된 모양 */
export function MultipleSeparated() {
  return (
    <Accordion.Root multiple variant="separated" size="large" defaultValues={["a", "b"]}>
      <Entry value="a" title="결제 수단">
        등록된 카드가 없습니다.
      </Entry>
      <Entry value="b" title="청구 주소">
        등록된 주소가 없습니다.
      </Entry>
    </Accordion.Root>
  );
}

/** 제어 — 열린 항목을 부모가 갖는다 */
export function Controlled() {
  const [values, setValues] = React.useState<string[]>([]);
  return (
    <Accordion.Root values={values} onValuesChange={setValues}>
      <Entry value="q1" title="요금은 어떻게 청구되나요?">
        매월 말일에 청구됩니다.
      </Entry>
      <Entry value="q2" title="언제든 해지할 수 있나요?">
        설정에서 바로 해지할 수 있습니다.
      </Entry>
    </Accordion.Root>
  );
}
