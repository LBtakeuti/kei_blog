import { supabase, Post, Category } from './supabase'

// 記事関連
export const postService = {
  // 記事一覧取得
  async getAll(includeUnpublished = false) {
    if (!supabase) {
      return []
    }
    
    let query = supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })

    if (!includeUnpublished) {
      query = query.eq('is_published', true)
    }

    const { data, error } = await query
    if (error) throw error
    return data
  },

  // 記事詳細取得
  async getById(id: string) {
    if (!supabase) {
      return null
    }
    
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  // 記事作成
  async create(post: Omit<Post, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('posts')
      .insert(post)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // 記事更新
  async update(id: string, post: Partial<Post>) {
    const { data, error } = await supabase
      .from('posts')
      .update(post)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // 記事削除
  async delete(id: string) {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// カテゴリ関連
export const categoryService = {
  // カテゴリ一覧取得
  async getAll() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('order', { ascending: true })
    
    if (error) throw error
    return data
  },

  // カテゴリ作成
  async create(category: Omit<Category, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('categories')
      .insert(category)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // カテゴリ更新
  async update(id: string, category: Partial<Category>) {
    const { data, error } = await supabase
      .from('categories')
      .update(category)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // カテゴリ削除
  async delete(id: string) {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// 画像アップロード関連
export const storageService = {
  // 画像アップロード
  async uploadImage(file: File, folder: string = 'posts') {
    const fileExt = file.name.split('.').pop()
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    
    const { data, error } = await supabase.storage
      .from('post-images')
      .upload(fileName, file)
    
    if (error) throw error
    
    // 公開URLを取得
    const { data: { publicUrl } } = supabase.storage
      .from('post-images')
      .getPublicUrl(fileName)
    
    return publicUrl
  },

  // 画像削除
  async deleteImage(url: string) {
    // URLからファイルパスを抽出
    const path = url.split('/').slice(-2).join('/')
    
    const { error } = await supabase.storage
      .from('post-images')
      .remove([path])
    
    if (error) throw error
  }
}

// データ移行ヘルパー
export const migrationHelper = {
  // LocalStorageからSupabaseへデータ移行
  async migrateFromLocalStorage() {
    try {
      // カテゴリ移行
      const localCategories = localStorage.getItem('categories')
      if (localCategories) {
        const categories = JSON.parse(localCategories)
        for (const cat of categories) {
          await categoryService.create({
            name: cat.name,
            slug: cat.slug,
            description: cat.description || '',
            color: cat.color || '#3B82F6',
            order: cat.order || 0
          })
        }
      }

      // 記事移行
      const localPosts = localStorage.getItem('posts')
      if (localPosts) {
        const posts = JSON.parse(localPosts)
        for (const post of posts) {
          // 画像をアップロード（Base64の場合）
          let featuredImageUrl = post.image
          if (post.image && post.image.startsWith('data:')) {
            // Base64をFileに変換してアップロード
            const response = await fetch(post.image)
            const blob = await response.blob()
            const file = new File([blob], 'image.jpg', { type: 'image/jpeg' })
            featuredImageUrl = await storageService.uploadImage(file)
          }

          await postService.create({
            title: post.title,
            content: post.content,
            excerpt: post.excerpt,
            category: post.category,
            tags: post.tags || [],
            author: post.author || '管理者',
            featured_image: featuredImageUrl,
            image_layouts: post.imageLayouts || [],
            is_draft: post.isDraft || false,
            is_published: post.isPublished || true
          })
        }
      }
      
      return { success: true, message: 'データ移行が完了しました' }
    } catch (error) {
      console.error('Migration error:', error)
      return { success: false, error }
    }
  }
}