#!/usr/bin/env node
// サムネSVG(gen-thumb.mjsが生成)を1200x630のOG画像PNGに変換する。
// 仕様: editorial/DESIGN_NOTES.md「サムネSVG」節、docs/PLAN.md Phase2を参照。
//
// 使い方: node scripts/gen-og.mjs <slug>
//   事前に node scripts/gen-thumb.mjs <slug> でサムネSVGを生成しておくこと。

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { Resvg } from "@resvg/resvg-js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

const slug = process.argv[2];
if (!slug) {
  console.error("使い方: node scripts/gen-og.mjs <slug>");
  process.exit(1);
}

const thumbPath = path.join(rootDir, "public/thumbs", `${slug}.svg`);
let thumbSvg;
try {
  thumbSvg = readFileSync(thumbPath, "utf8");
} catch {
  console.error(
    `サムネSVGが見つかりません: ${thumbPath}(先に node scripts/gen-thumb.mjs ${slug} を実行すること)`,
  );
  process.exit(1);
}

const SRC_WIDTH = 800;
const SRC_HEIGHT = 450;
const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

// サムネ(16:9)をOG比率(1200x630)にcoverフィットさせる(拡大して中央でクロップ。文字は入れない)
const scale = Math.max(OG_WIDTH / SRC_WIDTH, OG_HEIGHT / SRC_HEIGHT);
const scaledWidth = SRC_WIDTH * scale;
const scaledHeight = SRC_HEIGHT * scale;
const offsetX = (OG_WIDTH - scaledWidth) / 2;
const offsetY = (OG_HEIGHT - scaledHeight) / 2;

const innerSvg = thumbSvg
  .replace(/^<\?xml[^>]*\?>\s*/, "")
  .replace(/<svg[^>]*>/, "")
  .replace(/<\/svg>\s*$/, "");

const ogSvg = `<svg viewBox="0 0 ${OG_WIDTH} ${OG_HEIGHT}" width="${OG_WIDTH}" height="${OG_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <g transform="translate(${offsetX.toFixed(1)} ${offsetY.toFixed(1)}) scale(${scale.toFixed(4)})">
    ${innerSvg}
  </g>
</svg>
`;

const resvg = new Resvg(ogSvg);
const png = resvg.render().asPng();

const outDir = path.join(rootDir, "public/og");
mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, `${slug}.png`);
writeFileSync(outPath, png);
console.log(`OG画像生成: ${path.relative(rootDir, outPath)}`);
