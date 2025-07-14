'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import { useState, useEffect } from 'react'

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
    excerpt: "Explore innovative approaches to eco-friendly living, from renewable energy solutions to zero-waste lifestyles. Learn how small changes can make a big impact on our planet's health.",
    author: "Emma Carter",
    date: "July 26, 2024",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCffIFhoH1QgzKS_Wz05dELc07wG3C9MEMAOxshqVokSs53XjSiixUnrQmHngxMyZdArQDJHp1Q30NIuLyPF6256Y48JYRgpHes_fEx4OCICvucga_zej9-PJrDDWRnVUk7rF_8lP7gAEH4X1QsBVvTOacAVTPsuO29hGymYvhJR-G4n4tJOot9XQmNlOBiZb0oeCt41MSRIAB2-H2XcPEK21SWQ2_v7HaebFktfT9Y1Yj6CGuoF0iaL11u-9gD8CNAsRTdIE1T1oEG",
    category: "lifestyle"
  },
  {
    id: 2,
    title: "Mastering the Art of Photography",
    excerpt: "Dive into the world of photography with expert tips on composition, lighting, and editing. Whether you're a beginner or a seasoned pro, enhance your skills and capture stunning images.",
    author: "Ethan Lee",
    date: "July 20, 2024",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCWA4PcllaaPM6IBu9Gu1K_k8PVzNLRcluueK8EvIcJPPzo7X4l5fEiKqqrGTJSxYNoroeHMmm-quTxEaoye-Jh737TJ27eEkr8JYTqhEzz4DFbnqX_lkykm7aGXoP2Pi3SziKxpAitVAnGis3qcl4CAAIHAz0uCwop_xOX8xVUW88z-DYPF05VjWamTsMQavi5MtVQOzBobEGMTu1OiWBKzJi0VdwfObNAQ8IwodBehNLDVuikhjGayaC6zOTYdskvKHx38qWkYOxr",
    category: "photography"
  },
  {
    id: 3,
    title: "The Ultimate Guide to Home Workouts",
    excerpt: "Stay fit and healthy with our comprehensive guide to effective home workouts. Discover routines for all fitness levels, with no equipment needed. Get ready to sweat and achieve your fitness goals.",
    author: "Olivia Bennett",
    date: "July 14, 2024",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDd5WWgKwx_tlqEvSmo06MJiEyvAdga8zvNBUF3bt-6GQ6Hr0uM3JKrmR4Mhtwe1lFN4y6t8azLuFiA6HcWJ_ZCnaXe--cIsVJe-GzuHINSy507Jdz0L67CWjh90ubrWjablMXDWbtvS_qx8h6mE55mdk_YED5MDeqia37bGYYPmOnvX8RvffsQvxQ0cijlMw0PfWR041CF-jDcrKpEMORVZAYbXousZBxaZKjyjOewgyaVMDYJbJ97AmD4bhtc-Ai1RrBHntDIjItw",
    category: "fitness"
  }
]

const recentPosts = [
  "The Future of Sustainable Living",
  "Mastering the Art of Photography",
  "The Ultimate Guide to Home Workouts"
]

const categories = [
  "Lifestyle",
  "Photography",
  "Fitness"
]

export default function Home() {
  const [posts, setPosts] = useState(defaultPosts)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isCategoryOpen, setIsCategoryOpen] = useState(false)
  const [isRecentPostsOpen, setIsRecentPostsOpen] = useState(true)

  useEffect(() => {
    const savedPosts = localStorage.getItem('posts')
    const customPosts = savedPosts ? JSON.parse(savedPosts) : []
    
    // カスタム投稿を先頭に、デフォルト投稿を後に配置
    const allPosts = [...customPosts, ...defaultPosts]
    
    console.log('ユーザーサイトで読み込んだ投稿:', {
      customPosts,
      defaultPosts,
      allPosts
    })
    
    setPosts(allPosts)
  }, [])

  const filteredPosts = selectedCategory 
    ? posts.filter(post => post.category?.toLowerCase() === selectedCategory.toLowerCase())
    : posts

  const displayPosts = filteredPosts.slice(0, 5) // 最新5件を表示

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
        {displayPosts.length === 0 ? (
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
          displayPosts.map((post) => (
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
        )))}
        <div className="flex items-center justify-center p-4">
          <Link href="#" className="flex size-10 items-center justify-center">
            <ChevronLeftIcon className="text-[#121416] w-[18px] h-[18px]" />
          </Link>
          <Link className="text-sm font-bold leading-normal tracking-[0.015em] flex size-10 items-center justify-center text-[#121416] rounded-full bg-[#f1f2f4]" href="#">1</Link>
          <Link className="text-sm font-normal leading-normal flex size-10 items-center justify-center text-[#121416] rounded-full" href="#">2</Link>
          <Link className="text-sm font-normal leading-normal flex size-10 items-center justify-center text-[#121416] rounded-full" href="#">3</Link>
          <span className="text-sm font-normal leading-normal flex size-10 items-center justify-center text-[#121416] rounded-full">...</span>
          <Link className="text-sm font-normal leading-normal flex size-10 items-center justify-center text-[#121416] rounded-full" href="#">10</Link>
          <Link href="#" className="flex size-10 items-center justify-center">
            <ChevronRightIcon className="text-[#121416] w-[18px] h-[18px]" />
          </Link>
        </div>
      </div>
    </div>
  )
}