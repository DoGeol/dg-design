import * as React from "react";

import { IconBase, type IconProps } from "./icon-base";

export const ArrowRightIcon = React.forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <IconBase ref={ref} {...props}>
    <path d="M5 12h14" />
    <path d="m13 6 6 6-6 6" />
  </IconBase>
));

ArrowRightIcon.displayName = "ArrowRightIcon";
