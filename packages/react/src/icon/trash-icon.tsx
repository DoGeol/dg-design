import * as React from "react";

import { IconBase, type IconProps } from "./icon-base";

export const TrashIcon = React.forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <IconBase ref={ref} {...props}>
    <path d="M4 7h16" />
    <path d="M9.5 7V5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v2" />
    <path d="m6 7 1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12" />
    <path d="M10 11v6m4-6v6" />
  </IconBase>
));

TrashIcon.displayName = "TrashIcon";
