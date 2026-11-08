import * as React from "react";
import { IconBase, type IconProps } from "./icon-base";

export const CropIcon = React.forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <IconBase ref={ref} {...props}>
    <path d="M7 3v12a2 2 0 0 0 2 2h12M3 7h12a2 2 0 0 1 2 2v12" />
  </IconBase>
));

CropIcon.displayName = "CropIcon";
