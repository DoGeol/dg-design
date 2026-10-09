/**
 * flex 적용안 A·B의 치수 정본. 스펙 문서·Storybook 비교·이미지 시안 프롬프트가 모두 이 값을 쓴다.
 *
 * 근거 등급 — A: 원문 명시, B: 원본 이미지 측정(배율 가정 포함), C: 관계·접근성으로 재구성, D: 현재 DDS 0.17.3 값.
 * 배율 가정 — 데스크톱 H-desktop: DS024 입력 70 raster px = 40px(÷1.75). 모바일 H-mobile: M020 화면 520 raster px = 390px(×0.75).
 * A는 연구 보고서의 "proposed" 반올림 세트(6/8/12/14/16), B는 측정값을 가장 가까운 DDS 단계로 옮긴 값이다.
 * 측정이 없으면 B는 새 숫자를 만들지 않고 D(현재 값)를 쓴다. 관계식으로만 유도한 값은 C로 적는다.
 * 배율 1.75는 DS024에서만 확인했다. 다른 데스크톱 이미지(DS014·017·021·026·029)에서 옮긴 값은 "교차 배율" C로 적는다(2026-10-09 Gemini 검토 수용).
 */

export type Grade = "A" | "B" | "C" | "D";
export type Variant = "current" | "a" | "b";
export type Density = "desktop" | "mobile";

export interface Measure {
  /** px. null이면 해당 안에서 쓰지 않는 역할이다. */
  px: number | null;
  grade: Grade;
  basis: string;
}

export interface Role {
  /** CSS 변수 이름의 꼬리 — `--fx-{id}` */
  id: string;
  label: string;
  /** DDS 0.17.3 선언값. null은 DDS가 정하지 않는 값(앱 소유 또는 미존재). */
  current: number | null;
  currentNote?: string;
  a: { desktop: Measure; mobile?: Measure };
  b: { desktop: Measure; mobile?: Measure };
}

const d = (px: number | null, basis = "현재 DDS 값 유지"): Measure => ({ px, grade: "D", basis });
const m = (px: number | null, grade: Grade, basis: string): Measure => ({ px, grade, basis });

