import type * as React from "react";

export { CopyIcon, DownloadIcon, EditIcon, FileIcon, FilterIcon, LinkIcon, MoreIcon, TrashIcon } from "../../c-overlay/icons";

/** c-overlay/icons와 같은 규격(24 그리드, 1.75 stroke). 장식이라 aria-hidden. */
function Icon({ size = 16, children }: { size?: number; children: React.ReactNode }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0 }}>
      {children}
    </svg>
  );
}

type P = { size?: number };

export const ChevronRightIcon = (p: P) => <Icon {...p}><path d="m9 6 6 6-6 6" /></Icon>;
export const ChevronLeftIcon = (p: P) => <Icon {...p}><path d="m15 6-6 6 6 6" /></Icon>;
export const ChevronDownIcon = (p: P) => <Icon {...p}><path d="m6 9 6 6 6-6" /></Icon>;
export const ArrowLeftIcon = (p: P) => <Icon {...p}><path d="M19 12H5" /><path d="m11 6-6 6 6 6" /></Icon>;
export const CheckIcon = (p: P) => <Icon {...p}><path d="m5 12.5 4.5 4.5L19 7.5" /></Icon>;
export const SearchIcon = (p: P) => <Icon {...p}><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4 4" /></Icon>;
export const PlusIcon = (p: P) => <Icon {...p}><path d="M12 5v14M5 12h14" /></Icon>;
export const FolderIcon = (p: P) => <Icon {...p}><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></Icon>;
