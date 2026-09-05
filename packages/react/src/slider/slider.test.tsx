import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it } from "vitest";

import { Field } from "../field/Field";
import { Slider } from "./Slider";

describe("Slider", () => {
  it("기본 렌더 시 type='range'와 medium 사이즈 클래스를 갖는다", () => {
    render(<Slider aria-label="볼륨" />);

    const slider = screen.getByRole("slider");
    expect(slider.getAttribute("type")).toBe("range");
    expect(slider.classList.contains("dds-slider")).toBe(true);
    expect(slider.classList.contains("dds-slider--size_medium")).toBe(true);
  });

  it("size='small'이면 small 클래스를 갖는다", () => {
    render(<Slider size="small" aria-label="볼륨" />);

    const slider = screen.getByRole("slider");
    expect(slider.classList.contains("dds-slider--size_small")).toBe(true);
  });

  it("controlled 모드에서 value에 따라 --dds-slider-fill CSS 변수가 계산된다", () => {
    const { rerender } = render(<Slider value={25} min={0} max={100} aria-label="볼륨" />);

    const slider = screen.getByRole("slider") as HTMLInputElement;
    expect(slider.style.getPropertyValue("--dds-slider-fill")).toBe("25%");

    rerender(<Slider value={80} min={0} max={100} aria-label="볼륨" />);
    expect(slider.style.getPropertyValue("--dds-slider-fill")).toBe("80%");
  });

  it("min과 max 범위에 맞게 fill 비율이 계산된다", () => {
    render(<Slider value={150} min={100} max={200} aria-label="볼륨" />);

    const slider = screen.getByRole("slider") as HTMLInputElement;
    expect(slider.style.getPropertyValue("--dds-slider-fill")).toBe("50%");
  });

  it("uncontrolled 모드에서 onInput이 발생하면 fill 변수가 갱신된다", () => {
    render(<Slider defaultValue={10} min={0} max={100} aria-label="볼륨" />);

    const slider = screen.getByRole("slider") as HTMLInputElement;
    expect(slider.style.getPropertyValue("--dds-slider-fill")).toBe("10%");

    // React 16+ input value tracking 우회
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      "value",
    )?.set;
    nativeInputValueSetter?.call(slider, "60");
    slider.dispatchEvent(new Event("input", { bubbles: true }));

    expect(slider.style.getPropertyValue("--dds-slider-fill")).toBe("60%");
  });

  it("disabled일 때 input이 비활성화된다", async () => {
    const user = userEvent.setup();
    let clicked = false;
    render(
      <Slider
        disabled
        aria-label="볼륨"
        onClick={() => {
          clicked = true;
        }}
      />,
    );

    const slider = screen.getByRole("slider") as HTMLInputElement;
    expect(slider.disabled).toBe(true);

    await user.click(slider);
    expect(clicked).toBe(false);
  });

  it("Field와 연동되어 id, aria-describedby, aria-invalid가 자동 연결된다", async () => {
    const user = userEvent.setup();
    render(
      <Field.Root>
        <Field.Label>불투명도</Field.Label>
        <Slider />
        <Field.Description>0에서 100 사이로 조절하세요.</Field.Description>
        <Field.ErrorMessage>유효하지 않은 값입니다.</Field.ErrorMessage>
      </Field.Root>,
    );

    const slider = screen.getByRole("slider");
    const label = screen.getByText("불투명도");
    const desc = screen.getByText("0에서 100 사이로 조절하세요.");
    const error = screen.getByText("유효하지 않은 값입니다.");

    expect(slider.getAttribute("aria-describedby")).toContain(desc.id);
    expect(slider.getAttribute("aria-describedby")).toContain(error.id);
    expect(slider.getAttribute("aria-invalid")).toBe("true");

    await user.click(label);
    expect(document.activeElement).toBe(slider);
  });
});
