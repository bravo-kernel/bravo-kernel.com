# bravo-kernel.com

The source of [bravo-kernel.com](https://bravo-kernel.com), a static blog built with
[Astro](https://astro.build) and [Tailwind CSS](https://tailwindcss.com), deployed on Vercel.

## Getting started

Requires **Node 24** (see `.nvmrc`; Astro 7 needs >= 22.12).

```bash
nvm use
npm install
cp .env.example .env    # then fill in the Giscus IDs, see Configuration
npm run dev             # http://localhost:4321
```

| Script                | What it does                                              |
| --------------------- | --------------------------------------------------------- |
| `npm run dev`         | Start the dev server                                      |
| `npm run build`       | Type-check, then build to `dist/`                         |
| `npm run preview`     | Serve the production build locally                        |
| `npm run check`       | Type-check only (`astro check`)                           |
| `npm run format`      | Format with Prettier                                      |
| `npm run verify-urls` | Assert every live URL still exists in `dist/` (see below) |

## Writing a post

Posts live in `data/blog/YYYY/MM/slug.mdx`. **The file path is the URL**:
`data/blog/2023/05/my-post.mdx` is served at `/blog/2023/05/my-post`. Renaming or
moving a file changes a published URL, so don't.

```yaml
---
title: How to do the thing
date: 2023-05-03 14:48:07
lastmod: 2024-01-02 09:00:00 +0200 # optional, shown as "updated ..."
tags:
  - git
  - tutorial
toc: true # optional, renders a table of contents from the h2 headings
---
```

`title`, `date` and `tags` are required; the schema is enforced at build time in
`src/content.config.ts`, so a typo fails the build rather than shipping.

Images go in `public/static/images/blog/YYYY/MM/slug/` and are referenced with an
absolute path: `![alt](/static/images/blog/2023/05/my-post/screenshot.png)`.

Code fences support Shiki line highlighting — ` ```js {1,3-4} ` — plus the
`[!code highlight]`, `[!code ++]`, `[!code --]` and `[!code focus]` comment notations.

Post summaries on the list pages are derived from the body automatically; there is no
`summary` field to maintain.

## Configuration

| Where                   | What                                                         |
| ----------------------- | ------------------------------------------------------------ |
| `src/config.ts`         | Site metadata, nav, posts-per-page, Giscus and AdSense       |
| `astro.config.mjs`      | Astro, MDX, Tailwind and Shiki                               |
| `src/content.config.ts` | Blog collection schema                                       |
| `src/styles/global.css` | Tailwind theme (teal/neutral/Inter), prose and Shiki styling |
| `vercel.json`           | Redirects, security headers, framework preset                |

### Environment variables

`.env` is **not** committed. Copy `.env.example` to `.env` for local development, and
set the same variables as Project Environment Variables in Vercel for deploys.

| Variable                           | Purpose         |
| ---------------------------------- | --------------- |
| `NEXT_PUBLIC_GISCUS_REPO`          | Giscus comments |
| `NEXT_PUBLIC_GISCUS_REPOSITORY_ID` | Giscus comments |
| `NEXT_PUBLIC_GISCUS_CATEGORY`      | Giscus comments |
| `NEXT_PUBLIC_GISCUS_CATEGORY_ID`   | Giscus comments |

The `NEXT_PUBLIC_` prefix is a leftover from the previous Next.js stack, kept so the
existing Vercel variables keep working. The values are public by design — the giscus
script receives them in the browser — so they are not secrets, but they stay in the
environment rather than in source.

If any are missing, **the build logs a warning and omits the comment section entirely**
rather than failing silently.

### Ads

AdSense is currently **off**. Flip `adsense.enabled` in `src/config.ts` to bring it
back; that single flag gates both the loader script and every ad unit. The matching
CSP entries and `public/ads.txt` are left in place so nothing else is needed.

## URL preservation

The blog has inbound links going back to 2010, so URLs are treated as a contract.

`npm run verify-urls` fetches the production sitemap, enumerates the freshly built
`dist/`, and fails if any live URL is missing from the build. **Run it after any change
to routing, slugs, filenames or pagination.**

Four permanent redirects are served by Vercel via `vercel.json` (they are not files in
`dist/`, so `verify-urls` accounts for them separately):

| From               | To                      |
| ------------------ | ----------------------- |
| `/`                | `/blog`                 |
| `/categories/:tag` | `/tags/:tag`            |
| `/page/:n`         | `/blog/page/:n`         |
| `/:yyyy/:mm/:slug` | `/blog/:yyyy/:mm/:slug` |

Some deliberate choices worth knowing before changing them:

- **No `@astrojs/vercel` adapter.** The build is plain static output. Astro's own
  `redirects` only emits meta-refresh on static builds and cannot express the
  `\d{4}/\d{2}` legacy-permalink pattern, and an adapter's generated routing config
  would conflict with `vercel.json`.
- **`/blog` and `/blog/page/1` are both real pages** rendering identical content,
  because both are in the published sitemap.
- **The sitemap is hand-rolled** at `src/pages/sitemap.xml.ts`. `@astrojs/sitemap`
  always emits `/sitemap-index.xml` with no way to suppress it, which would move the
  existing URL.
- **`vercel.json` pins the framework preset.** The Vercel project previously had a
  Next.js preset saved in its dashboard; `vercel.json` overrides it so deploys don't
  depend on a dashboard toggle.

## History

This was a Next.js 13 blog (a `tailwind-nextjs-starter-blog` fork using contentlayer
and pliny) until August 2026, when it was rewritten on Astro. Contentlayer had been
unmaintained since 2023 and its output broke on Node 22+, which made the whole stack
un-upgradeable. All 112 published URLs were preserved through the rewrite.
