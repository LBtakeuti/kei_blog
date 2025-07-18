import { supabase } from './supabase'
import { postService } from './supabase-service'

export interface Post {
  id: number
  title: string
  content: string
  excerpt?: string
  author: string
  date: string
  image: string
  category?: string
  tags?: string[]
  imageLayouts?: any[]
  isDraft?: boolean
  isPublished?: boolean
}

// サーバーサイドでデータを取得する関数
export async function getPosts(): Promise<Post[]> {
  // 環境変数をチェック
  const useSupabase = process.env.NEXT_PUBLIC_SUPABASE_URL && 
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your_supabase')

  if (useSupabase) {
    try {
      const posts = await postService.getAll(false) // 公開済みのみ
      return posts.map(post => ({
        id: parseInt(post.id),
        title: post.title,
        content: post.content,
        excerpt: post.excerpt || undefined,
        author: post.author,
        date: new Date(post.created_at).toLocaleDateString('ja-JP'),
        image: post.featured_image || '',
        category: post.category || undefined,
        tags: post.tags || [],
        imageLayouts: post.image_layouts || [],
        isDraft: post.is_draft,
        isPublished: post.is_published
      }))
    } catch (error) {
      console.error('Supabase error:', error)
    }
  }

  // Supabaseが利用できない場合は空配列を返す
  return []
}

export async function getPostById(id: string): Promise<Post | null> {
  const useSupabase = process.env.NEXT_PUBLIC_SUPABASE_URL && 
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your_supabase')

  if (useSupabase) {
    try {
      const post = await postService.getById(id)
      if (!post || !post.is_published) return null
      
      return {
        id: parseInt(post.id),
        title: post.title,
        content: post.content,
        excerpt: post.excerpt || undefined,
        author: post.author,
        date: new Date(post.created_at).toLocaleDateString('ja-JP'),
        image: post.featured_image || '',
        category: post.category || undefined,
        tags: post.tags || [],
        imageLayouts: post.image_layouts || [],
        isDraft: post.is_draft,
        isPublished: post.is_published
      }
    } catch (error) {
      console.error('Supabase error:', error)
    }
  }

  return null
}