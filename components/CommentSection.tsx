'use client'

import { useState, useEffect } from 'react'
import { Comment } from '@/types/comment'

interface CommentSectionProps {
  postId: number
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [authorName, setAuthorName] = useState('')
  const [authorEmail, setAuthorEmail] = useState('')

  useEffect(() => {
    const savedComments = localStorage.getItem('comments')
    if (savedComments) {
      const allComments = JSON.parse(savedComments)
      const postComments = allComments.filter((comment: Comment) => comment.postId === postId)
      setComments(postComments)
    }
  }, [postId])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newComment.trim() || !authorName.trim()) {
      alert('名前とコメントは必須です')
      return
    }

    const savedComments = localStorage.getItem('comments')
    const allComments = savedComments ? JSON.parse(savedComments) : []
    
    const comment: Comment = {
      id: Date.now(),
      postId,
      author: authorName,
      content: newComment,
      date: new Date().toLocaleDateString('ja-JP', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      email: authorEmail || undefined
    }
    
    allComments.push(comment)
    localStorage.setItem('comments', JSON.stringify(allComments))
    
    setComments([...comments, comment])
    setNewComment('')
    setAuthorName('')
    setAuthorEmail('')
  }

  return (
    <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-[#f1f2f4]">
      <h3 className="text-[#121416] text-xl sm:text-2xl font-bold mb-4 sm:mb-6">コメント ({comments.length})</h3>
      
      <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
        {comments.length === 0 ? (
          <p className="text-[#6a7581] text-sm sm:text-base">まだコメントはありません。最初のコメントを投稿してください！</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-gray-50 rounded-lg p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-1 sm:gap-0">
                <h4 className="font-semibold text-[#121416] text-sm sm:text-base">{comment.author}</h4>
                <span className="text-xs sm:text-sm text-[#6a7581]">{comment.date}</span>
              </div>
              <p className="text-[#121416] whitespace-pre-wrap text-sm sm:text-base">{comment.content}</p>
            </div>
          ))
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="bg-gray-50 rounded-lg p-4 sm:p-6">
        <h4 className="text-base sm:text-lg font-semibold text-[#121416] mb-4">コメントを投稿</h4>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-xs sm:text-sm font-medium text-[#121416] mb-1">
                名前 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full px-3 py-2 border border-[#dde0e3] rounded-lg focus:outline-none focus:border-blue-500 text-sm sm:text-base"
                placeholder="お名前"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-[#121416] mb-1">
                メールアドレス（任意）
              </label>
              <input
                type="email"
                id="email"
                value={authorEmail}
                onChange={(e) => setAuthorEmail(e.target.value)}
                className="w-full px-3 py-2 border border-[#dde0e3] rounded-lg focus:outline-none focus:border-blue-500 text-sm sm:text-base"
                placeholder="email@example.com"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="comment" className="block text-xs sm:text-sm font-medium text-[#121416] mb-1">
              コメント <span className="text-red-500">*</span>
            </label>
            <textarea
              id="comment"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-[#dde0e3] rounded-lg focus:outline-none focus:border-blue-500 resize-none text-sm sm:text-base"
              placeholder="コメントを入力してください..."
            />
          </div>
          
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2 bg-[#121416] text-white rounded-lg hover:bg-[#2a2d30] transition-colors text-sm sm:text-base"
          >
            コメントを投稿
          </button>
        </div>
      </form>
    </div>
  )
}