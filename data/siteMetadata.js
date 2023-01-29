// @ts-check

/** @type {import("pliny/config").PlinyConfig } */
const siteMetadata = {
  title: 'Bravo Kernel',
  author: 'Bravo Kernel',
  headerTitle: 'Bravo Kernel',
  description: 'Bravo Kernel Blog',
  language: 'en-us',
  theme: 'system', // system, dark or light
  siteUrl: 'https://bravo-kernel.com',
  siteRepo: 'https://github.com/bravo-kernel/bravo-kernel.com/',
  siteLogo: '/static/images/logo.png', // used for SEO
  image: '/static/images/avatar.png',
  socialBanner: '/static/images/twitter-card.png',
  email: null,
  github: 'https://github.com/bravo-kernel',
  twitter: 'https://twitter.com/bravo_kernel',
  facebook: null,
  youtube: null,
  linkedin: null,
  locale: 'en-US',
  analytics: {
    // If you want to use an analytics provider you have to add it to the
    // content security policy in the `next.config.js` file.
    // supports plausible, simpleAnalytics, umami or googleAnalytics
  },
  newsletter: {
    // supports mailchimp, buttondown, convertkit, klaviyo, revue, emailoctopus
    // Please add your .env file and modify it according to your selection
    provider: null,
  },
  comments: {
    // If you want to use an analytics provider you have to add it to the
    // content security policy in the `next.config.js` file.
    // Select a provider and use the environment variables associated to it
    // https://vercel.com/docs/environment-variables
    provider: 'giscus', // supported providers: giscus, utterances, disqus
    giscusConfig: {
      // Visit the link below, and follow the steps in the 'configuration' section
      // https://giscus.app/
      repo: process.env.NEXT_PUBLIC_GISCUS_REPO,
      repositoryId: process.env.NEXT_PUBLIC_GISCUS_REPOSITORY_ID,
      category: process.env.NEXT_PUBLIC_GISCUS_CATEGORY,
      categoryId: process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID,
      mapping: 'pathname', // supported options: pathname, url, title
      reactions: '1', // Emoji reactions: 1 = enable / 0 = disable
      // Send discussion metadata periodically to the parent window: 1 = enable / 0 = disable
      metadata: '0',
      // theme example: light, dark, dark_dimmed, dark_high_contrast
      // transparent_dark, preferred_color_scheme, custom
      theme: 'light',
      // theme when dark mode
      darkTheme: 'transparent_dark',
      // If the theme option above is set to 'custom`
      // please provide a link below to your custom theme css file.
      // example: https://giscus.app/themes/custom_example.css
      themeURL: '',
      lang: 'en',
    },
  },
}

module.exports = siteMetadata
