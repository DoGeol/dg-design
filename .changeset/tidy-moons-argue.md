---
"@dg-design/react": patch
---

exports의 `"import"` 조건을 `"default"`로 바꿔 CJS 도구(Jest 등)에서 `ERR_PACKAGE_PATH_NOT_EXPORTED`로 해석이 막히던 문제를 고쳤습니다. react-dom은 현재 어떤 컴포넌트도 사용하지 않아 `peerDependenciesMeta`로 optional 표시했습니다.
