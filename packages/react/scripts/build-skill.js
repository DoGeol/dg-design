#!/usr/bin/env node
// skill-src/*.tsx(맨 앞 JSDoc = 설명, 나머지 = 예제 코드)에서 skill/dg-design/references/*.md를 만들고
// SKILL.md의 컴포넌트 목록을 갱신한다. `--check`면 쓰지 않고 다르면 실패한다(CI용).
import { readdirSync, readFileSync, writeFileSync, existsSync, rmSync } from "node:fs";
import { join, basename } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(import.meta.url), "../..");
const srcDir = join(root, "skill-src");
const skillDir = join(root, "skill/dg-design");
const refDir = join(skillDir, "references");
const check = process.argv.includes("--check");

const outputs = new Map();
const list = [];

for (const file of readdirSync(srcDir).filter((f) => f.endsWith(".tsx")).sort()) {
  const name = basename(file, ".tsx");
  const text = readFileSync(join(srcDir, file), "utf8");
  const match = text.match(/^\/\*\*([\s\S]*?)\*\/\s*/);
  if (!match) throw new Error(`${file}: 맨 앞 JSDoc이 없다`);
  const doc = match[1]
    .split("\n")
    .map((line) => line.replace(/^\s*\* ?/, ""))
    .join("\n")
    .trim();
  const title = doc.match(/^@title (.+)$/m)?.[1];
  const summary = doc.match(/^@summary (.+)$/m)?.[1];
  if (!title || !summary) throw new Error(`${file}: @title·@summary가 필요하다`);
  const body = doc.replace(/^@(title|summary) .+\n?/gm, "").trim();
  const code = text.slice(match[0].length).trim();
  outputs.set(
    join(refDir, `${name}.md`),
    `<!-- 생성 파일 — packages/react/skill-src/${file}에서 만든다. 직접 고치지 않는다. -->\n\n# ${title}\n\n${summary}\n\n${body}\n\n## 예제\n\n\`\`\`tsx\n${code}\n\`\`\`\n`,
  );
  list.push(`| [${title}](references/${name}.md) | \`@dg-design/react/${name}\` | ${summary} |`);
}

const skillPath = join(skillDir, "SKILL.md");
const skill = readFileSync(skillPath, "utf8");
const start = "<!-- components:start -->";
const end = "<!-- components:end -->";
const table = `${start}\n| 컴포넌트 | import | 한 줄 |\n| --- | --- | --- |\n${list.join("\n")}\n${end}`;
outputs.set(skillPath, skill.replace(new RegExp(`${start}[\\s\\S]*?${end}`), table));

const stale = existsSync(refDir)
  ? readdirSync(refDir).map((f) => join(refDir, f)).filter((p) => !outputs.has(p))
  : [];
const changed = [...outputs].filter(([path, content]) => !existsSync(path) || readFileSync(path, "utf8") !== content);

if (check) {
  if (changed.length || stale.length) {
    console.error("skill 참조 파일이 skill-src와 다르다. `pnpm --filter @dg-design/react run build:skill`을 돌려 커밋한다:");
    for (const [path] of changed) console.error(`  변경 ${path}`);
    for (const path of stale) console.error(`  남은 ${path}`);
    process.exit(1);
  }
  console.log(`skill 참조 ${list.length}개 최신`);
} else {
  for (const [path, content] of changed) writeFileSync(path, content);
  for (const path of stale) rmSync(path);
  console.log(`skill 참조 ${list.length}개 생성(${changed.length}개 변경, ${stale.length}개 삭제)`);
}
