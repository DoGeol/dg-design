# 토큰 적용 검토

[개요](README.md) · [실제 출력 JSON](token-comparison.json) · [구현 순서](plan.md)

원본 수치가 아닌 적용 후보는 **C**로 표시한다. 래스터 측정의 반복성이 높아도 CSS px·원래 폰트·색 공간까지 복원했다는 뜻은 아니다.

## 숫자는 대부분 이미 있다

근거: [tokens.ts](../../../packages/tokens/src/tokens.ts). dimension 19개, radius 11개, semantic color 47개가 있다.

| 적용 후보 | 기존 dimension | 기존 radius |
| --- | --- | --- |
| 6px | x1_5 | r1_5 |
| 8px | x2 | r2 |
| 12px | x3 | r3 |
| 14px | x3_5 | r3_5 |
| 16px | x4 | r4 |
| 20px | x5 | r5 |
| 24px | x6 | r6 |
| 28px | x7 | — |
| 32px | x8 | — |
| 40px | x10 | — |
| 48px | x12 | — |
| 52px | x13 | — |
| 56px | x14 | — |

기존 수치 스케일을 `flex-spacing-*`로 복제할 필요가 없다. 현재 컴포넌트가 primitive를 직접 고르는 부분에 **역할 토큰**을 연결한다. margin/padding/gap은 같은 수치 스케일을 쓰되, 의미가 다른 여백을 하나의 역할로 묶지 않는다.

## 역할과 플랫폼 프로필 제안

이름과 값 모두 검토용 C다. 기본값을 즉시 전역 교체하지 않고 기존 치수로 역할 연결부터 검증한 뒤 새 프로필을 적용한다. desktop/mobile은 여기서 연구 비교용 이름이며 최종 API는 compact/comfortable 등 과업 밀도와 기기 대응을 분리해 결정한다.

| 역할 후보 | 데스크톱 C | 모바일 C | 연결 |
| --- | --- | --- | --- |
| page inline inset | 32 | 20 | x8 / x5 |
| 작업 패널 inset | 40 | 별도 결정 | x10. 작은 확인 Dialog의 24px까지 일괄 변경하지 않음 |
| field inline inset | 12 | 16 | x3 / x4 |
| 같은 그룹 field gap | 12 | 14 | x3 / x3_5 |
| group gap | 24 | 28 | x6 / x7 |
| field min-height | 40 | 56 | x10 / x14 |
| 주요 CTA height | 48 | 52 | x12 / x13. 일반 버튼과 역할 구분 |
| field radius | 6 | 16 | r1_5 / r4 |
| button radius | 8 | 12 | r2 / r3 |
| menu radius | 12 | 미정 | r3 |
| select panel radius | 14 | 미정 | r3_5 |
| panel radius | 16 | 미정 | r4 |
| bottom sheet radius | 해당 없음 | 24 | r6. **원본 보정 실측 없는 디자인 제안** |

모바일 후보는 화면 내부 폭 520 raster px를 390–393 logical px로 가정했다. 페이지 inset 26, 필드 inset 22, 필드 높이 74–75, CTA 높이 68 raster px에서 유도했다. 가정을 제거하면 공식 logical px 값도 확정할 수 없다.

radius는 부모 반경·자식 반경·사이 padding을 함께 검토한다. DS017의 바깥 약 22.5 / 내부 약 9 / inset 약 14 raster px는 그 관계의 근거다. 모든 부품에 같은 rounded 값을 적용하지 않는다. visual height와 터치 hit area는 구분하고 긴 라벨·글자 확대에서는 min-height와 wrapping을 검증한다.

공개 이름 예시는 `--dds-space-field-gap`, `--dds-size-field-min-height`, `--dds-radius-field`다. 현재 컴포넌트 로컬 변수는 비공개이므로, 이름만 추가한다고 안정 API가 되지는 않는다. 지원 목록·기본값·override 범위를 [customization](../../customization.md)에 명시해야 한다. primitive는 유지하고 실제로 두 곳 이상 쓰는 역할부터 추가한다.

## 색상: 구조를 적용하고 래스터 hex는 후보로 남긴다

| 근거 | 관찰 | DDS 적용 |
| --- | --- | --- |
| fx B | white #FFFFFF, hover #F6F6F8 | 기본 표면과 hover 역할을 분리 |
| fx B | 주 글자 약 #262A2D, 보조 약 #8F9297 | 기존 fg-neutral/fg-neutral-weak와 대조; 보조 색을 그대로 복사하지 않음 |
| fx B | 녹색 약 #09BB1B, 녹색→청록 그라데이션 | 선택/주 행동 의미 참고. DDS 브랜드 색 교체의 근거는 아님 |
| fxm A | `#33C759 → green-6 → button-primary → component token` | primitive → semantic → component 역할 연결을 차용 |
| fxm B | 같은 표본의 이미지 색 #00CA48 | 인쇄 hex와 불일치. 원래 P3 좌표로 역변환 불가 |

