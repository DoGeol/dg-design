import * as React from "react";

import { IconBase, type IconProps } from "./icon-base";

export const LockIcon = React.forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <IconBase ref={ref} {...props}>
    <rect x="5" y="11" width="14" height="10" rx="2" />
    <path d="M8 11V7.5a4 4 0 0 1 8 0V11" />
    <path d="M12 15v2" />
  </IconBase>
));

LockIcon.displayName = "LockIcon";
