import * as React from "react";
import { IconBase, type IconProps } from "./icon-base";

export const ResizeIcon = React.forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <IconBase ref={ref} {...props}>
    <path d="M14 4h6v6M20 4l-6 6M4 14v6h6m-6 0 6-6" />
  </IconBase>
));

ResizeIcon.displayName = "ResizeIcon";
