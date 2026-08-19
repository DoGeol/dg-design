import { render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";

import { Table } from "./Table";

function renderFullTable() {
  return render(
    <Table.Root>
      <Table.Caption>사용자 목록</Table.Caption>
      <Table.Header>
        <Table.Row>
          <Table.Head>이름</Table.Head>
          <Table.Head>이메일</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.Cell>홍길동</Table.Cell>
          <Table.Cell>user@example.com</Table.Cell>
        </Table.Row>
      </Table.Body>
      <Table.Footer>
        <Table.Row>
          <Table.Cell>합계</Table.Cell>
          <Table.Cell>1명</Table.Cell>
        </Table.Row>
      </Table.Footer>
    </Table.Root>,
  );
}

describe("Table", () => {
  it("table/rowgroup(thead·tbody·tfoot)/row/columnheader/cell 시맨틱을 유지한다", () => {
    renderFullTable();

    expect(screen.getByRole("table").tagName).toBe("TABLE"); // 못 찾으면 getByRole 자체가 던진다
    expect(screen.getAllByRole("rowgroup")).toHaveLength(3); // thead·tbody·tfoot
    expect(screen.getAllByRole("row")).toHaveLength(3); // header·body·footer 각 1행
    expect(screen.getAllByRole("columnheader")).toHaveLength(2);
    expect(screen.getAllByRole("cell")).toHaveLength(4); // body 2 + footer 2
  });

  it("Root는 table을 overflow-x:auto 래퍼 div로 감싸고, table 시맨틱은 그대로다", () => {
    renderFullTable();

    const table = screen.getByRole("table");
    expect(table.tagName).toBe("TABLE");

    const wrapper = table.parentElement;
    expect(wrapper?.tagName).toBe("DIV");
    expect(wrapper?.classList.contains("dds-table__wrapper")).toBe(true);
  });

  it("Head는 기본 scope=col을 갖지만 소비자가 덮어쓸 수 있다", () => {
    render(
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.Head>이름</Table.Head>
            <Table.Head scope="row">행 머리글</Table.Head>
          </Table.Row>
        </Table.Header>
      </Table.Root>,
    );

    expect(screen.getByRole("columnheader").getAttribute("scope")).toBe("col");

    // scope="row"인 th는 columnheader가 아니라 rowheader로 매핑된다
    expect(screen.getByRole("rowheader").getAttribute("scope")).toBe("row");
  });

  it("모든 파트가 각자 dds 클래스에 소비자 className을 뒤이어 병합한다", () => {
    render(
      <Table.Root className="root-cls">
        <Table.Caption className="caption-cls">캡션</Table.Caption>
        <Table.Header className="header-cls">
          <Table.Row className="row-cls">
            <Table.Head className="head-cls">헤더</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body className="body-cls">
          <Table.Row>
            <Table.Cell className="cell-cls">셀</Table.Cell>
          </Table.Row>
        </Table.Body>
        <Table.Footer className="footer-cls">
          <Table.Row>
            <Table.Cell>푸터셀</Table.Cell>
          </Table.Row>
        </Table.Footer>
      </Table.Root>,
    );

    expect(screen.getByRole("table").className).toBe("dds-table root-cls");
    expect(screen.getByText("캡션").className).toBe("dds-table__caption caption-cls");
    expect(screen.getByText("헤더").closest("thead")?.className).toBe(
      "dds-table__header header-cls",
    );
    expect(screen.getByText("헤더").closest("tr")?.className).toBe("dds-table__row row-cls");
    expect(screen.getByText("헤더").className).toBe("dds-table__head head-cls");
    expect(screen.getByText("셀").closest("tbody")?.className).toBe("dds-table__body body-cls");
    expect(screen.getByText("셀").className).toBe("dds-table__cell cell-cls");
    expect(screen.getByText("푸터셀").closest("tfoot")?.className).toBe(
      "dds-table__footer footer-cls",
    );
  });

  it("전 파트가 ref를 실제 DOM 요소로 전달한다", () => {
    const rootRef = React.createRef<HTMLTableElement>();
    const captionRef = React.createRef<HTMLTableCaptionElement>();
    const headerRef = React.createRef<HTMLTableSectionElement>();
    const bodyRef = React.createRef<HTMLTableSectionElement>();
    const footerRef = React.createRef<HTMLTableSectionElement>();
    const rowRef = React.createRef<HTMLTableRowElement>();
    const headRef = React.createRef<HTMLTableCellElement>();
    const cellRef = React.createRef<HTMLTableCellElement>();

    render(
      <Table.Root ref={rootRef}>
        <Table.Caption ref={captionRef}>캡션</Table.Caption>
        <Table.Header ref={headerRef}>
          <Table.Row ref={rowRef}>
            <Table.Head ref={headRef}>헤더</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body ref={bodyRef}>
          <Table.Row>
            <Table.Cell ref={cellRef}>셀</Table.Cell>
          </Table.Row>
        </Table.Body>
        <Table.Footer ref={footerRef}>
          <Table.Row>
            <Table.Cell>푸터셀</Table.Cell>
          </Table.Row>
        </Table.Footer>
      </Table.Root>,
    );

    expect(rootRef.current?.tagName).toBe("TABLE");
    expect(captionRef.current?.tagName).toBe("CAPTION");
    expect(headerRef.current?.tagName).toBe("THEAD");
    expect(bodyRef.current?.tagName).toBe("TBODY");
    expect(footerRef.current?.tagName).toBe("TFOOT");
    expect(rowRef.current?.tagName).toBe("TR");
    expect(headRef.current?.tagName).toBe("TH");
    expect(cellRef.current?.tagName).toBe("TD");
  });
});
