import * as React from "react";

import { IconBase, type IconProps } from "./icon-base";

export const EyeIcon = React.forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <IconBase ref={ref} {...props}>
    <path d="M2.5 12C4.5 8 8 5.5 12 5.5s7.5 2.5 9.5 6.5c-2 4-5.5 6.5-9.5 6.5S4.5 16 2.5 12Z" />
    <circle cx="12" cy="12" r="3" />
  </IconBase>
));

EyeIcon.displayName = "EyeIcon";
