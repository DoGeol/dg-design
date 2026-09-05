# 배포 자동화 — npm trusted publishing

- 날짜: 2026-09-06
- 상태: 활성
- 관련: `.github/workflows/release.yml`, [AGENTS.md](../../AGENTS.md) 배포 항목

## 문제

0.12.0·0.13.0 배포 모두 로컬에서 `changeset publish`를 돌리며 npm 웹 로그인과 OTP 입력을 반복했다. 스코프 패키지는 인증 실패가 403이 아니라 404(PUT)로 나와 원인 파악에도 시간이 들었다.

## 선택지

| 방식 | 비밀 | 운영 부담 |
|------|------|-----------|
| 로컬 수동 publish | 없음 | 매번 로그인·OTP |
| granular access token을 GitHub secret에 저장 | 장기 토큰 | 2FA bypass 만료(최대 90일) 관리, 유출 시 폐기 |
| **npm trusted publishing(OIDC)** | 없음 | npm 웹에서 패키지별 1회 등록 |

## 결정

trusted publishing + changesets/action v2. GitHub Actions가 OIDC로 "DoGeol/dg-design의 release.yml"이라는 신원을 증명하고 npm이 그것만 허용한다. 장기 비밀이 없고 provenance가 자동 첨부된다(레포 public).

흐름: changeset 포함 커밋 push → 봇이 "Version Packages" PR 생성 → **PR 머지 = 배포 승인** → 같은 워크플로가 publish·태그·GitHub 릴리스. AGENTS.md의 "커밋·배포는 승인 뒤" 규칙과 맞물린다.

## 구현 중 확인한 함정

- changesets/action은 v2부터 `publish-script`·`version-script`·`github-token` input만 받는다. v1 문법(`publish:`, `env: GITHUB_TOKEN`)은 조용히 무시된다.
- `push-git-tags` 기본값이 false. 기존 `@dg-design/react@x.y.z` 태그 관례를 잇기 위해 true.
- `actions/setup-node`에 `registry-url`을 주면 `.npmrc`에 `NODE_AUTH_TOKEN` 플레이스홀더가 쓰이고, 그것이 빈 bearer로 나가 OIDC 대신 404가 난다. 주지 않는다.
- trusted publishing은 npm CLI 11.5.1 이상이 필요하다. Node 24가 npm 11을 동봉하므로 CI(Node 22)와 달리 24를 쓴다.
- pnpm 11은 OIDC 회귀 이슈(pnpm/pnpm#11513)가 열려 있다. `packageManager`는 10.x에 둔다.
- 레포 설정 "Allow GitHub Actions to create and approve pull requests"가 꺼져 있으면 Version PR 생성이 실패한다. 워크플로 밖의 전제 조건이다.
- `GITHUB_TOKEN`이 만든 PR에는 GitHub 정책상 다른 워크플로가 트리거되지 않는다. Version PR은 package.json·CHANGELOG만 바꾸므로 원래 커밋의 CI로 충분하다고 판단했다. 필수 status check를 도입하면 GitHub App 토큰으로 바꾼다.
- Trusted Publisher의 "Allowed actions"는 기본이 `npm stage publish`만 허용이다. **Allow npm publish**를 체크하지 않으면 필드가 전부 맞아도 `403 OIDC permission denied for this action`이 난다(0.13.1 검증 배포에서 실측). 이 항목은 저장 뒤에도 수정 가능하다.
- npm의 Trusted Publisher 등록은 저장 시 검증하지 않고 수정도 불가(삭제 후 재생성). 대소문자·`.yml` 확장자·환경명 공란까지 정확히 맞춰야 한다.

## 미뤄둔 것

- version/publish 잡 분리(`id-token: write`를 publish에만): 외부 기여 PR을 받기 시작하면.
- Version PR에 CI 붙이기(GitHub App 토큰): 브랜치 보호 규칙에 필수 체크를 넣을 때.
