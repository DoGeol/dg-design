import * as React from "react";

import { IconBase, type IconProps } from "./icon-base";

export const CheckIcon = React.forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <IconBase ref={ref} {...props}>
    <path d="M20 6 9 17l-5-5" />
  </IconBase>
));

CheckIcon.displayName = "CheckIcon";
