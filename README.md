# bravo-kernel.com

The source of [bravo-kernel.com](https://bravo-kernel.com), a static blog built with
[Astro](https://astro.build) and [Tailwind CSS](https://tailwindcss.com), deployed on Vercel.

## Requirements

Node 24 (see `.nvmrc`). Astro 7 requires Node >= 22.12.

## Getting started

```bash
nvm use
npm install
npm run dev          # http://localhost:4321
```

| Script                | What it does                                              |
| --------------------- | --------------------------------------------------------- |
| `npm run dev`         | Start the dev server                                       |
| `npm run build`       | Type-check, then build to `dist/`                          |
| `npm run preview`     | Serve the production build locally                         |
| `npm run check`       | Type-check only (`astro check`)                            |
| `npm run format`      | Format with Prettier                                       |
| `npm run verify-urls` | Assert every live URL still exists in `dist/` (see below)  |

## Writing a post

Posts live in `data/blog/YYYY/MM/slug.mdx`. **The file path is the URL**:
`data/blog/2023/05/my-post.mdx` is served at `/blog/2023/05/my-post`.

```yaml
---
title: How to do the thing
date: 2023-05-03 14:48:07
lastmod: 2024-01-02 09:00:00 +0200 # optional
tags:
  - git
  - tutorial
toc: true # optional, renders a table of contents from the h2 headings
---
```

Images go in `public/static/images/blog/YYYY/MM/slug/` and are referenced with an absolute
path: `![alt](/static/images/blog/2023/05/my-post/screenshot.png)`.

Code fences support Shiki line highlighting — ```` ```js {1,3-4} ```` — plus the
`[!code highlight]`, `[!code ++]`, `[!code --]` and `[!code focus]` comment notations.

## URL preservation

The site has inbound links going back to 2010, so URLs are treated as a contract.
`npm run verify-urls` fetches the production sitemap, enumerates the freshly built
`dist/`, and fails if any live URL is missing from the build. Run it after any change
to routing, slugs, or pagination.

Four permanent redirects are served by Vercel via `vercel.json` (they are not files in
`dist/`, so `verify-urls` treats them separately):

| From              | To                        |
| ----------------- | ------------------------- |
| `/`               | `/blog`                   |
| `/categories/:tag`| `/tags/:tag`              |
| `/page/:n`        | `/blog/page/:n`           |
| `/:yyyy/:mm/:slug`| `/blog/:yyyy/:mm/:slug`   |

`vercel.json` also carries the CSP and the other security headers. There is deliberately
**no** `@astrojs/vercel` adapter: the build is plain static output, and an adapter's
generated routing config would conflict with `vercel.json`.

Note `/blog` and `/blog/page/1` are both real pages showing identical content, because
both are in the live sitemap.

## Configuration

- `src/config.ts` — site metadata, nav, posts-per-page, Giscus and AdSense IDs
- `astro.config.mjs` — Astro, MDX, Tailwind and Shiki config
- `src/content.config.ts` — the blog collection schema
- `.env` — Giscus IDs (`NEXT_PUBLIC_GISCUS_*`, kept under those names so the existing
  Vercel environment variables keep working)

The sitemap is hand-rolled at `src/pages/sitemap.xml.ts` rather than using
`@astrojs/sitemap`, which would emit `/sitemap-index.xml` and move the existing URL.
