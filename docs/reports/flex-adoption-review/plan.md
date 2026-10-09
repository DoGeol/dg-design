# 직접 업데이트 순서

[개요](README.md) · [컴포넌트](components.md) · [API](composition.md) · [토큰](tokens.md)

상태: 구현 검토안. 런타임 코드는 아직 변경하지 않았다. 이 순서는 DDS 기존 구조를 사용하며 새 headless 패키지나 레시피 코드젠을 전제하지 않는다.

## 변경 묶음과 완료 조건

| 단계 | 주요 대상 | 작업 | 완료 조건 |
| --- | --- | --- | --- |
| 1. 역할 토큰 | tokens.ts, color-core.ts, customization.md | 기존 값에 역할 이름 연결, 프로필 범위와 공개 override 계약, Tailwind 브릿지 보완 | 기존 기본 화면 유지, light/dark/중첩 scope 값 일치, utility 생성 확인 |
| 2. 폼 외형 | button, field, text-field, text-area, select CSS | control/inset/gap/radius 역할 연결, box/line·밀도 조합 | ref·label/error·className 계약 유지, 긴 한글·숫자·오류·disabled·loading 검증 |
| 3. 선택 조합 | select, multi-select, internal/select-core | 트리거/표시값·행 metadata, 사각 mark, 패널 shell/list 분리 | 초기 라벨·검색·비동기 옵션·생성 실패·선택 유지·키보드·form 동작 검증 |
| 4. 새 종류 | list, chip, property-field 후보 | 실제 소비자 2곳에서 API 확인 후 공용화 | 객체/값/행동의 의미 분리, 중첩 interactive 요소 없음, 기존 부품 재사용 |
| 5. 작업 패널 | dialog, sheet, dropdown-menu, shared overlay | 레이아웃 부품·모바일 높이·portal profile 전달·Sub API | 중첩 닫기/포커스·본문 스크롤·푸터 위치·다크 경계·RTL 검증 |
| 6. 고밀도 화면 | date-picker, data-table, tabs | presentation/trigger 선택, 표 치수와 계산 연결, 필요 시 manual Tabs | 날짜 모델·DST 유지, 가상화/고정 열 정렬, 값/포커스 보존 |
| 7. 소비 앱 전환 | dg-studio DDS 의존성·예제·실사용처 | 배포된 npm 버전으로 갱신, 앱 임시 override 정리 | 대표 화면 전환 및 회귀 검증, 공개 URL·업무 로직 유지 |

실제 파일 위치는 [인벤토리](inventory.json)에 있다. 예시·접근성 설명·compound named export·package subpath·타입도 같은 변경 묶음에 포함한다. 기존 `.dds-*` 비공개 클래스를 앱이 더 많이 알아야 하는 방향은 피한다.

## 구현 전에 고정할 결정

| 결정 | 권고안 |
| --- | --- |
| 브랜드 | 현재 소비 앱 블루 정책 보존. flex 녹색이나 패키지 기본색 교체는 별도 결정 |
| 시각 기본값 전환 | 첫 단계는 기존 값에 역할 연결. 새 치수는 대표 화면에서 검증 후 기본 적용 여부 결정 |
| 밀도와 플랫폼 | 화면 폭만으로 모든 부품을 확대하지 않음. 공통 density와 Sheet/Popover presentation을 구분 |
| scope와 portal | 중첩 theme/density를 지원한다면 body 직하 portal에도 명시적으로 전달. 지원 범위를 문서화 |
| 새 공용 종류 | List·Chip·PropertyField는 실제 소비/역할로 확정. PageHeader/FilterBar는 앱 조합부터 시작 |
| option 정보 | label/textValue와 행 slot 분리. 초기/비동기 registry 계약을 함께 해결 |
| Tailwind | 실제 지원 버전 범위에서 재검증. 기존 utility와 임의값 사용법 보존 |

