import "./card.css";

import { Slot } from "@radix-ui/react-slot";
import clsx from "clsx";
import * as React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    return <Comp ref={ref} className={clsx("dds-card", className)} {...props} />;
  },
);
Card.displayName = "Card";
