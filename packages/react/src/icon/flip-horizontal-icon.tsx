import * as React from "react";
import { IconBase, type IconProps } from "./icon-base";

export const FlipHorizontalIcon = React.forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <IconBase ref={ref} {...props}>
    <path d="M12 3v2m0 4v2m0 4v2m0 4v0M3 7l5 5-5 5V7Zm18 0-5 5 5 5V7Z" />
  </IconBase>
));

FlipHorizontalIcon.displayName = "FlipHorizontalIcon";
