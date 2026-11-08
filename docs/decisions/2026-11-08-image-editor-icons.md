# 이미지 편집용 아이콘 확장

- 상태: 구현·로컬 검증 완료, 미배포
- 요청: dg-studio 이미지 에디터 시안 1에 필요한 아이콘을 DDS에 추가한다.
- 브랜치: `codex/image-editor-icons` (별도 워크트리)

## 결정

CropIcon, RotateLeftIcon, RotateRightIcon, FlipHorizontalIcon, FlipVerticalIcon,
ResizeIcon, MosaicIcon, TextIcon, AdjustmentsIcon, FilterIcon, HandIcon,
FitScreenIcon, ImageIcon 13종을 추가한다. 기존 37종과 합쳐 50종이다.

기존 IconBase의 24 grid, currentColor, stroke 토큰, 16/20/24 크기,
ref·label·장식 접근성 계약을 그대로 사용한다. 외부 라이브러리를 추가하지 않는다.
각 아이콘은 독립 모듈이며 icon 하위 경로와 루트 배럴에 공개한다.
이름을 바꾸거나 기존 모양을 교체하지 않는 additive API 확장이다.

## 검증

- tokens generate·전체 build·전체 typecheck 통과.
- React 단위 테스트 58파일 850개 통과. 기존 모든 아이콘의 공통 계약 테스트에 13종도 포함.
- check:subpaths, build:skill/check:skill, publint 통과.
- 빌드한 Storybook을 로컬 브라우저에서 열어 새 아이콘 13종의 16/20/24px 표시를 확인했다.
- Storybook state matrix가 확장돼 CI에서 VR baseline을 갱신해야 한다. 로컬에서 기준을 갱신하지 않았다.

## 배포·소비

minor changeset을 준비했다. 로컬 version/publish·수동 태그는 사용하지 않는다.
사용자의 커밋·푸시 승인 후 PR·정식 release workflow 절차로 배포한다.
소비 앱은 npm 배포판만 사용하므로 현재 미배포 소스를 link·복사하지 않는다.

## CI 기준 갱신

Visual Baseline run `42490735172`가 성공해 icon state matrix의 라이트·다크 PNG와
색 텍스트 기준 4파일만 갱신했다. 기존 기준에서 발생한 아이콘 행 추가 차이를
반영한 것으로, 다른 컴포넌트 기준은 바뀌지 않았다. 갱신한 기준 위에서 PR CI를 다시 확인한다.
