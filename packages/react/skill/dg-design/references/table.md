<!-- 생성 파일 — packages/react/skill-src/table.tsx에서 만든다. 직접 고치지 않는다. -->

# Table

정렬·선택 로직 없이 스타일만 입힌 정적 표 마크업. 데이터 기능이 필요하면 DataTable.

## 언제 쓰나

- 행과 열이 고정된 읽기 전용 표(요금표, 비교표, 요약 표).
- 셀 안에 버튼·링크·Badge 등 자유로운 내용을 직접 배치해야 할 때.
- tanstack 같은 외부 표 로직이 이미 있고 마크업 스타일만 필요할 때.

## 쓰지 말 때

- 정렬·필터·행 선택·열 고정·가상 스크롤이 필요하면 `DataTable`(데이터 주도).
- 객체 목록(제목 + 메타 + 행 동작)이면 `List`. 표는 "열로 비교하는 값"에 쓴다.
- 레이아웃 용도로 쓰지 않는다.

## 핵심 API

| 부품 | 대응 요소 | 메모 |
| --- | --- | --- |
| `Table.Root` | `table` | `overflow-x:auto` div로 감싸진다. `wrapperProps`·`wrapperRef`는 감싸는 div용, 나머지 props·`ref`는 table용 |
| `Table.Caption` | `caption` | 표 이름 |
| `Table.Header` · `Table.Body` · `Table.Footer` | `thead` · `tbody` · `tfoot` | |
| `Table.Row` | `tr` | |
| `Table.Head` | `th` | `scope` 기본 `col`. 행 머리글이면 `scope="row"` |
| `Table.Cell` | `td` | 숫자 열 정렬은 `style`/`className`으로 직접 |

## 접근성

- `Table.Caption`으로 표 이름을 준다(화면에 안 보이게 하려면 시각 숨김 클래스를 직접 얹는다).
- 열 머리글은 `Table.Head`, 행 머리글은 `scope="row"`.
- 가로로 넘칠 수 있으면 `wrapperProps`에 `role="region"`·`aria-label`·`tabIndex={0}`을 주어 키보드로 스크롤되게 한다.

## 예제

```tsx
import { Badge } from "@dg-design/react/badge";
import { Table } from "@dg-design/react/table";

/** 기본 읽기 전용 표 */
export function BasicTable() {
  return (
    <Table.Root>
      <Table.Caption>프로젝트 목록</Table.Caption>
      <Table.Header>
        <Table.Row>
          <Table.Head>이름</Table.Head>
          <Table.Head>담당</Table.Head>
          <Table.Head>상태</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.Cell>디자인 토큰 정리</Table.Cell>
          <Table.Cell>김하나</Table.Cell>
          <Table.Cell>
            <Badge intent="positive" variant="weak">
              진행 중
            </Badge>
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>문서 개편</Table.Cell>
          <Table.Cell>이둘</Table.Cell>
          <Table.Cell>
            <Badge intent="neutral" variant="weak">
              대기
            </Badge>
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Root>
  );
}

/** 행 머리글 + 숫자 열 + 합계 행 */
export function WithRowHeadAndFooter() {
  const right = { textAlign: "right" } as const;
  return (
    <Table.Root>
      <Table.Caption>월별 사용량</Table.Caption>
      <Table.Header>
        <Table.Row>
          <Table.Head>월</Table.Head>
          <Table.Head style={right}>요청 수</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.Head scope="row">8월</Table.Head>
          <Table.Cell style={right}>1,200</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Head scope="row">9월</Table.Head>
          <Table.Cell style={right}>1,840</Table.Cell>
        </Table.Row>
      </Table.Body>
      <Table.Footer>
        <Table.Row>
          <Table.Head scope="row">합계</Table.Head>
          <Table.Cell style={right}>3,040</Table.Cell>
        </Table.Row>
      </Table.Footer>
    </Table.Root>
  );
}

/** 가로로 넘치는 표 — 감싸는 영역에 이름을 주어 키보드로 스크롤 */
export function ScrollableTable() {
  return (
    <Table.Root
      wrapperProps={{ role: "region", "aria-label": "설정 비교표 스크롤", tabIndex: 0 }}
      style={{ minWidth: 640 }}
    >
      <Table.Caption>플랜별 설정 비교</Table.Caption>
      <Table.Header>
        <Table.Row>
          <Table.Head>항목</Table.Head>
          <Table.Head>기본</Table.Head>
          <Table.Head>팀</Table.Head>
          <Table.Head>조직</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.Head scope="row">프로젝트 수</Table.Head>
          <Table.Cell>3</Table.Cell>
          <Table.Cell>20</Table.Cell>
          <Table.Cell>무제한</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Root>
  );
}
```
