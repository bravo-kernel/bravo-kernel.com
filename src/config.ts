export const siteConfig = {
  title: 'Bravo Kernel',
  author: 'Bravo Kernel',
  description: 'Bravo Kernel Blog',
  language: 'en-us',
  locale: 'en-US',
  siteUrl: 'https://bravo-kernel.com',
  siteRepo: 'https://github.com/bravo-kernel/bravo-kernel.com',
  siteLogo: '/static/images/logo.png',
  avatar: '/static/images/avatar.png',
  socialBanner: '/static/images/twitter-card.png',
  github: 'https://github.com/bravo-kernel',
  twitter: 'https://twitter.com/bravo_kernel',
} as const

export const POSTS_PER_PAGE = 5

export const navLinks = [{ href: '/tags', title: 'Tags' }] as const

/**
 * Giscus configuration.
 *
 * The NEXT_PUBLIC_* names are kept from the previous stack so the existing
 * Vercel environment variables keep working. The values are public by design
 * (the giscus script receives them in the browser), but they stay in the
 * environment so a fork can point comments elsewhere without editing source.
 *
 * Read through import.meta.env, which Astro populates from both a local .env
 * file and real platform environment variables. process.env would only cover
 * the latter, so comments would work on Vercel but not locally.
 */
const env = import.meta.env as Record<string, string | undefined>

const GISCUS_VARS = [
  'NEXT_PUBLIC_GISCUS_REPO',
  'NEXT_PUBLIC_GISCUS_REPOSITORY_ID',
  'NEXT_PUBLIC_GISCUS_CATEGORY',
  'NEXT_PUBLIC_GISCUS_CATEGORY_ID',
] as const

const missingGiscusVars = GISCUS_VARS.filter((name) => !env[name])

// Fail loudly rather than silently shipping pages with no comment section.
// .env is not committed, so a fresh clone or an unconfigured deploy would
// otherwise look completely fine while quietly dropping every discussion.
if (missingGiscusVars.length > 0) {
  console.warn(
    `\n⚠  Giscus is disabled — missing ${missingGiscusVars.join(', ')}.` +
      `\n   Comments will be omitted from every post.` +
      `\n   Copy .env.example to .env locally, or set these as Vercel project` +
      ` environment variables.\n`,
  )
}

export const giscusConfig = {
  repo: env.NEXT_PUBLIC_GISCUS_REPO ?? '',
  repositoryId: env.NEXT_PUBLIC_GISCUS_REPOSITORY_ID ?? '',
  category: env.NEXT_PUBLIC_GISCUS_CATEGORY ?? '',
  categoryId: env.NEXT_PUBLIC_GISCUS_CATEGORY_ID ?? '',
  mapping: 'pathname',
  reactions: '1',
  metadata: '0',
  theme: 'light',
  darkTheme: 'transparent_dark',
  lang: 'en',
} as const

/**
 * Flip `enabled` to re-enable ads. It gates both the loader script in
 * BaseLayout and every ad unit, so nothing else needs changing. The
 * corresponding CSP entries are left in place in vercel.json.
 */
export const adsense = {
  enabled: false,
  client: 'ca-pub-1161412231963156',
  slot: '5565156947',
} as const
