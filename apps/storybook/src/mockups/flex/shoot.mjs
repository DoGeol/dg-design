// usage: BASE=<storybook URL> node apps/storybook/src/mockups/flex/shoot.mjs <출력 폴더> <id[@globals]> ...
// 예: node apps/storybook/src/mockups/flex/shoot.mjs out mockups-flex-forms-button--compare "select--state-matrix-story@brand:studio-blue;theme:dark"
// BASE를 안 주면 storybook-static을 정적 서버로 띄운다. iframe(Compare 열)이 다 그려질 때까지 기다린 뒤 full-page로 캡처한다.
import { createServer } from "node:http";
import { readFileSync, existsSync, mkdirSync, statSync } from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../../..");
const STATIC = process.env.STORYBOOK_STATIC ?? `${REPO}/apps/storybook/storybook-static`;
const require = createRequire(`${REPO}/apps/visual-regression/package.json`);
const { chromium } = require("@playwright/test");

const [outDir, ...targets] = process.argv.slice(2);
mkdirSync(outDir, { recursive: true });

let base = process.env.BASE;
let server;
if (!base) {
  const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".png": "image/png" };
  server = createServer((req, res) => {
    let p = path.join(STATIC, decodeURIComponent(new URL(req.url, "http://x").pathname));
    if (existsSync(p) && statSync(p).isDirectory()) p = path.join(p, "index.html");
    if (!existsSync(p)) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { "content-type": TYPES[path.extname(p)] ?? "application/octet-stream" });
    res.end(readFileSync(p));
  }).listen(0);
  base = `http://localhost:${server.address().port}`;
}

const browser = await chromium.launch();
const errors = [];
for (const target of targets) {
  const [id, globals = ""] = target.split("@");
  const mobile = globals.includes("density:mobile");
  const page = await browser.newPage({ viewport: { width: mobile ? 1290 : 1440, height: 900 }, deviceScaleFactor: 1 });
  page.on("pageerror", (e) => errors.push(`${target}: ${e.message}`));
  await page.goto(`${base}/iframe.html?id=${id}&viewMode=story${globals ? `&globals=${globals}` : ""}`);
  await page.waitForSelector("#storybook-root *", { timeout: 90000 }).catch(() => errors.push(`${target}: 빈 화면`));
  for (const frame of await page.$$("iframe")) {
    const inner = await frame.contentFrame();
    await inner?.waitForSelector("#storybook-root *", { timeout: 90000 }).catch(() => errors.push(`${target}: 빈 열`));
  }
  await page.waitForTimeout(900);
  const name = `${id}${globals ? `__${globals.replace(/[;:]/g, "-")}` : ""}.png`;
  await page.screenshot({ path: path.join(outDir, name), fullPage: true, animations: "disabled" });
  console.log("shot", name);
  await page.close();
}
await browser.close();
server?.close();
if (errors.length) console.log("ERRORS\n" + errors.join("\n"));
