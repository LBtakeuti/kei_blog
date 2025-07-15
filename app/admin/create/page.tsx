"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { PhotoIcon } from '@heroicons/react/24/outline'
import ImageEditor from '@/components/ImageEditor'
import { ImageLayout } from '@/types/image'
import { Category } from '@/types/category'

interface Post {
  id: number
  title: string
  excerpt?: string
  content?: string
  author: string
  date: string
  image: string
  imageLayouts?: ImageLayout[]
  category?: string
  tags?: string[]
  isDraft?: boolean
  isPublished?: boolean
}

export default function CreatePost() {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [content, setContent] = useState('')
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageLayouts, setImageLayouts] = useState<ImageLayout[]>([])
  const [tags, setTags] = useState('')
  const [isDraft, setIsDraft] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    const saved = localStorage.getItem('categories')
    if (saved) {
      setCategories(JSON.parse(saved))
    }
  }, [])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setImagePreview(base64String)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent, saveAsDraft: boolean = false) => {
    e.preventDefault()
    
    // 画像はBase64形式で直接保存（デプロイ環境でも動作するように）
    const imageUrl = imagePreview || ''
    
    // タグを配列に変換
    const tagArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
    
    console.log('投稿:', { title, category, content, imageUrl, tags: tagArray, isDraft: saveAsDraft })
    
    // 投稿データを保存する処理をここに追加
    // localStorage に保存
    const posts = JSON.parse(localStorage.getItem('posts') || '[]')
    const newPost: Post = {
      id: Date.now(),
      title,
      category,
      content,
      excerpt: content.substring(0, 150), // 自動で抜粋を生成
      image: imageUrl,
      imageLayouts,
      author: '管理者',
      date: new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' }),
      tags: tagArray,
      isDraft: saveAsDraft,
      isPublished: !saveAsDraft,
    }
    posts.unshift(newPost)
    localStorage.setItem('posts', JSON.stringify(posts))
    
    console.log('新しい投稿が作成されました:', newPost)
    console.log('現在の投稿一覧:', posts)
    
    alert(saveAsDraft ? '下書きが保存されました！' : '投稿が作成されました！')
    
    // フォームをリセット
    setTitle('')
    setCategory('')
    setContent('')
    setTags('')
    setSelectedImage(null)
    setImagePreview(null)
    setImageLayouts([])
    
    // 管理画面にリダイレクト
    window.location.href = '/admin'
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 flex flex-1 justify-center py-5">
      <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
        <div className="flex flex-wrap justify-between gap-3 p-4">
          <p className="text-[#121416] tracking-light text-xl sm:text-2xl lg:text-[32px] font-bold leading-tight">新規投稿</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="flex max-w-full flex-wrap items-end gap-4 px-4 py-3">
            <label className="flex flex-col min-w-40 flex-1">
              <p className="text-[#121416] text-sm sm:text-base font-medium leading-normal pb-2">タイトル</p>
              <input
                placeholder="タイトルを追加"
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#121416] focus:outline-0 focus:ring-0 border border-[#dde0e3] bg-white focus:border-[#dde0e3] h-12 sm:h-14 placeholder:text-[#6a7581] p-[15px] text-sm sm:text-base font-normal leading-normal"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </label>
          </div>
          <div className="flex max-w-full flex-wrap items-end gap-4 px-4 py-3">
            <label className="flex flex-col min-w-40 flex-1">
              <p className="text-[#121416] text-sm sm:text-base font-medium leading-normal pb-2">カテゴリ</p>
              <select
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#121416] focus:outline-0 focus:ring-0 border border-[#dde0e3] bg-white focus:border-[#dde0e3] h-12 sm:h-14 placeholder:text-[#6a7581] p-[15px] text-sm sm:text-base font-normal leading-normal appearance-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='24px' height='24px' fill='rgb(106,117,129)' viewBox='0 0 256 256'%3e%3cpath d='M181.66,170.34a8,8,0,0,1,0,11.32l-48,48a8,8,0,0,1-11.32,0l-48-48a8,8,0,0,1,11.32-11.32L128,212.69l42.34-42.35A8,8,0,0,1,181.66,170.34Zm-96-84.68L128,43.31l42.34,42.35a8,8,0,0,0,11.32-11.32l-48-48a8,8,0,0,0-11.32,0l-48,48A8,8,0,0,0,85.66,85.66Z'%3e%3c/path%3e%3c/svg%3e")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 15px center',
                  backgroundSize: '24px 24px'
                }}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">カテゴリーを選択</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="flex max-w-full flex-wrap items-end gap-4 px-4 py-3">
            <label className="flex flex-col min-w-40 flex-1">
              <p className="text-[#121416] text-sm sm:text-base font-medium leading-normal pb-2">画像</p>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="flex flex-col items-center justify-center w-full h-40 sm:h-48 border-2 border-dashed border-[#dde0e3] rounded-xl cursor-pointer hover:bg-gray-50"
                >
                  {imagePreview ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        fill
                        className="object-cover rounded-xl"
                      />
                    </div>
                  ) : (
                    <>
                      <PhotoIcon className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400" />
                      <p className="mt-2 text-xs sm:text-sm text-gray-600">画像をアップロード</p>
                    </>
                  )}
                </label>
              </div>
            </label>
          </div>
          <div className="flex max-w-full flex-wrap items-end gap-4 px-4 py-3">
            <label className="flex flex-col min-w-40 flex-1">
              <p className="text-[#121416] text-sm sm:text-base font-medium leading-normal pb-2">タグ</p>
              <input
                placeholder="タグをカンマ区切りで入力（例: 技術, プログラミング, JavaScript）"
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#121416] focus:outline-0 focus:ring-0 border border-[#dde0e3] bg-white focus:border-[#dde0e3] h-12 sm:h-14 placeholder:text-[#6a7581] p-[15px] text-sm sm:text-base font-normal leading-normal"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </label>
          </div>
          <div className="flex max-w-full flex-wrap items-end gap-4 px-4 py-3">
            <label className="flex flex-col min-w-40 flex-1">
              <p className="text-[#121416] text-sm sm:text-base font-medium leading-normal pb-2">コンテンツ</p>
              <textarea
                placeholder="コンテンツを追加"
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#121416] focus:outline-0 focus:ring-0 border border-[#dde0e3] bg-white focus:border-[#dde0e3] min-h-32 sm:min-h-36 placeholder:text-[#6a7581] p-[15px] text-sm sm:text-base font-normal leading-normal"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </label>
          </div>
          <div className="px-4 py-3">
            <ImageEditor 
              layouts={imageLayouts} 
              onLayoutsChange={setImageLayouts} 
            />
          </div>
          <div className="flex flex-col sm:flex-row px-4 py-3 justify-end gap-3">
            <Link
              href="/admin"
              className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#f1f2f4] text-[#121416] text-sm font-bold leading-normal tracking-[0.015em]"
            >
              <span className="truncate">キャンセル</span>
            </Link>
            <button
              type="button"
              onClick={(e) => handleSubmit(e as any, true)}
              className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-gray-300 text-[#121416] text-sm font-bold leading-normal tracking-[0.015em]"
            >
              <span className="truncate">下書き保存</span>
            </button>
            <button
              type="submit"
              className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#dce7f3] text-[#121416] text-sm font-bold leading-normal tracking-[0.015em]"
            >
              <span className="truncate">公開</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}