import type { Meta, StoryObj } from "@storybook/react-vite";
import { Pagination } from "@dg-design/react";

// RadioGroup과 같은 이유로 component를 지정하지 않는다 — barrel엔 Pagination 객체 하나뿐이라
// 개별 compound의 컴포넌트 타입에 이름을 붙일 수 없다(TS4023). 모든 스토리가 render를 쓴다.
const meta = {
  title: "Pagination",
} satisfies Meta;

export default meta;

/**
 * 생략 계산은 소비자 몫이라는 계약을 보여주는 실사용 조합 — 1…4[5]6…20을 조각을
 * 손으로 조립한다. Pagination엔 onPageChange류 상태 API가 없어 값은 전부 하드코딩이다.
 */
export const FunctionalDemo: StoryObj<typeof meta> = {
  name: "Functional demo",
  render: () => (
    <div style={{ padding: 24 }}>
      <Pagination.Root>
        <Pagination.List>
          <Pagination.Item>
            <Pagination.Previous href="?page=4" />
          </Pagination.Item>
          <Pagination.Item>
            <Pagination.Link href="?page=1">1</Pagination.Link>
          </Pagination.Item>
          <Pagination.Item>
            <Pagination.Ellipsis />
          </Pagination.Item>
          <Pagination.Item>
            <Pagination.Link href="?page=4">4</Pagination.Link>
          </Pagination.Item>
          <Pagination.Item>
            <Pagination.Link href="?page=5" isActive>
              5
            </Pagination.Link>
          </Pagination.Item>
          <Pagination.Item>
            <Pagination.Link href="?page=6">6</Pagination.Link>
          </Pagination.Item>
          <Pagination.Item>
            <Pagination.Ellipsis />
          </Pagination.Item>
          <Pagination.Item>
            <Pagination.Link href="?page=20">20</Pagination.Link>
          </Pagination.Item>
          <Pagination.Item>
            <Pagination.Next href="?page=6" />
          </Pagination.Item>
        </Pagination.List>
      </Pagination.Root>
    </div>
  ),
};

/**
 * VR 기준. 생략 없는 짧은 목록과, asChild로 a 대신 button을 쓰는 라우터 onClick 연동
 * 형태를 함께 담아 isActive·asChild 두 축을 커버한다.
 */
export const StateMatrix: StoryObj<typeof meta> = {
  name: "State matrix",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 32, padding: 24 }}>
      <section>
        <h2 style={{ font: "600 14px sans-serif", marginBottom: 12 }}>생략 없음(5페이지)</h2>
        <Pagination.Root aria-label="짧은 페이지 이동">
          <Pagination.List>
            <Pagination.Item>
              <Pagination.Previous href="#" />
            </Pagination.Item>
            {[1, 2, 3, 4, 5].map((page) => (
              <Pagination.Item key={page}>
                <Pagination.Link href="#" isActive={page === 2}>
                  {page}
                </Pagination.Link>
              </Pagination.Item>
            ))}
            <Pagination.Item>
              <Pagination.Next href="#" />
            </Pagination.Item>
          </Pagination.List>
        </Pagination.Root>
      </section>
      <section>
        <h2 style={{ font: "600 14px sans-serif", marginBottom: 12 }}>
          asChild로 버튼형 교체(라우터 onClick 연동 대비)
        </h2>
        <Pagination.Root aria-label="버튼형 페이지 이동">
          <Pagination.List>
            <Pagination.Item>
              <Pagination.Link asChild isActive>
                <button type="button" onClick={() => console.log("go to page 1")}>
                  1
                </button>
              </Pagination.Link>
            </Pagination.Item>
            <Pagination.Item>
              <Pagination.Link asChild>
                <button type="button" onClick={() => console.log("go to page 2")}>
                  2
                </button>
              </Pagination.Link>
            </Pagination.Item>
          </Pagination.List>
        </Pagination.Root>
      </section>
    </div>
  ),
};
