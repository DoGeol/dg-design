import * as React from "react";

import { IconBase, type IconProps } from "./icon-base";

export const BellIcon = React.forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <IconBase ref={ref} {...props}>
    <path d="M6 10a6 6 0 0 1 12 0v4.5l1.5 2.5h-15L6 14.5Z" />
    <path d="M10 20a2 2 0 0 0 4 0" />
  </IconBase>
));

BellIcon.displayName = "BellIcon";
