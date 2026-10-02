import type { Meta, StoryObj } from "@storybook/react-vite";
import { Field, Select } from "@dg-design/react";

import { MockupPage, MockupSection, MockupSpec, MockupState } from "../MockupKit";
import "./overrides.css";

const meta = { title: "Mockups/A/Select", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;

/** 옵션은 엘리먼트 상수로 둔다 — 닫힌 상태의 라벨 스캔은 사용자 컴포넌트 안까지 들어가지 않는다. */
const roleOptions = (
  <>
    <Select.Option value="owner">소유자</Select.Option>
    <Select.Option value="admin">관리자</Select.Option>
    <Select.Option value="editor">편집자</Select.Option>
    <Select.Option value="viewer">보기 전용</Select.Option>
  </>
);

function Role({ defaultValue, size, disabled }: { defaultValue?: string; size?: "medium" | "large"; disabled?: boolean }) {
  return (
    <div style={{ width: "100%" }}>
      <Select.Root defaultValue={defaultValue}>
        <Select.Trigger size={size} placeholder="권한을 선택하십시오" disabled={disabled} />
        <Select.Content>{roleOptions}</Select.Content>
      </Select.Root>
    </div>
  );
}

export const Overview: StoryObj = {
  render: () => (
    <MockupPage title="Select" summary="목록에서 값 하나를 고릅니다. 트리거는 TextField와 같은 높이·radius·테두리를 쓰고, 목록은 부유 패널(radius 12)로 열립니다.">
      <MockupSection title="값" note="값이 없으면 placeholder를 비활성 글자색으로 보입니다.">
        <MockupState label="empty · placeholder"><Role /></MockupState>
        <MockupState label="selected"><Role defaultValue="editor" /></MockupState>
        <MockupState label="긴 값 · 말줄임">
          <div style={{ width: 200 }}>
            <Select.Root defaultValue="long">
              <Select.Trigger />
              <Select.Content><Select.Option value="long">서울특별시 강남구 테헤란로 지점</Select.Option></Select.Content>
            </Select.Root>
          </div>
        </MockupState>
      </MockupSection>

      <MockupSection title="상태" columns={5} note="medium 기준입니다. 트리거에는 pressed 표현이 없습니다.">
        <MockupState label="default"><Role defaultValue="editor" /></MockupState>
        <MockupState label="hover" force="hover"><Role defaultValue="editor" /></MockupState>
        <MockupState label="focus" force="focus"><Role defaultValue="editor" /></MockupState>
        <MockupState label="disabled"><Role defaultValue="editor" disabled /></MockupState>
        <MockupState label="error">
          <div style={{ width: "100%" }}>
            <Field.Root>
              <Select.Root>
                <Select.Trigger placeholder="권한을 선택하십시오" />
                <Select.Content>{roleOptions}</Select.Content>
              </Select.Root>
              <Field.ErrorMessage>권한을 선택하십시오.</Field.ErrorMessage>
            </Field.Root>
          </div>
        </MockupState>
      </MockupSection>

      <MockupSection title="크기" columns={2} note="입력류에는 small(36)이 없습니다.">
        <MockupState label="medium · 40"><Role defaultValue="admin" size="medium" /></MockupState>
        <MockupState label="large · 52"><Role defaultValue="admin" size="large" /></MockupState>
      </MockupSection>

      <MockupSection title="사용 예" columns={1}>
        <MockupState label="멤버 초대 폼 · Field 조합">
          <div style={{ display: "flex", flexDirection: "column", gap: 20, width: 360 }}>
            <Field.Root>
              <Field.Label>권한</Field.Label>
              <Select.Root defaultValue="editor">
                <Select.Trigger placeholder="권한을 선택하십시오" />
                <Select.Content>{roleOptions}</Select.Content>
              </Select.Root>
              <Field.Description>편집자는 문서를 고칠 수 있지만 멤버를 초대할 수 없습니다.</Field.Description>
            </Field.Root>
            <Field.Root>
              <Field.Label>알림 주기</Field.Label>
              <Select.Root defaultValue="daily">
                <Select.Trigger />
                <Select.Content>
                  <Select.Option value="instant">즉시</Select.Option>
                  <Select.Option value="daily">하루 한 번</Select.Option>
                  <Select.Option value="weekly">일주일 한 번</Select.Option>
                </Select.Content>
              </Select.Root>
            </Field.Root>
          </div>
        </MockupState>
      </MockupSection>

      <MockupSpec rows={[
        ["트리거 높이 medium / large", "40 / 52px", "--dds-dimension-x10 / x13"],
        ["트리거 radius medium / large", "8 / 12px", "--dds-radius-r2 / r3"],
        ["트리거 좌우 패딩 medium / large", "12 / 16px", "--dds-dimension-x3 / x4"],
        ["트리거 글자 medium / large", "14px·19px / 18px·24px · regular", "--dds-font-size-t4 / t6, --dds-line-height-t4 / t6"],
        ["트리거 테두리", "2px #6D6F72 · hover #252629", "--dds-dimension-x0_5, --dds-color-stroke-neutral / fg-neutral"],
        ["트리거 배경 / 글자", "#FFFFFF / #252629", "--dds-color-bg-layer-default / fg-neutral"],
        ["placeholder", "#8A8C8F", "--dds-color-fg-disabled"],
        ["값과 캐럿 간격 · 캐럿", "8px · 16px stroke 1.5, 열리면 180° 회전", "--dds-dimension-x2"],
        ["focus ring", "2px #1550A9 outline, offset 2px", "--dds-color-stroke-focus-ring"],
        ["error 테두리", "#C7272D", "--dds-color-stroke-critical"],
        ["disabled", "배경 #E5E8EB · 글자 #8A8C8F · 테두리 #6D6F72", "--dds-color-bg-disabled / fg-disabled / stroke-neutral"],
        ["목록 패널", "radius 12px(A 보정, 현재 8) · 패딩 4px · 최소 폭 12rem 또는 트리거 폭", "--dds-radius-r3, --dds-dimension-x1"],
        ["목록 그림자", "0 12px 32px rgba(15,15,15,.18), 0 4px 8px rgba(15,15,15,.08)", "--dds-shadow-overlay"],
        ["옵션", "최소 높이 32px · 패딩 6px 8px · radius 6px · 14px", "--dds-dimension-x8, x1_5 / x2, --dds-radius-r1_5"],
        ["옵션 hover / pressed", "rgb(16 18 20 / .06) / rgb(16 18 20 / .12)", "--dds-color-bg-transparent-hover / -pressed"],
        ["옵션 체크", "16px, 선택 시에만 보임(자리는 항상 차지)", "—"],
        ["그룹 라벨", "12px bold #6D6F72 · 패딩 6px 8px", "--dds-font-size-t2, --dds-color-fg-neutral-weak"],
      ]} />
    </MockupPage>
  ),
};

export const Open: StoryObj = {
  render: () => (
    <MockupPage title="Select · 열린 목록" summary="그룹 라벨, 선택된 옵션(체크), 비활성 옵션을 함께 보입니다. 열리면 선택된 옵션으로 포커스가 들어갑니다.">
      <MockupSection title="열린 상태" columns={1}>
        <MockupState label="open · 경기도 선택됨 · 울산광역시 비활성" minHeight={420}>
          <div style={{ width: 320, alignSelf: "flex-start" }}>
            <Select.Root open defaultValue="gyeonggi">
              <Select.Trigger placeholder="지역을 선택하십시오" />
              <Select.Content>
                <Select.Group>
                  <Select.Label>수도권</Select.Label>
                  <Select.Option value="seoul">서울특별시</Select.Option>
                  <Select.Option value="gyeonggi">경기도</Select.Option>
                  <Select.Option value="incheon">인천광역시</Select.Option>
                </Select.Group>
                <Select.Group>
                  <Select.Label>영남권</Select.Label>
                  <Select.Option value="busan">부산광역시</Select.Option>
                  <Select.Option value="daegu">대구광역시</Select.Option>
                  <Select.Option value="ulsan" disabled>울산광역시 (준비 중)</Select.Option>
                </Select.Group>
              </Select.Content>
            </Select.Root>
          </div>
        </MockupState>
      </MockupSection>
    </MockupPage>
  ),
};
