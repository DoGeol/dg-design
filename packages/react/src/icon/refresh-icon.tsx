import * as React from "react";

import { IconBase, type IconProps } from "./icon-base";

export const RefreshIcon = React.forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <IconBase ref={ref} {...props}>
    <path d="M20 12a8 8 0 1 1-2.34-5.66L20 8.5" />
    <path d="M20 4v4.5h-4.5" />
  </IconBase>
));

RefreshIcon.displayName = "RefreshIcon";
