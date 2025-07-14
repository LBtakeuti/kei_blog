'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

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


export default function PostDetail() {
  const params = useParams()
  const id = params?.id
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return

    const postId = parseInt(id as string)
    
    // localStorageからカスタム投稿を探す
    const savedPosts = localStorage.getItem('posts')
    if (savedPosts) {
      const customPosts = JSON.parse(savedPosts)
      const customPost = customPosts.find((p: Post) => p.id === postId)
      if (customPost) {
        console.log('カスタム投稿を表示:', customPost)
        setPost(customPost)
        setLoading(false)
        return
      }
    }
    
    console.log('投稿が見つかりませんでした:', postId)
    setLoading(false)
  }, [id])

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
          <Link href="/" className="text-[#121416] hover:underline flex items-center gap-2">
            <ArrowLeftIcon className="w-4 h-4" />
            ホームに戻る
          </Link>
        </div>
      </div>
    )
  }

  return (
    <article className="px-6 flex flex-1 justify-center py-5">
      <div className="layout-content-container flex flex-col max-w-[800px] flex-1">
        <Link href="/" className="flex items-center gap-2 text-[#6a7581] hover:text-[#121416] mb-6">
          <ArrowLeftIcon className="w-4 h-4" />
          <span className="text-sm">ホームに戻る</span>
        </Link>

        {post.image && (
          <div className="relative w-full aspect-video mb-8">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover rounded-xl"
              priority
            />
          </div>
        )}

        <header className="mb-8">
          <h1 className="text-[#121416] text-4xl font-bold leading-tight tracking-[-0.015em] mb-4">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-[#6a7581] text-sm">
            <span>by {post.author}</span>
            <span>•</span>
            <span>{post.date}</span>
            {post.category && (
              <>
                <span>•</span>
                <span className="capitalize">{post.category}</span>
              </>
            )}
          </div>
        </header>

        <div className="prose prose-lg max-w-none">
          <div className="text-[#121416] text-base leading-relaxed whitespace-pre-wrap">
            {post.content}
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[#f1f2f4]">
          <Link href="/" className="flex items-center gap-2 text-[#121416] hover:underline">
            <ArrowLeftIcon className="w-4 h-4" />
            他の記事を見る
          </Link>
        </div>
      </div>
    </article>
  )
}