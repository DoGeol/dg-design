import * as React from "react";

import { IconBase, type IconProps } from "./icon-base";

export const ChevronRightIcon = React.forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <IconBase ref={ref} {...props}>
    <path d="m9 18 6-6-6-6" />
  </IconBase>
));

ChevronRightIcon.displayName = "ChevronRightIcon";
