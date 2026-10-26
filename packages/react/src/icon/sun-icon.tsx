import * as React from "react";

import { IconBase, type IconProps } from "./icon-base";

export const SunIcon = React.forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <IconBase ref={ref} {...props}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4m11.4-11.4 1.4-1.4" />
  </IconBase>
));

SunIcon.displayName = "SunIcon";
