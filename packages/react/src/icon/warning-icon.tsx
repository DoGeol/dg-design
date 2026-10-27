import * as React from "react";

import { IconBase, type IconProps } from "./icon-base";

export const WarningIcon = React.forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <IconBase ref={ref} {...props}>
    <path d="M12 3l9.84 17.04H2.16Z" />
    <path d="M12 9.6v4.2" />
    <circle cx="12" cy="16.8" r="1.08" fill="currentColor" stroke="none" />
  </IconBase>
));

WarningIcon.displayName = "WarningIcon";
