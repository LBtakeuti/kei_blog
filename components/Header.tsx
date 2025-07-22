"use client"

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

export default function Header() {
  const pathname = usePathname()
  const isAdminPage = pathname?.startsWith('/admin')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="border-b border-solid border-b-[#f1f2f4] bg-white sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-10 py-3">
        <div className="flex items-center gap-3 text-[#121416]">
          <div className="size-4">
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 6H42L36 24L42 42H6L12 24L6 6Z" fill="currentColor"></path>
            </svg>
          </div>
          <h2 className="text-[#121416] text-lg font-bold leading-tight tracking-[-0.015em]">Bloggr</h2>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex flex-1 justify-end gap-8">
          <div className="flex items-center gap-9">
            {isAdminPage ? (
              <>
                <Link className="text-[#121416] text-sm font-medium leading-normal hover:text-blue-600 transition-colors" href="/admin">記事管理</Link>
                <Link className="text-[#121416] text-sm font-medium leading-normal hover:text-blue-600 transition-colors" href="/">サイトを見る</Link>
              </>
            ) : (
              <>
                <Link className="text-[#121416] text-sm font-medium leading-normal hover:text-blue-600 transition-colors" href="/">Home</Link>
                <Link className="text-[#121416] text-sm font-medium leading-normal hover:text-blue-600 transition-colors" href="/about">About</Link>
                <Link className="text-[#121416] text-sm font-medium leading-normal hover:text-blue-600 transition-colors" href="/contact">Contact</Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
        >
          {isMobileMenuOpen ? (
            <XMarkIcon className="h-6 w-6 text-[#121416]" />
          ) : (
            <Bars3Icon className="h-6 w-6 text-[#121416]" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-[#f1f2f4] shadow-lg">
          <div className="px-4 py-3 space-y-3">
            {isAdminPage ? (
              <>
                <Link 
                  className="block text-[#121416] text-base font-medium leading-normal py-2 hover:text-blue-600 transition-colors" 
                  href="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  記事管理
                </Link>
                <Link 
                  className="block text-[#121416] text-base font-medium leading-normal py-2 hover:text-blue-600 transition-colors" 
                  href="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  サイトを見る
                </Link>
              </>
            ) : (
              <>
                <Link 
                  className="block text-[#121416] text-base font-medium leading-normal py-2 hover:text-blue-600 transition-colors" 
                  href="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link 
                  className="block text-[#121416] text-base font-medium leading-normal py-2 hover:text-blue-600 transition-colors" 
                  href="/about"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About
                </Link>
                <Link 
                  className="block text-[#121416] text-base font-medium leading-normal py-2 hover:text-blue-600 transition-colors" 
                  href="/contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact
                </Link>
                {/* New Post button removed for security */}
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}