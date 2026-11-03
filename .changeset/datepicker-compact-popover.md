---
"@dg-design/react": patch
---

DatePicker·DateRangePicker 달력 팝오버가 데스크톱(마우스)에서 작아집니다. 날짜 칸과 이전·다음 버튼이 44px에서 32px, 요일 행이 32px에서 28px이 되고, 단일 팝오버 폭은 24rem에서 약 16rem(258px), 범위(두 달)는 43rem에서 약 31rem(498px)이 됩니다. 터치 기기(`@media (pointer: coarse)`)와 모바일 밀도에서는 `--dds-size-touch-target`(44px)을 그대로 따라 날짜 칸이 44px로 남고, 팝오버 폭도 칸 크기에 맞춰 같이 커집니다. 모바일 시트는 그대로입니다. API 변경 없는 시각 조정이라 patch입니다(부유 패널 테두리 변경과 같은 기준).

근거: `docs/decisions/2026-11-04-datepicker-compact-popover.md`
