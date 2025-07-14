'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

interface Post {
  id: number
  title: string
  content: string
  excerpt?: string
  author: string
  date: string
  image: string
  category?: string
}

const defaultPosts: Post[] = [
  {
    id: 1,
    title: "The Future of Sustainable Living",
    content: `Sustainable living is more than just a trend; it's a necessity for our planet's future. In this comprehensive guide, we'll explore innovative approaches to eco-friendly living that can be easily incorporated into your daily routine.

From renewable energy solutions like solar panels and wind turbines to zero-waste lifestyles that minimize our environmental footprint, there are countless ways to make a positive impact. We'll delve into practical tips for reducing energy consumption, choosing sustainable products, and creating an eco-friendly home environment.

Learn about the latest green technologies, sustainable fashion choices, and how small changes in your daily habits can contribute to a healthier planet. Whether you're just starting your sustainability journey or looking to take your eco-conscious lifestyle to the next level, this guide provides actionable insights for everyone.

Join the movement towards a more sustainable future and discover how you can be part of the solution to climate change and environmental degradation.`,
    excerpt: "Explore innovative approaches to eco-friendly living, from renewable energy solutions to zero-waste lifestyles. Learn how small changes can make a big impact on our planet's health.",
    author: "Emma Carter",
    date: "July 26, 2024",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCffIFhoH1QgzKS_Wz05dELc07wG3C9MEMAOxshqVokSs53XjSiixUnrQmHngxMyZdArQDJHp1Q30NIuLyPF6256Y48JYRgpHes_fEx4OCICvucga_zej9-PJrDDWRnVUk7rF_8lP7gAEH4X1QsBVvTOacAVTPsuO29hGymYvhJR-G4n4tJOot9XQmNlOBiZb0oeCt41MSRIAB2-H2XcPEK21SWQ2_v7HaebFktfT9Y1Yj6CGuoF0iaL11u-9gD8CNAsRTdIE1T1oEG",
    category: "lifestyle"
  },
  {
    id: 2,
    title: "Mastering the Art of Photography",
    content: `Photography is an art form that allows us to capture moments, tell stories, and express our creativity. In this comprehensive guide, we'll explore the fundamental principles and advanced techniques that will help you take your photography skills to the next level.

Understanding composition is crucial for creating visually appealing images. We'll discuss the rule of thirds, leading lines, symmetry, and other compositional techniques that can transform ordinary scenes into extraordinary photographs. Learn how to use natural and artificial lighting to enhance your subjects and create mood in your images.

Post-processing is an essential part of modern photography. We'll introduce you to popular editing software and techniques that can help you enhance your photos while maintaining a natural look. From basic adjustments like exposure and contrast to advanced techniques like color grading and compositing, you'll learn how to bring your creative vision to life.

Whether you're shooting with a professional DSLR, mirrorless camera, or smartphone, these principles apply universally. Join us on this journey to master the art of photography and capture the world through your unique perspective.`,
    excerpt: "Dive into the world of photography with expert tips on composition, lighting, and editing. Whether you're a beginner or a seasoned pro, enhance your skills and capture stunning images.",
    author: "Ethan Lee",
    date: "July 20, 2024",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCWA4PcllaaPM6IBu9Gu1K_k8PVzNLRcluueK8EvIcJPPzo7X4l5fEiKqqrGTJSxYNoroeHMmm-quTxEaoye-Jh737TJ27eEkr8JYTqhEzz4DFbnqX_lkykm7aGXoP2Pi3SziKxpAitVAnGis3qcl4CAAIHAz0uCwop_xOX8xVUW88z-DYPF05VjWamTsMQavi5MtVQOzBobEGMTu1OiWBKzJi0VdwfObNAQ8IwodBehNLDVuikhjGayaC6zOTYdskvKHx38qWkYOxr",
    category: "photography"
  },
  {
    id: 3,
    title: "The Ultimate Guide to Home Workouts",
    content: `Staying fit and healthy doesn't require an expensive gym membership or fancy equipment. In this ultimate guide to home workouts, we'll show you how to create an effective fitness routine using minimal space and equipment.

We'll start with bodyweight exercises that target all major muscle groups. From push-ups and squats to planks and lunges, these fundamental movements form the foundation of any good workout routine. Learn proper form and technique to maximize results while minimizing the risk of injury.

Cardiovascular fitness is equally important for overall health. Discover high-intensity interval training (HIIT) routines that can be done in small spaces, jump rope techniques, and creative ways to get your heart rate up without leaving your home. We'll also explore yoga and stretching routines for flexibility and recovery.

Creating a sustainable fitness routine is about more than just exercises. We'll discuss how to set realistic goals, track your progress, stay motivated, and integrate healthy habits into your daily life. Whether you're a fitness beginner or looking to maintain your routine at home, this guide provides everything you need to achieve your fitness goals.`,
    excerpt: "Stay fit and healthy with our comprehensive guide to effective home workouts. Discover routines for all fitness levels, with no equipment needed. Get ready to sweat and achieve your fitness goals.",
    author: "Olivia Bennett",
    date: "July 14, 2024",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDd5WWgKwx_tlqEvSmo06MJiEyvAdga8zvNBUF3bt-6GQ6Hr0uM3JKrmR4Mhtwe1lFN4y6t8azLuFiA6HcWJ_ZCnaXe--cIsVJe-GzuHINSy507Jdz0L67CWjh90ubrWjablMXDWbtvS_qx8h6mE55mdk_YED5MDeqia37bGYYPmOnvX8RvffsQvxQ0cijlMw0PfWR041CF-jDcrKpEMORVZAYbXousZBxaZKjyjOewgyaVMDYJbJ97AmD4bhtc-Ai1RrBHntDIjItw",
    category: "fitness"
  }
]

