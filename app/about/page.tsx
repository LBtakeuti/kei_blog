'use client'

import { useState, useEffect } from 'react'
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

export default function AboutPage() {
  const [content, setContent] = useState<PageContent>(defaultAboutContent)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedContent = localStorage.getItem('aboutContent')
    if (savedContent) {
      setContent(JSON.parse(savedContent))
    }
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="flex flex-1 justify-center items-center py-20">
        <p className="text-[#6a7581] text-lg">読み込み中...</p>
      </div>
    )
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 flex flex-1 justify-center py-5">
      <div className="layout-content-container flex flex-col max-w-[800px] flex-1">
        <Link href="/" className="flex items-center gap-2 text-[#6a7581] hover:text-[#121416] mb-6">
          <ArrowLeftIcon className="w-4 h-4" />
          <span className="text-sm">ホームに戻る</span>
        </Link>

        <h1 className="text-[#121416] text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight tracking-[-0.015em] mb-6 sm:mb-8">
          {content.title}
        </h1>

        <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none">
          <div className="text-[#121416] text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
            {content.content}
          </div>
        </div>
      </div>
    </div>
  )
}