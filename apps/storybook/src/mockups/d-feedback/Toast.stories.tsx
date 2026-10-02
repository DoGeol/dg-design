import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Toast, type ToastOptions } from "@dg-design/react";

import { MockupPage, MockupSection, MockupSpec, MockupState } from "../MockupKit";

const meta = { title: "Mockups/A/Toast", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;

const COPY = {
  positive: { intent: "positive", title: "변경 사항을 저장했습니다", description: "프로필 정보가 업데이트되었습니다." },
  warning: { intent: "warning", title: "저장 공간이 거의 찼습니다", description: "남은 용량은 500MB입니다." },
  critical: { intent: "critical", title: "저장하지 못했습니다", description: "네트워크 연결을 확인한 뒤 다시 시도해 주세요." },
  brand: { intent: "brand", title: "초대 링크를 복사했습니다", description: "팀원에게 링크를 공유해 주세요." },
  neutral: { intent: "neutral", title: "항목을 보관함으로 옮겼습니다", description: "보관함에서 언제든 되돌릴 수 있습니다." },
  informative: { intent: "informative", title: "새 버전을 사용할 수 있습니다", description: "페이지를 새로 고치면 적용됩니다." },
} satisfies Record<string, ToastOptions>;

const USE: Record<keyof typeof COPY, string> = {
  positive: "positive · 저장·완료",
  warning: "warning · 주의가 필요한 결과",
  critical: "critical · 실패 (role=alert)",
  brand: "brand · 사용자가 한 동작의 확인",
  neutral: "neutral · 되돌릴 수 있는 일반 결과",
  informative: "informative · 시스템 안내",
};

function IntentSection({ names, note }: { names: (keyof typeof COPY)[]; note?: string }) {
  return (
    <MockupSection title="intent" columns={3} note={note}>
      {names.map((name) => (
        <MockupState key={name} label={USE[name]}>
          <Toast.View {...COPY[name]} onClose={() => {}} live={false} style={{ width: "100%" }} />
        </MockupState>
      ))}
    </MockupSection>
  );
}

function RulesSection() {
  return (
    <MockupSection title="동작 규칙" columns={1} note="화면 배치와 시간 동작은 Toast.Provider가 맡습니다. 위 카드는 같은 마크업을 정적으로 그린 Toast.View입니다.">
      <MockupState label="규칙">
        <ul style={{ margin: 0, paddingLeft: 18, display: "flex", flexDirection: "column", gap: 8, fontSize: 13, lineHeight: "18px" }}>
          <li>화면 오른쪽 아래에서 16px 띄우고, 새 Toast가 아래에 붙습니다.</li>
          <li>동시에 3개까지 보이고(Provider의 max로 조정), 넘치면 오래된 것부터 닫힙니다.</li>
          <li>5초 뒤 스스로 닫히고, 마우스를 올리거나 포커스가 있으면 멈춥니다.</li>
          <li>모달이 열려 있어도 Toast는 가려지지 않고 닫기 버튼을 누를 수 있습니다.</li>
          <li>아이콘 없이 배경색과 글자색으로 intent를 나눕니다. 실패는 제목에서 바로 말합니다.</li>
        </ul>
      </MockupState>
    </MockupSection>
  );
}

const toastSpec = [
  ["위치", "화면 오른쪽 아래 16px, 폭 min(384px, 100vw − 32px)", "--dds-dimension-x4 / x8"],
  ["항목 간격 · 최대 개수", "8px · 기본 3개(Provider max, 넘치면 오래된 것부터 닫힘)", "--dds-dimension-x2"],
  ["패딩", "12px 16px", "--dds-dimension-x3 / x4"],
  ["radius", "12px", "--dds-radius-r3"],
  ["그림자", "0 12px 32px rgba(15,15,15,.18), 0 4px 8px rgba(15,15,15,.08)", "--dds-shadow-overlay"],
  ["제목", "13px / 18px · bold", "--dds-font-size-t3 / line-height-t3"],
  ["설명", "12px / 16px · regular, 제목과 간격 4px", "--dds-font-size-t2 / dimension-x1"],
  ["닫기 버튼", "20×20px · radius 4px · 16px X 아이콘(stroke 1.5)", "--dds-dimension-x5 / radius-r1"],
  ["focus ring (닫기)", "2px #1550A9 outline, offset 2px", "--dds-color-stroke-focus-ring"],
  ["positive 배경 / 글자", "#E7FCE7 / #0F4A17", "--dds-color-bg-positive-weak / fg-positive"],
  ["warning 배경 / 글자", "#FCF4E5 / #4D3A0C", "--dds-color-bg-warning-weak / fg-warning"],
  ["critical 배경 / 글자", "#FCF3F2 / #731115", "--dds-color-bg-critical-weak / fg-critical"],
  ["brand 배경 / 글자", "#F1F5FC / #0B397E", "--dds-color-bg-brand-weak / fg-brand"],
  ["neutral 배경 / 글자", "#F3F5F9 / #252629", "--dds-color-bg-neutral-weak / fg-neutral"],
  ["informative 배경 / 글자", "#F0F6FC / #0D3F6A", "--dds-color-bg-informative-weak / fg-informative"],
  ["등장 · 자동 닫힘", "200ms ease-out, 오른쪽 16px에서 슬라이드 · 5초(hover·focus 중 정지)", "--dds-duration-base / easing-out"],
  ["z-index", "2100 (모달 위)", "--dds-z-toast"],
] as const;

export const Overview: StoryObj = {
  render: () => (
    <MockupPage title="Toast" summary="작업 결과를 잠깐 알리고 5초 뒤 스스로 닫힙니다. 사용자의 결정이 필요한 내용은 Toast 대신 Dialog를 씁니다.">
      <IntentSection names={["positive", "warning", "critical"]} />
      <MockupSection title="구성" columns={2} note="action 슬롯에 링크나 버튼을 둘 수 있습니다. 닫기 버튼은 onClose를 줄 때만 그려집니다.">
        <MockupState label="제목만 · 닫기 없음">
          <Toast.View intent="neutral" title="항목을 보관함으로 옮겼습니다" live={false} style={{ width: "100%" }} />
        </MockupState>
        <MockupState label="action 포함">
          <Toast.View
            intent="neutral"
            title="항목을 보관함으로 옮겼습니다"
            description="보관함에서 언제든 되돌릴 수 있습니다."
            action={<Button intent="neutral" variant="ghost" size="small">실행 취소</Button>}
            onClose={() => {}}
            live={false}
            style={{ width: "100%" }}
          />
        </MockupState>
      </MockupSection>
      <MockupSection title="문구" columns={2}>
        <MockupState label="제목 · 마침표 없이 결과를 한 줄로">
          <span style={{ fontSize: 13 }}>변경 사항을 저장했습니다</span>
        </MockupState>
        <MockupState label="설명 · 다음 행동이 있을 때만, 마침표로 끝냄">
          <span style={{ fontSize: 13 }}>네트워크 연결을 확인한 뒤 다시 시도해 주세요.</span>
        </MockupState>
      </MockupSection>
      <RulesSection />
      <MockupSpec rows={toastSpec} />
    </MockupPage>
  ),
};

export const OpenNotice: StoryObj = {
  render: () => (
    <MockupPage title="Toast · 안내형 intent" summary="brand·neutral·informative 세 intent입니다. 한 화면에는 최대 3개까지 쌓입니다.">
      <IntentSection names={["brand", "neutral", "informative"]} />
    </MockupPage>
  ),
};
