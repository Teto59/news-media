import { getCollection, type CollectionEntry } from "astro:content";

// draft記事は本番ビルドでは一覧・RSS・sitemapに出さない(npm run devでは確認のため表示する)
export async function getPublishedArticles(): Promise<CollectionEntry<"articles">[]> {
  const isDev = import.meta.env.DEV;
  const articles = await getCollection("articles", (article) => isDev || !article.data.draft);
  // pubDate降順。同日に複数記事を出す場合はpubDateに時刻まで入れて順序を確定させる
  // (日付のみ同士だと同時刻扱いになり、順序がファイル名順で不定になるため)
  return articles.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export function formatDate(date: Date): string {
  // ビルド環境のタイムゾーン(CIはUTC)に依存しないよう日本時間で固定する
  return date.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Asia/Tokyo",
  });
}
