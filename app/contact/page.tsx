'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

interface PageContent {
  title: string
  content: string
}

const defaultContactContent: PageContent = {
  title: "Contact Us",
  content: `We'd love to hear from you! Whether you have questions, feedback, or just want to say hello, don't hesitate to reach out.

Email: contact@example.com
Phone: +1 (555) 123-4567

Office Hours:
Monday - Friday: 9:00 AM - 6:00 PM
Saturday - Sunday: Closed

Address:
123 Blog Street
Content City, CC 12345

For press inquiries, please email: press@example.com
For partnership opportunities, please email: partners@example.com

We typically respond to all inquiries within 24-48 hours during business days.`
}

export default function ContactPage() {
  const [content, setContent] = useState<PageContent>(defaultContactContent)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedContent = localStorage.getItem('contactContent')
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