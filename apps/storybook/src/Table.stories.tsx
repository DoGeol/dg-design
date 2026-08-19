import type { Meta, StoryObj } from "@storybook/react-vite";
import { Table } from "@dg-design/react";

// RadioGroup과 같은 이유로 component를 지정하지 않는다 — barrel엔 Table 객체 하나뿐이라
// 개별 compound의 컴포넌트 타입에 이름을 붙일 수 없다(TS4023). 모든 스토리가 render를 쓴다.
const meta = {
  title: "Table",
} satisfies Meta;

export default meta;

const USERS = [
  { id: "U-1001", name: "김도경", email: "dokyung.kim@example.com", role: "관리자", status: "활성", joined: "2026-01-14" },
  { id: "U-1002", name: "이서준", email: "seojun.lee@example.com", role: "운영자", status: "정지", joined: "2026-02-03" },
  { id: "U-1003", name: "박하늘", email: "haneul.park@example.com", role: "일반", status: "활성", joined: "2026-03-22" },
  { id: "U-1004", name: "최윤아", email: "yoona.choi@example.com", role: "일반", status: "대기", joined: "2026-04-09" },
];

const LONG_NOTES = [
  "2026-08-19 09:12 로그인 · 관리자 권한으로 사용자 목록 조회 · IP 121.145.0.12",
  "결제 문의로 3회 연락, 다음 정기 점검 시 계정 상태 재확인 필요",
  "베타 기능 얼리 액세스 신청 완료, 마케팅 수신 동의는 미완료 상태로 확인됨",
  "정지 해제 요청 접수, 운영팀 검토 대기 중 — 처리 기한 2026-08-25",
];

/**
 * 기본 데모. Header/Body/Row/Head/Cell/Caption 조합의 실사용 예시 — Footer와 가로 스크롤
 * 변형은 StateMatrix에서 다룬다.
 */
export const FunctionalDemo: StoryObj<typeof meta> = {
  name: "Functional demo",
  render: () => (
    <div style={{ padding: 24 }}>
      <Table.Root>
        <Table.Caption>최근 가입한 사용자</Table.Caption>
        <Table.Header>
          <Table.Row>
            <Table.Head>이름</Table.Head>
            <Table.Head>이메일</Table.Head>
            <Table.Head>역할</Table.Head>
            <Table.Head>상태</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {USERS.map((user) => (
            <Table.Row key={user.id}>
              <Table.Cell>{user.name}</Table.Cell>
              <Table.Cell>{user.email}</Table.Cell>
              <Table.Cell>{user.role}</Table.Cell>
              <Table.Cell>{user.status}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </div>
  ),
};

/**
 * VR 기준. 헤더+본문 4행+푸터 기본형과, 긴 셀 때문에 가로 스크롤이 뜨는 변형을 함께 잡는다.
 * 스크롤 변형은 래퍼 폭을 480px로 고정해 뷰포트 크기와 무관하게 항상 오버플로우가 재현되게 한다.
 */
export const StateMatrix: StoryObj<typeof meta> = {
  name: "State matrix",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 32, padding: 24 }}>
      <section>
        <h2 style={{ font: "600 14px sans-serif", marginBottom: 12 }}>기본형</h2>
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.Head>ID</Table.Head>
              <Table.Head>이름</Table.Head>
              <Table.Head>이메일</Table.Head>
              <Table.Head>상태</Table.Head>
              <Table.Head>가입일</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {USERS.map((user) => (
              <Table.Row key={user.id}>
                <Table.Cell>{user.id}</Table.Cell>
                <Table.Cell>{user.name}</Table.Cell>
                <Table.Cell>{user.email}</Table.Cell>
                <Table.Cell>{user.status}</Table.Cell>
                <Table.Cell>{user.joined}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
          <Table.Footer>
            <Table.Row>
              <Table.Cell colSpan={5}>총 {USERS.length}명</Table.Cell>
            </Table.Row>
          </Table.Footer>
        </Table.Root>
      </section>
      <section>
        <h2 style={{ font: "600 14px sans-serif", marginBottom: 12 }}>가로 스크롤(긴 셀)</h2>
        <div style={{ maxWidth: 480 }}>
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.Head>ID</Table.Head>
                <Table.Head>이름</Table.Head>
                <Table.Head>이메일</Table.Head>
                <Table.Head>비고</Table.Head>
                <Table.Head>상태</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {USERS.map((user, index) => (
                <Table.Row key={user.id}>
                  <Table.Cell>{user.id}</Table.Cell>
                  <Table.Cell>{user.name}</Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell style={{ whiteSpace: "nowrap" }}>{LONG_NOTES[index]}</Table.Cell>
                  <Table.Cell>{user.status}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
            <Table.Footer>
              <Table.Row>
                <Table.Cell colSpan={5}>총 {USERS.length}명</Table.Cell>
              </Table.Row>
            </Table.Footer>
          </Table.Root>
        </div>
      </section>
    </div>
  ),
};
