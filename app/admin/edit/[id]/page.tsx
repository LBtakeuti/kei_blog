"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { PhotoIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

interface Post {
  id: number
  title: string
  content: string
  excerpt?: string
  author: string
  date: string
  image: string
  category?: string
}

const defaultPosts: Post[] = [
  {
    id: 1,
    title: "The Future of Sustainable Living",
    content: `Sustainable living is more than just a trend; it's a necessity for our planet's future. In this comprehensive guide, we'll explore innovative approaches to eco-friendly living that can be easily incorporated into your daily routine.

From renewable energy solutions like solar panels and wind turbines to zero-waste lifestyles that minimize our environmental footprint, there are countless ways to make a positive impact. We'll delve into practical tips for reducing energy consumption, choosing sustainable products, and creating an eco-friendly home environment.

Learn about the latest green technologies, sustainable fashion choices, and how small changes in your daily habits can contribute to a healthier planet. Whether you're just starting your sustainability journey or looking to take your eco-conscious lifestyle to the next level, this guide provides actionable insights for everyone.

Join the movement towards a more sustainable future and discover how you can be part of the solution to climate change and environmental degradation.`,
    excerpt: "Explore innovative approaches to eco-friendly living, from renewable energy solutions to zero-waste lifestyles.",
    author: "Emma Carter",
    date: "July 26, 2024",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCffIFhoH1QgzKS_Wz05dELc07wG3C9MEMAOxshqVokSs53XjSiixUnrQmHngxMyZdArQDJHp1Q30NIuLyPF6256Y48JYRgpHes_fEx4OCICvucga_zej9-PJrDDWRnVUk7rF_8lP7gAEH4X1QsBVvTOacAVTPsuO29hGymYvhJR-G4n4tJOot9XQmNlOBiZb0oeCt41MSRIAB2-H2XcPEK21SWQ2_v7HaebFktfT9Y1Yj6CGuoF0iaL11u-9gD8CNAsRTdIE1T1oEG",
    category: "lifestyle"
  },
  {
    id: 2,
    title: "Mastering the Art of Photography",
    content: `Photography is an art form that allows us to capture moments, tell stories, and express our creativity. In this comprehensive guide, we'll explore the fundamental principles and advanced techniques that will help you take your photography skills to the next level.

Understanding composition is crucial for creating visually appealing images. We'll discuss the rule of thirds, leading lines, symmetry, and other compositional techniques that can transform ordinary scenes into extraordinary photographs. Learn how to use natural and artificial lighting to enhance your subjects and create mood in your images.

Post-processing is an essential part of modern photography. We'll introduce you to popular editing software and techniques that can help you enhance your photos while maintaining a natural look. From basic adjustments like exposure and contrast to advanced techniques like color grading and compositing, you'll learn how to bring your creative vision to life.

Whether you're shooting with a professional DSLR, mirrorless camera, or smartphone, these principles apply universally. Join us on this journey to master the art of photography and capture the world through your unique perspective.`,
    excerpt: "Dive into the world of photography with expert tips on composition, lighting, and editing.",
    author: "Ethan Lee",
    date: "July 20, 2024",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCWA4PcllaaPM6IBu9Gu1K_k8PVzNLRcluueK8EvIcJPPzo7X4l5fEiKqqrGTJSxYNoroeHMmm-quTxEaoye-Jh737TJ27eEkr8JYTqhEzz4DFbnqX_lkykm7aGXoP2Pi3SziKxpAitVAnGis3qcl4CAAIHAz0uCwop_xOX8xVUW88z-DYPF05VjWamTsMQavi5MtVQOzBobEGMTu1OiWBKzJi0VdwfObNAQ8IwodBehNLDVuikhjGayaC6zOTYdskvKHx38qWkYOxr",
    category: "photography"
  },
  {
    id: 3,
    title: "The Ultimate Guide to Home Workouts",
    content: `Staying fit and healthy doesn't require an expensive gym membership or fancy equipment. In this ultimate guide to home workouts, we'll show you how to create an effective fitness routine using minimal space and equipment.

We'll start with bodyweight exercises that target all major muscle groups. From push-ups and squats to planks and lunges, these fundamental movements form the foundation of any good workout routine. Learn proper form and technique to maximize results while minimizing the risk of injury.

Cardiovascular fitness is equally important for overall health. Discover high-intensity interval training (HIIT) routines that can be done in small spaces, jump rope techniques, and creative ways to get your heart rate up without leaving your home. We'll also explore yoga and stretching routines for flexibility and recovery.

Creating a sustainable fitness routine is about more than just exercises. We'll discuss how to set realistic goals, track your progress, stay motivated, and integrate healthy habits into your daily life. Whether you're a fitness beginner or looking to maintain your routine at home, this guide provides everything you need to achieve your fitness goals.`,
    excerpt: "Stay fit and healthy with our comprehensive guide to effective home workouts.",
    author: "Olivia Bennett",
    date: "July 14, 2024",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDd5WWgKwx_tlqEvSmo06MJiEyvAdga8zvNBUF3bt-6GQ6Hr0uM3JKrmR4Mhtwe1lFN4y6t8azLuFiA6HcWJ_ZCnaXe--cIsVJe-GzuHINSy507Jdz0L67CWjh90ubrWjablMXDWbtvS_qx8h6mE55mdk_YED5MDeqia37bGYYPmOnvX8RvffsQvxQ0cijlMw0PfWR041CF-jDcrKpEMORVZAYbXousZBxaZKjyjOewgyaVMDYJbJ97AmD4bhtc-Ai1RrBHntDIjItw",
    category: "fitness"
  }
]

