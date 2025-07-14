'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // ログインページ以外で認証チェック
    if (pathname !== '/admin/login') {
      const isAuthenticated = localStorage.getItem('isAuthenticated')
      if (!isAuthenticated) {
        router.push('/admin/login')
      }
    }
  }, [pathname, router])

  return <>{children}</>
}