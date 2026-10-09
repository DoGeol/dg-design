import { Avatar } from "@dg-design/react";

/** forms 시안 공용 조각 — 사람 데이터·행 내용·아이콘. 스토리 파일이 아니라 Storybook 목록에 안 잡힌다. */

export const PEOPLE = [
  { id: "kim", name: "김서윤", dept: "디자인시스템" },
  { id: "pyeon", name: "편도걸", dept: "프론트엔드" },
  { id: "lee", name: "이하준", dept: "제품 디자인" },
  { id: "park", name: "박지아", dept: "인사" },
  { id: "choi", name: "최민재", dept: "데이터" },
] as const;

export type PersonId = (typeof PEOPLE)[number]["id"];

export const personName = (id: string | undefined) => PEOPLE.find((p) => p.id === id)?.name;

/** 사람 옵션 행 내용 — leading 아바타, 이름, 약한 소속. 이름만 접근 이름에 남도록 아바타는 숨긴다. */
export function Person({ name, dept }: { name: string; dept: string }) {
  return (
    <span className="fx-person">
      <Avatar.Root size="small" aria-hidden="true">
        <Avatar.Fallback>{name.slice(0, 1)}</Avatar.Fallback>
      </Avatar.Root>
      <span className="fx-person-name">{name}</span>
      <span className="fx-person-meta">{dept}</span>
    </span>
  );
}

const icon = { viewBox: "0 0 16 16", fill: "none", "aria-hidden": true } as const;
const line = { stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export function SearchIcon() {
  return (
    <svg {...icon} width="16" height="16">
      <circle cx="7" cy="7" r="4.5" {...line} />
      <path d="M10.5 10.5L14 14" {...line} />
    </svg>
  );
}

export function FileIcon() {
  return (
    <svg {...icon} width="20" height="20">
      <path d="M9 1.75H4.5A1.25 1.25 0 0 0 3.25 3v10a1.25 1.25 0 0 0 1.25 1.25h7A1.25 1.25 0 0 0 12.75 13V5.5L9 1.75z" {...line} />
      <path d="M9 1.75V5.5h3.75" {...line} />
    </svg>
  );
}

export function UploadIcon() {
  return (
    <svg {...icon} width="24" height="24">
      <path d="M8 10.5V2.5M5 5.5l3-3 3 3M2.5 10.5v2a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1v-2" {...line} />
    </svg>
  );
}
