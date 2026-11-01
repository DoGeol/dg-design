# 터치 기기 touch-target 폴백 결정

- 날짜: 2026-11-01
- 근거: [flex 적용 방향](./2026-10-09-flex-adoption-direction.md) "P1 역할 토큰·밀도"의 `touch-target` 항목(데스크톱 24 · 모바일 44, 루트 밀도 기준)
- 계기: [#63](https://github.com/DoGeol/dg-design/issues/63). dg-studio가 375px에서 확인한 결과, 44px 조작 영역이 전부 `[data-dds-density="mobile"]`에 묶여 있어 밀도 없이 쓰면 `--dds-size-touch-target`이 24px이었다. dg-studio는 전역 밀도를 켜지 않는다 — 밀도는 입력·버튼·옵션 같은 데스크톱 폼 높이까지 바꾸기 때문이다(dg-studio 2026-10-27 결정).
- 상태: 활성 · flex 적용 방향의 P1 `touch-target` 항목을 개정

## 결정

tokens.css(와 `createTheme` 출력)에 아래 블록을 더한다.

```css
@media (pointer: coarse) {
  :root {
    --dds-size-touch-target: 44px;
  }
}
```

- **토큰 하나만** 올린다. 다른 역할 토큰은 그대로라 데스크톱 폼 높이가 바뀌지 않는다. 값은 `roles.size["touch-target"].mobile`에서 읽어 출처가 하나다.
- 블록은 `:root` 뒤에 온다. 특이도가 `:root`와 같아 순서로 이긴다. 명시 밀도 `[data-dds-density="mobile"]`도 같은 44px라 둘의 순서는 상관없다.
- 데스크톱 밀도를 명시로 고르는 선택자(`[data-dds-density="desktop"]`)는 없고, 이번에도 만들지 않는다.

## 효과 범위

토큰을 직접 읽는 곳만 밀도 없이 44px이 된다 — 라벨 없는 Checkbox·Switch의 투명 영역, Slider 높이, Pagination 항목(`max()`), Collapsible 트리거 최소 높이.

밀도에 묶인 `::before` 확장(Button xsmall, ToggleGroup, CopyButton, Chip 제거·필터, Tabs, Alert·Toast 닫기, List 행 끝 버튼, ResizeHandle, Select chip 트리거)은 **그대로 밀도 전용**이다. 같은 규칙을 컴포넌트 CSS에 `@media (pointer: coarse)`로 복제하지 않는다 — 규칙이 두 벌이 되고, 밀도를 켠 앱과 안 켠 앱이 같은 화면에서 다르게 보이는 경우를 하나 더 만든다. 밀도 없이 꼭 44px이 필요한 곳은 컴포넌트가 직접 정한다(같은 이슈에서 TableOfContents 접는 트리거는 기본 44px, CopyButton은 40rem 미만에서 44px).

## 트레이드오프

- `pointer: coarse`는 **주 포인터**만 본다. 터치스크린 노트북을 마우스로 쓰면 24px 그대로다(`any-pointer`였다면 달랐다). 휴대폰·태블릿이 목표라 주 포인터 기준을 택했다.
- 터치 기기에서 24px로 되돌릴 방법은 없다. 필요해지면 그때 opt-out을 정한다.
- Slider·Pagination·Collapsible은 터치 기기에서 보이는 크기도 커진다(투명 영역이 아니라 높이·폭을 토큰으로 잡기 때문이다). 레이아웃이 데스크톱과 몇 px 달라질 수 있다.
- VR은 데스크톱 뷰포트·마우스라 이 블록이 켜지지 않는다. 기준 이미지로는 검증되지 않는다.
