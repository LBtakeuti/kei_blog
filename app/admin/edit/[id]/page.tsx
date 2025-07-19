"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { PhotoIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import ImageEditor from '@/components/ImageEditor'
import { ImageLayout } from '@/types/image'
import { Category } from '@/types/category'

interface Post {
  id: number
  title: string
  content: string
  excerpt?: string
  author: string
  date: string
  image: string
  category?: string
  tags?: string[]
  imageLayouts?: ImageLayout[]
  isDraft?: boolean
  isPublished?: boolean
}


export default function EditPost() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id
  
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [content, setContent] = useState('')
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageLayouts, setImageLayouts] = useState<ImageLayout[]>([])
  const [tags, setTags] = useState('')
  const [isDraft, setIsDraft] = useState(false)
  const [loading, setLoading] = useState(true)
  const [post, setPost] = useState<Post | null>(null)
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    // カテゴリを取得
    const savedCategories = localStorage.getItem('categories')
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories))
    }

    if (!id) return

    const postId = parseInt(id as string)

    // LocalStorageからカスタム投稿を探す
    const savedPosts = localStorage.getItem('posts')
    if (savedPosts) {
      const posts = JSON.parse(savedPosts)
      const savedPost = posts.find((p: Post) => p.id === postId)
      if (savedPost) {
        setPost(savedPost)
        setTitle(savedPost.title)
        setCategory(savedPost.category || '')
        setContent(savedPost.content)
        setImagePreview(savedPost.image)
        setImageLayouts(savedPost.imageLayouts || [])
        setTags(savedPost.tags?.join(', ') || '')
        setIsDraft(savedPost.isDraft || false)
        setLoading(false)
        return
      }
    }
    
    console.log('編集対象の投稿が見つかりませんでした:', postId)
    setLoading(false)
  }, [id])

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
    
    if (!post) return
    
    // 画像はBase64形式で直接保存（デプロイ環境でも動作するように）
    const imageUrl = imagePreview || post.image
    
    // タグを配列に変換
    const tagArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
    
    // 更新された投稿データ
    const updatedPost = {
      ...post,
      title,
      category,
      content,
      excerpt: content.substring(0, 150), // 自動で抜粋を生成
      image: imageUrl,
      imageLayouts,
      tags: tagArray,
      isDraft: saveAsDraft,
      isPublished: !saveAsDraft,
    }
    
    // LocalStorageを更新
    try {
      const savedPosts = localStorage.getItem('posts')
      const posts = savedPosts ? JSON.parse(savedPosts) : []
      
      // 既存のカスタム投稿を更新
      const existingIndex = posts.findIndex((p: Post) => p.id === post.id)
      if (existingIndex !== -1) {
        posts[existingIndex] = updatedPost
        console.log('既存の投稿を更新:', updatedPost)
      } else {
        posts.unshift(updatedPost)
        console.log('新しい投稿として追加:', updatedPost)
      }
      
      // 容量チェック
      const dataSize = new Blob([JSON.stringify(posts)]).size
      const maxSize = 5 * 1024 * 1024 // 5MB
      
      if (dataSize > maxSize) {
        throw new Error('データサイズが大きすぎます。画像を減らすか、古い投稿を削除してください。')
      }
      
      localStorage.setItem('posts', JSON.stringify(posts))
      console.log('データサイズ:', (dataSize / 1024 / 1024).toFixed(2) + 'MB')
      
      alert(saveAsDraft ? '下書きとして保存されました！' : '記事が公開されました！')
      router.push('/admin')
    } catch (error) {
      console.error('保存エラー:', error)
      if (error instanceof Error) {
        if (error.name === 'QuotaExceededError' || error.message.includes('exceeded')) {
          alert('保存容量が不足しています。画像のサイズを小さくするか、不要な投稿を削除してください。')
        } else {
          alert(`保存に失敗しました: ${error.message}`)
        }
      } else {
        alert('保存に失敗しました。')
      }
    }
  }

  if (loading) {
    return (
      <div className="flex flex-1 justify-center items-center py-20">
        <p className="text-[#6a7581] text-lg">読み込み中...</p>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="flex flex-1 justify-center items-center py-20">
        <div className="text-center">
          <p className="text-[#6a7581] text-lg mb-4">記事が見つかりませんでした</p>
          <Link href="/admin" className="text-[#121416] hover:underline flex items-center gap-2">
            <ArrowLeftIcon className="w-4 h-4" />
            管理画面に戻る
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="px-40 flex flex-1 justify-center py-5">
      <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
        <Link href="/admin" className="flex items-center gap-2 text-[#6a7581] hover:text-[#121416] mb-6">
          <ArrowLeftIcon className="w-4 h-4" />
          <span className="text-sm">管理画面に戻る</span>
        </Link>
        
        <div className="flex flex-wrap justify-between gap-3 p-4">
          <p className="text-[#121416] tracking-light text-[32px] font-bold leading-tight min-w-72">記事を編集</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
            <label className="flex flex-col min-w-40 flex-1">
              <p className="text-[#121416] text-base font-medium leading-normal pb-2">タイトル</p>
              <input
                placeholder="タイトルを追加"
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#121416] focus:outline-0 focus:ring-0 border border-[#dde0e3] bg-white focus:border-[#dde0e3] h-14 placeholder:text-[#6a7581] p-[15px] text-base font-normal leading-normal"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </label>
          </div>
          <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
            <label className="flex flex-col min-w-40 flex-1">
              <p className="text-[#121416] text-base font-medium leading-normal pb-2">カテゴリ</p>
              <select
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#121416] focus:outline-0 focus:ring-0 border border-[#dde0e3] bg-white focus:border-[#dde0e3] h-14 placeholder:text-[#6a7581] p-[15px] text-base font-normal leading-normal appearance-none"
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
          <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
            <label className="flex flex-col min-w-40 flex-1">
              <p className="text-[#121416] text-base font-medium leading-normal pb-2">画像</p>
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
                  className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-[#dde0e3] rounded-xl cursor-pointer hover:bg-gray-50"
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
                      <PhotoIcon className="w-12 h-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-600">画像をアップロード</p>
                    </>
                  )}
                </label>
              </div>
            </label>
          </div>
          <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
            <label className="flex flex-col min-w-40 flex-1">
              <p className="text-[#121416] text-base font-medium leading-normal pb-2">コンテンツ</p>
              <textarea
                placeholder="コンテンツを追加"
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#121416] focus:outline-0 focus:ring-0 border border-[#dde0e3] bg-white focus:border-[#dde0e3] min-h-36 placeholder:text-[#6a7581] p-[15px] text-base font-normal leading-normal"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={10}
                required
              />
            </label>
          </div>
          <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
            <label className="flex flex-col min-w-40 flex-1">
              <p className="text-[#121416] text-base font-medium leading-normal pb-2">タグ</p>
              <input
                placeholder="タグをカンマ区切りで入力（例: 技術, プログラミング, JavaScript）"
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#121416] focus:outline-0 focus:ring-0 border border-[#dde0e3] bg-white focus:border-[#dde0e3] h-14 placeholder:text-[#6a7581] p-[15px] text-base font-normal leading-normal"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </label>
          </div>
          <div className="px-4 py-3">
            <ImageEditor 
              layouts={imageLayouts} 
              onLayoutsChange={setImageLayouts} 
            />
          </div>
          <div className="flex px-4 py-3 justify-end gap-3">
            <Link
              href="/admin"
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#f1f2f4] text-[#121416] text-sm font-bold leading-normal tracking-[0.015em]"
            >
              <span className="truncate">キャンセル</span>
            </Link>
            <button
              type="button"
              onClick={(e) => handleSubmit(e as any, true)}
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-gray-300 text-[#121416] text-sm font-bold leading-normal tracking-[0.015em]"
            >
              <span className="truncate">下書き保存</span>
            </button>
            <button
              type="submit"
              onClick={(e) => handleSubmit(e as any, false)}
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#dce7f3] text-[#121416] text-sm font-bold leading-normal tracking-[0.015em]"
            >
              <span className="truncate">公開</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}