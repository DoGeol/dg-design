import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Popover, RadioGroup } from "@dg-design/react";

import { FlexCompare, FlexPage, FlexReserve, FlexSection, FlexSpec, FlexState, flexOf, type Flex } from "../FlexKit";

const meta = { title: "Mockups/Flex/Surfaces/Popover", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;

/** 포털 내용은 .fx-page 밖이라 본문 글자를 직접 준다(소비 앱의 body 글자에 해당). */
const body = { fontSize: "var(--fx-body-size, var(--dds-font-size-t4))", lineHeight: "var(--fx-body-line, var(--dds-line-height-t4))" } as const;
const weak = { margin: 0, color: "var(--dds-color-fg-neutral-weak)", fontSize: "var(--dds-font-size-t3)", lineHeight: "var(--dds-line-height-t3)" } as const;

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}

/**
 * 열어 둔 패널. 형제 오버레이를 닫는 규칙이 있어 defaultOpen은 마지막 하나만 남는다 —
 * controlled open으로 셋을 동시에 연다. autoFocus를 끄는 것도 같은 이유다.
 */
function Open({ trigger, label, className, width, children }: {
  trigger: string;
  label: string;
  className?: string;
  width: number;
  children: React.ReactNode;
}) {
  return (
    <Popover.Root open autoFocus={false} placement="bottom-start">
      <Popover.Trigger asChild><Button intent="neutral" variant="weak">{trigger}</Button></Popover.Trigger>
      <Popover.Content aria-label={label} className={className} style={{ ...body, width }}>{children}</Popover.Content>
    </Popover.Root>
  );
}

const STATUS = ["검토 중", "검토 완료", "보류", "반려"] as const;

function View({ v }: { v: Flex }) {
  const isB = v.variant === "b";
  const mobile = v.density === "mobile";
  return (
    <FlexPage
      v={v}
      title="Popover"
      summary={
        isB
          ? "담는 기능에 따라 표현을 나눕니다. 정보·설정은 현재 p16·r12, 선택은 선택 패널과 같은 r14·여백 6에 행 32·r8입니다."
          : v.variant === "a"
            ? "Popover는 담는 내용과 상관없이 현재 p16·r12를 유지합니다. 선택 전용 패널(r14·p8)은 Select의 몫입니다."
            : "현재 Popover는 p16·r12 한 가지입니다. 선택 목록을 넣어도 같은 여백을 씁니다."
      }
    >
      <FlexSection title="정보" note="세 안 모두 같습니다. 제목·설명·행동의 시작선을 맞추고 안에 Card를 겹치지 않습니다.">
        <FlexState label="설명 + 행동 · p16 · r12" block>
          <Open trigger="공개 범위 안내" label="공개 범위 안내" width={280}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <strong>전체 공개</strong>
              <p style={weak}>링크가 없어도 검색과 프로필에서 보입니다. 비공개로 바꾸면 기존 공유 링크도 막힙니다.</p>
              <Popover.Close asChild><Button size="small" intent="neutral" variant="weak" style={{ alignSelf: "flex-start" }}>확인</Button></Popover.Close>
            </div>
          </Open>
          <FlexReserve height={150} />
        </FlexState>
      </FlexSection>

      <FlexSection
        title="선택"
        note={mobile ? "모바일 행은 터치 높이(옵션 역할)입니다. 선택지가 길면 Popover 대신 하단 Sheet 조합을 씁니다." : isB
          ? "선택 컨테이너 — 반경 14·여백 6, 행 32·r8. 선택 체크(brand)와 hover(중성)를 구분합니다."
          : v.variant === "a"
            ? "A는 Popover 여백을 그대로 둡니다(p16·r12). 행은 옵션 역할 36·r6입니다."
            : "현재 없음/우회 — Popover 기본 p16 안에 행을 둡니다. 행은 Select 옵션과 같은 32·r6입니다."}
      >
        <FlexState label={isB ? "선택형 · r14 · 여백 6" : "Popover 기본 · p16 · r12"} block>
          <Open trigger="상태: 검토 중" label="검토 상태" width={220} className={isB ? "fx-pop-select" : undefined}>
            <div className="fx-pop-options">
              {STATUS.map((s, i) => (
                <button key={s} type="button" className="fx-pop-option" aria-pressed={i === 0} data-hover={i === 1 ? "" : undefined}>
                  {s}<CheckIcon />
                </button>
              ))}
            </div>
          </Open>
          <FlexReserve height={mobile ? 240 : isB ? 170 : 200} />
        </FlexState>
      </FlexSection>

      <FlexSection
        title="설정"
        note={isB
          ? "설정 컨테이너 — 바깥은 현재 p16·r12, 안은 DS026 설정 행(약한 중성 표면 48·r14)입니다. 라디오 색은 RadioGroup 문서를 따릅니다."
          : "Popover 기본 안에 RadioGroup과 저장 버튼을 둡니다."}
      >
        <FlexState label={isB ? "설정형 · 설정 행" : "Popover 기본 · RadioGroup"} block>
          <Open trigger="알림 주기" label="알림 주기" width={288}>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <strong>알림 받는 방법</strong>
              <RadioGroup.Root aria-label="알림 주기" defaultValue="now" style={isB ? { gap: 8 } : undefined}>
                {[["now", "실시간으로 받기"], ["daily", "하루에 한 번 받기"], ["off", "받지 않기"]].map(([value, text]) => (
                  <RadioGroup.Item key={value} value={value!} className={isB ? "fx-pop-setting" : undefined}>{text}</RadioGroup.Item>
                ))}
              </RadioGroup.Root>
              <Button style={{ alignSelf: "flex-end" }}>저장</Button>
            </div>
          </Open>
          <FlexReserve height={isB ? (mobile ? 330 : 280) : 210} />
        </FlexState>
      </FlexSection>

      <FlexSpec
        v={v}
        roles={isB ? ["select-panel-radius", "select-panel-inset", "option-height", "option-radius", "setting-row-height", "setting-row-radius"] : ["option-height", "option-radius"]}
        extra={[
          ["정보·설정 컨테이너", "p16 · r12 · 최대 24rem · arrow 8", isB ? "D 측정 없음 — 현재 유지" : v.variant === "a" ? "D 현재 유지(A 원문)" : "DDS 선언값"],
          ...(isB ? [] : [["선택 컨테이너", "p16 · r12 (정보형과 같음)", v.variant === "a" ? "D 현재 유지" : "DDS 선언값"] as const]),
          ["경계", "1px stroke-neutral-weak + shadow-overlay", "현재 유지 — 다크 필수"],
        ]}
      />
    </FlexPage>
  );
}

export const Compare: StoryObj = { render: (_, ctx) => <FlexCompare ctx={ctx} minHeight={1100} /> };
export const Decided: StoryObj = { name: "Decided (현재 vs 결정안)", render: (_, ctx) => <FlexCompare ctx={ctx} variants={["current", "final"]} minHeight={1100} /> };
export const Specimen: StoryObj = { render: (_, ctx) => <View v={flexOf(ctx)} /> };
