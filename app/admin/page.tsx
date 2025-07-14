'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline'
import React from 'react'

interface Post {
  id: number
  title: string
  excerpt?: string
  content?: string
  author: string
  date: string
  image: string
  category?: string
  tags?: string[]
  imageLayouts?: any[]
  isDraft?: boolean
  isPublished?: boolean
}


export default function AdminHome() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // LocalStorageから投稿を取得（カスタム投稿のみ表示）
    const savedPosts = localStorage.getItem('posts')
    const customPosts = savedPosts ? JSON.parse(savedPosts) : []
    
    console.log('管理画面で読み込んだ投稿:', {
      customPosts
    })
    
    // CMS側はカスタム投稿のみ表示
    setPosts(customPosts)
    setLoading(false)
  }, [])

  const handleDelete = (id: number) => {
    if (confirm('この記事を削除してもよろしいですか？')) {
      // LocalStorageから削除
      const savedPosts = localStorage.getItem('posts')
      const posts = savedPosts ? JSON.parse(savedPosts) : []
      const updatedPosts = posts.filter((post: Post) => post.id !== id)
      localStorage.setItem('posts', JSON.stringify(updatedPosts))
      
      console.log('記事を削除しました:', id)
      console.log('削除後の投稿一覧:', updatedPosts)
      
      // 表示を更新
      setPosts(prevPosts => prevPosts.filter(post => post.id !== id))
    }
  }

  if (loading) {
    return (
      <div className="flex flex-1 justify-center items-center py-20">
        <p className="text-[#6a7581] text-lg">読み込み中...</p>
      </div>
    )
  }


  return (
    <div className="px-4 sm:px-6 flex flex-1 justify-center py-5">
      <div className="layout-content-container flex flex-col max-w-[1200px] flex-1">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-[#121416] tracking-light text-2xl sm:text-3xl lg:text-[32px] font-bold leading-tight">記事管理</h1>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
            <Link
              href="/admin/create"
              className="flex items-center justify-center gap-2 px-4 py-2 bg-[#dce7f3] text-[#121416] rounded-xl hover:bg-[#c5d5e8] transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              <span className="text-sm font-bold">新規投稿</span>
            </Link>
            <button
              onClick={() => {
                localStorage.removeItem('isAuthenticated')
                window.location.href = '/admin/login'
              }}
              className="px-4 py-2 bg-gray-200 text-[#121416] rounded-xl hover:bg-gray-300 transition-colors"
            >
              <span className="text-sm font-bold">ログアウト</span>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-4 mb-6">
          <Link
            href="/admin/pages/about"
            className="px-3 sm:px-4 py-2 bg-[#f1f2f4] text-[#121416] rounded-xl hover:bg-[#e5e7e9] transition-colors"
          >
            <span className="text-xs sm:text-sm font-medium">Aboutページ編集</span>
          </Link>
          <Link
            href="/admin/pages/contact"
            className="px-3 sm:px-4 py-2 bg-[#f1f2f4] text-[#121416] rounded-xl hover:bg-[#e5e7e9] transition-colors"
          >
            <span className="text-xs sm:text-sm font-medium">Contactページ編集</span>
          </Link>
          <Link
            href="/admin/comments"
            className="px-3 sm:px-4 py-2 bg-[#f1f2f4] text-[#121416] rounded-xl hover:bg-[#e5e7e9] transition-colors"
          >
            <span className="text-xs sm:text-sm font-medium">コメント管理</span>
          </Link>
        </div>

        {/* モバイル用カードレイアウト */}
        <div className="block sm:hidden space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <div className="flex gap-3">
                {post.image && (
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="text-[#121416] font-medium text-sm line-clamp-2">{post.title}</h3>
                  {post.excerpt && (
                    <p className="text-[#6a7581] text-xs mt-1 line-clamp-2">
                      {post.excerpt}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-2 text-xs text-[#6a7581]">
                    <span>{post.category || 'なし'}</span>
                    <span>•</span>
                    <span>{post.author}</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                <span className="text-xs text-[#6a7581]">{post.date}</span>
                <div className="flex gap-2">
                  <Link
                    href={`/admin/edit/${post.id}`}
                    className="p-2 text-[#121416] hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* デスクトップ用テーブルレイアウト */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[#f1f2f4]">
                <th className="text-left p-4 text-sm font-medium text-[#6a7581]">画像</th>
                <th className="text-left p-4 text-sm font-medium text-[#6a7581]">タイトル</th>
                <th className="text-left p-4 text-sm font-medium text-[#6a7581]">カテゴリー</th>
                <th className="text-left p-4 text-sm font-medium text-[#6a7581]">著者</th>
                <th className="text-left p-4 text-sm font-medium text-[#6a7581]">日付</th>
                <th className="text-right p-4 text-sm font-medium text-[#6a7581]">操作</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-b border-[#f1f2f4] hover:bg-gray-50">
                  <td className="p-4">
                    {post.image && (
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-16 h-16 object-contain rounded"
                      />
                    )}
                  </td>
                  <td className="p-4">
                    <p className="text-[#121416] font-medium">{post.title}</p>
                    {post.excerpt && (
                      <p className="text-[#6a7581] text-sm mt-1 line-clamp-2">
                        {post.excerpt}
                      </p>
                    )}
                  </td>
                  <td className="p-4">
                    <span className="text-[#6a7581] text-sm capitalize">
                      {post.category || 'なし'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-[#6a7581] text-sm">{post.author}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-[#6a7581] text-sm">{post.date}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2 justify-end">
                      <Link
                        href={`/admin/edit/${post.id}`}
                        className="p-2 text-[#121416] hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {posts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-[#6a7581] text-lg mb-4">記事がありません</p>
            <Link
              href="/admin/create"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#dce7f3] text-[#121416] rounded-xl hover:bg-[#c5d5e8] transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              <span className="text-sm font-bold">最初の記事を作成</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}