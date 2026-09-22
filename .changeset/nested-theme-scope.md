---
"@dg-design/tokens": minor
---

중첩 테마 스코프: `tokens.css`와 `createTheme` 생성 CSS가 `[data-dds-theme="light"]` 블록을 추가로 내보낸다. 다크 블록이 재정의하는 semantic 색 47개 전부를 `:root`와 같은 라이트 값으로 담아, `<html data-dds-theme="dark">` 아래에서 `data-dds-theme="light"`를 붙인 영역이 더 이상 다크 값을 상속하지 않는다. 다크 안의 라이트, 라이트 안의 다크, 여러 겹 중첩 모두 가장 가까운 조상을 따른다. `:root` 기본값은 그대로다.

Tailwind 브릿지(`tailwind.css`)는 `@theme` 대신 `@theme inline`으로 방출한다. 일반 `@theme`은 유틸이 `:root`에서 해석된 `--color-*`를 참조해 스코프를 무시했다(실측: 다크 루트 아래 라이트 영역의 `bg-bg-layer-default`가 다크). 이제 유틸이 `var(--dds-color-*)`를 직접 쓴다. 유틸 이름과 결과 값은 같고, 앱 CSS에서 `var(--color-*)`를 직접 참조하는 경우만 여전히 루트 모드 값을 받는다.

minor인 이유: 새 공개 셀렉터(`data-dds-theme="light"`의 스코프 의미)가 생기는 기능 추가다. 기존 출력에서 지워진 것은 없다.
