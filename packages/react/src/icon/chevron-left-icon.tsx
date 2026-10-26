import * as React from "react";

import { IconBase, type IconProps } from "./icon-base";

export const ChevronLeftIcon = React.forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <IconBase ref={ref} {...props}>
    <path d="m15 18-6-6 6-6" />
  </IconBase>
));

ChevronLeftIcon.displayName = "ChevronLeftIcon";
