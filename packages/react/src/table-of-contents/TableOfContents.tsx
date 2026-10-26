import "./table-of-contents.css";

import clsx from "clsx";
import * as React from "react";

import { Collapsible } from "../collapsible/Collapsible";
import { ChevronDownIcon } from "../icon/chevron-down-icon";
import { useControllableState } from "../internal/use-controllable-state";
import {
  useTableOfContentsActiveId,
  type UseTableOfContentsActiveIdOptions,
} from "./use-table-of-contents-active-id";

export { useTableOfContentsActiveId, type UseTableOfContentsActiveIdOptions };

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

export interface TableOfContentsItem {
  /** 문서 내 대상 요소의 id (# 제외) */
  id: string;
  /** 목차에 표시할 텍스트 라벨 */
  label: string;
  /** 문서 내 상대적 깊이 (1~6) */
  depth: 1 | 2 | 3 | 4 | 5 | 6;
}

export interface TableOfContentsBaseProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "children"> {
  /** 목차 항목 목록 */
  items: readonly TableOfContentsItem[];
  /** 목차의 접근 가능한 이름(aria-label) 및 제목/접기 버튼 문구 */
  label: string;
  /** 현재 활성화된 항목의 id. 일치하는 항목에 aria-current="location"이 부여됩니다. */
  activeId?: string | null;
}

export interface TableOfContentsInlineProps extends TableOfContentsBaseProps {
  /** inline 목차. 펼침 상태를 항상 유지합니다. */
  variant?: "inline";
  open?: never;
  defaultOpen?: never;
  onOpenChange?: never;
}

export interface TableOfContentsCollapsibleProps
  extends TableOfContentsBaseProps {
  /** collapsible 목차. 접기/펼치기 가능한 구조를 가집니다. */
  variant: "collapsible";
  /** 제어형 열림 상태 */
  open?: boolean;
  /** 비제어형 기본 열림 상태 (기본 false) */
  defaultOpen?: boolean;
  /** 열림 상태 변경 콜백 */
  onOpenChange?: (open: boolean) => void;
}

export type TableOfContentsProps =
  | TableOfContentsInlineProps
  | TableOfContentsCollapsibleProps;

interface NormalizedItem extends Omit<TableOfContentsItem, "depth"> {
  depth: number;
}

interface TocTreeNode {
  item: NormalizedItem;
  children: TocTreeNode[];
}

function processItems(rawItems: readonly TableOfContentsItem[] | undefined): {
  valid: boolean;
  tree: TocTreeNode[];
} {
  if (!rawItems || rawItems.length === 0) {
    return { valid: false, tree: [] };
  }

  const seenIds = new Set<string>();
  const validItems: TableOfContentsItem[] = [];

  for (const item of rawItems) {
    const id = typeof item?.id === "string" ? item.id.trim() : "";
    const label = typeof item?.label === "string" ? item.label.trim() : "";

    if (!id || !label) {
      console.warn(
        `[TableOfContents] 항목의 id 또는 label이 비어 있어 제외되었습니다: id="${item?.id}", label="${item?.label}"`,
      );
      continue;
    }

    if (seenIds.has(id)) {
      console.warn(
        `[TableOfContents] 중복된 id("${id}")가 감지되어 첫 번째 항목만 유지됩니다.`,
      );
      continue;
    }

    seenIds.add(id);
    validItems.push({
      ...item,
      id,
      label,
    });
  }

  const firstValid = validItems[0];
  if (!firstValid || validItems.length === 0) {
    return { valid: false, tree: [] };
  }

  // depth 정규화:
  // 첫 항목 depth가 1이 아니면 1로 정규화한다.
  // 앞 항목보다 2단계 이상 깊으면 1단계만 내려간다.
  const normalizedItems: NormalizedItem[] = [];
  const depthShift = firstValid.depth - 1;

  for (let i = 0; i < validItems.length; i++) {
    const item = validItems[i];
    if (!item) continue;
    let depth: number;

    if (i === 0) {
      depth = 1;
    } else {
      const prev = normalizedItems[i - 1];
      const prevDepth = prev ? prev.depth : 1;
      const targetDepth = Math.max(1, item.depth - depthShift);
      if (targetDepth > prevDepth + 1) {
        depth = prevDepth + 1;
      } else {
        depth = targetDepth;
      }
    }

    normalizedItems.push({
      ...item,
      depth,
    });
  }

  // 중첩 ol/li 트리 구축
  const tree: TocTreeNode[] = [];
  const stack: { node: TocTreeNode; depth: number }[] = [];

  for (const item of normalizedItems) {
    const newNode: TocTreeNode = { item, children: [] };
    while (
      stack.length > 0 &&
      stack[stack.length - 1] &&
      (stack[stack.length - 1]?.depth ?? 0) >= item.depth
    ) {
      stack.pop();
    }
    const parent = stack[stack.length - 1];
    if (!parent) {
      tree.push(newNode);
    } else {
      parent.node.children.push(newNode);
    }
    stack.push({ node: newNode, depth: item.depth });
  }

  return { valid: true, tree };
}

