// @ts-check

/** @type {import("pliny/config").PlinyConfig } */
const siteMetadata = {
  title: 'Bravo Kernel',
  author: 'Bravo Kernel',
  headerTitle: 'Bravo Kernel',
  description: null,
  language: 'en-us',
  theme: 'system', // system, dark or light
  siteUrl: 'https://bravo-kernel.com/',
  siteRepo: 'https://github.com/bravo-kernel/bravo-kernel.com/',
  siteLogo: '/static/images/logo.png',
  image: '/static/images/avatar.png',
  socialBanner: 'static/images/twitter-card.png',
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
    googleAnalyticsId: 'G-54901CB409', // e.g. UA-000000-2 or G-XXXXXXX
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
    provider: 'disqus', // supported providers: giscus, utterances, disqus
    disqusConfig: {
      shortname: 'bravo-kernel',
    },
  },
}

module.exports = siteMetadata
