import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import CommentSection from '@/components/CommentSection'
import ImageLayoutRenderer from '@/components/ImageLayoutRenderer'
import { getPosts, getPostById } from '@/lib/posts-data'
import { Metadata } from 'next'

// 静的パラメータの生成（ビルド時に実行）
export async function generateStaticParams() {
  const posts = await getPosts()
  
  return posts.map((post) => ({
    id: post.id.toString(),
  }))
}

// メタデータの生成（SEO対策）
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const post = await getPostById(params.id)
  
  if (!post) {
    return {
      title: '記事が見つかりません',
    }
  }

  return {
    title: post.title,
    description: post.excerpt || post.content.substring(0, 160),
    openGraph: {
      title: post.title,
      description: post.excerpt || post.content.substring(0, 160),
      images: post.image ? [post.image] : [],
    },
  }
}

// サーバーコンポーネント（データ取得はサーバーサイドで実行）
export default async function PostDetail({ params }: { params: { id: string } }) {
  const post = await getPostById(params.id)

  if (!post) {
    notFound()
  }

  return (
    <article className="px-4 sm:px-6 lg:px-8 flex flex-1 justify-center py-5">
      <div className="layout-content-container flex flex-col max-w-[800px] flex-1">
        <Link href="/" className="flex items-center gap-2 text-[#6a7581] hover:text-[#121416] mb-6">
          <ArrowLeftIcon className="w-4 h-4" />
          <span className="text-sm">ホームに戻る</span>
        </Link>

        {post.image && (
          <div className="w-full mb-6 sm:mb-8">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-auto rounded-xl object-cover"
            />
          </div>
        )}

        <header className="mb-6 sm:mb-8">
          <h1 className="text-[#121416] text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight tracking-[-0.015em] mb-4">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-[#6a7581] text-xs sm:text-sm">
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
          {post.tags && post.tags.length > 0 && (
            <div className="flex gap-2 mt-4 flex-wrap">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 sm:px-3 py-1 bg-gray-100 text-gray-700 text-xs sm:text-sm rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none">
          <div className="text-[#121416] text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
            {post.content}
          </div>
          
          {post.imageLayouts && post.imageLayouts.length > 0 && (
            <div className="mt-6 sm:mt-8">
              <ImageLayoutRenderer layouts={post.imageLayouts} />
            </div>
          )}
        </div>

        <CommentSection postId={post.id} />
        
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-[#f1f2f4]">
          <Link href="/" className="flex items-center gap-2 text-[#121416] hover:underline">
            <ArrowLeftIcon className="w-4 h-4" />
            他の記事を見る
          </Link>
        </div>
      </div>
    </article>
  )
}