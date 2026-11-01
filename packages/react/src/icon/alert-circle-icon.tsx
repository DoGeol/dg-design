import * as React from "react";

import { IconBase, type IconProps } from "./icon-base";

export const AlertCircleIcon = React.forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <IconBase ref={ref} {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7.8v5.4" />
    <circle cx="12" cy="16.44" r="1.08" fill="currentColor" stroke="none" />
  </IconBase>
));

AlertCircleIcon.displayName = "AlertCircleIcon";
