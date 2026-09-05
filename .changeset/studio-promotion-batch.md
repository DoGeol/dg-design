---
"@dg-design/react": minor
---

dg-studio 승격 1차 컴포넌트 및 기능 추가: StatePanel, Slider, RadioGroup variant="segmented", Tabs responsive, Alert actions slot

- StatePanel: compound(Root, Icon, Title asChild, Description, Actions, Footer) 및 Loading preset 추가
- Slider: leaf 컴포넌트, size(small, medium) 지원, FieldContext 연동, --dds-slider-fill CSS 변수 트랙 채움
- RadioGroup: variant="segmented" 및 size(small, medium, large) 지원 (horizontal 강제)
- Tabs: responsive prop 지원 (matchMedia 기반, wide 화면에서 List 숨김 및 Content 전체 표시)
- Alert: actions slot prop 추가 (description 아래 가로 액션 flex 렌더)
