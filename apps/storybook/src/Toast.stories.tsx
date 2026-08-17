import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Dialog, Toast, useToast } from "@dg-design/react";
import * as React from "react";

const INTENTS = ["brand", "neutral", "critical", "positive", "warning", "informative"] as const;

// Toast는 트리거가 없는 유일한 컴포넌트라 barrel엔 `Toast.Provider` + `useToast()`뿐이다.
// component를 지정하지 않는다 — Dialog·Tooltip과 같은 이유(compound 타입에 이름을 못 붙임).
const meta = {
  title: "Toast",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;

/**
 * 기본 데모. 기능 테스트(Playwright)가 이 스토리 id(`toast--functional-demo`)를 쓴다 —
 * intent 6종 트리거 버튼과, Dialog 안에서 띄우는 버튼("모달에서 토스트 띄우기")을 함께 둔다.
 * 후자가 dialog-stack의 알림 레이어 inert 면제(모달이 열려도 토스트 뷰포트는 죽지 않는다)를
 * 눈으로도, 테스트로도 실증한다. 버튼 문구는 Playwright 로케이터가 그대로 참조하므로 바꾸지 않는다.
 */
function FunctionalDemoContent() {
  const toast = useToast();

  return (
    <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 24 }}>
      <section style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {INTENTS.map((intent) => (
          <Button
            key={intent}
            variant="weak"
            intent="neutral"
            onClick={() =>
              toast({
                intent,
                title: `${intent} 토스트`,
                description: "훅 호출로 뜬 알림입니다.",
              })
            }
          >
            {intent} 토스트
          </Button>
        ))}
      </section>

      <Dialog.Root>
        <Dialog.Trigger asChild>
          <Button>다이얼로그 열기</Button>
        </Dialog.Trigger>
        <Dialog.Overlay />
        <Dialog.Content>
          <Dialog.Title>모달 안 작업</Dialog.Title>
          <Dialog.Description>
            모달이 열린 채로 토스트를 띄워도 토스트가 보이고 닫기 버튼을 누를 수 있어야 합니다.
          </Dialog.Description>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <Dialog.Close asChild>
              <Button variant="weak" intent="neutral">
                취소
              </Button>
            </Dialog.Close>
            <Button
              onClick={() =>
                toast({
                  intent: "positive",
                  title: "저장됨",
                  description: "변경사항이 저장되었습니다.",
                })
              }
            >
              모달에서 토스트 띄우기
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Root>
    </div>
  );
}

export const FunctionalDemo: StoryObj<typeof meta> = {
  name: "Functional demo",
  render: () => (
    <Toast.Provider>
      <FunctionalDemoContent />
    </Toast.Provider>
  ),
};

/**
 * intent 6종을 마운트 시 한 번에 순서대로 띄운다. VR은 클릭 같은 상호작용을 하지 않으므로
 * (stories.spec.ts 참조) 버튼 대신 useEffect로 자동 발화한다.
 *
 * 주의: Toast 구현의 동시 표시 최대 개수(현재 3, `toast/Toast.tsx`의 `MAX_VISIBLE`)가 6보다
 * 작아, 정지 화면엔 나중에 발화한 3개(positive·warning·informative)만 남고 앞의 3개는
 * 퇴장 애니메이션 후 사라진다 — "최대 개수를 넘기면 오래된 것부터 사라진다"는 합격 조건을
 * 그대로 보여주는 결과라 캡션으로 명시한다. 6종이 동시에 한 화면에 잡히는 캡처는 뷰포트가
 * Provider당 1개·항상 같은 고정 위치(우하단)로 포탈되는 실제 구현상 애초에 불가능하다
 * (다중 Provider를 써도 뷰포트끼리 같은 좌표에 겹친다).
 */
function StateMatrixContent() {
  const toast = useToast();
  const fired = React.useRef(false);

  React.useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    for (const intent of INTENTS) {
      toast({
        intent,
        title: `${intent} 토스트`,
        description: "intent별 배경·글자색·아이콘 없는 레이아웃 확인용 고정 문구.",
      });
    }
  }, [toast]);

  return null;
}

export const StateMatrix: StoryObj<typeof meta> = {
  name: "State matrix",
  render: () => (
    <div style={{ minHeight: "100vh", padding: 24, boxSizing: "border-box" }}>
      <p style={{ font: "500 13px sans-serif", maxWidth: 480 }}>
        6개 intent를 순서대로 띄우면 최대 동시 표시 개수(3)를 넘겨 오래된 3개(brand·neutral·
        critical)는 자동으로 밀려나고, 최근 3개(positive·warning·informative)만 화면 우하단에
        남습니다.
      </p>
      <Toast.Provider>
        <StateMatrixContent />
      </Toast.Provider>
    </div>
  ),
};
