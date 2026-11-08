import * as React from "react";
import { IconBase, type IconProps } from "./icon-base";

export const RotateRightIcon = React.forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <IconBase ref={ref} {...props}>
    <path d="M20 10a8 8 0 1 0-2 8" /><path d="M20 4v6h-6" />
  </IconBase>
));

RotateRightIcon.displayName = "RotateRightIcon";
