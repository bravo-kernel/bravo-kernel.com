import rss from './rss.mjs'
import search from './search.mjs'

async function postbuild() {
  await Promise.all([rss(), search()])
  await Promise.all([search()])
}

postbuild()
