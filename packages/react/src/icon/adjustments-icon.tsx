import * as React from "react";
import { IconBase, type IconProps } from "./icon-base";

export const AdjustmentsIcon = React.forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <IconBase ref={ref} {...props}>
    <path d="M3 6h4m4 0h10M3 12h10m4 0h4M3 18h4m4 0h10" /><circle cx="9" cy="6" r="2" /><circle cx="15" cy="12" r="2" /><circle cx="9" cy="18" r="2" />
  </IconBase>
));

AdjustmentsIcon.displayName = "AdjustmentsIcon";
