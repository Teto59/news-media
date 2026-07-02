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
// ポスター調の大胆な色面構成: 主色のベタ地に紙色・墨色の大きな幾何形を重ねる(DESIGN_NOTES.md「サムネSVG」節)
const PAPER = "#F6F1E7";
const INK = "#211D16";
const PALETTE = [
  { main: "#2A5A8C", deep: "#1C3D60" }, // 藍
  { main: "#C2451E", deep: "#8F3115" }, // 朱
  { main: "#3F6B4F", deep: "#2B4A36" }, // 深緑
  { main: "#A67C2E", deep: "#7A5A20" }, // 黄土
];

const tagHash = hashString(firstTag || slug);
const { main: MAIN, deep: DEEP } = PALETTE[tagHash % PALETTE.length];

const slugHash = hashString(slug);
const rand = mulberry32(slugHash);

const WIDTH = 800;
const HEIGHT = 450;

// 構成A: 斜め帯 — 主色のベタ地に、紙色の太い帯と濃色・墨の細い帯を斜めに走らせる
function bandComposition(rand) {
  const angle = 24 + Math.floor(rand() * 12); // 24〜35°
  const parts = [`<rect width="${WIDTH}" height="${HEIGHT}" fill="${MAIN}" />`];
  const bandXs = [WIDTH * (0.1 + rand() * 0.2), WIDTH * (0.45 + rand() * 0.2), WIDTH * (0.75 + rand() * 0.15)];
  const widths = [70 + rand() * 90, 26 + rand() * 30, 110 + rand() * 110];
  const fills = [PAPER, INK, DEEP];
  for (let i = 0; i < 3; i++) {
    parts.push(
      `<rect x="${bandXs[i].toFixed(1)}" y="-80" width="${widths[i].toFixed(1)}" height="${HEIGHT + 160}" fill="${fills[i]}" transform="rotate(${angle} ${(bandXs[i] + widths[i] / 2).toFixed(1)} ${HEIGHT / 2})" />`,
    );
  }
  // 紙色の帯の残響(細い平行線)
  const echoX = bandXs[0] + widths[0] + 18;
  parts.push(
    `<rect x="${echoX.toFixed(1)}" y="-80" width="6" height="${HEIGHT + 160}" fill="${PAPER}" opacity="0.65" transform="rotate(${angle} ${echoX.toFixed(1)} ${HEIGHT / 2})" />`,
  );
  return parts.join("\n  ");
}

// 構成B: 円環 — 主色のベタ地に、大きな紙色の円と濃色の円環、墨の点をひとつ
function circleComposition(rand) {
  const left = rand() < 0.5;
  const cx = WIDTH * (left ? 0.24 + rand() * 0.14 : 0.62 + rand() * 0.14);
  const cy = HEIGHT * (0.3 + rand() * 0.4);
  const r = 150 + rand() * 90;
  const parts = [`<rect width="${WIDTH}" height="${HEIGHT}" fill="${MAIN}" />`];
  // 反対側に紙色の細い同心弧(奥行き)
  const acx = WIDTH * (left ? 1.02 : -0.02);
  for (let i = 0; i < 3; i++) {
    parts.push(
      `<circle cx="${acx.toFixed(1)}" cy="${(HEIGHT * (0.2 + rand() * 0.6)).toFixed(1)}" r="${(160 + i * 60 + rand() * 30).toFixed(1)}" fill="none" stroke="${PAPER}" stroke-width="3" opacity="0.5" />`,
    );
  }
  parts.push(`<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${r.toFixed(1)}" fill="${PAPER}" />`);
  parts.push(
    `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${(r * 0.55).toFixed(1)}" fill="none" stroke="${DEEP}" stroke-width="${(10 + rand() * 8).toFixed(1)}" />`,
  );
  // 円環の縁に墨の点(印のように)
  const theta = rand() * Math.PI * 2;
  parts.push(
    `<circle cx="${(cx + Math.cos(theta) * r * 0.55).toFixed(1)}" cy="${(cy + Math.sin(theta) * r * 0.55).toFixed(1)}" r="${(13 + rand() * 6).toFixed(1)}" fill="${INK}" />`,
  );
  return parts.join("\n  ");
}

// 構成C: 対角分割 — 濃色の地を主色の大きな面が斜めに分割し、境界に紙色の円が乗る
function splitComposition(rand) {
  const topY = HEIGHT * (0.15 + rand() * 0.35);
  const bottomY = HEIGHT * (0.55 + rand() * 0.35);
  const parts = [
    `<rect width="${WIDTH}" height="${HEIGHT}" fill="${DEEP}" />`,
    `<polygon points="0,${topY.toFixed(1)} ${WIDTH},${bottomY.toFixed(1)} ${WIDTH},${HEIGHT} 0,${HEIGHT}" fill="${MAIN}" />`,
    `<line x1="0" y1="${topY.toFixed(1)}" x2="${WIDTH}" y2="${bottomY.toFixed(1)}" stroke="${PAPER}" stroke-width="3" opacity="0.7" />`,
  ];
  // 境界線上に紙色の円
  const t = 0.25 + rand() * 0.5;
  const cx = WIDTH * t;
  const cy = topY + (bottomY - topY) * t;
  const r = 60 + rand() * 55;
  parts.push(`<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${r.toFixed(1)}" fill="${PAPER}" />`);
  parts.push(`<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${(r * 0.42).toFixed(1)}" fill="${INK}" />`);
  // 隅に紙色の細い平行罫3本(紙面の段組の暗喩)
  const rx = rand() < 0.5 ? WIDTH * 0.08 : WIDTH * 0.72;
  const ry = topY > HEIGHT * 0.3 ? HEIGHT * 0.12 : HEIGHT * 0.76;
  for (let i = 0; i < 3; i++) {
    parts.push(
      `<rect x="${rx.toFixed(1)}" y="${(ry + i * 14).toFixed(1)}" width="${(WIDTH * 0.16).toFixed(1)}" height="3" fill="${PAPER}" opacity="0.85" />`,
    );
  }
  return parts.join("\n  ");
}

const compositions = [bandComposition, circleComposition, splitComposition];
// 構成はスラッグのハッシュ値から直接決める(擬似乱数の初回出力はシード近傍で偏ることがあるため)
const compose = compositions[slugHash % compositions.length];

const svg = `<svg viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="">
  ${compose(rand)}
</svg>
`;

const outDir = path.join(rootDir, "public/thumbs");
mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, `${slug}.svg`);
writeFileSync(outPath, svg, "utf8");
console.log(`サムネ生成: ${path.relative(rootDir, outPath)}`);
