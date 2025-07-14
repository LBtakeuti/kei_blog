'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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

export default function EditContactPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedContent = localStorage.getItem('contactContent')
    if (savedContent) {
      const pageContent = JSON.parse(savedContent) as PageContent
      setTitle(pageContent.title)
      setContent(pageContent.content)
    } else {
      setTitle(defaultContactContent.title)
      setContent(defaultContactContent.content)
    }
    setLoading(false)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const updatedContent: PageContent = {
      title,
      content
    }
    
    localStorage.setItem('contactContent', JSON.stringify(updatedContent))
    
    alert('Contactページが更新されました！')
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
          <p className="text-[#121416] tracking-light text-[32px] font-bold leading-tight min-w-72">Contactページを編集</p>
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