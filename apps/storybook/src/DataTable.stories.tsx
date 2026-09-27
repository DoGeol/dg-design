import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "@dg-design/react/badge";
import { DataTable, type DataColumn } from "@dg-design/react/data-table";

const meta = {
  title: "DataTable",
} satisfies Meta;

export default meta;

type User = {
  id: string;
  name: string;
  email: string;
  status: "활성" | "대기" | "정지";
};

const users: User[] = [
  { id: "U-1001", name: "김도경", email: "dokyung.kim@example.com", status: "활성" },
  { id: "U-1002", name: "이서준", email: "seojun.lee@example.com", status: "정지" },
  { id: "U-1003", name: "박하늘", email: "haneul.park@example.com", status: "활성" },
  { id: "U-1004", name: "최윤아", email: "yoona.choi@example.com", status: "대기" },
];

const statusOptions = [
  { label: "활성", value: "활성" },
  { label: "대기", value: "대기" },
  { label: "정지", value: "정지" },
];

const columns: DataColumn<User>[] = [
  { field: "name", header: "이름", sortable: true, filter: "text", width: 160, pin: "left" },
  { field: "email", header: "이메일", filter: "text", width: 280 },
  {
    field: "status",
    header: "상태",
    filter: { options: statusOptions },
    width: 140,
    pin: "right",
    cell: (user) => (
      <Badge intent={user.status === "활성" ? "positive" : "neutral"}>
        {user.status}
      </Badge>
    ),
  },
];

export const FunctionalDemo: StoryObj<typeof meta> = {
  name: "Functional demo",
  render: () => (
    <div style={{ maxWidth: 660, padding: 24 }}>
      <DataTable data={users} rowKey="id" caption="사용자 목록" columns={columns} selectable />
    </div>
  ),
};

export const ColumnTags: StoryObj<typeof meta> = {
  name: "Typed Column tags",
  render: () => (
    <div style={{ maxWidth: 660, padding: 24 }}>
      <DataTable data={users} rowKey="id" caption="사용자 목록" selectable>
        {({ Column }) => (
          <>
            <Column field="name" header="이름" sortable filter="text" width={160} pin="left" />
            <Column field="email" header="이메일" filter="text" width={280} />
            <Column
              field="status"
              header="상태"
              filter={{ options: statusOptions }}
              width={140}
              pin="right"
              cell={(user) => (
                <Badge intent={user.status === "활성" ? "positive" : "neutral"}>
                  {user.status}
                </Badge>
              )}
            />
          </>
        )}
      </DataTable>
    </div>
  ),
};

const manyUsers: User[] = Array.from({ length: 10_000 }, (_, index) => ({
  id: `U-${String(index + 1).padStart(5, "0")}`,
  name: `사용자 ${index + 1}`,
  email: `user${index + 1}@example.com`,
  status: index % 3 === 0 ? "대기" : index % 5 === 0 ? "정지" : "활성",
}));

export const Virtualized: StoryObj<typeof meta> = {
  name: "10,000 rows · pinned columns",
  render: () => (
    <div style={{ maxWidth: 660, padding: 24 }}>
      <DataTable
        data={manyUsers}
        rowKey="id"
        caption="가상 사용자 목록"
        columns={columns}
        selectable
        virtual={{ height: 480, rowHeight: 44 }}
      />
    </div>
  ),
};

export const Empty: StoryObj<typeof meta> = {
  name: "Empty",
  render: () => (
    <div style={{ maxWidth: 660, padding: 24 }}>
      <DataTable data={[]} rowKey="id" caption="빈 사용자 목록" columns={columns} />
    </div>
  ),
};
