import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const articles = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/articles" }),
  schema: z.object({
    title: z.string().max(48), // 扇動禁止。STYLE_GUIDE準拠
    lead: z.string().min(80).max(180), // リード文。カードと記事冒頭に表示
    tldr: z.array(z.string()).length(3), // 3行まとめ。各60字以内
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).min(1).max(4),
    sources: z
      .array(
        z.object({
          // ★出典。ニュース記事はmin(2)を運用ルールで強制
          name: z.string(), // 例: "Anthropic公式発表"
          url: z.string().url(),
          publisher: z.string().optional(),
          accessed: z.coerce.date(), // 参照日
        }),
      )
      .min(1),
    // サムネの手動差し替え(任意)。"/thumbs/xxx.jpg" のように public/ 配下のパスを指定する。
    // 未指定なら自動生成SVG(/thumbs/<slug>.svg)を使う。権利上使える画像のみ(DESIGN_NOTES.md参照)
    thumb: z.string().startsWith("/").optional(),
    corrections: z
      .array(
        z.object({
          // 訂正履歴(公開する)
          date: z.coerce.date(),
          description: z.string(),
        }),
      )
      .default([]),
    draft: z.boolean().default(true),
  }),
});

export const collections = { articles };
