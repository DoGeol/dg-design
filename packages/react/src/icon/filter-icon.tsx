import * as React from "react";
import { IconBase, type IconProps } from "./icon-base";

export const FilterIcon = React.forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <IconBase ref={ref} {...props}>
    <circle cx="9" cy="9" r="5" /><circle cx="15" cy="9" r="5" /><circle cx="12" cy="15" r="5" />
  </IconBase>
));

FilterIcon.displayName = "FilterIcon";
