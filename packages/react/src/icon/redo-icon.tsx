import * as React from "react";

import { IconBase, type IconProps } from "./icon-base";

export const RedoIcon = React.forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <IconBase ref={ref} {...props}>
    <path d="m16 13 4-4-4-4" />
    <path d="M20 9H9a5 5 0 0 0 0 10h4" />
  </IconBase>
));

RedoIcon.displayName = "RedoIcon";
