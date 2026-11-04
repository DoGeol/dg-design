---
"@dg-design/react": patch
---

모션이 코드 때문에 끊기거나 사라지던 곳을 고쳤습니다.

- **Collapsible·Accordion·TableOfContents(접기)**: 열고 닫는 높이 애니메이션이 ResizeObserver 재측정에 끊겨 200ms 대신 약 30ms에 끝나던 문제. Content 자신은 폭이 바뀔 때만 다시 재고, 자식 크기 변화는 그대로 따라갑니다.
- **Collapsible**: reduced motion에서 opacity 페이드까지 꺼지던 것을 높이 이동만 끄도록 바꿨습니다.
- **Toast**: 닫히는 중에 새 토스트가 붙으면 재배치(FLIP)가 퇴장 이동을 덮어써 위로 미끄러지던 문제. FLIP을 개별 `translate`로 걸어 퇴장 `transform`과 합성됩니다.
- **SaveStatus·Button 로딩 스피너**: 사라지는 스피너가 0°로 튀던 것을 그 자리에서 멈추게(`animation-play-state: paused`) 했습니다.
- **TextField·TextArea·Select 트리거**: reduced motion에서도 테두리 색 전환을 남깁니다(색 전환은 이동이 아니라는 결정과 맞춤).
