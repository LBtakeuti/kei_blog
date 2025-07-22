'use client'

import { useState, useEffect } from 'react'
import { Category } from '@/types/category'
import { categoryService } from '@/lib/supabase-service'
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline'

interface CategoryManagerSupabaseProps {
  onCategoriesChange?: (categories: Category[]) => void
  useSupabase?: boolean
}

export default function CategoryManagerSupabase({ 
  onCategoriesChange,
  useSupabase = false 
}: CategoryManagerSupabaseProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    color: '#3B82F6'
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadCategories()
  }, [useSupabase])

  const loadCategories = async () => {
    if (useSupabase) {
      try {
        const data = await categoryService.getAll()
        setCategories(data)
        if (onCategoriesChange) onCategoriesChange(data)
      } catch (error) {
        console.error('カテゴリの取得に失敗しました:', error)
      }
    } else {
      const saved = localStorage.getItem('categories')
      if (saved) {
        const cats = JSON.parse(saved)
        setCategories(cats.sort((a: Category, b: Category) => a.order - b.order))
      } else {
        // デフォルトカテゴリをセット
        const defaultCategories: Category[] = [
          {
            id: '1',
            name: 'ライフスタイル',
            slug: 'lifestyle',
            description: '日常生活に関する記事',
            color: '#10B981',
            order: 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: '2',
            name: '写真',
            slug: 'photography',
            description: '写真撮影に関する記事',
            color: '#F59E0B',
            order: 2,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: '3',
            name: 'フィットネス',
            slug: 'fitness',
            description: '健康とフィットネスに関する記事',
            color: '#EF4444',
            order: 3,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ]
        localStorage.setItem('categories', JSON.stringify(defaultCategories))
        setCategories(defaultCategories)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.slug) {
      alert('カテゴリ名とスラッグは必須です')
      return
    }

    setLoading(true)
    
    try {
      if (editingCategory) {
        // 編集
        if (useSupabase) {
          await categoryService.update(editingCategory.id, formData)
        } else {
          const updated = categories.map(cat => 
            cat.id === editingCategory.id 
              ? {
                  ...cat,
                  ...formData,
                  updatedAt: new Date().toISOString()
                }
              : cat
          )
          localStorage.setItem('categories', JSON.stringify(updated))
        }
        alert('カテゴリを更新しました')
      } else {
        // 新規作成
        if (useSupabase) {
          await categoryService.create({
            ...formData,
            order: categories.length + 1
          })
        } else {
          const newCategory: Category = {
            id: Date.now().toString(),
            ...formData,
            order: categories.length + 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
          const updated = [...categories, newCategory]
          localStorage.setItem('categories', JSON.stringify(updated))
        }
        alert('カテゴリを作成しました')
      }
      
      await loadCategories()
      resetForm()
    } catch (error) {
      console.error('カテゴリの保存に失敗しました:', error)
      alert('カテゴリの保存に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      color: category.color || '#3B82F6'
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('このカテゴリを削除してもよろしいですか？')) {
      setLoading(true)
      try {
        if (useSupabase) {
          await categoryService.delete(id)
        } else {
          const updated = categories.filter(cat => cat.id !== id)
          const reordered = updated.map((cat, index) => ({
            ...cat,
            order: index + 1
          }))
          localStorage.setItem('categories', JSON.stringify(reordered))
        }
        alert('カテゴリを削除しました')
        await loadCategories()
      } catch (error) {
        console.error('カテゴリの削除に失敗しました:', error)
        alert('カテゴリの削除に失敗しました')
      } finally {
        setLoading(false)
      }
    }
  }

  const handleMoveUp = async (index: number) => {
    if (index === 0) return
    const newCategories = [...categories]
    const temp = newCategories[index]
    newCategories[index] = newCategories[index - 1]
    newCategories[index - 1] = temp
    
    // 並び順を更新
    const reordered = newCategories.map((cat, idx) => ({
      ...cat,
      order: idx + 1
    }))
    
    if (useSupabase) {
      // Supabaseの場合は各カテゴリのorderを更新
      for (const cat of reordered) {
        await categoryService.update(cat.id, { order: cat.order })
      }
    } else {
      localStorage.setItem('categories', JSON.stringify(reordered))
    }
    
    setCategories(reordered)
  }

  const handleMoveDown = async (index: number) => {
    if (index === categories.length - 1) return
    const newCategories = [...categories]
    const temp = newCategories[index]
    newCategories[index] = newCategories[index + 1]
    newCategories[index + 1] = temp
    
    // 並び順を更新
    const reordered = newCategories.map((cat, idx) => ({
      ...cat,
      order: idx + 1
    }))
    
    if (useSupabase) {
      // Supabaseの場合は各カテゴリのorderを更新
      for (const cat of reordered) {
        await categoryService.update(cat.id, { order: cat.order })
      }
    } else {
      localStorage.setItem('categories', JSON.stringify(reordered))
    }
    
    setCategories(reordered)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      color: '#3B82F6'
    })
    setEditingCategory(null)
    setShowForm(false)
  }

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[#121416]">
          カテゴリ管理
          {useSupabase && (
            <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
              Supabase連携中
            </span>
          )}
        </h2>
        <button
          onClick={() => setShowForm(true)}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-[#dce7f3] text-[#121416] rounded-xl hover:bg-[#c5d5e8] transition-colors disabled:opacity-50"
        >
          <PlusIcon className="w-5 h-5" />
          <span className="text-sm font-bold">新規カテゴリ</span>
        </button>
      </div>

      {/* カテゴリ作成・編集フォーム */}
      {showForm && (
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingCategory ? 'カテゴリを編集' : '新規カテゴリを作成'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[#121416] mb-1">
                  カテゴリ名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-[#dde0e3] rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="例: テクノロジー"
                />
              </div>
              <div>
                <label htmlFor="slug" className="block text-sm font-medium text-[#121416] mb-1">
                  スラッグ（URL用） <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                  className="w-full px-3 py-2 border border-[#dde0e3] rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="例: technology"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-[#121416] mb-1">
                説明
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border border-[#dde0e3] rounded-lg focus:outline-none focus:border-blue-500 resize-none"
                placeholder="カテゴリの説明を入力"
              />
            </div>
            
            <div>
              <label htmlFor="color" className="block text-sm font-medium text-[#121416] mb-1">
                カラー
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  id="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="h-10 w-20 border border-[#dde0e3] rounded cursor-pointer"
                />
                <span className="text-sm text-[#6a7581]">{formData.color}</span>
              </div>
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={resetForm}
                disabled={loading}
                className="px-4 py-2 bg-gray-200 text-[#121416] rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
              >
                キャンセル
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-[#121416] text-white rounded-lg hover:bg-[#2a2d30] transition-colors disabled:opacity-50"
              >
                {loading ? '処理中...' : editingCategory ? '更新' : '作成'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* カテゴリ一覧 */}
      <div className="space-y-3">
        {categories.length === 0 ? (
          <div className="text-center py-10 text-[#6a7581]">
            カテゴリがありません
          </div>
        ) : (
          categories.map((category, index) => (
            <div key={category.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0 || loading}
                      className={`p-1 rounded ${index === 0 || loading ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                      ▲
                    </button>
                    <button
                      onClick={() => handleMoveDown(index)}
                      disabled={index === categories.length - 1 || loading}
                      className={`p-1 rounded ${index === categories.length - 1 || loading ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                      ▼
                    </button>
                  </div>
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <div>
                    <h3 className="font-semibold text-[#121416]">{category.name}</h3>
                    <p className="text-sm text-[#6a7581]">/{category.slug}</p>
                    {category.description && (
                      <p className="text-sm text-[#6a7581] mt-1">{category.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(category)}
                    disabled={loading}
                    className="p-2 text-[#121416] hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    disabled={loading}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}