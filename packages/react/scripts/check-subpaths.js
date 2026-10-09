/**
 * 하위 경로 가드. build 뒤 dist를 정적 import 그래프로 훑는다(의존성 0).
 * 배럴(dist/index.js)은 모든 컴포넌트와 CSS를 import한다. 하위 경로 진입점이 배럴에 닿으면
 * 컴포넌트 하나만 써도 전부 딸려오므로 실패시킨다. 하위 경로마다 닿는 폴더·CSS도 출력한다.
 */
import { readFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const dist = join(root, "dist");
const barrel = join(dist, "index.js");
const { exports } = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
// "./package.json" 같은 문자열 항목은 진입점이 아니다.
const entries = Object.entries(exports).filter(([subpath, target]) => subpath !== "." && target.default);

/** 상대 경로 import·re-export·side-effect import. 외부 패키지는 그래프에 넣지 않는다. */
function relativeImports(file) {
  const src = readFileSync(file, "utf8");
  return [...src.matchAll(/(?:from|import)\s*"(\.[^"]+)"/g)].map((m) => resolve(dirname(file), m[1]));
}

function reach(entry) {
  const seen = new Set([entry]);
  const queue = [entry];
  for (const file of queue) {
    if (!file.endsWith(".js")) continue;
    for (const dep of relativeImports(file)) {
      if (seen.has(dep)) continue;
      seen.add(dep);
      queue.push(dep);
    }
  }
  return seen;
}

const failures = [];
for (const [subpath, target] of entries) {
  const files = [...reach(join(root, target.default))].map((f) => relative(dist, f));
  if (files.includes("index.js")) failures.push(subpath);
  const folders = [...new Set(files.map((f) => f.split("/")[0]))].sort();
  const css = files.filter((f) => f.endsWith(".css")).sort();
  console.log(`${subpath}\n  폴더: ${folders.join(", ")}\n  CSS: ${css.join(", ") || "(없음)"}`);
}

if (failures.length > 0) {
  console.error(`\n배럴(${relative(root, barrel)})에 닿는 하위 경로: ${failures.join(", ")}`);
  process.exit(1);
}
console.log(`\n하위 경로 ${entries.length}개 모두 배럴에 닿지 않음`);
