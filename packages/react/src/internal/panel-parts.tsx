import "./panel-parts.css";
import clsx from "clsx";
import * as React from "react";

/**
 * 작업형 패널 부품 — Dialog·Sheet Content 직속에 둔다. 하나라도 있으면 Content가 작업형 배치
 * (위 Toolbar · 가운데 Body|Aside · 아래 Footer, Body만 스크롤)로 바뀌고, 없으면 확인형 그대로다.
 * Dialog와 Sheet가 같은 클래스를 쓰고 이름만 각자 붙인다.
 */
export function createPanelParts(owner: string) {
  const Toolbar = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
    <div ref={ref} className={clsx("dds-panel__toolbar", className)} {...props} />
  ));
  Toolbar.displayName = `${owner}.Toolbar`;

  const Body = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
    <div ref={ref} className={clsx("dds-panel__body", className)} {...props} />
  ));
  Body.displayName = `${owner}.Body`;

  /** 판단 자료·활동 같은 보조 구역. 넓으면 Body 옆, 좁으면 Body 뒤에 온다. */
  const Aside = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(({ className, ...props }, ref) => (
    <aside ref={ref} className={clsx("dds-panel__aside", className)} {...props} />
  ));
  Aside.displayName = `${owner}.Aside`;

  /** 행동 줄. Body 열 아래에만 붙는다 — Aside 밑으로 이어지지 않는다. */
  const Footer = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
    <div ref={ref} className={clsx("dds-panel__footer", className)} {...props} />
  ));
  Footer.displayName = `${owner}.Footer`;

  return { Toolbar, Body, Aside, Footer };
}
