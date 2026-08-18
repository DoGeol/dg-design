# 테마 생성기 + 브릿지 보강 — 인터뷰 기록

[스펙 본문](2026-08-19-theme-generator.md)의 deep-interview 전체 Q&A (5라운드).

### Round 0
**Q:** 구성요소 5개(createTheme·브릿지 보강·계약 문서·테스트·릴리스) / **A:** 이대로 맞음

### Round 1
**Q:** 생성기 입력 — hex vs hue vs 둘 다 / **A:** hex 받기, hue 추출 / **모호도:** 39%

### Round 2
**Q:** 전달 형태 — 함수+CLI vs 함수만 vs CLI만 / **A:** JS 함수 + 얇은 CLI / **모호도:** 33%

### Round 3
**Q:** 테마 축 — brand만(gray 연동) vs intent 포함 vs gray 분리 옵션 / **A:** brand만, gray 자동 연동 / **모호도:** 26%

### Round 4 (반론)
**Q:** 소비자 hex가 검사에 걸리면 — 거부+진단 vs 자동 보정 vs 인접 hue 제안 / **A:** 실패 + 진단 메시지 / **모호도:** 21%

### Round 5
**Q:** 출력 스코프 — 드롭인 교체 vs selector 옵션 vs 오버라이드 조각 / **A:** 드롭인 교체 / **모호도:** 15%
