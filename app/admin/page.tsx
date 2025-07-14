'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline'

interface Post {
  id: number
  title: string
  excerpt?: string
  content?: string
  author: string
  date: string
  image: string
  category?: string
}

const defaultPosts: Post[] = [
  {
    id: 1,
    title: "The Future of Sustainable Living",
    excerpt: "Explore innovative approaches to eco-friendly living, from renewable energy solutions to zero-waste lifestyles.",
    author: "Emma Carter",
    date: "July 26, 2024",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCffIFhoH1QgzKS_Wz05dELc07wG3C9MEMAOxshqVokSs53XjSiixUnrQmHngxMyZdArQDJHp1Q30NIuLyPF6256Y48JYRgpHes_fEx4OCICvucga_zej9-PJrDDWRnVUk7rF_8lP7gAEH4X1QsBVvTOacAVTPsuO29hGymYvhJR-G4n4tJOot9XQmNlOBiZb0oeCt41MSRIAB2-H2XcPEK21SWQ2_v7HaebFktfT9Y1Yj6CGuoF0iaL11u-9gD8CNAsRTdIE1T1oEG",
    category: "lifestyle"
  },
  {
    id: 2,
    title: "Mastering the Art of Photography",
    excerpt: "Dive into the world of photography with expert tips on composition, lighting, and editing.",
    author: "Ethan Lee",
    date: "July 20, 2024",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCWA4PcllaaPM6IBu9Gu1K_k8PVzNLRcluueK8EvIcJPPzo7X4l5fEiKqqrGTJSxYNoroeHMmm-quTxEaoye-Jh737TJ27eEkr8JYTqhEzz4DFbnqX_lkykm7aGXoP2Pi3SziKxpAitVAnGis3qcl4CAAIHAz0uCwop_xOX8xVUW88z-DYPF05VjWamTsMQavi5MtVQOzBobEGMTu1OiWBKzJi0VdwfObNAQ8IwodBehNLDVuikhjGayaC6zOTYdskvKHx38qWkYOxr",
    category: "photography"
  },
  {
    id: 3,
    title: "The Ultimate Guide to Home Workouts",
    excerpt: "Stay fit and healthy with our comprehensive guide to effective home workouts.",
    author: "Olivia Bennett",
    date: "July 14, 2024",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDd5WWgKwx_tlqEvSmo06MJiEyvAdga8zvNBUF3bt-6GQ6Hr0uM3JKrmR4Mhtwe1lFN4y6t8azLuFiA6HcWJ_ZCnaXe--cIsVJe-GzuHINSy507Jdz0L67CWjh90ubrWjablMXDWbtvS_qx8h6mE55mdk_YED5MDeqia37bGYYPmOnvX8RvffsQvxQ0cijlMw0PfWR041CF-jDcrKpEMORVZAYbXousZBxaZKjyjOewgyaVMDYJbJ97AmD4bhtc-Ai1RrBHntDIjItw",
    category: "fitness"
  }
]

export default function AdminHome() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // LocalStorageから投稿を取得
    const savedPosts = localStorage.getItem('posts')
    const allPosts = savedPosts ? JSON.parse(savedPosts) : []
    setPosts([...allPosts, ...defaultPosts])
    setLoading(false)
  }, [])

  const handleDelete = (id: number) => {
    // デフォルト記事は削除不可
    if (defaultPosts.find(dp => dp.id === id)) {
      alert('デフォルトの記事は削除できません。')
      return
    }
    
    if (confirm('この記事を削除してもよろしいですか？')) {
      // LocalStorageから削除
      const savedPosts = localStorage.getItem('posts')
      const posts = savedPosts ? JSON.parse(savedPosts) : []
      const updatedPosts = posts.filter((post: Post) => post.id !== id)
      localStorage.setItem('posts', JSON.stringify(updatedPosts))
      
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
    <div className="px-6 flex flex-1 justify-center py-5">
      <div className="layout-content-container flex flex-col max-w-[1200px] flex-1">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-[#121416] tracking-light text-[32px] font-bold leading-tight">記事管理</h1>
          <Link
            href="/admin/create"
            className="flex items-center gap-2 px-4 py-2 bg-[#dce7f3] text-[#121416] rounded-xl hover:bg-[#c5d5e8] transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            <span className="text-sm font-bold">新規投稿</span>
          </Link>
        </div>

        <div className="overflow-x-auto">
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
                      <div className="relative w-16 h-16">
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    <p className="text-[#121416] font-medium">{post.title}</p>
                    <p className="text-[#6a7581] text-sm mt-1 line-clamp-2">
                      {post.excerpt || post.content?.substring(0, 100) + '...'}
                    </p>
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
                        className={`p-2 rounded-lg transition-colors ${
                          defaultPosts.some(dp => dp.id === post.id)
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-red-600 hover:bg-red-50'
                        }`}
                        disabled={defaultPosts.some(dp => dp.id === post.id)}
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