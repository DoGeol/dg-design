# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# dg-design

Dogeol Design System (DDS). daangn/seed-design 구조를 참고한 개인 디자인시스템.

## 참고 저장소

로컬 클론: `/Users/pdg/WebstormProjects/seed-design`

- 토큰/스키마 정의: `packages/rootage`, `packages/design-token`
- 스타일 레시피: `packages/qvism-preset`, `packages/css`, `packages/stylesheet`
- 컴포넌트: `packages/react`, `packages/react-headless`
- Tailwind 브릿지: `packages/tailwind4-theme`, `packages/tailwind3-plugin`

패턴 참고용 read-only. 코드 복사보다 구조·네이밍 참고 우선.

## 아키텍처 (확정 — 상세는 docs/specs/2026-08-14-dds-architecture.md)

- pnpm workspace 모노레포: `packages/tokens`, `packages/react`, `apps/storybook`
- 토큰: TS 단일 소스(primitive→semantic) → 미니 코드젠 스크립트 → `tokens.css` + `tailwind.css`(v4 `@theme` 재바인딩) + 타입
- 컴포넌트: 수기 plain CSS + CVA. variant=클래스(`.dds-button--variant_solid`), 런타임 상태=data-attribute. Tailwind 종속 없음
- CSS 배포: 컴포넌트별 CSS + side-effect import (seed 방식), `sideEffects: ["*.css"]`
- 빌드: Vite lib mode(`preserveModules`), ESM only. 다크모드는 `data-*` 속성 기반
- 배포: npm 공개(`@dg-design/*`, org 확보는 배포 단계에서 확정), changesets. 0.1.0 = Button 하나로 파이프라인 검증
- 하지 않을 것: 레시피 코드젠(qvism/Panda), headless 분리, YAML 정의, CJS — 트리거 조건은 스펙 참조