export default function EditPost() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id
  
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [content, setContent] = useState('')
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [post, setPost] = useState<Post | null>(null)

  useEffect(() => {
    if (!id) return

    // デフォルトの投稿から探す
    const defaultPost = defaultPosts.find(p => p.id === parseInt(id as string))
    if (defaultPost) {
      setPost(defaultPost)
      setTitle(defaultPost.title)
      setCategory(defaultPost.category || '')
      setContent(defaultPost.content)
      setImagePreview(defaultPost.image)
      setLoading(false)
      return
    }

    // LocalStorageから探す
    const savedPosts = localStorage.getItem('posts')
    if (savedPosts) {
      const posts = JSON.parse(savedPosts)
      const savedPost = posts.find((p: Post) => p.id === parseInt(id as string))
      if (savedPost) {
        setPost(savedPost)
        setTitle(savedPost.title)
        setCategory(savedPost.category || '')
        setContent(savedPost.content)
        setImagePreview(savedPost.image)
      }
    }
    
    setLoading(false)
  }, [id])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!post) return
    
    let imageUrl = post.image
    
    if (selectedImage) {
      const formData = new FormData()
      formData.append('file', selectedImage)
      
      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })
        
        if (response.ok) {
          const data = await response.json()
          imageUrl = data.url
        }
      } catch (error) {
        console.error('画像アップロードエラー:', error)
      }
    }
    
    // 更新された投稿データ
    const updatedPost = {
      ...post,
      title,
      category,
      content,
      excerpt: content.substring(0, 150), // 自動で抜粋を生成
      image: imageUrl,
    }
    
    // LocalStorageを更新
    const savedPosts = localStorage.getItem('posts')
    const posts = savedPosts ? JSON.parse(savedPosts) : []
    
    // デフォルトの投稿の場合
    if (defaultPosts.find(dp => dp.id === post.id)) {
      // 編集された内容を新しい投稿として保存
      const newPost = {
        ...updatedPost,
        id: Date.now(),
        author: post.author,
        date: new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })
      }
      posts.unshift(newPost) // 新しい投稿は先頭に追加
      console.log('デフォルト記事を編集して新しい投稿を作成:', newPost)
    } else {
      // 既存のカスタム投稿の場合は更新
      const existingIndex = posts.findIndex((p: Post) => p.id === post.id)
      if (existingIndex !== -1) {
        posts[existingIndex] = updatedPost
        console.log('既存の投稿を更新:', updatedPost)
      } else {
        posts.unshift(updatedPost)
        console.log('新しい投稿として追加:', updatedPost)
      }
    }
    
    localStorage.setItem('posts', JSON.stringify(posts))
    console.log('現在の投稿一覧:', posts)
    
    alert('記事が更新されました！')
    router.push('/admin')
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
                <option value="lifestyle">ライフスタイル</option>
                <option value="photography">写真</option>
                <option value="fitness">フィットネス</option>
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
          <div className="flex px-4 py-3 justify-end gap-3">
            <Link
              href="/admin"
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#f1f2f4] text-[#121416] text-sm font-bold leading-normal tracking-[0.015em]"
            >
              <span className="truncate">キャンセル</span>
            </Link>
            <button
              type="submit"
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#dce7f3] text-[#121416] text-sm font-bold leading-normal tracking-[0.015em]"
            >
              <span className="truncate">更新</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}