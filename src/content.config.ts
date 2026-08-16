import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
// Re-exported `z` from 'astro:content' is deprecated in Astro 7.
import { z } from 'astro/zod'

// Posts stay at data/blog/YYYY/MM/slug.mdx so their git history is preserved.
// The glob loader slugifies each path segment and rejoins with '/', so the
// generated id is exactly the URL tail: '2014/08/how-to-configure-git-private-email'.
const blog = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './data/blog' }),
  schema: z.object({
    title: z.string(),
    // js-yaml parses '2014-08-09 09:24:14 +0200' as a string (its !!timestamp
    // regex wants +02:00, not +0200) but '2023-05-03 14:48:07' as a Date.
    // z.coerce.date() handles both.
    date: z.coerce.date(),
    lastmod: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    // Opt-in table of contents; replaces the old <TOCInline toc={props.toc} />.
    toc: z.boolean().default(false),
    // `layout: PostSimple` in the source frontmatter is vestigial and is
    // silently stripped, since zod objects drop unknown keys by default.
  }),
})

export const collections = { blog }
