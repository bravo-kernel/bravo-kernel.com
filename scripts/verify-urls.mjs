/**
 * URL parity gate for the Astro migration.
 *
 * Fetches the live sitemap from the production site and asserts that every URL
 * it lists is present in the freshly built dist/ output. Anything missing is a
 * broken inbound link, so a non-empty report fails the check.
 *
 *   node scripts/verify-urls.mjs [--local]
 *
 * --local compares against dist/sitemap.xml instead of the live site, which is
 * useful offline but only checks internal consistency, not link preservation.
 */
import { readFile, readdir } from 'node:fs/promises'
import { join, relative, sep } from 'node:path'

const DIST = new URL('../dist/', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')
const LIVE_SITEMAP = 'https://bravo-kernel.com/sitemap.xml'
const useLocal = process.argv.includes('--local')

async function walk(dir) {
  const out = []
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) out.push(...(await walk(full)))
    else out.push(full)
  }
  return out
}

/** Every path dist/ can actually serve. */
async function builtPaths() {
  const files = await walk(DIST)
  const paths = new Set()

  for (const file of files) {
    const rel = relative(DIST, file).split(sep).join('/')
    if (rel.endsWith('/index.html')) {
      paths.add('/' + rel.slice(0, -'/index.html'.length))
    } else if (rel === 'index.html') {
      paths.add('/')
    } else if (rel.endsWith('.html')) {
      paths.add('/' + rel.slice(0, -'.html'.length))
    } else {
      paths.add('/' + rel)
    }
  }
  return paths
}

function extractLocs(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => {
    const url = match[1].trim()
    const path = new URL(url).pathname.replace(/\/$/, '')
    return path === '' ? '/' : path
  })
}

async function liveePaths() {
  if (useLocal) {
    return extractLocs(await readFile(join(DIST, 'sitemap.xml'), 'utf8'))
  }
  const response = await fetch(LIVE_SITEMAP)
  if (!response.ok) throw new Error(`Failed to fetch ${LIVE_SITEMAP}: ${response.status}`)
  return extractLocs(await response.text())
}

const built = await builtPaths()
const live = await liveePaths()

// The four redirects are served by Vercel, not by a file in dist/.
const REDIRECTED = [/^\/$/, /^\/categories\//, /^\/page\//, /^\/\d{4}\/\d{2}\//]
const isRedirect = (path) => REDIRECTED.some((pattern) => pattern.test(path))

const missing = live.filter((path) => !built.has(path) && !isRedirect(path))

console.log(`source        : ${useLocal ? 'dist/sitemap.xml' : LIVE_SITEMAP}`)
console.log(`live URLs     : ${live.length}`)
console.log(`built paths   : ${built.size}`)
console.log(`missing       : ${missing.length}`)

if (missing.length > 0) {
  console.error('\nURLs that would break:\n' + missing.map((p) => `  ${p}`).join('\n'))
  process.exit(1)
}

// Report additions for visibility; these are new URLs, not broken ones.
const liveSet = new Set(live)
const added = [...built].filter(
  (path) => !liveSet.has(path) && !path.startsWith('/_astro/') && !path.startsWith('/static/'),
)
if (added.length > 0) {
  console.log('\nNew paths not in the live sitemap (informational):')
  for (const path of added.sort()) console.log(`  ${path}`)
}

console.log('\nOK — every live URL is present in the build.')
