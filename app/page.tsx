import { getPosts } from '@/lib/posts-data'
import HomeClient from '@/components/HomeClient'

export const revalidate = 60 // 60秒ごとに再生成

// サーバーコンポーネント
export default async function Home() {
  const posts = await getPosts()
  
  return <HomeClient initialPosts={posts} />
}