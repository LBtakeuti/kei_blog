import { Metadata } from 'next'

interface Post {
  id: number
  title: string
  excerpt?: string
  content?: string
  author: string
  date: string
  image: string
  category?: string
  tags?: string[]
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  if (typeof window !== 'undefined') {
    return {}
  }
  
  return {
    title: 'Blog Post',
    description: 'Read our latest blog post',
  }
}

export default function PostLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}