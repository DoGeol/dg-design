// usage: STORYBOOK_STATIC=<빌드 폴더> node apps/storybook/src/mockups/shoot.mjs <출력 폴더> [스토리 id 일부]
// storybook-static을 정적 서버로 띄우고 Mockups/A 스토리를 전부 full-page로 캡처한다.
import { createServer } from "node:http";
import { readFileSync, existsSync, mkdirSync, statSync } from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const REPO = "/Users/pdg/WebstormProjects/dg-design";
const STATIC = process.env.STORYBOOK_STATIC ?? `${REPO}/apps/storybook/storybook-static`;
const require = createRequire(`${REPO}/apps/visual-regression/package.json`);
const { chromium } = require("@playwright/test");

const outDir = process.argv[2];
const filter = process.argv[3] ?? "";
mkdirSync(outDir, { recursive: true });

const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".png": "image/png" };
const server = createServer((req, res) => {
  let p = path.join(STATIC, decodeURIComponent(new URL(req.url, "http://x").pathname));
  if (existsSync(p) && statSync(p).isDirectory()) p = path.join(p, "index.html");
  if (!existsSync(p)) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { "content-type": TYPES[path.extname(p)] ?? "application/octet-stream" });
  res.end(readFileSync(p));
}).listen(0);
const port = server.address().port;

const { entries } = JSON.parse(readFileSync(`${STATIC}/index.json`, "utf8"));
const ids = Object.values(entries).filter((e) => e.type === "story" && e.title.startsWith("Mockups/A/") && e.id.includes(filter)).map((e) => e.id);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 1 });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
for (const id of ids) {
  await page.goto(`http://localhost:${port}/iframe.html?id=${id}&viewMode=story`);
  await page.waitForSelector("[data-mockup]", { timeout: 15000 });
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(outDir, `${id}.png`), fullPage: true, animations: "disabled" });
  console.log("shot", id);
}
if (errors.length) console.log("PAGE ERRORS", errors);
await browser.close();
server.close();
