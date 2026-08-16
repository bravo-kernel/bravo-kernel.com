import { getCollection, type CollectionEntry } from 'astro:content'
import type { Page } from 'astro'
import { POSTS_PER_PAGE } from '@/config'

export type Post = CollectionEntry<'blog'>

/** All posts, newest first. */
export async function getSortedPosts(): Promise<Post[]> {
  const posts = await getCollection('blog')
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
}

/** Every tag with its post count, ordered by count desc then name. */
export async function getTagCounts(posts?: Post[]): Promise<[string, number][]> {
  const all = posts ?? (await getSortedPosts())
  const counts = new Map<string, number>()
  for (const post of all) {
    for (const tag of post.data.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1)
    }
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
}

export function postUrl(post: Post): string {
  return `/blog/${post.id}`
}

/**
 * `paginate()` cannot run in a non-dynamic route, so /blog builds a Page object
 * by hand that is identical in shape to page 1 of /blog/page/[page]. Both routes
 * then render the same component, keeping their content byte-identical.
 */
export function makeFirstPage(posts: Post[]): Page<Post> {
  const data = posts.slice(0, POSTS_PER_PAGE)
  const lastPage = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE))
  return {
    data,
    start: 0,
    end: data.length - 1,
    size: POSTS_PER_PAGE,
    total: posts.length,
    currentPage: 1,
    lastPage,
    url: {
      current: '/blog',
      prev: undefined,
      next: lastPage > 1 ? '/blog/page/2' : undefined,
      first: undefined,
      last: lastPage > 1 ? `/blog/page/${lastPage}` : undefined,
    },
  }
}

/**
 * Derive a short excerpt from the body. No post has a `summary` field, so the
 * old list rendered an empty description for every entry.
 */
export function excerpt(post: Post, maxLength = 200): string {
  const body = post.body ?? ''
  const text = body
    .replace(/^import\s.+$/gm, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[*_`>]/g, '')
    .replace(/\s+/g, ' ')
    .trim()

  if (text.length <= maxLength) return text
  return text.slice(0, text.lastIndexOf(' ', maxLength)).trimEnd() + '…'
}

export function formatDate(date: Date, locale = 'en-US'): string {
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

export function isoDate(date: Date): string {
  return date.toISOString()
}
