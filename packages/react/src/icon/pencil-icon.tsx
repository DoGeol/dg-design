import * as React from "react";

import { IconBase, type IconProps } from "./icon-base";

export const PencilIcon = React.forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <IconBase ref={ref} {...props}>
    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8.5 17.5 4 19l1.5-4.5Z" />
    <path d="m14.5 5.5 3 3" />
  </IconBase>
));

PencilIcon.displayName = "PencilIcon";