export default function PostDetail() {
  const params = useParams()
  const id = params?.id
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return

    const postId = parseInt(id as string)
    
    // まずlocalStorageから探す（カスタム投稿を優先）
    const savedPosts = localStorage.getItem('posts')
    if (savedPosts) {
      const customPosts = JSON.parse(savedPosts)
      const customPost = customPosts.find((p: Post) => p.id === postId)
      if (customPost) {
        console.log('カスタム投稿を表示:', customPost)
        setPost(customPost)
        setLoading(false)
        return
      }
    }

    // カスタム投稿にない場合、デフォルトの投稿から探す
    const defaultPost = defaultPosts.find(p => p.id === postId)
    if (defaultPost) {
      console.log('デフォルト投稿を表示:', defaultPost)
      setPost(defaultPost)
      setLoading(false)
      return
    }
    
    console.log('投稿が見つかりませんでした:', postId)
    setLoading(false)
  }, [id])

  if (loading) {
    return (
      <div className="flex flex-1 justify-center items-center py-20">
        <p className="text-[#6a7581] text-lg">読み込み中...</p>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="flex flex-1 justify-center items-center py-20">
        <div className="text-center">
          <p className="text-[#6a7581] text-lg mb-4">記事が見つかりませんでした</p>
          <Link href="/" className="text-[#121416] hover:underline flex items-center gap-2">
            <ArrowLeftIcon className="w-4 h-4" />
            ホームに戻る
          </Link>
        </div>
      </div>
    )
  }

  return (
    <article className="px-6 flex flex-1 justify-center py-5">
      <div className="layout-content-container flex flex-col max-w-[800px] flex-1">
        <Link href="/" className="flex items-center gap-2 text-[#6a7581] hover:text-[#121416] mb-6">
          <ArrowLeftIcon className="w-4 h-4" />
          <span className="text-sm">ホームに戻る</span>
        </Link>

        {post.image && (
          <div className="relative w-full aspect-video mb-8">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover rounded-xl"
              priority
            />
          </div>
        )}

        <header className="mb-8">
          <h1 className="text-[#121416] text-4xl font-bold leading-tight tracking-[-0.015em] mb-4">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-[#6a7581] text-sm">
            <span>by {post.author}</span>
            <span>•</span>
            <span>{post.date}</span>
            {post.category && (
              <>
                <span>•</span>
                <span className="capitalize">{post.category}</span>
              </>
            )}
          </div>
        </header>

        <div className="prose prose-lg max-w-none">
          <div className="text-[#121416] text-base leading-relaxed whitespace-pre-wrap">
            {post.content}
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[#f1f2f4]">
          <Link href="/" className="flex items-center gap-2 text-[#121416] hover:underline">
            <ArrowLeftIcon className="w-4 h-4" />
            他の記事を見る
          </Link>
        </div>
      </div>
    </article>
  )
}