# 다음 컴포넌트: Badge + intent 축 완성

- 날짜: 2026-08-15
- 경로: architectural
- 상태: 결정됨
- 스펙: [specs/archive/2026-08-15-badge-intent-axis.md](../specs/archive/2026-08-15-badge-intent-axis.md) (구현 완료)

## 배경

0.1.0(Button 1개) 이후 다음 컴포넌트를 정하는 토론. seed react 85개 중 Karrot 도메인 전용과 레이아웃 프리미티브(Tailwind 브릿지로 대체)를 제외하고 계층별로 비교했다. 핵심 판단 기준은 "어느 토큰 축을 먼저 넓히느냐" — 컴포넌트가 토큰을 앞서가면 임기응변 값이 생긴다.

## 검토한 선택지

| 선택지 | 장점 | 단점 | 판정 |
|--------|------|------|------|
| Badge + intent 축 | 예약만 된 critical/positive/warning/informative 실값화. 뒤의 모든 컴포넌트가 이 축을 씀. 트리거 0 | 컴포넌트 자체는 얇아 실사용 임팩트 작음 | **채택** |
| Checkbox + Switch | stroke 축 신설, 상태 조합 확장 | intent 축 없이 stroke부터 가면 TextField의 error 상태가 붕 뜸 | 탈락 — 순서상 다음(2순위) |
| TextField | 실사용 가치 최대 | stroke + critical 둘 다 선행 필요, 한 입이 큼 | 탈락 — A·B 뒤 3순위 |
| Dialog | 헤드리스 구조 시험대 | portal + 테스트 프레임워크 + elevation 토큰 3개 문이 동시에 열림 | 탈락 — 4순위 |

로드맵 합의: **A(Badge) → B(Checkbox/Switch) → C(TextField) → D(Dialog)**. B부터 시각 회귀 트리거(5개+)가 가까워진다.

## 결정

Badge를 만들되 본체는 intent 축 완성이다. seed Badge 축(tone 6종 × weak·solid·outline)을 DDS 문법으로 옮기되 outline은 제외한다.

- Badge 축: `intent` 6종(brand·neutral·critical·positive·warning·informative) × `variant`(solid·weak) × `size`
- palette: 새 hue 램프 4개, 기존 `ramp()` + 스텝별 chroma 배열 방식 유지
- semantic: 새 intent당 base 4개만 — `bg-{intent}-solid` `bg-{intent}-weak` `fg-{intent}` `fg-{intent}-contrast` (16개)
- 대비 검사: intent당 3쌍 × 2모드 = 24검사 추가
- 구현 관습: CVA + `@layer dds` + `.dds-badge--intent_*`, Button과 동일

## 정해진 것

- outline 제외: stroke 축은 Checkbox 때 신설 — Badge에 먼저 넣으면 축이 어중간하게 태어남
- 새 intent에 hover/pressed 없음: Badge는 비인터랙티브. 인터랙티브 소비자(삭제 Button 등) 등장 시 추가. 이름 예약도 안 함(YAGNI)
- 헤드리스 파일 규칙(로직 훅 + 스타일 껍데기 분리)은 방향만 합의 — 첫 적용은 로직 있는 컴포넌트(Dialog 등)에서. 패키지 분리는 기존 트리거("같은 로직에 다른 스타일 2회") 유지

## 안 정해진 것

- hue 실값 4개 — 스펙 단계에서 gamut 검사와 함께 확정
- warning(황) 대비 전략 — 4.5:1 난관, fg를 어둡게 잡는 seed식 해법 검토
- size 축 구성(small/medium?), dot·count 변형 포함 여부
- Badge 엘리먼트(`<span>` 고정 vs 다형)

## 뒤집을 조건

DDS를 소비하는 실제 앱이 정해지고 그 앱의 첫 화면이 다른 컴포넌트를 요구하면 로드맵 순서를 재검토한다.
