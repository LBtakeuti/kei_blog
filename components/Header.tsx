"use client"

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

export default function Header() {
  const pathname = usePathname()
  const isAdminPage = pathname?.startsWith('/admin')

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f1f2f4] px-10 py-3">
      <div className="flex items-center gap-4 text-[#121416]">
        <div className="size-4">
          <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 6H42L36 24L42 42H6L12 24L6 6Z" fill="currentColor"></path>
          </svg>
        </div>
        <h2 className="text-[#121416] text-lg font-bold leading-tight tracking-[-0.015em]">Bloggr</h2>
      </div>
      <div className="flex flex-1 justify-end gap-8">
        <div className="flex items-center gap-9">
          {isAdminPage ? (
            <>
              <Link className="text-[#121416] text-sm font-medium leading-normal" href="/admin">記事管理</Link>
              <Link className="text-[#121416] text-sm font-medium leading-normal" href="/">サイトを見る</Link>
            </>
          ) : (
            <>
              <Link className="text-[#121416] text-sm font-medium leading-normal" href="/">Home</Link>
              <Link className="text-[#121416] text-sm font-medium leading-normal" href="/about">About</Link>
              <Link className="text-[#121416] text-sm font-medium leading-normal" href="/contact">Contact</Link>
            </>
          )}
        </div>
        {!isAdminPage && (
          <Link 
            href="/admin/create"
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#dce7f3] text-[#121416] text-sm font-bold leading-normal tracking-[0.015em]"
          >
            <span className="truncate">New Post</span>
          </Link>
        )}
      </div>
    </header>
  )
}