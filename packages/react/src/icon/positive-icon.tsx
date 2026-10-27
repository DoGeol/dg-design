import * as React from "react";

import { IconBase, type IconProps } from "./icon-base";

export const PositiveIcon = React.forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <IconBase ref={ref} {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="m7.8 12.24 2.76 2.76 5.64-5.64" />
  </IconBase>
));

PositiveIcon.displayName = "PositiveIcon";
