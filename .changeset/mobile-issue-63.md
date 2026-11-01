---
"@dg-design/tokens": minor
"@dg-design/react": minor
---

dg-studio에서 모은 모바일·토큰 문제를 고칩니다.

- **tokens**: 터치 기기(`@media (pointer: coarse)`)에서는 `data-dds-density="mobile"` 없이도 `--dds-size-touch-target`이 44px입니다. 다른 역할 토큰은 바뀌지 않아 데스크톱 폼 높이는 그대로입니다. 이 토큰을 직접 읽는 라벨 없는 Checkbox·Switch, Slider, Pagination, Collapsible이 터치 기기에서 44px이 되고, 밀도에 묶인 조작 영역 확장(Button xsmall·ToggleGroup·CopyButton·Chip·Tabs 등)은 계속 밀도 전용입니다. `createTheme` 출력도 같습니다.
- **TableOfContents**: collapsible 트리거 최소 높이가 밀도와 관계없이 44px입니다(이전 40px).
- **CopyButton**: 40rem 이하 화면에서 높이가 44px입니다. 데스크톱은 32px 그대로입니다.
- **CodeBlock**: 코드 글자를 12px(t2)에서 13px(t3)로 키웠습니다. 파일명과 CopyButton이 정의되지 않은 `--dds-font-weight-medium`을 참조해 기본 굵기로 떨어지던 것을 `--dds-font-weight-bold`로 고쳤습니다.
- **ToggleGroup**: `wrap` prop을 추가했습니다. horizontal에서 `wrap`이면 넘치는 항목이 가로 스크롤 대신 다음 줄로 갑니다. 기본값은 `false`(지금처럼 가로 스크롤)입니다.
