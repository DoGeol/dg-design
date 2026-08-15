# @dg-design/visual-regression

Storybook 정적 빌드를 Playwright로 스크린샷 비교하는 시각 회귀 테스트. 비공개 워크스페이스 패키지.

## 동작

1. `apps/storybook/storybook-static`을 `vite preview`로 서빙 (`webServer`가 자동 기동)
2. `storybook-static/index.json`에서 스토리를 **동적 열거** — 스토리 이름을 하드코딩하지 않는다
3. 대상 × 라이트/다크 각각 `#storybook-root` 요소를 스크린샷해 기준 이미지와 비교

### 스토리 선택 규칙

`title`(컴포넌트)별로 묶은 뒤:

- id가 `matrix` 또는 `combination`을 포함하는 스토리를 전부 선택
- 하나도 없으면 그 컴포넌트의 **첫 스토리**로 폴백

폴백이 있으므로 매트릭스 스토리를 아직 안 만든 컴포넌트도 최소 1장은 커버된다. 새 컴포넌트를 추가할 때 이 패키지는 건드릴 필요가 없다.

### 테마

`iframe.html?globals=theme:dark`로 Storybook 데코레이터가 `html[data-dds-theme="dark"]`를 걸게 한다. 테스트는 다크에서 그 속성을 실제로 검증한다 — 주입이 조용히 실패하면 다크 스냅샷이 라이트와 같아지기 때문이다.

Storybook 기본 배경은 흰색 고정이라, 스냅샷 직전에 `body` 배경을 `--dds-color-bg-layer-default`로 덮어 다크 기준 이미지가 읽히게 한다.

## 실행

```sh
pnpm --filter @dg-design/storybook run build   # storybook-static 필요
pnpm vr                                        # 저장소 루트에서
```

브라우저가 없으면 먼저 `pnpm --filter @dg-design/visual-regression exec playwright install chromium`.

## 기준 이미지 정책

**기준 이미지는 CI 러너(ubuntu)에서만 생성·갱신한다. 로컬 macOS에서 `--update-snapshots`를 실행하지 않는다.**

macOS와 Linux는 폰트 렌더링과 안티앨리어싱이 달라 로컬에서 만든 기준은 CI를 영구히 붉게 만든다. 그래서:

- 기준 경로에 OS가 들어간다 — `tests/__screenshots__/{platform}/{story-id}-{theme}.png`. git에 올라가는 건 `linux/`뿐이다
- 로컬 macOS 실행은 기준이 없으므로 **전부 스킵**하고 그린으로 끝난다. 시각 검증은 CI가 담당한다
- macOS에서 `--update-snapshots`를 쓰면 테스트가 명시적 에러로 죽는다 (문서만이 아니라 코드 가드)

### 기준 없는 스토리는 실패가 아니라 스킵

새 스토리·새 컴포넌트가 들어와도 기준이 생길 때까지 main CI가 붉어지지 않는다. 커버리지를 실제로 켜는 건 아래 갱신 절차다.

### 갱신 절차 (유일한 경로)

1. GitHub Actions → **Visual Baseline** 워크플로 → **Run workflow** (`workflow_dispatch`)
2. 워크플로가 ubuntu에서 `playwright test --update-snapshots`를 돌린다
3. 변경된 기준 이미지를 `github-actions[bot]`이 커밋·푸시한다
4. 그 커밋을 pull 받아 diff를 **눈으로 확인**한다 — 의도한 변화인지 판단하는 건 사람이다

의도적으로 컴포넌트 모양을 바꿨을 때, 새 컴포넌트/스토리를 추가했을 때, 러너 이미지 교체로 렌더링이 통째로 밀렸을 때 이 절차를 돈다.

## 플레이크 대응

| 대응 | 값 |
|------|-----|
| 애니메이션 | `animations: "disabled"` + `reducedMotion: "reduce"` |
| 폰트 로딩 | 스냅샷 직전 `document.fonts.ready` 대기 |
| 렌더 완료 | `#storybook-root`의 첫 자식 `toBeVisible()` 대기 |
| 디바이스 픽셀 | `deviceScaleFactor: 1`, `scale: "css"` |
| 허용 diff | `maxDiffPixelRatio: 0.005` (0.5%) |
| 재시도 | CI에서 1회 |

`maxDiffPixelRatio`는 같은 러너·같은 브라우저 기준이라 정상 실행에서는 0에 가깝다. 0.5%는 안티앨리어싱 흔들림만 흡수하고, 컴포넌트 한 칸이 실제로 바뀌면 잡히는 폭이다.

## CI

`ci.yml`의 publint 뒤에 붙는다. `pnpm build`가 이미 storybook-static을 만들므로 재빌드하지 않는다. 브라우저 바이너리는 Playwright 버전으로 키를 잡아 캐시하고, diff 실패 시 `test-results/`·`playwright-report/`를 아티팩트로 올린다.
