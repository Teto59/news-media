import { getCollection, type CollectionEntry } from "astro:content";

// draft記事は本番ビルドでは一覧・RSS・sitemapに出さない(npm run devでは確認のため表示する)
export async function getPublishedArticles(): Promise<CollectionEntry<"articles">[]> {
  const isDev = import.meta.env.DEV;
  const articles = await getCollection("articles", (article) => isDev || !article.data.draft);
  return articles.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("ja-JP", { year: "numeric", month: "2-digit", day: "2-digit" });
}
