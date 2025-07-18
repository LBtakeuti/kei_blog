// Dummy export for type compatibility
export const supabase = null as any

// 型定義
export type Post = {
  id: string
  title: string
  content: string
  excerpt: string
  category: string
  tags: string[]
  author: string
  featured_image?: string
  image_layouts?: any[]
  is_draft: boolean
  is_published: boolean
  created_at: string
  updated_at: string
}

export type Category = {
  id: string
  name: string
  slug: string
  description?: string
  color: string
  order: number
  created_at: string
  updated_at: string
}

export type PostImage = {
  id: string
  post_id: string
  url: string
  alt: string
  caption?: string
  layout_id: string
  position: number
  created_at: string
}