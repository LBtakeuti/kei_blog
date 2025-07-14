'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeftIcon, ChevronRightIcon, ArrowLeftIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
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
}


const categories = [
  "Lifestyle",
  "Photography",
  "Fitness"
]

export default function CategoryPage() {
  const params = useParams()
  const category = params?.category as string
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [isCategoryOpen, setIsCategoryOpen] = useState(true)
  const [isRecentPostsOpen, setIsRecentPostsOpen] = useState(true)
  const [allPosts, setAllPosts] = useState<Post[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const postsPerPage = 5

  useEffect(() => {
    if (!category) return

    // LocalStorageから投稿を取得
    const savedPosts = localStorage.getItem('posts')
    const customPosts = savedPosts ? JSON.parse(savedPosts) : []
    
    // カスタム投稿のみ使用
    const allPostsData = customPosts

    setAllPosts(allPostsData)

    // カテゴリーでフィルター
    const filteredPosts = allPostsData.filter(
      post => post.category?.toLowerCase() === category.toLowerCase()
    )
    
    console.log('カテゴリーページで読み込んだ投稿:', {
      category,
      customPosts,
      allPostsData,
      filteredPosts
    })
    
    setPosts(filteredPosts)
    setLoading(false)
  }, [category])

  if (loading) {
    return (
      <div className="flex flex-1 justify-center items-center py-20">
        <p className="text-[#6a7581] text-lg">読み込み中...</p>
      </div>
    )
  }

  const displayCategory = category.charAt(0).toUpperCase() + category.slice(1)

  // Calculate pagination
  const totalPages = Math.ceil(posts.length / postsPerPage)
  const indexOfLastPost = currentPage * postsPerPage
  const indexOfFirstPost = indexOfLastPost - postsPerPage
  const displayPosts = posts.slice(indexOfFirstPost, indexOfLastPost)

  // Generate page numbers
  const getPageNumbers = () => {
    const pageNumbers = []
    const maxPagesToShow = 5
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i)
        }
        pageNumbers.push('...')
        pageNumbers.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1)
        pageNumbers.push('...')
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i)
        }
      } else {
        pageNumbers.push(1)
        pageNumbers.push('...')
        pageNumbers.push(currentPage - 1)
        pageNumbers.push(currentPage)
        pageNumbers.push(currentPage + 1)
        pageNumbers.push('...')
        pageNumbers.push(totalPages)
      }
    }
    
    return pageNumbers
  }

  return (
    <div className="gap-1 px-6 flex flex-1 justify-center py-5">
      <div className="layout-content-container flex flex-col w-80">
        <Link href="/" className="flex items-center gap-2 text-[#6a7581] hover:text-[#121416] mb-4 px-4">
          <ArrowLeftIcon className="w-4 h-4" />
          <span className="text-sm">ホームに戻る</span>
        </Link>
        
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
              {allPosts.slice(0, 3).map((post) => (
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
              <Link href="/" className="flex items-center gap-4 w-full px-2 py-3 rounded bg-white hover:bg-gray-50">
                <p className="text-[#121416] text-base font-normal leading-normal flex-1 text-left">All Categories</p>
              </Link>
              {categories.map((cat, index) => (
                <Link
                  key={index}
                  href={`/category/${cat.toLowerCase()}`}
                  className={`flex items-center gap-4 w-full px-2 py-3 rounded hover:bg-gray-50 ${
                    cat.toLowerCase() === category.toLowerCase() ? 'bg-[#f1f2f4]' : 'bg-white'
                  }`}
                >
                  <p className="text-[#121416] text-base font-normal leading-normal flex-1 text-left">{cat}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
        <h2 className="text-[#121416] tracking-light text-[28px] font-bold leading-tight px-4 text-center pb-3 pt-5">
          {displayCategory} Posts
        </h2>
        
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[#6a7581] text-lg mb-4">
              No posts found in {displayCategory} category.
            </p>
            <Link href="/" className="text-[#121416] hover:underline">
              View all posts
            </Link>
          </div>
        ) : (
          <>
            {displayPosts.map((post) => (
              <div key={post.id} className="p-4 @container">
                <div className="flex flex-col items-stretch justify-start rounded-xl @xl:flex-row @xl:items-start">
                  <Link href={`/posts/${post.id}`} className="w-full">
                    <div
                      className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl hover:opacity-90 transition-opacity cursor-pointer"
                      style={{ backgroundImage: `url("${post.image}")` }}
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
            ))}
            
            {totalPages > 1 && (
              <div className="flex items-center justify-center p-4">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="flex size-10 items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeftIcon className="text-[#121416] w-[18px] h-[18px]" />
                </button>
                
                {getPageNumbers().map((number, index) => (
                  <React.Fragment key={index}>
                    {number === '...' ? (
                      <span className="text-sm font-normal leading-normal flex size-10 items-center justify-center text-[#121416] rounded-full">
                        ...
                      </span>
                    ) : (
                      <button
                        onClick={() => setCurrentPage(number as number)}
                        className={`text-sm leading-normal flex size-10 items-center justify-center rounded-full transition-colors ${
                          currentPage === number 
                            ? 'font-bold text-[#121416] bg-[#f1f2f4]' 
                            : 'font-normal text-[#121416] hover:bg-gray-100'
                        }`}
                      >
                        {number}
                      </button>
                    )}
                  </React.Fragment>
                ))}
                
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="flex size-10 items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRightIcon className="text-[#121416] w-[18px] h-[18px]" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}