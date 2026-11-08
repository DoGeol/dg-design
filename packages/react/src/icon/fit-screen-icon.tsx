import * as React from "react";
import { IconBase, type IconProps } from "./icon-base";

export const FitScreenIcon = React.forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <IconBase ref={ref} {...props}>
    <path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5" /><rect x="7" y="7" width="10" height="10" rx="1" />
  </IconBase>
));

FitScreenIcon.displayName = "FitScreenIcon";
