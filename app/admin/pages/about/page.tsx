'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

interface PageContent {
  title: string
  content: string
}

const defaultAboutContent: PageContent = {
  title: "About Us",
  content: `Welcome to our blog, where we share insights, stories, and perspectives on various topics that matter to us and our community.

Our mission is to create a platform that inspires, educates, and connects people through thoughtful content. Whether you're interested in lifestyle, photography, fitness, or other topics, we strive to provide valuable information and unique perspectives.

Founded with the belief that everyone has a story worth sharing, our blog features content from diverse voices and experiences. We believe in the power of words to make a difference and build understanding across different communities.

Thank you for being part of our journey. We hope you find our content informative, inspiring, and worth sharing with others.`
}

export default function EditAboutPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedContent = localStorage.getItem('aboutContent')
    if (savedContent) {
      const pageContent = JSON.parse(savedContent) as PageContent
      setTitle(pageContent.title)
      setContent(pageContent.content)
    } else {
      setTitle(defaultAboutContent.title)
      setContent(defaultAboutContent.content)
    }
    setLoading(false)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const updatedContent: PageContent = {
      title,
      content
    }
    
    localStorage.setItem('aboutContent', JSON.stringify(updatedContent))
    
    alert('Aboutページが更新されました！')
    router.push('/admin')
  }

  if (loading) {
    return (
      <div className="flex flex-1 justify-center items-center py-20">
        <p className="text-[#6a7581] text-lg">読み込み中...</p>
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
          <p className="text-[#121416] tracking-light text-[32px] font-bold leading-tight min-w-72">Aboutページを編集</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
            <label className="flex flex-col min-w-40 flex-1">
              <p className="text-[#121416] text-base font-medium leading-normal pb-2">タイトル</p>
              <input
                placeholder="タイトルを入力"
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#121416] focus:outline-0 focus:ring-0 border border-[#dde0e3] bg-white focus:border-[#dde0e3] h-14 placeholder:text-[#6a7581] p-[15px] text-base font-normal leading-normal"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </label>
          </div>
          <div className="flex max-w-[960px] flex-wrap items-end gap-4 px-4 py-3">
            <label className="flex flex-col min-w-40 flex-1">
              <p className="text-[#121416] text-base font-medium leading-normal pb-2">コンテンツ</p>
              <textarea
                placeholder="コンテンツを入力"
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#121416] focus:outline-0 focus:ring-0 border border-[#dde0e3] bg-white focus:border-[#dde0e3] min-h-96 placeholder:text-[#6a7581] p-[15px] text-base font-normal leading-normal"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={20}
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