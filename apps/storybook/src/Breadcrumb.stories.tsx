import type { Meta, StoryObj } from "@storybook/react-vite";
import { Breadcrumb } from "@dg-design/react";

// RadioGroup과 같은 이유로 component를 지정하지 않는다 — barrel엔 Breadcrumb 객체 하나뿐이라
// 개별 compound의 컴포넌트 타입에 이름을 붙일 수 없다(TS4023). 모든 스토리가 render를 쓴다.
const meta = {
  title: "Breadcrumb",
} satisfies Meta;

export default meta;

/** 3단 경로 + 현재 위치(Page) 실사용 조합. 마지막 항목만 Link가 아니라 Page다. */
export const FunctionalDemo: StoryObj<typeof meta> = {
  name: "Functional demo",
  render: () => (
    <div style={{ padding: 24 }}>
      <Breadcrumb.Root>
        <Breadcrumb.List>
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/admin">홈</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/admin/users">사용자 관리</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item>
            <Breadcrumb.Page>사용자 상세</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>
    </div>
  ),
};

/**
 * VR 기준. 기본 구분자("/") 짧은 경로와, 커스텀 구분자·asChild(a → button, 라우터
 * onClick 연동 대비) 긴 경로를 함께 담아 Separator 위임·asChild 두 축을 커버한다.
 */
export const StateMatrix: StoryObj<typeof meta> = {
  name: "State matrix",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, padding: 24 }}>
      <section>
        <h2 style={{ font: "600 14px sans-serif", marginBottom: 12 }}>기본 구분자</h2>
        <Breadcrumb.Root aria-label="기본 구분자 경로">
          <Breadcrumb.List>
            <Breadcrumb.Item>
              <Breadcrumb.Link href="#">홈</Breadcrumb.Link>
            </Breadcrumb.Item>
            <Breadcrumb.Separator />
            <Breadcrumb.Item>
              <Breadcrumb.Page>현재 페이지</Breadcrumb.Page>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
      </section>
      <section>
        <h2 style={{ font: "600 14px sans-serif", marginBottom: 12 }}>커스텀 구분자 + asChild</h2>
        <Breadcrumb.Root aria-label="커스텀 구분자 경로">
          <Breadcrumb.List>
            <Breadcrumb.Item>
              <Breadcrumb.Link asChild>
                <button type="button" onClick={() => console.log("navigate: /admin")}>
                  홈
                </button>
              </Breadcrumb.Link>
            </Breadcrumb.Item>
            <Breadcrumb.Separator>›</Breadcrumb.Separator>
            <Breadcrumb.Item>
              <Breadcrumb.Link href="#">사용자 관리</Breadcrumb.Link>
            </Breadcrumb.Item>
            <Breadcrumb.Separator>›</Breadcrumb.Separator>
            <Breadcrumb.Item>
              <Breadcrumb.Page>사용자 상세</Breadcrumb.Page>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
      </section>
    </div>
  ),
};
