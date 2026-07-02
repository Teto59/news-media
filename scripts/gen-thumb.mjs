#!/usr/bin/env node
// スラッグから決定論的にサムネSVGを生成する(同じ記事は常に同じ絵)。
// 仕様: editorial/DESIGN_NOTES.md「サムネSVG」節を参照。
//
// 使い方: node scripts/gen-thumb.mjs <slug>
//   <slug> は src/content/articles/<slug>.md のファイル名(拡張子なし)。
//   記事の最初のタグ名から主色を、slug文字列から幾何構成を決定する。

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

const slug = process.argv[2];
if (!slug) {
  console.error("使い方: node scripts/gen-thumb.mjs <slug>");
  process.exit(1);
}

const articlePath = path.join(rootDir, "src/content/articles", `${slug}.md`);
let source;
try {
  source = readFileSync(articlePath, "utf8");
} catch {
  console.error(`記事ファイルが見つかりません: ${articlePath}`);
  process.exit(1);
}

function extractFirstTag(markdown) {
  const frontmatter = markdown.split("---")[1] ?? "";
  const inline = frontmatter.match(/tags:\s*\[([^\]]*)\]/);
  if (inline) {
    const first = inline[1].split(",")[0];
    return first.replace(/["']/g, "").trim();
  }
  const block = frontmatter.match(/tags:\s*\n((?:\s*-\s*.+\n?)+)/);
  if (block) {
    const first = block[1].split("\n")[0];
    return first.replace(/-/, "").replace(/["']/g, "").trim();
  }
  return "";
}

const firstTag = extractFirstTag(source);

// 文字列 -> 32bit整数の決定論的ハッシュ(FNV-1a)
function hashString(str) {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

// シード付き擬似乱数生成器(mulberry32)。ビルドごとの再現性を保証する。
function mulberry32(seed) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// editorial/DESIGN_NOTES.md のトークンを写した固定値(このスクリプトはCSSトークンを参照できないビルド時アセット生成のため直書き)
const PAPER = "#F6F1E7";
const PALETTE = ["#2A5A8C", "#C2451E", "#3F6B4F", "#A67C2E"]; // 藍・朱・深緑・黄土

const tagHash = hashString(firstTag || slug);
const mainColor = PALETTE[tagHash % PALETTE.length];

const slugHash = hashString(slug);
const rand = mulberry32(slugHash);

const WIDTH = 800;
const HEIGHT = 450;

function diagonalBands(rand, color) {
  const bandCount = 3 + Math.floor(rand() * 3);
  let bands = "";
  for (let i = 0; i < bandCount; i++) {
    const w = 20 + rand() * 50;
    const x = rand() * WIDTH * 1.4 - WIDTH * 0.2;
    const opacity = (0.12 + rand() * 0.18).toFixed(2);
    bands += `<rect x="${x.toFixed(1)}" y="-40" width="${w.toFixed(1)}" height="${HEIGHT + 80}" fill="${color}" opacity="${opacity}" transform="rotate(28 ${(x + w / 2).toFixed(1)} ${HEIGHT / 2})" />`;
  }
  return bands;
}

function concentricArcs(rand, color) {
  const cx = WIDTH * (0.2 + rand() * 0.6);
  const cy = HEIGHT * (0.2 + rand() * 0.6);
  const ringCount = 3 + Math.floor(rand() * 4);
  let arcs = "";
  for (let i = 0; i < ringCount; i++) {
    const r = 30 + i * (28 + rand() * 14);
    const opacity = (0.16 - i * 0.015).toFixed(2);
    arcs += `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${r.toFixed(1)}" fill="none" stroke="${color}" stroke-width="${(2 + rand() * 3).toFixed(1)}" opacity="${Math.max(0.05, opacity)}" />`;
  }
  return arcs;
}

function dotCluster(rand, color) {
  const dotCount = 18 + Math.floor(rand() * 24);
  let dots = "";
  for (let i = 0; i < dotCount; i++) {
    const x = rand() * WIDTH;
    const y = rand() * HEIGHT;
    const r = 2 + rand() * 6;
    const opacity = (0.15 + rand() * 0.35).toFixed(2);
    dots += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="${color}" opacity="${opacity}" />`;
  }
  return dots;
}

const layers = [diagonalBands, concentricArcs, dotCluster];
// シードで2種を選んで層状に重ねる
const shuffled = [...layers].sort(() => rand() - 0.5);
const chosen = shuffled.slice(0, 2);

const layerSvg = chosen.map((layerFn) => layerFn(rand, mainColor)).join("\n  ");

const svg = `<svg viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="">
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${PAPER}" />
  ${layerSvg}
</svg>
`;

const outDir = path.join(rootDir, "public/thumbs");
mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, `${slug}.svg`);
writeFileSync(outPath, svg, "utf8");
console.log(`サムネ生成: ${path.relative(rootDir, outPath)}`);
