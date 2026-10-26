import * as React from "react";

import { IconBase, type IconProps } from "./icon-base";

export const MenuIcon = React.forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <IconBase ref={ref} {...props}>
    <path d="M4 6h16M4 12h16M4 18h16" />
  </IconBase>
));

MenuIcon.displayName = "MenuIcon";
