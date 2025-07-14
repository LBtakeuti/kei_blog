'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Comment } from '@/types/comment'
import { TrashIcon } from '@heroicons/react/24/outline'

interface Post {
  id: number
  title: string
}

export default function AdminComments() {
  const [comments, setComments] = useState<Comment[]>([])
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    const savedComments = localStorage.getItem('comments')
    const savedPosts = localStorage.getItem('posts')
    
    if (savedComments) {
      const allComments = JSON.parse(savedComments)
      setComments(allComments.sort((a: Comment, b: Comment) => b.id - a.id))
    }
    
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts))
    }
  }, [])

  const getPostTitle = (postId: number) => {
    const post = posts.find(p => p.id === postId)
    return post?.title || '不明な記事'
  }

  const handleDelete = (commentId: number) => {
    if (confirm('このコメントを削除してもよろしいですか？')) {
      const updatedComments = comments.filter(comment => comment.id !== commentId)
      setComments(updatedComments)
      localStorage.setItem('comments', JSON.stringify(updatedComments))
    }
  }

  return (
    <div className="px-40 flex flex-1 justify-center py-5">
      <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
        <div className="flex flex-wrap justify-between gap-3 p-4">
          <p className="text-[#121416] tracking-light text-[32px] font-bold leading-tight min-w-72">コメント管理</p>
          <Link
            href="/admin"
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#f1f2f4] text-[#121416] text-sm font-bold leading-normal tracking-[0.015em]"
          >
            <span className="truncate">管理画面に戻る</span>
          </Link>
        </div>
        
        {comments.length === 0 ? (
          <div className="p-4 text-center text-[#6a7581]">
            <p>まだコメントはありません。</p>
          </div>
        ) : (
          <div className="space-y-4 p-4">
            {comments.map((comment) => (
              <div key={comment.id} className="bg-white border border-[#dde0e3] rounded-xl p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-[#121416]">{comment.author}</h4>
                    <p className="text-sm text-[#6a7581]">
                      {comment.email && `${comment.email} • `}
                      {comment.date}
                    </p>
                    <p className="text-sm text-blue-600 mt-1">
                      記事: {getPostTitle(comment.postId)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="削除"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-[#121416] whitespace-pre-wrap mt-3">{comment.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}