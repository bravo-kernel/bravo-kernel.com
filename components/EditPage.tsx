import Link from 'next/link'
import { HiPencil } from 'react-icons/hi'
import siteMetadata from '@/data/siteMetadata'

interface Props {
  path: string
  title?: string
}

export default function EditPage({ path, title = 'Edit this page' }: Props) {
  path = path.replace(/^blog\//, '')
  path = `${siteMetadata.siteRepo}edit/main/data/blog/${path}.mdx`

  return (
    <div>
      <Link href={path} className="border-none">
        <HiPencil className="mr-1 inline !border-t-0" />
        {title}
      </Link>
    </div>
  )
}
