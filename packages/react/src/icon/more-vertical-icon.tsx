import * as React from "react";

import { IconBase, type IconProps } from "./icon-base";

export const MoreVerticalIcon = React.forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <IconBase ref={ref} fill="currentColor" stroke="none" strokeWidth={0} {...props}>
    <circle cx="12" cy="5.5" r="1.75" />
    <circle cx="12" cy="12" r="1.75" />
    <circle cx="12" cy="18.5" r="1.75" />
  </IconBase>
));

MoreVerticalIcon.displayName = "MoreVerticalIcon";
