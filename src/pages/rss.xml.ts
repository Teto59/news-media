import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getPublishedArticles } from "../lib/articles";
import { SITE_NAME, SITE_DESCRIPTION } from "../consts";

export async function GET(context: APIContext) {
  const articles = await getPublishedArticles();
  return rss({
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    site: context.site ?? "",
    items: articles.map((article) => ({
      title: article.data.title,
      description: article.data.lead,
      pubDate: article.data.pubDate,
      link: `/articles/${article.id}/`,
    })),
  });
}
