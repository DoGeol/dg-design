import * as React from "react";

import { IconBase, type IconProps } from "./icon-base";

/**
 * 메뉴 라디오 인디케이터용 비공개 채운 원 아이콘.
 * 공개 16종 세트에는 포함되지 않으며 Icon.ts에서 export하지 않는다.
 * r=4.5(24 grid)는 16px로 그릴 때 예전 16 grid의 r=3과 같은 지름 6px이 되도록 고른 값이다.
 */
export const DotIcon = React.forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <IconBase ref={ref} fill="currentColor" stroke="none" {...props}>
    <circle cx="12" cy="12" r="4.5" />
  </IconBase>
));

DotIcon.displayName = "DotIcon";
