import rss from '@astrojs/rss'
import type { APIRoute } from 'astro'
import { excerpt, getSortedPosts, postUrl } from '@/lib/posts'
import { siteConfig } from '@/config'

// Filename drives the URL: /feed.xml, matching the current live feed.
export const GET: APIRoute = async (context) => {
  const posts = await getSortedPosts()

  return rss({
    title: siteConfig.title,
    description: siteConfig.description,
    site: context.site!,
    // @astrojs/rss appends a trailing slash by default; the site is
    // trailingSlash: 'never', so feed links would otherwise all get 308'd.
    trailingSlash: false,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      // No trailing slash, to match trailingSlash: 'never'.
      link: postUrl(post),
      description: excerpt(post, 300),
      categories: [...post.data.tags],
    })),
    customData: `<language>${siteConfig.language}</language>`,
  })
}
