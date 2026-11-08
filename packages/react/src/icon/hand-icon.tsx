import * as React from "react";
import { IconBase, type IconProps } from "./icon-base";

export const HandIcon = React.forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <IconBase ref={ref} {...props}>
    <path d="M7 12V7a2 2 0 0 1 4 0v5-7a2 2 0 0 1 4 0v7-5a2 2 0 0 1 4 0v5-2a2 2 0 0 1 4 0v5a7 7 0 0 1-7 7h-2a7 7 0 0 1-5-2l-5-5a2 2 0 0 1 3-3l2 2" transform="translate(-1 0)" />
  </IconBase>
));

HandIcon.displayName = "HandIcon";
