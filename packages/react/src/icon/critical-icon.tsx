import * as React from "react";

import { IconBase, type IconProps } from "./icon-base";

export const CriticalIcon = React.forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <IconBase ref={ref} {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="m9 9 6 6m0-6-6 6" />
  </IconBase>
));

CriticalIcon.displayName = "CriticalIcon";
