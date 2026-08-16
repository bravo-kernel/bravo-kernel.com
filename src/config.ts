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
 * Giscus still reads the NEXT_PUBLIC_* variable names on purpose: these are
 * baked into the static HTML at build time, so nothing in the Vercel dashboard
 * has to change and comments cannot silently break on deploy.
 *
 * Read through import.meta.env, which Astro populates from both the local .env
 * file and real platform environment variables. process.env would only cover
 * the latter, so comments would work on Vercel but not locally.
 */
const env = import.meta.env as Record<string, string | undefined>

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
