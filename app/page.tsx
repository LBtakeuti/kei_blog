'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { useState, useEffect } from 'react'
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
  isDraft?: boolean
  isPublished?: boolean
}



const categories = [
  "Lifestyle",
  "Photography",
  "Fitness"
]

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isCategoryOpen, setIsCategoryOpen] = useState(false)
  const [isRecentPostsOpen, setIsRecentPostsOpen] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const savedPosts = localStorage.getItem('posts')
    const allPosts = savedPosts ? JSON.parse(savedPosts) : []
    
    // 公開された記事のみを表示
    const publishedPosts = allPosts.filter((post: Post) => post.isPublished !== false && !post.isDraft)
    
    console.log('ユーザーサイトで読み込んだ投稿:', {
      allPosts,
      publishedPosts
    })
    
    setPosts(publishedPosts)
  }, [])

  const filteredPosts = posts.filter(post => {
    // カテゴリーフィルター
    if (selectedCategory && post.category?.toLowerCase() !== selectedCategory.toLowerCase()) {
      return false
    }
    
    // 検索フィルター
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        post.title.toLowerCase().includes(query) ||
        post.content?.toLowerCase().includes(query) ||
        post.excerpt?.toLowerCase().includes(query)
      )
    }
    
    return true
  })

  return (
    <div className="gap-1 px-6 flex flex-1 justify-center py-5">
      <div className="layout-content-container flex flex-col w-80">
        <div className="px-4 pt-4">
          <button
            onClick={() => setIsRecentPostsOpen(!isRecentPostsOpen)}
            className="flex items-center justify-between w-full text-[#121416] text-lg font-bold leading-tight tracking-[-0.015em] pb-2"
          >
            <span>Recent Posts</span>
            <ChevronDownIcon 
              className={`w-5 h-5 transition-transform ${isRecentPostsOpen ? 'rotate-180' : ''}`} 
            />
          </button>
          
          {isRecentPostsOpen && (
            <div className="space-y-1">
              {posts.slice(0, 3).map((post) => (
                <Link 
                  key={post.id} 
                  href={`/posts/${post.id}`} 
                  className="flex items-center gap-4 w-full px-2 py-3 rounded bg-white hover:bg-gray-50"
                >
                  <p className="text-[#121416] text-base font-normal leading-normal flex-1 truncate">{post.title}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
        
        <div className="px-4 pt-4">
          <button
            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            className="flex items-center justify-between w-full text-[#121416] text-lg font-bold leading-tight tracking-[-0.015em] pb-2"
          >
            <span>Categories</span>
            <ChevronDownIcon 
              className={`w-5 h-5 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} 
            />
          </button>
          
          {isCategoryOpen && (
            <div className="space-y-1">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`flex items-center gap-4 w-full px-2 py-3 rounded hover:bg-gray-50 ${
                  selectedCategory === null ? 'bg-[#f1f2f4]' : 'bg-white'
                }`}
              >
                <p className="text-[#121416] text-base font-normal leading-normal flex-1 text-left">All Categories</p>
              </button>
              {categories.map((category, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedCategory(category.toLowerCase())}
                  className={`flex items-center gap-4 w-full px-2 py-3 rounded hover:bg-gray-50 ${
                    selectedCategory === category.toLowerCase() ? 'bg-[#f1f2f4]' : 'bg-white'
                  }`}
                >
                  <p className="text-[#121416] text-base font-normal leading-normal flex-1 text-left">{category}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
        <h2 className="text-[#121416] tracking-light text-[28px] font-bold leading-tight px-4 text-center pb-3 pt-5">
          {selectedCategory ? `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Posts` : 'Latest Posts'}
        </h2>
        
        {/* 検索バー */}
        <div className="px-4 pb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="記事を検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <svg
              className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
        {filteredPosts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[#6a7581] text-lg">
              {selectedCategory 
                ? `No posts found in ${selectedCategory} category.` 
                : 'No posts found.'}
            </p>
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory(null)}
                className="mt-4 text-[#121416] hover:underline"
              >
                View all posts
              </button>
            )}
          </div>
        ) : (
          filteredPosts.map((post) => (
          <div key={post.id} className="p-4 @container">
            <div className="flex flex-col items-stretch justify-start rounded-xl @xl:flex-row @xl:items-start">
              <Link href={`/posts/${post.id}`} className="w-full @xl:w-1/2">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-auto rounded-xl hover:opacity-90 transition-opacity cursor-pointer"
                />
              </Link>
              <div className="flex w-full min-w-72 grow flex-col items-stretch justify-center gap-1 py-4 @xl:px-4">
                <Link href={`/posts/${post.id}`}>
                  <p className="text-[#121416] text-lg font-bold leading-tight tracking-[-0.015em] hover:underline cursor-pointer">{post.title}</p>
                </Link>
                <div className="flex items-end gap-3 justify-between">
                  <div className="flex flex-col gap-1">
                    <p className="text-[#6a7581] text-base font-normal leading-normal">
                      {post.excerpt || post.content?.substring(0, 150) + '...'}
                    </p>
                    <p className="text-[#6a7581] text-base font-normal leading-normal">By {post.author} | Published on {post.date}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )))}
      </div>
    </div>
  )
}