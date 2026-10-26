import * as React from "react";

import { IconBase, type IconProps } from "./icon-base";

export const CloseIcon = React.forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <IconBase ref={ref} {...props}>
    <path d="M18 6 6 18M6 6l12 12" />
  </IconBase>
));

CloseIcon.displayName = "CloseIcon";
