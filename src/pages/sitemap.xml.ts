import type { APIRoute } from 'astro'
import { getSortedPosts, getTagCounts, postUrl } from '@/lib/posts'
import { POSTS_PER_PAGE } from '@/config'

/**
 * Hand-rolled rather than using @astrojs/sitemap, which always emits
 * sitemap-index.xml + sitemap-0.xml with no way to suppress the index file.
 * The live site serves a single /sitemap.xml and that URL must not move.
 */
export const GET: APIRoute = async ({ site }) => {
  const posts = await getSortedPosts()
  const tags = await getTagCounts(posts)
  const lastPage = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE))
  const origin = site!.origin

  const urls: { loc: string; lastmod?: Date }[] = [
    { loc: '/blog' },
    ...Array.from({ length: lastPage }, (_, index) => ({ loc: `/blog/page/${index + 1}` })),
    { loc: '/tags' },
    ...tags.map(([tag]) => ({ loc: `/tags/${tag}` })),
    ...posts.map((post) => ({
      loc: postUrl(post),
      lastmod: post.data.lastmod ?? post.data.date,
    })),
  ]

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    ({ loc, lastmod }) =>
      `  <url><loc>${origin}${loc}</loc>${
        lastmod ? `<lastmod>${lastmod.toISOString()}</lastmod>` : ''
      }</url>`,
  )
  .join('\n')}
</urlset>
`

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  })
}
