import * as React from "react";

import { IconBase, type IconProps } from "./icon-base";

export const PanelLeftIcon = React.forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <IconBase ref={ref} {...props}>
    <rect x="3.5" y="4.5" width="17" height="15" rx="2" />
    <path d="M9.5 4.5v15" />
  </IconBase>
));

PanelLeftIcon.displayName = "PanelLeftIcon";