권고를 검토한 뒤 승인된 범위를 `docs/specs/`에 옮긴다. 이 보고서의 모든 후보가 자동으로 구현 범위가 되는 것은 아니다.

## 회귀 검증

컴포넌트 변경마다 관련 React 테스트와 Storybook state matrix를 갱신한다. 테스트는 실제 동작과 계약을 검증하며 CSS 선언을 그대로 복사한 테스트만 늘리지 않는다.

- 선택: 첫 렌더 라벨, wrapped/비동기 Option, 검색 중 선택 유지, disabled, chip 제거, 키보드 이동, 생성 성공/오류, Escape·포커스 복귀.
- 입력: 네이티브 form 제출/reset, label/description/error 연결, affix ref/className, multiline·글자 확대·긴 값.
- 패널: 중첩 theme/density + portal, Dialog 안 Select/Menu, 다크 패널 1px 경계와 arrow, 조상 유지·형제 닫기, 긴 본문·고정 Footer, 모바일 키보드와 safe area.
- 데이터: 가상 행 실제 높이와 계산 일치, 선택 열/고정 열 offset, 빈/로딩/오류, 정렬·필터 후 선택 범위. 날짜값·DST·컨테이너 전환 회귀.
- 접근성: native 의미와 aria 계약, hover 없이 기능 접근, focus/selected 구분. DatePicker 모바일 및 Table 스크린리더 실기기 미검증은 기존 후속 항목으로 남겨 완료로 표시하지 않음.

최종 코드 검증은 저장소의 generate → build → React test → typecheck → publint → 관련 VR 흐름을 따른다. VR 기준은 기존 규칙대로 CI에서만 갱신한다. 0.17.3의 overlay-boundary 검증을 유지하고 픽셀 변화가 넓은 허용 오차에 묻히지 않게 한다. 이번 문서 검토 결과를 런타임 테스트 통과로 보고하지 않는다.

## 마이그레이션과 되돌리기

API 확장은 기존 사용법이 그대로 작동하도록 추가한다. 외형 기본값 전환이나 DOM/ref 의미 변경이 필요하면 별도 마이그레이션을 제공한다. 0.x 패키지의 정확한 버전 상승은 기존 릴리스 정책과 실제 호환성에 맞춰 changeset에서 결정한다.

새 React CSS가 새 토큰을 요구하면 packages/react와 tokens의 최소 호환 버전을 함께 문서화한다. 두 패키지가 어긋나 CSS 변수가 사라지는 배포를 피한다. 앱은 npm 배포판만 소비하고 pnpm link나 미배포 소스 의존을 만들지 않는다.

되돌릴 때는 컴포넌트/토큰 버전과 앱 프로필을 한 묶음으로 이전 상태로 복귀시킨다. 색상·치수 변경에 데이터 마이그레이션을 섞지 않는다. 커밋·푸시·PR·릴리스·배포는 각 단계에서 사용자의 명시적 요청을 따른다.

## 문서와 소스의 차이도 함께 정리

- AGENTS/INDEX의 배포 버전 표기는 일부 뒤처져 있다. 이번 기준은 package.json의 React 0.17.3이다.
- customization.md의 21종/20종 className 설명은 현재 38개 subpath 전체에 일반화할 수 없다. 특히 DataTable의 외부 스타일 계약을 따로 다룬다.
- 같은 문서의 createTheme 예시는 string 반환을 가정한다. 실제 반환은 `{ css, brandHue }`이므로 생성 파일에는 `.css`를 써야 한다.
- 옛 Sheet radius 0 기록보다 현재 CSS의 안쪽 모서리 16px가 우선한다.
- Tailwind duration/z namespace 설명은 tokens 문서에 적은 4.3.3 실측 결과와 지원 버전 범위를 반영해 수정한다.

이 차이는 도입 시 혼동을 일으키므로 구현·가이드 갱신 범위에 포함한다. 이번 검토에서는 기존 결정 기록을 과거 사실과 다르게 고쳐 쓰지 않았다.
