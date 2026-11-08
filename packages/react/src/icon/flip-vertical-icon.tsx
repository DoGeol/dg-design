import * as React from "react";
import { IconBase, type IconProps } from "./icon-base";

export const FlipVerticalIcon = React.forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <IconBase ref={ref} {...props}>
    <path d="M3 12h2m4 0h2m4 0h2m4 0h0M7 3l5 5 5-5H7Zm0 18 5-5 5 5H7Z" />
  </IconBase>
));

FlipVerticalIcon.displayName = "FlipVerticalIcon";
