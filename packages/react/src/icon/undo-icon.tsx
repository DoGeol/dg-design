import * as React from "react";

import { IconBase, type IconProps } from "./icon-base";

export const UndoIcon = React.forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <IconBase ref={ref} {...props}>
    <path d="M8 13 4 9l4-4" />
    <path d="M4 9h11a5 5 0 0 1 0 10h-4" />
  </IconBase>
));

UndoIcon.displayName = "UndoIcon";
