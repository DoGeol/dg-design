import * as React from "react";

import { IconBase, type IconProps } from "./icon-base";

export const ChevronDownIcon = React.forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <IconBase ref={ref} {...props}>
    <path d="m6 9 6 6 6-6" />
  </IconBase>
));

ChevronDownIcon.displayName = "ChevronDownIcon";
