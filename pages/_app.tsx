import { Analytics } from '@vercel/analytics/react'
import '@/css/tailwind.css'
import '@/css/prism.css'
import 'katex/dist/katex.css'
import '@/css/overrides.css'
// import '@/css/docsearch.css' // Uncomment if using algolia docsearch
// import '@docsearch/css' // Uncomment if using algolia docsearch

import { ThemeProvider } from 'next-themes'
import type { AppProps } from 'next/app'
import Head from 'next/head'

import siteMetadata from '@/data/siteMetadata'
import { SearchProvider } from 'pliny/search'
import LayoutWrapper from '@/components/LayoutWrapper'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme={siteMetadata.theme}>
      <Head>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>
      <LayoutWrapper>
        <SearchProvider searchConfig={siteMetadata.search}>
          <Component {...pageProps} />
          <Analytics />
        </SearchProvider>
      </LayoutWrapper>
    </ThemeProvider>
  )
}
