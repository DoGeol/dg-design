import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

import { Field } from "../field/Field";
import { FileInput } from "./FileInput";

function makeFile(name: string, type: string, sizeBytes = 10): File {
  const content = new Uint8Array(sizeBytes);
  return new File([content], name, { type });
}

const dropzone = () => screen.getByRole("button");

describe("FileInput accept 검증", () => {
  it("MIME 패턴에 맞는 파일은 통과, 안 맞는 파일은 type 사유로 거부된다", async () => {
    const onFilesChange = vi.fn();
    render(
      <FileInput.Root accept="image/png" onFilesChange={onFilesChange}>
        <FileInput.Dropzone />
      </FileInput.Root>,
    );

    const png = makeFile("photo.png", "image/png");
    const pdf = makeFile("doc.pdf", "application/pdf");
    fireEvent.drop(dropzone(), { dataTransfer: { files: [png, pdf] } });

    expect(onFilesChange).toHaveBeenCalledWith([png], [{ file: pdf, reason: "type" }]);
  });

  it("확장자 패턴은 파일명으로 판정한다", async () => {
    const onFilesChange = vi.fn();
    render(
      <FileInput.Root accept=".csv" onFilesChange={onFilesChange}>
        <FileInput.Dropzone />
      </FileInput.Root>,
    );

    const csv = makeFile("data.csv", "text/csv");
    const txt = makeFile("notes.txt", "text/plain");
    fireEvent.drop(dropzone(), { dataTransfer: { files: [csv, txt] } });

    expect(onFilesChange).toHaveBeenCalledWith([csv], [{ file: txt, reason: "type" }]);
  });

  it("File.type이 빈 문자열이어도 확장자로 MIME을 추정해 판정한다", async () => {
    const onFilesChange = vi.fn();
    render(
      <FileInput.Root accept="image/*" onFilesChange={onFilesChange}>
        <FileInput.Dropzone />
      </FileInput.Root>,
    );

    const emptyTypePng = makeFile("dropped.png", "");
    fireEvent.drop(dropzone(), { dataTransfer: { files: [emptyTypePng] } });

    expect(onFilesChange).toHaveBeenCalledWith([emptyTypePng], []);
  });

  it("accept 없이 쓰면 전부 통과한다", () => {
    const onFilesChange = vi.fn();
    render(
      <FileInput.Root onFilesChange={onFilesChange}>
        <FileInput.Dropzone />
      </FileInput.Root>,
    );

    const any = makeFile("weird.xyz", "");
    fireEvent.drop(dropzone(), { dataTransfer: { files: [any] } });

    expect(onFilesChange).toHaveBeenCalledWith([any], []);
  });
});

describe("FileInput maxSize / maxFiles", () => {
  it("maxSize 초과 파일은 size 사유로 거부되고 통과분만 files에 담긴다", () => {
    const onFilesChange = vi.fn();
    render(
      <FileInput.Root maxSize={100} onFilesChange={onFilesChange}>
        <FileInput.Dropzone />
      </FileInput.Root>,
    );

    const small = makeFile("small.png", "image/png", 50);
    const big = makeFile("big.png", "image/png", 200);
    fireEvent.drop(dropzone(), { dataTransfer: { files: [small, big] } });

    expect(onFilesChange).toHaveBeenCalledWith([small], [{ file: big, reason: "size" }]);
  });

  it("maxFiles를 넘는 초과분은 count 사유로 거부된다", () => {
    const onFilesChange = vi.fn();
    render(
      <FileInput.Root multiple maxFiles={2} onFilesChange={onFilesChange}>
        <FileInput.Dropzone />
      </FileInput.Root>,
    );

    const files = [makeFile("a.png", "image/png"), makeFile("b.png", "image/png"), makeFile("c.png", "image/png")];
    fireEvent.drop(dropzone(), { dataTransfer: { files } });

    expect(onFilesChange).toHaveBeenCalledWith(
      [files[0], files[1]],
      [{ file: files[2], reason: "count" }],
    );
  });

  it("multiple이 false면 암묵적으로 1개까지만 통과한다", () => {
    const onFilesChange = vi.fn();
    render(
      <FileInput.Root onFilesChange={onFilesChange}>
        <FileInput.Dropzone />
      </FileInput.Root>,
    );

    const files = [makeFile("a.png", "image/png"), makeFile("b.png", "image/png")];
    fireEvent.drop(dropzone(), { dataTransfer: { files } });

    expect(onFilesChange).toHaveBeenCalledWith([files[0]], [{ file: files[1], reason: "count" }]);
  });
});

