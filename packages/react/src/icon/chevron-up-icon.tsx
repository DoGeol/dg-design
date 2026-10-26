import * as React from "react";

import { IconBase, type IconProps } from "./icon-base";

export const ChevronUpIcon = React.forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <IconBase ref={ref} {...props}>
    <path d="m6 15 6-6 6 6" />
  </IconBase>
));

ChevronUpIcon.displayName = "ChevronUpIcon";
