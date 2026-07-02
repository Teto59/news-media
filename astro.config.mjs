// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
// output: 'static' 以外禁止(docs/PLAN.md の絶対条件: DBなし・サーバーなしの静的サイト)
export default defineConfig({
  output: 'static',
});