export const ROLES = {
  /* 레이아웃 */
  "page-inset": {
    id: "page-inset", label: "페이지 좌우 여백", current: null, currentNote: "앱 소유",
    a: { desktop: m(32, "C", "연구 proposed"), mobile: m(20, "C", "연구 proposed") },
    b: { desktop: m(32, "C", "DS029 헤더 inset 55÷1.75=31.4 (교차 배율)"), mobile: m(20, "B", "M020 26×0.75=19.5") },
  },
  "field-gap": {
    id: "field-gap", label: "같은 묶음 필드 간격", current: null, currentNote: "앱 소유",
    a: { desktop: m(12, "C", "연구 proposed"), mobile: m(14, "B", "M020 18.5×0.75=13.9") },
    b: { desktop: m(10, "C", "모바일 관계 14:56=1/4 → 40×1/4"), mobile: m(14, "B", "M020 18.5×0.75=13.9") },
  },
  "group-gap": {
    id: "group-gap", label: "묶음 사이 간격", current: null, currentNote: "앱 소유",
    a: { desktop: m(24, "C", "연구 proposed"), mobile: m(28, "B", "M020 36×0.75=27") },
    b: { desktop: m(20, "C", "모바일 관계 28:56=1/2 → 40×1/2"), mobile: m(28, "B", "M020 36×0.75=27") },
  },
  "panel-inset": {
    id: "panel-inset", label: "작업 패널 본문 여백", current: 24, currentNote: "Dialog padding",
    a: { desktop: m(40, "C", "연구 proposed"), mobile: m(20, "C", "페이지 여백과 같게") },
    b: { desktop: m(40, "C", "DS026 72÷1.75=41.1 (교차 배율)"), mobile: m(20, "B", "M020 26×0.75=19.5") },
  },

  /* 입력 */
  "field-height": {
    id: "field-height", label: "입력·선택 트리거 높이", current: 40, currentNote: "medium (large 52)",
    a: { desktop: m(40, "C", "DS024 70÷1.75"), mobile: m(56, "C", "연구 proposed") },
    b: { desktop: m(40, "B", "DS024 70÷1.75=40 (배율 기준)"), mobile: m(56, "B", "M020 74.5×0.75=55.9") },
  },
  "field-radius": {
    id: "field-radius", label: "입력 반경", current: 8,
    a: { desktop: m(6, "C", "측정 4.3을 6으로 올림"), mobile: m(16, "C", "연구 proposed") },
    b: { desktop: m(4, "B", "DS024 7.5÷1.75=4.3"), mobile: m(14, "B", "M020 18.75~21×0.75=14.1~15.8, 평균 14.9") },
  },
  "field-inset": {
    id: "field-inset", label: "입력 안쪽 여백", current: 12,
    a: { desktop: m(12, "C", "DS024 20÷1.75=11.4"), mobile: m(16, "C", "연구 proposed") },
    b: { desktop: m(12, "B", "DS024 20÷1.75=11.4"), mobile: m(16, "B", "M020 22×0.75=16.5") },
  },
  "field-font": {
    id: "field-font", label: "입력 값 글자", current: 14,
    a: { desktop: d(14), mobile: m(16, "C", "모바일 Body Large") },
    b: { desktop: d(14), mobile: m(16, "C", "M005 Body Large 16/24") },
  },

  /* 버튼 */
  "button-radius": {
    id: "button-radius", label: "버튼 반경 (medium)", current: 8,
    a: { desktop: m(8, "C", "측정 6.6을 8로 올림"), mobile: m(12, "C", "연구 proposed") },
    b: { desktop: m(6, "B", "DS024·026 11.5÷1.75=6.6"), mobile: m(12, "B", "M020 16.75×0.75=12.6") },
  },
  "cta-height": {
    id: "cta-height", label: "주요 CTA 높이", current: 52, currentNote: "large 버튼",
    a: { desktop: m(48, "C", "DS024 85÷1.75=48.6"), mobile: m(52, "C", "연구 proposed") },
    b: { desktop: m(48, "B", "DS024 85÷1.75=48.6"), mobile: m(52, "B", "M020 68×0.75=51") },
  },

  /* 선택 패널 */
  "select-panel-radius": {
    id: "select-panel-radius", label: "선택 패널 반경", current: 12,
    a: { desktop: m(14, "C", "검색 6 + 여백 8") },
    b: { desktop: m(12, "C", "DS017 22.5÷1.75=12.9 → 가장 가까운 단계 12 (교차 배율). 원본도 행 반경+여백과 동심이 아니다") },
  },
  "select-panel-inset": {
    id: "select-panel-inset", label: "선택 패널 안쪽 여백", current: 4,
    a: { desktop: m(8, "C", "연구 proposed") },
    b: { desktop: m(6, "C", "DS017 행 inset 12÷1.75=6.9 (교차 배율)") },
  },
  "option-height": {
    id: "option-height", label: "옵션 행 최소 높이", current: 32,
    a: { desktop: m(36, "C", "정보 여유"), mobile: m(48, "C", "터치 행") },
    b: { desktop: m(32, "C", "DS017 hover 행 56÷1.75=32 (교차 배율)"), mobile: m(48, "C", "터치 행 44 이상") },
  },
  "option-radius": {
    id: "option-radius", label: "옵션 행 반경", current: 6,
    a: { desktop: d(6) },
    b: { desktop: m(8, "C", "DS017 12.5÷1.75=7.1 (교차 배율)") },
  },
  "mark-size": {
    id: "mark-size", label: "복수 선택 사각 mark", current: null, currentNote: "현재는 체크 아이콘",
    a: { desktop: m(16, "C", "Checkbox small 재사용") },
    b: { desktop: m(18, "C", "DS017 33÷1.75=18.9 (교차 배율)") },
  },

  /* 명령 메뉴 */
  "menu-radius": {
    id: "menu-radius", label: "메뉴 패널 반경", current: 12,
    a: { desktop: d(12) },
    b: { desktop: m(12, "C", "DS021 19.5÷1.75=11.1 (교차 배율)") },
  },
  "menu-inset": {
    id: "menu-inset", label: "메뉴 안쪽 여백", current: 4,
    a: { desktop: m(6, "C", "연구 proposed") },
    b: { desktop: m(8, "C", "메뉴 안쪽 12~16÷1.75=6.9~9.1 (교차 배율)") },
  },
  "menu-item-height": {
    id: "menu-item-height", label: "메뉴 항목 최소 높이", current: 32,
    a: { desktop: m(36, "C", "정보 여유"), mobile: m(48, "C", "터치 행") },
    b: { desktop: m(32, "C", "DS017 행 56÷1.75=32 (교차 배율)"), mobile: m(48, "C", "터치 행 44 이상") },
  },
  "menu-item-radius": {
    id: "menu-item-radius", label: "메뉴 항목 반경", current: 6,
    a: { desktop: d(6) },
    b: { desktop: m(8, "C", "DS017 12.5÷1.75=7.1 (교차 배율)") },
  },

  /* 레이어 */
  "sheet-radius": {
    id: "sheet-radius", label: "Sheet 안쪽 모서리", current: 16,
    a: { desktop: d(16), mobile: m(24, "C", "미측정 디자인 제안") },
    b: { desktop: d(16), mobile: d(16, "미측정이라 현재 값 유지") },
  },
  "sheet-inset": {
    id: "sheet-inset", label: "Sheet 안쪽 여백", current: 24,
    a: { desktop: d(24), mobile: m(20, "C", "페이지 여백과 같게") },
    b: { desktop: d(24), mobile: m(20, "B", "M020 26×0.75=19.5") },
  },

  /* 목록·칩·설정 행 (새 종류 후보) */
  "list-row-2": {
    id: "list-row-2", label: "목록 두 줄 행 높이", current: null, currentNote: "List 없음",
    a: { desktop: m(64, "C", "연구 proposed"), mobile: m(64, "C", "연구 proposed") },
    b: { desktop: m(56, "C", "DS014 행 pitch 98.5÷1.75=56.3 (교차 배율)"), mobile: m(64, "C", "M017 사람:값 행 1.27배, 토큰 x16") },
  },
  "list-row-1": {
    id: "list-row-1", label: "목록 한 줄 행 높이", current: null, currentNote: "List 없음",
    a: { desktop: m(56, "C", "연구 proposed"), mobile: m(56, "C", "필드 높이와 같게") },
    b: { desktop: m(48, "C", "DS026 행 84÷1.75=48 (교차 배율)"), mobile: m(56, "C", "필드 높이와 같게") },
  },
  "list-inset": {
    id: "list-inset", label: "목록 행 좌우 여백", current: null,
    a: { desktop: m(16, "C", "연구 12~16 중 큰 값"), mobile: m(16, "C", "필드 안쪽과 같게") },
    b: { desktop: m(12, "B", "DS024 20÷1.75=11.4"), mobile: m(16, "B", "M020 22×0.75=16.5") },
  },
  "list-leading-gap": {
    id: "list-leading-gap", label: "leading과 본문 간격", current: null,
    a: { desktop: m(12, "C", "연구 proposed") },
    b: { desktop: m(8, "C", "DS017 14÷1.75=8 (교차 배율)") },
  },
  "chip-height": {
    id: "chip-height", label: "Chip 높이", current: 20, currentNote: "MultiSelect 비공개 chip",
    a: { desktop: m(28, "C", "연구 proposed"), mobile: m(32, "C", "연구 proposed") },
    b: { desktop: m(24, "C", "제거 버튼 조작 영역 24"), mobile: m(32, "C", "터치 행") },
  },
  "chip-radius": {
    id: "chip-radius", label: "Chip 반경", current: 6,
    a: { desktop: m(8, "C", "연구 proposed") },
    b: { desktop: d(6, "측정 없음, 현재 chip 유지") },
  },
  "setting-row-height": {
    id: "setting-row-height", label: "설정 행 높이", current: null, currentNote: "설정 행 없음",
    a: { desktop: m(null, "D", "A는 기존 Radio 목록 유지") },
    b: { desktop: m(48, "C", "DS026 행 84÷1.75=48 (교차 배율)"), mobile: m(56, "C", "필드 높이와 같게") },
  },
  "setting-row-radius": {
    id: "setting-row-radius", label: "설정 행 반경", current: null,
    a: { desktop: m(null, "D", "A는 기존 Radio 목록 유지") },
    b: { desktop: m(14, "C", "DS026 24÷1.75=13.7 (교차 배율)"), mobile: m(14, "C", "입력 반경과 같게") },
  },

  /* 탐색 */
  "tab-height": {
    id: "tab-height", label: "탭 최소 높이", current: 36,
    a: { desktop: m(40, "C", "긴 이름·건수 여유") },
    b: { desktop: d(36, "측정 없음") },
  },
  "tab-inset": {
    id: "tab-inset", label: "탭 좌우 여백", current: 8,
    a: { desktop: m(12, "C", "긴 이름·건수 여유") },
    b: { desktop: d(8, "측정 없음") },
  },
  "tab-panel-gap": {
    id: "tab-panel-gap", label: "탭과 패널 간격", current: 12,
    a: { desktop: m(24, "C", "연구 proposed") },
    b: { desktop: d(12, "측정 없음") },
  },

  /* 데이터 */
  "table-row": {
    id: "table-row", label: "표 한 줄 행 높이", current: 44, currentNote: "셀 12·16 + 본문 줄",
    a: { desktop: m(44, "C", "compact 44 / comfortable 52 중 compact") },
    b: { desktop: d(44, "측정 없음") },
  },

  /* 조작 영역 — 세 그룹이 따로 44를 쓰고 있어 역할로 묶었다. 데스크톱은 정하지 않는다. */
  "touch-target": {
    id: "touch-target", label: "모바일 최소 조작 영역", current: null, currentNote: "정하지 않음",
    a: { desktop: m(null, "D", "데스크톱 미정"), mobile: m(44, "C", "터치 행 44 이상") },
    b: { desktop: m(null, "D", "데스크톱 미정"), mobile: m(44, "C", "터치 행 44 이상") },
  },

  /* 글자 */
  "body-size": {
    id: "body-size", label: "본문 글자", current: 14,
    a: { desktop: d(14), mobile: m(16, "C", "Body Large") },
    b: { desktop: d(14), mobile: m(16, "C", "M005 Body Large 16/24") },
  },
  "body-line": {
    id: "body-line", label: "본문 행간", current: 19,
    a: { desktop: d(19), mobile: m(24, "C", "Body Large") },
    b: { desktop: m(20, "B", "DS024 줄 pitch 36÷1.75=20.6"), mobile: m(24, "C", "M005 pitch 48÷2") },
  },
} as const satisfies Record<string, Role>;

export type RoleId = keyof typeof ROLES;

/** 해당 안·밀도의 값. A/B 모바일 값이 없으면 데스크톱 값을 쓴다. */
export function resolve(role: Role, variant: Variant, density: Density): Measure {
  if (variant === "current") return d(role.current);
  const side = role[variant];
  return (density === "mobile" ? side.mobile : undefined) ?? side.desktop;
}

/** :root에 꽂을 CSS 변수. current는 아무것도 덮지 않는다. */
export function cssVariables(variant: Variant, density: Density): Record<string, string> {
  if (variant === "current") return {};
  const out: Record<string, string> = {};
  for (const role of Object.values(ROLES) as Role[]) {
    const { px } = resolve(role, variant, density);
    if (px !== null) out[`--fx-${role.id}`] = `${px}px`;
  }
  return out;
}
