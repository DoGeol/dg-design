import * as React from "react";

import { IconBase, type IconProps } from "./icon-base";

export const MinusIcon = React.forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <IconBase ref={ref} {...props}>
    <path d="M5 12h14" />
  </IconBase>
));

MinusIcon.displayName = "MinusIcon";
