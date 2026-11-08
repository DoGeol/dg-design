import * as React from "react";
import { IconBase, type IconProps } from "./icon-base";

export const TextIcon = React.forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <IconBase ref={ref} {...props}>
    <path d="M4 7V4h16v3M12 4v16m-4 0h8" />
  </IconBase>
));

TextIcon.displayName = "TextIcon";
