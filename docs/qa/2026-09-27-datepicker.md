# DatePicker QA

- 날짜: 2026-09-27 (최종 자동 검증 2026-09-28)
- 브랜치: `codex/datepicker-plan`
- 상태: 로컬 구현·자동 검증 통과. Linux 시각 기준·실기기/스크린리더 청취는 릴리스 전 후속
- 계약: [스펙](../specs/2026-09-27-datepicker.md) · [구현 계획](../plans/2026-09-27-datepicker.md)

## Phase 0 결과

| 검증 | 결과 | 근거·한계 |
| --- | --- | --- |
| 타입·값 | 통과 | TS 6.0.3에서 `kind`별 세 값 타입과 단일/범위 판별 union, `null` controlled 값, 잘못 섞은 값의 타입 오류 확인. `value={undefined}`는 현재 TS 설정에서 런타임 정규화 필요 |
| 날짜 입력 | 통과 | `@internationalized/date@3.12.4`의 일부 생성자·파서는 잘못된 값을 보정하므로 완성된 입력 형태→`parseDate`·`parseTime`→값 생성으로 검증. day 00, 2월 29일 오류, 4월 31일, 24:00, 12:60, 초 입력을 거부 |
| DST | 통과 | New York·Lord Howe의 gap은 후보 0개, overlap은 오프셋이 다른 후보 2개. Apia의 건너뛴 날도 gap. 현지 시각 draft를 유지하고 earlier/later 결과의 wall time 왕복을 검사해야 함 |
| 기간 불가일 | 통과 | 1만 일 순회 20회에서 중앙값 약 0.8ms·최대 약 1.2ms(단순 predicate, 로컬 Node). 상한 날짜 9999-12-31에서는 종료 조건을 증분보다 먼저 검사해야 함 |
| 접근성 조립 | jsdom 통과 | `react-aria@3.52.1`·`react-stately@3.50.0` 달력 훅이 DDS Popover/Sheet 안에서 중복 overlay 없이 동작. 단일/범위 그리드, 방향키 이동, 불가일 `aria-disabled`, `en-US`·`ko-KR` 월 이름 확인. 실제 브라우저·스크린리더는 미검증 |
| 직접 입력 | 별도 구현 필요 | React Aria `useDateField`는 전체 날짜가 완성되면 즉시 변경 이벤트를 낸다. 스펙의 Enter/blur 확정·오류 원문 보존은 DDS TextField와 분리된 draft 파서로 구현 |
| 모바일 시트 크기 | 정적 브라우저 PoC | 375×667에서 기존 bottom Sheet 높이 318px·콘텐츠 약 724px으로 적용 버튼이 화면 밖. DatePicker 전용 90dvh+내부 스크롤/고정 footer에서는 버튼이 y=594~642px. 375×430 축소 화면에서도 y=357~405px. 실제 가상 키보드는 미검증 |

값·DST PoC 실행은 임시 디렉터리에서 `node strict-model.mjs`, `node runtime.mjs`, `tsc -p tsconfig.json`으로 모두 통과했다. 접근성 PoC는 `node poc.mjs`와 DDS 오버레이를 불러온 `node --experimental-loader css-loader.mjs overlay.mjs`로 통과했다. 임시 PoC 파일은 저장소에 포함하지 않는다.

## 로컬 구현 검증

| 검증 | 결과 | 범위 |
| --- | --- | --- |
| `pnpm generate` | 통과 | 토큰 대비·gamut 검사 |
| `pnpm build` | 통과 | React·tokens·Storybook 빌드, DatePicker 서브패스 생성 |
| React Vitest | 491건 통과 | 기존 471건과 새 날짜 모델·달력·입력·Picker 20건. 양 끝 DST 중복 시각, controlled 값 변경, 직접 입력→달력·바깥 blur 포함 |
| `pnpm typecheck` | 통과 | React·tokens·Storybook |
| publint | 통과 | `@dg-design/react/date-picker` 타입·런타임 export 포함 |
| `pnpm vr` | 115건 통과, 76건 스킵 | macOS에 Linux 전용 시각 기준이 없어 이미지 비교 스킵. 신규 기능 테스트 11건 통과 |
| React Doctor | 전체 51/100, 58건 | 기존 저장소 진단을 포함. 새 DatePicker 관련 오류는 없고 복잡도·draft 동기화 경고가 있다. changed 스캔 100/100은 미추적 파일을 놓치므로 근거로 쓰지 않음 |

Storybook production build의 DatePicker 공유 청크는 약 **124.7KB / gzip 39.2KB**다. `react-aria` 서브패스 import로 바꾼 뒤에도 유사했다. 이 수치는 Storybook 청크이며 소비 앱 전체 번들 비용을 보증하지 않는다.

Chromium 브라우저에서 단일 날짜 즉시 확정·포커스 복귀·폼 값, 범위의 두 달 가로 배치·적용/취소·중간 불가일, 375px 한 달 시트·터치 조작, 430px 축소 높이의 적용 버튼, 열려 있는 상태의 데스크톱↔모바일 전환과 draft 보존, DST overlap 오프셋 선택을 확인했다. 달력을 열 때 선택된 날짜로 포커스가 이동했고 전환 뒤에도 유지됐다. 시트 진입 모션이 끝나기 전 좌표를 읽어 실패하던 터치 테스트는 애니메이션 완료 후 터치하도록 고쳤다. 키보드만으로 열기·날짜 이동·선택·포커스 복귀, 직접 입력 후 달력 클릭과 바깥 blur 확정도 확인했다.

## 남은 검증

- [x] 모델·컴포넌트 단위 테스트: 값 종류, strict parse, 윤년·월 경계, DST, 범위 제약, 프리셋.
- [x] 네 사용 방식의 데스크톱·375px 브라우저 기능과 직접 입력·적용/취소·리사이즈 중 draft/포커스.
- [x] `pnpm generate`·`pnpm build`·React test·`pnpm typecheck`·publint·`pnpm vr`, 새 의존성의 Storybook 소비 청크 크기.
- [ ] Linux 시각 기준 생성·검토. 워크플로는 커밋·푸시하므로 별도 사용자 승인 후 실행.
- [ ] 실제 모바일 가상 키보드·터치와 VoiceOver/TalkBack 청취. 릴리스 전 수행.
