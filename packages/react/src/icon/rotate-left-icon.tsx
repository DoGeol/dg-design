import * as React from "react";
import { IconBase, type IconProps } from "./icon-base";

export const RotateLeftIcon = React.forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <IconBase ref={ref} {...props}>
    <path d="M4 10a8 8 0 1 1 2 8" /><path d="M4 4v6h6" />
  </IconBase>
));

RotateLeftIcon.displayName = "RotateLeftIcon";