function renderTocTree(
  nodes: readonly TocTreeNode[],
  activeId: string | null | undefined,
): React.ReactNode {
  if (nodes.length === 0) return null;

  return (
    <ol className="dds-table-of-contents__list">
      {nodes.map((node) => {
        const isActive = activeId != null && activeId === node.item.id;
        return (
          <li
            key={node.item.id}
            className="dds-table-of-contents__item"
            data-depth={node.item.depth}
          >
            <a
              href={`#${encodeURIComponent(node.item.id)}`}
              className="dds-table-of-contents__link"
              aria-current={isActive ? "location" : undefined}
            >
              {node.item.label}
            </a>
            {node.children.length > 0
              ? renderTocTree(node.children, activeId)
              : null}
          </li>
        );
      })}
    </ol>
  );
}

interface CollapsibleContentWrapperProps
  extends Omit<TableOfContentsCollapsibleProps, "variant"> {
  tree: readonly TocTreeNode[];
}

const CollapsibleNav = React.forwardRef<HTMLElement, CollapsibleContentWrapperProps>(
  (props, ref) => {
    const {
      label,
      activeId,
      className,
      items: _items,
      open: openProp,
      defaultOpen = false,
      onOpenChange,
      ...rest
    } = props;

    const [open, setOpen] = useControllableState({
      value: openProp,
      controlled: "open" in props,
      defaultValue: defaultOpen,
      onChange: onOpenChange,
    });

    const triggerRef = React.useRef<HTMLButtonElement>(null);
    const contentRef = React.useRef<HTMLDivElement>(null);
    const prevOpenRef = React.useRef(open);

    // 프로그램적으로 접힐 때 초점이 내용 안에 있으면 트리거로 복귀
    useIsomorphicLayoutEffect(() => {
      if (prevOpenRef.current && !open) {
        if (
          contentRef.current &&
          contentRef.current.contains(document.activeElement)
        ) {
          triggerRef.current?.focus();
        }
      }
      prevOpenRef.current = open;
    }, [open]);

    return (
      <nav
        {...rest}
        ref={ref}
        aria-label={label}
        className={clsx(
          "dds-table-of-contents",
          "dds-table-of-contents--collapsible",
          className,
        )}
      >
        <Collapsible.Root open={open} onOpenChange={setOpen}>
          <Collapsible.Trigger
            ref={triggerRef}
            className="dds-table-of-contents__trigger"
          >
            <span className="dds-table-of-contents__trigger-label">{label}</span>
            <ChevronDownIcon
              aria-hidden="true"
              className="dds-table-of-contents__chevron"
            />
          </Collapsible.Trigger>
          <Collapsible.Content
            ref={contentRef}
            className="dds-table-of-contents__content"
          >
            {renderTocTree(props.tree, activeId)}
          </Collapsible.Content>
        </Collapsible.Root>
      </nav>
    );
  },
);
CollapsibleNav.displayName = "TableOfContents.CollapsibleNav";

export const TableOfContents = React.forwardRef<
  HTMLElement,
  TableOfContentsProps
>((props, ref) => {
  const { items, label, activeId, variant = "inline", className, ...rest } =
    props;

  const { valid, tree } = React.useMemo(() => processItems(items), [items]);

  // 유효 항목이 0개거나 label이 비어있으면 null 렌더 (빈 nav·접기 버튼을 만들지 않는다)
  if (!valid || !label || !label.trim()) {
    return null;
  }

  if (variant === "collapsible") {
    return (
      <CollapsibleNav
        {...(rest as TableOfContentsCollapsibleProps)}
        ref={ref}
        className={className}
        items={items}
        label={label}
        activeId={activeId}
        tree={tree}
      />
    );
  }

  return (
    <nav
      {...rest}
      ref={ref}
      aria-label={label}
      className={clsx(
        "dds-table-of-contents",
        "dds-table-of-contents--inline",
        className,
      )}
    >
      <p className="dds-table-of-contents__title">{label}</p>
      {renderTocTree(tree, activeId)}
    </nav>
  );
});

TableOfContents.displayName = "TableOfContents";
