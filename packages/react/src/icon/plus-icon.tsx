import * as React from "react";

import { IconBase, type IconProps } from "./icon-base";

export const PlusIcon = React.forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <IconBase ref={ref} {...props}>
    <path d="M12 5v14M5 12h14" />
  </IconBase>
));

PlusIcon.displayName = "PlusIcon";
