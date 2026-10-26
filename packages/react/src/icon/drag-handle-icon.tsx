import * as React from "react";

import { IconBase, type IconProps } from "./icon-base";

export const DragHandleIcon = React.forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <IconBase ref={ref} fill="currentColor" stroke="none" strokeWidth={0} {...props}>
    <circle cx="9" cy="6" r="1.5" />
    <circle cx="15" cy="6" r="1.5" />
    <circle cx="9" cy="12" r="1.5" />
    <circle cx="15" cy="12" r="1.5" />
    <circle cx="9" cy="18" r="1.5" />
    <circle cx="15" cy="18" r="1.5" />
  </IconBase>
));

DragHandleIcon.displayName = "DragHandleIcon";
