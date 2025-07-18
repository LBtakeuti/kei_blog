// Dummy Supabase service for build compatibility
export const postService = {
  async getAll(includeUnpublished = false) {
    return []
  },
  
  async getById(id: string) {
    return null
  },
  
  async create(post: any) {
    throw new Error('Supabase not configured')
  },
  
  async update(id: string, post: any) {
    throw new Error('Supabase not configured')
  },
  
  async delete(id: string) {
    throw new Error('Supabase not configured')
  }
}

export const categoryService = {
  async getAll() {
    return []
  },
  
  async create(category: any) {
    throw new Error('Supabase not configured')
  },
  
  async update(id: string, category: any) {
    throw new Error('Supabase not configured')
  },
  
  async delete(id: string) {
    throw new Error('Supabase not configured')
  }
}

export const storageService = {
  async uploadImage(file: File, folder?: string) {
    throw new Error('Supabase not configured')
  },
  
  async deleteImage(url: string) {
    throw new Error('Supabase not configured')
  }
}