describe("FileInput Dropzone 상호작용", () => {
  it("클릭하면 숨은 input의 파일 선택 창이 열린다(click 위임)", async () => {
    const user = userEvent.setup();
    render(
      <FileInput.Root>
        <FileInput.Dropzone />
      </FileInput.Root>,
    );

    const input = document.querySelector("input[type='file']") as HTMLInputElement;
    const clickSpy = vi.spyOn(input, "click");

    await user.click(dropzone());
    expect(clickSpy).toHaveBeenCalledTimes(1);
  });

  it("Enter·Space 키로도 파일 선택 창이 열린다", async () => {
    const user = userEvent.setup();
    render(
      <FileInput.Root>
        <FileInput.Dropzone />
      </FileInput.Root>,
    );

    const input = document.querySelector("input[type='file']") as HTMLInputElement;
    const clickSpy = vi.spyOn(input, "click");

    dropzone().focus();
    await user.keyboard("{Enter}");
    expect(clickSpy).toHaveBeenCalledTimes(1);

    await user.keyboard(" ");
    expect(clickSpy).toHaveBeenCalledTimes(2);
  });

  it("dragenter로 data-dragging이 켜지고, 자식 진입(enter/leave 카운터) 중엔 꺼지지 않다가 완전히 벗어나면 꺼진다", () => {
    render(
      <FileInput.Root>
        <FileInput.Dropzone>
          <span data-testid="child">여기에 드롭</span>
        </FileInput.Dropzone>
      </FileInput.Root>,
    );

    const zone = dropzone();
    const child = screen.getByTestId("child");

    fireEvent.dragEnter(zone);
    expect(zone.hasAttribute("data-dragging")).toBe(true);

    // 자식으로 진입할 때의 leave+enter 쌍 — 카운터가 0으로 안 떨어져야 유지된다.
    fireEvent.dragLeave(zone);
    fireEvent.dragEnter(child);
    expect(zone.hasAttribute("data-dragging")).toBe(true);

    // 완전히 밖으로 나가는 마지막 leave만 끈다.
    fireEvent.dragLeave(child);
    expect(zone.hasAttribute("data-dragging")).toBe(false);
  });

  it("drop 이후 data-dragging이 꺼진다", () => {
    const onFilesChange = vi.fn();
    render(
      <FileInput.Root onFilesChange={onFilesChange}>
        <FileInput.Dropzone />
      </FileInput.Root>,
    );

    const zone = dropzone();
    fireEvent.dragEnter(zone);
    expect(zone.hasAttribute("data-dragging")).toBe(true);

    fireEvent.drop(zone, { dataTransfer: { files: [makeFile("a.png", "image/png")] } });
    expect(zone.hasAttribute("data-dragging")).toBe(false);
  });
});

describe("FileInput disabled", () => {
  it("disabled면 클릭·키보드·드롭이 전부 무시된다", async () => {
    const user = userEvent.setup();
    const onFilesChange = vi.fn();
    render(
      <FileInput.Root disabled onFilesChange={onFilesChange}>
        <FileInput.Dropzone />
        <FileInput.Trigger>파일 선택</FileInput.Trigger>
      </FileInput.Root>,
    );

    const input = document.querySelector("input[type='file']") as HTMLInputElement;
    const clickSpy = vi.spyOn(input, "click");
    const zone = document.querySelector(".dds-file-input__dropzone") as HTMLElement;

    await user.click(zone);
    expect(clickSpy).not.toHaveBeenCalled();

    fireEvent.drop(zone, { dataTransfer: { files: [makeFile("a.png", "image/png")] } });
    expect(onFilesChange).not.toHaveBeenCalled();

    expect(
      (screen.getByRole("button", { name: "파일 선택" }) as HTMLButtonElement).disabled,
    ).toBe(true);
  });
});

describe("FileInput Trigger", () => {
  it("클릭하면 숨은 input이 열리고, asChild면 전달한 요소로 렌더된다", async () => {
    const user = userEvent.setup();
    render(
      <FileInput.Root>
        <FileInput.Trigger asChild>
          <a href="#pick">파일 선택</a>
        </FileInput.Trigger>
      </FileInput.Root>,
    );

    const link = screen.getByRole("link", { name: "파일 선택" });
    expect(link.tagName).toBe("A");

    const input = document.querySelector("input[type='file']") as HTMLInputElement;
    const clickSpy = vi.spyOn(input, "click");
    await user.click(link);
    expect(clickSpy).toHaveBeenCalledTimes(1);
  });
});

describe("FileInput Field 연동", () => {
  it("Field 안이면 Dropzone에 aria-describedby·aria-invalid가 연결된다", () => {
    render(
      <Field.Root>
        <Field.Label>대표 이미지</Field.Label>
        <FileInput.Root accept="image/png">
          <FileInput.Dropzone />
        </FileInput.Root>
        <Field.Description>PNG 파일만 업로드할 수 있습니다.</Field.Description>
        <Field.ErrorMessage>파일 형식이 올바르지 않습니다.</Field.ErrorMessage>
      </Field.Root>,
    );

    const zone = dropzone();
    const desc = screen.getByText("PNG 파일만 업로드할 수 있습니다.");
    const error = screen.getByText("파일 형식이 올바르지 않습니다.");

    expect(zone.getAttribute("aria-describedby")).toContain(desc.id);
    expect(zone.getAttribute("aria-describedby")).toContain(error.id);
    expect(zone.getAttribute("aria-invalid")).toBe("true");
  });

  it("name prop을 주면 hidden input에 name이 실린다", () => {
    render(
      <FileInput.Root name="cover">
        <FileInput.Dropzone />
      </FileInput.Root>,
    );

    const input = document.querySelector("input[type='file']") as HTMLInputElement;
    expect(input.name).toBe("cover");
  });
});
