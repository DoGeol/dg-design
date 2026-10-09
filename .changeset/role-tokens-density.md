---
"@dg-design/tokens": minor
---

역할 토큰 30개와 모바일 밀도를 추가합니다. `--dds-space-*`(페이지·필드·묶음 간격, 패널·입력·Sheet·탭 여백), `--dds-size-*`(필드·CTA·옵션·메뉴 항목·Chip·탭·표 행 높이, 조작 영역, mark), 역할 radius(`--dds-radius-field`·`button`·`select-panel`·`option`·`menu`·`menu-item`·`chip`·`sheet`), `--dds-font-size-field`·`body`, `--dds-line-height-body`입니다. `<html data-dds-density="mobile">`이면 모바일 값으로 바뀝니다. 컴포넌트는 아직 이 토큰을 읽지 않아 화면은 그대로입니다.

Tailwind 브릿지에 역할 토큰(`gap-field-gap`, `h-field-height`, `rounded-field`, `text-body` 등)과 `duration-fast`·`duration-base`, `z-overlay`·`z-toast`를 추가합니다. 이전 브릿지는 duration·z-index 네임스페이스 이름을 잘못 알아 이 둘을 빼 두었습니다.
