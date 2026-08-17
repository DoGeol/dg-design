# Toast·Alert·Spinner/Progress + Button loading — 인터뷰 기록

[스펙 본문](2026-08-17-feedback-batch.md)의 deep-interview 전체 Q&A (5라운드).

### Round 0
**Q:** 구성요소 6개(Toast·Alert·Spinner/Progress·Button loading·테스트VR·live region 정책) / **A:** 이대로 맞음

### Round 1
**Q:** Toast 호출 방식 — 훅 vs 전역 함수 vs 선언형 / **A:** 훅 `useToast().toast({...})` / **모호도:** 44%

### Round 2
**Q:** Toast와 모달의 관계 — dialog-stack의 inert가 viewport를 죽이는 구조적 충돌 / **A:** 항상 최상단(inert 면제 + 전용 z 층) / **모호도:** 32%

### Round 3
**Q:** live region 정중함 — intent 분기 vs 전부 polite vs prop / **A:** critical만 assertive / **모호도:** 24%

### Round 4 (반론)
**Q:** Button loading을 지금 넣는 게 맞나 (asChild 충돌·셀렉터 11회·모션 토큰 부재, 중복 클릭은 `disabled` 한 줄로 가능) / **A:** 넣는다, Spinner 합성으로 / **모호도:** 24%

### Round 5
**Q:** Toast 액션 버튼(실행 취소) — 자동 소멸 요소의 키보드 도달 문제 / **A:** 닫기 버튼만 / **모호도:** 18%
