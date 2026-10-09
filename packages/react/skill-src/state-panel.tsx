/**
 * @title StatePanel
 * @summary 영역 전체가 비었거나 불러오는 중이거나 실패했을 때 그 자리에 채우는 상태 안내 패널.
 *
 * ## 언제 쓰나
 *
 * - 목록·표·검색 결과가 비었을 때(아이콘 + 제목 + 설명 + 다음 행동).
 * - 영역을 불러오는 중이거나 불러오기에 실패했을 때.
 *
 * ## 쓰지 말 때
 *
 * - 콘텐츠 위에 계속 떠 있는 안내·경고 — `Alert`.
 * - 잠깐 뜨는 결과 알림 — `Toast`.
 * - 자동 저장 상태 — `SaveStatus`.
 * - 콘텐츠 모양을 알고 있는 로딩 — `Skeleton`.
 *
 * ## 핵심 API
 *
 * | 부품 | 메모 |
 * | --- | --- |
 * | `StatePanel.Root` | `minHeight`(number면 px). `role` 기본값 없음 — 오류는 `role="alert"`, 나머지는 `role="status"`를 직접 지정 |
 * | `StatePanel.Icon` | 아이콘 슬롯 |
 * | `StatePanel.Title` | 기본 `h2`. 문서 구조에 맞으면 `asChild`로 다른 heading |
 * | `StatePanel.Description` | 설명 |
 * | `StatePanel.Actions` | 버튼 영역 |
 * | `StatePanel.Footer` | 보조 링크 등 |
 * | `StatePanel.Loading` | 프리셋. `label` 필수, Spinner + 문구. `role="status"`가 내장 |
 *
 * Root 밖에서도 부품이 에러 없이 렌더되지만 Root 안에서 쓴다.
 *
 * ## 접근성
 *
 * - 오류 패널만 `role="alert"`, 빈 상태·로딩은 `role="status"`. `aria-live`는 직접 얹지 않는다(Loading은 내장).
 * - 아이콘은 장식이므로 `aria-hidden`을 준다. 의미는 제목과 설명이 나른다.
 */
import { Button } from "@dg-design/react/button";
import { StatePanel } from "@dg-design/react/state-panel";

/** 빈 상태 — 다음 행동을 제안한다 */
export function Empty() {
  return (
    <StatePanel.Root role="status" minHeight={240}>
      <StatePanel.Icon aria-hidden="true">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <rect x="7" y="9" width="26" height="22" rx="3" stroke="currentColor" strokeWidth="2" />
        </svg>
      </StatePanel.Icon>
      <StatePanel.Title>아직 문서가 없어요</StatePanel.Title>
      <StatePanel.Description>첫 문서를 만들어 시작해 보세요.</StatePanel.Description>
      <StatePanel.Actions>
        <Button>문서 만들기</Button>
      </StatePanel.Actions>
    </StatePanel.Root>
  );
}

/** 불러오기 실패 — 오류는 role="alert" */
export function LoadError({ onRetry = () => {} }: { onRetry?: () => void }) {
  return (
    <StatePanel.Root role="alert" minHeight={240}>
      <StatePanel.Title>목록을 불러오지 못했어요</StatePanel.Title>
      <StatePanel.Description>잠시 후 다시 시도해 주세요.</StatePanel.Description>
      <StatePanel.Actions>
        <Button intent="neutral" variant="weak" onClick={onRetry}>
          다시 시도
        </Button>
      </StatePanel.Actions>
    </StatePanel.Root>
  );
}

/** 로딩 프리셋 */
export function Loading() {
  return <StatePanel.Loading label="불러오는 중이에요" minHeight={240} />;
}
