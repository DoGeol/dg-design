import * as React from "react";

import { IconBase, type IconProps } from "./icon-base";

export const SearchIcon = React.forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <IconBase ref={ref} {...props}>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </IconBase>
));

SearchIcon.displayName = "SearchIcon";
