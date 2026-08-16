// @ts-check
import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import tailwindcss from '@tailwindcss/vite'
import {
  transformerMetaHighlight,
  transformerNotationDiff,
  transformerNotationFocus,
  transformerNotationHighlight,
} from '@shikijs/transformers'

// https://astro.build/config
export default defineConfig({
  site: 'https://bravo-kernel.com',
  output: 'static',
  trailingSlash: 'never',

  // No adapter on purpose. Redirects and security headers live in vercel.json:
  // Astro's own `redirects` only emits <meta http-equiv="refresh"> on static
  // builds and cannot express the regex needed for the legacy permalink rule.
  integrations: [
    // `optimize` is deliberately off: it breaks the `components` prop on
    // <Content /> (withastro/astro#14611).
    mdx(),
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  markdown: {
    shikiConfig: {
      themes: {
        light: 'night-owl-light',
        dark: 'night-owl',
      },
      // Required so both themes emit CSS variables instead of inline colours.
      defaultColor: false,
      wrap: true,
      transformers: [
        transformerMetaHighlight(), // ```js {1,3-4}
        transformerNotationHighlight(), // // [!code highlight]
        transformerNotationDiff(), // // [!code ++] / [!code --]
        transformerNotationFocus(), // // [!code focus]
      ],
    },
  },
})
