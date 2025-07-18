'use client'

import { useState, useEffect } from 'react'
import { CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'

export default function SupabaseStatus() {
  const [status, setStatus] = useState<'checking' | 'connected' | 'error' | 'not-configured'>('checking')
  const [useSupabase, setUseSupabase] = useState(false)

  useEffect(() => {
    checkSupabaseConnection()
  }, [])

  const checkSupabaseConnection = async () => {
    try {
      // 環境変数の確認
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your_supabase')) {
        setStatus('not-configured')
        setUseSupabase(false)
        localStorage.setItem('useSupabase', 'false')
        return
      }

      // Supabaseへの接続テスト
      const { supabase } = await import('@/lib/supabase')
      const { error } = await supabase.from('categories').select('count').limit(1)
      
      if (error) {
        console.error('Supabase connection error:', error)
        setStatus('error')
        setUseSupabase(false)
        localStorage.setItem('useSupabase', 'false')
      } else {
        setStatus('connected')
        const savedPreference = localStorage.getItem('useSupabase')
        const shouldUseSupabase = savedPreference !== 'false'
        setUseSupabase(shouldUseSupabase)
      }
    } catch (error) {
      console.error('Supabase check error:', error)
      setStatus('error')
      setUseSupabase(false)
      localStorage.setItem('useSupabase', 'false')
    }
  }

  const toggleSupabase = () => {
    const newValue = !useSupabase
    setUseSupabase(newValue)
    localStorage.setItem('useSupabase', newValue.toString())
  }

  if (status === 'checking') {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500"></div>
        接続確認中...
      </div>
    )
  }

  if (status === 'not-configured') {
    return (
      <div className="flex items-center gap-2 text-sm text-amber-600">
        <ExclamationTriangleIcon className="w-5 h-5" />
        <span>Supabase未設定（LocalStorage使用中）</span>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="flex items-center gap-2 text-sm text-red-600">
        <XCircleIcon className="w-5 h-5" />
        <span>Supabase接続エラー（LocalStorage使用中）</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 text-sm">
        <CheckCircleIcon className="w-5 h-5 text-green-600" />
        <span className="text-green-600">Supabase接続済み</span>
      </div>
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={useSupabase}
          onChange={toggleSupabase}
          className="sr-only"
        />
        <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          useSupabase ? 'bg-blue-600' : 'bg-gray-200'
        }`}>
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            useSupabase ? 'translate-x-6' : 'translate-x-1'
          }`} />
        </div>
        <span className="text-sm text-gray-600">
          {useSupabase ? 'Supabase使用中' : 'LocalStorage使用中'}
        </span>
      </label>
    </div>
  )
}