fxm은 Gray 21단계와 유채색 10종×10단계, Display P3를 설명한다. 이미지에 보이는 유채색은 9행이므로 나머지 팔레트를 추정 생성하지 않는다. DDS의 sRGB 대비/gamut 검증을 P3 이미지 색으로 대체하지 않는다. 전시 보드의 #F4F4F6도 실제 제품 배경으로 가져오지 않는다.

후보 hex끼리 계산하면 #8F9297/white는 3.12:1, white/#09BB1B는 2.58:1이다. 이는 이미지 후보 계산이며 실제 flex 접근성 판정이 아니다. DDS에 채택할 텍스트·컨트롤 색은 역할별 검증을 다시 통과해야 한다.

### 실제 브랜드 정책의 차이

| light 출력 | DDS 기본 | createTheme(#2B7FFF) |
| --- | --- | --- |
| bg-brand-solid | #196161 | #1550A9 |
| bg-brand-weak | #DFFCFB | #F1F5FC |
| fg-neutral | #242727 | #252629 |
| fg-neutral-weak | #6B706F | #6D6F72 |
| stroke-neutral-weak | #E4E9E8 | #E5E8EB |

dg-studio의 브랜드 설정은 solid **#155EEF**를 사용한다. [create-theme.ts](../../../packages/tokens/src/create-theme.ts)는 입력 hue만 이용해 명도/채도를 다시 만들기 때문에 #2B7FFF를 넣어도 위 값이 나온다. 기본 패키지는 유지하고 소비 앱의 브랜드를 쓸지, DDS 기본까지 블루로 바꿀지 구현 전에 정한다. 권고는 이번 구조 변경과 브랜드 기본값 교체를 분리하고 현재 앱 블루 정책을 보존하는 것이다.

semantic 색은 서로 독립된 리터럴이다. bg-brand-solid만 바꿔도 focus ring은 따라 바뀌지 않는다. light/dark·hover/pressed·글자/아이콘/focus를 한 세트로 검증한다. component alias를 root에만 `var()`로 정의하면 중첩 scope에서 굳을 수 있으므로, 적용 요소 또는 테마 경계에서 다시 바인딩한다. portal 전달도 [API 검토](composition.md)의 계약을 따른다.

## 타이포·경계·그림자·모션

- 현재 fontSize t1…t10은 11/12/13/14/16/18/20/22/24/26px, lineHeight는 15/16/18/19/22/24/27/30/32/35px다(1rem=16px 비교값).
- fxm Header/Title/Body/Caption 등 11개 역할명은 A, 크기·행간 재구성은 C다. 후보의 15/17/28px와 행간 20/23/28/36px는 현 스케일에 없다. 기존 t 인덱스를 바꾸지 않고 역할 조합을 먼저 정한다. 필요가 확인된 값만 additive로 추가한다.
- 폰트 family/숫자 weight/letter-spacing은 복원하지 못했다. 기존 regular 400/bold 700을 유지하며 실제 한글·숫자·긴 라벨로 확인한다.
- border는 현 1px, 입력 focus는 border+inset, 비입력 focus는 ring 계약을 유지한다. 부유 패널 경계를 연하게 만드는 일은 0.17.3 수정과 함께 검증한다.
- 그림자는 기존 overlay 1종을 유지한다. blur/alpha/spread 원본은 확인되지 않았다. 여러 shadow 단계를 임의 추가하지 않는다.
- duration 150/200ms, spin 1000ms와 out/linear easing, overlay 2000/toast 2100도 현 DDS 정책이다. flex 영상에서 공식 값으로 추출한 것이 아니다. 새 opacity/breakpoint/motion 숫자 역시 근거 없이 만들지 않는다.

## Tailwind 적용

현재 [브릿지 생성기](../../../packages/tokens/src/color-core.ts)는 color/radius/spacing/type/easing을 `@theme inline`으로 재바인딩한다. `rounded-r-full` 충돌 때문에 r-full을 제외한 판단은 유지한다.

이전 연구의 Tailwind **4.3.3** 컴파일은 38 assertions(37개 고유 utility), 6 namespace, 14 DDS 변수 참조를 확인했다. `--transition-duration-*`, `--z-index-*`, `--border-width-*`, `--opacity-*`가 작동한다. 현 생성기의 “duration/z namespace가 없다”는 주석은 잘못된 `--duration-*`/`--z-*` 이름에 기반하므로 보정 대상이다. 모든 v4 버전에 대한 검증은 아니다.

```css
/* 제안 예: 아래 역할 변수는 아직 패키지에 없는 새 계약이다. */
@theme inline {
  --spacing-field-gap: var(--dds-space-field-gap);
  --spacing-field-height: var(--dds-size-field-min-height);
  --radius-field: var(--dds-radius-field);
  --transition-duration-dds-fast: var(--dds-duration-fast);
  --z-index-dds-overlay: var(--dds-z-overlay);
}
/* gap-field-gap / min-h-field-height / rounded-field
   duration-dds-fast / z-dds-overlay */
```

기존 alias와 임의값 문법은 유지한다. 지원할 Tailwind 버전을 명시하고 새 utility의 생성·중첩 scope를 그 버전에서 검증한다. 앱 진입점의 `@layer dds, theme, base, components, utilities;` 순서, tokens.css 수동 로드 계약도 그대로다.
