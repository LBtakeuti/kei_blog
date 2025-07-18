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
      // Try to use Supabase service if available
      const serviceModule = process.env.NODE_ENV === 'production' 
        ? await import('./supabase-service').catch(() => import('./supabase-dummy'))
        : await import('./supabase-dummy')
      
      const { postService } = serviceModule
      const posts = await postService.getAll(false)
      
      if (!posts || posts.length === 0) {
        return []
      }
      
      return posts.map((post: any) => ({
        id: parseInt(post.id),
        title: post.title,
        content: post.content,
        excerpt: post.excerpt || undefined,
        author: post.author,
        date: post.created_at ? new Date(post.created_at).toLocaleDateString('ja-JP') : '',
        image: post.featured_image || '',
        category: post.category || undefined,
        tags: post.tags || [],
        imageLayouts: post.image_layouts || [],
        isDraft: post.is_draft,
        isPublished: post.is_published
      }))
    } catch (error) {
      console.error('Data fetch error:', error)
      return []
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
      // Try to use Supabase service if available
      const serviceModule = process.env.NODE_ENV === 'production' 
        ? await import('./supabase-service').catch(() => import('./supabase-dummy'))
        : await import('./supabase-dummy')
      
      const { postService } = serviceModule
      const post = await postService.getById(id)
      
      if (!post || !post.is_published) return null
      
      return {
        id: parseInt(post.id),
        title: post.title,
        content: post.content,
        excerpt: post.excerpt || undefined,
        author: post.author,
        date: post.created_at ? new Date(post.created_at).toLocaleDateString('ja-JP') : '',
        image: post.featured_image || '',
        category: post.category || undefined,
        tags: post.tags || [],
        imageLayouts: post.image_layouts || [],
        isDraft: post.is_draft,
        isPublished: post.is_published
      }
    } catch (error) {
      console.error('Data fetch error:', error)
      return null
    }
  }

  return null
}