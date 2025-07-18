'use client'

import { useState, useRef, DragEvent } from 'react'
import { PhotoIcon, TrashIcon, PlusIcon, XMarkIcon, InformationCircleIcon } from '@heroicons/react/24/outline'
import { ImageData, ImageLayout } from '@/types/image'
import { compressImageToFile } from '@/utils/imageCompression'
import { storageService } from '@/lib/supabase-service'

interface ImageEditorSupabaseProps {
  layouts: ImageLayout[]
  onLayoutsChange: (layouts: ImageLayout[]) => void
  useSupabase?: boolean // Supabaseを使用するかどうか
}

export default function ImageEditorSupabase({ 
  layouts, 
  onLayoutsChange,
  useSupabase = false 
}: ImageEditorSupabaseProps) {
  const [draggedImage, setDraggedImage] = useState<{ layoutId: string; imageId: string } | null>(null)
  const [showGuide, setShowGuide] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // シンプルな画像追加
  const handleSimpleImageAdd = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    
    setIsUploading(true)
    const newImages: ImageData[] = []
    
    // 画像を処理
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      setUploadProgress(`画像を処理中... (${i + 1}/${files.length})`)
      
      try {
        let imageSrc: string
        
        if (useSupabase) {
          // Supabaseにアップロード
          const compressedFile = await compressImageToFile(file, 800, 0.7)
          imageSrc = await storageService.uploadImage(compressedFile)
        } else {
          // LocalStorage用（従来の方法）
          const { compressImage } = await import('@/utils/imageCompression')
          imageSrc = await compressImage(file, 800, 0.7)
        }
        
        const imageData: ImageData = {
          id: Date.now() + i + '',
          src: imageSrc,
          alt: file.name,
          caption: ''
        }
        newImages.push(imageData)
      } catch (error) {
        console.error('画像の処理に失敗しました:', error)
        alert(`画像 ${file.name} の処理に失敗しました`)
      }
    }
    
    if (newImages.length === 0) {
      setIsUploading(false)
      setUploadProgress('')
      return
    }

    // 適切な列数を自動判定
    let columns: 1 | 2 | 3 | 4 = 1
    if (newImages.length === 2) columns = 2
    else if (newImages.length === 3) columns = 3
    else if (newImages.length >= 4) columns = 2 // 4枚以上は2列で表示

    // 既存のレイアウトがない、または最後のレイアウトに画像がある場合は新規作成
    if (layouts.length === 0 || (layouts[layouts.length - 1]?.images.length > 0)) {
      const newLayout: ImageLayout = {
        id: Date.now() + '',
        images: newImages,
        columns: columns,
        position: layouts.length
      }
      onLayoutsChange([...layouts, newLayout])
    } else {
      // 最後のレイアウトが空の場合はそこに追加
      const updatedLayouts = [...layouts]
      const lastLayout = updatedLayouts[updatedLayouts.length - 1]
      lastLayout.images = newImages
      lastLayout.columns = columns
      onLayoutsChange(updatedLayouts)
    }
    
    setIsUploading(false)
    setUploadProgress('')
    setShowGuide(false)
  }

  const deleteImage = async (layoutId: string, imageId: string) => {
    try {
      // Supabaseから画像を削除
      if (useSupabase) {
        const layout = layouts.find(l => l.id === layoutId)
        const image = layout?.images.find(img => img.id === imageId)
        if (image && image.src.includes('supabase')) {
          await storageService.deleteImage(image.src)
        }
      }
      
      const updatedLayouts = layouts.map(layout => 
        layout.id === layoutId 
          ? { ...layout, images: layout.images.filter(img => img.id !== imageId) }
          : layout
      ).filter(layout => layout.images.length > 0) // 空のレイアウトは削除
      
      onLayoutsChange(updatedLayouts)
    } catch (error) {
      console.error('画像の削除に失敗しました:', error)
      alert('画像の削除に失敗しました')
    }
  }

  const updateColumns = (layoutId: string, columns: 1 | 2 | 3 | 4) => {
    const updatedLayouts = layouts.map(layout => 
      layout.id === layoutId ? { ...layout, columns } : layout
    )
    onLayoutsChange(updatedLayouts)
  }

  const updateImageCaption = (layoutId: string, imageId: string, caption: string) => {
    const updatedLayouts = layouts.map(layout => 
      layout.id === layoutId 
        ? {
            ...layout, 
            images: layout.images.map(img => 
              img.id === imageId ? { ...img, caption } : img
            )
          }
        : layout
    )
    onLayoutsChange(updatedLayouts)
  }

  // ドラッグ&ドロップ
  const handleDragStart = (e: DragEvent, layoutId: string, imageId: string) => {
    setDraggedImage({ layoutId, imageId })
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: DragEvent, targetLayoutId: string, targetIndex: number) => {
    e.preventDefault()
    if (!draggedImage) return

    const { layoutId: sourceLayoutId, imageId } = draggedImage
    if (sourceLayoutId === targetLayoutId) return // 同じレイアウト内は無視

    const sourceLayout = layouts.find(l => l.id === sourceLayoutId)
    const image = sourceLayout?.images.find(img => img.id === imageId)
    if (!image) return

    const updatedLayouts = layouts.map(layout => {
      if (layout.id === sourceLayoutId) {
        return {
          ...layout,
          images: layout.images.filter(img => img.id !== imageId)
        }
      } else if (layout.id === targetLayoutId) {
        const newImages = [...layout.images]
        newImages.splice(targetIndex, 0, image)
        return { ...layout, images: newImages }
      }
      return layout
    }).filter(layout => layout.images.length > 0) // 空のレイアウトは削除

    onLayoutsChange(updatedLayouts)
    setDraggedImage(null)
  }

  return (
    <div className="space-y-4">
      {/* ヘッダーとメインボタン */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-[#121416]">画像を追加</h3>
          {useSupabase && (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
              Supabase連携中
            </span>
          )}
        </div>
        <div className="flex gap-2">
          {showGuide && (
            <button
              type="button"
              onClick={() => setShowGuide(false)}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              <XMarkIcon className="w-4 h-4 inline mr-1" />
              ガイドを閉じる
            </button>
          )}
        </div>
      </div>

      {/* 使い方ガイド */}
      {showGuide && layouts.length === 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
          <div className="flex items-start gap-2">
            <InformationCircleIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-1 text-blue-800">
              <p className="font-medium">💡 かんたん画像追加ガイド</p>
              <ul className="space-y-1 ml-4">
                <li>• 下のボタンから画像を選ぶだけ！</li>
                <li>• 複数選択すると自動で並べます</li>
                <li>• あとから並び替えもできます</li>
                {useSupabase && <li>• 画像は自動でクラウドに保存されます</li>}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* メイン画像追加ボタン */}
      <div className="relative">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleSimpleImageAdd(e.target.files)}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className={`w-full py-8 border-2 border-dashed rounded-xl transition-all ${
            isUploading 
              ? 'border-gray-300 bg-gray-50 cursor-not-allowed' 
              : 'border-blue-300 hover:border-blue-400 hover:bg-blue-50 cursor-pointer'
          }`}
        >
          <div className="text-center">
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-3"></div>
                <p className="text-gray-600">{uploadProgress || '画像を処理中...'}</p>
              </>
            ) : (
              <>
                <PhotoIcon className="w-12 h-12 text-blue-500 mx-auto mb-3" />
                <p className="text-lg font-medium text-gray-700">クリックして画像を追加</p>
                <p className="text-sm text-gray-500 mt-1">複数選択できます</p>
              </>
            )}
          </div>
        </button>
      </div>

      {/* 画像プレビューエリア */}
      {layouts.length > 0 && (
        <div className="space-y-6">
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">追加した画像</h4>
          </div>
          
          {layouts.map((layout, layoutIndex) => (
            <div key={layout.id} className="bg-gray-50 rounded-lg p-4">
              {/* 列数変更ボタン（シンプル版） */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-600">
                  {layout.images.length}枚の画像
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">表示列数:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((col) => (
                      <button
                        key={col}
                        type="button"
                        onClick={() => updateColumns(layout.id, col as 1 | 2 | 3 | 4)}
                        className={`px-2 py-1 text-xs rounded transition-all ${
                          layout.columns === col
                            ? 'bg-blue-500 text-white'
                            : 'bg-white text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {col}列
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 画像グリッド */}
              <div className={`grid gap-3 ${
                layout.columns === 1 ? 'grid-cols-1' : 
                layout.columns === 2 ? 'grid-cols-2' : 
                layout.columns === 3 ? 'grid-cols-3' : 
                'grid-cols-4'
              }`}>
                {layout.images.map((image, imageIndex) => (
                  <div
                    key={image.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, layout.id, image.id)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, layout.id, imageIndex)}
                    className="relative group"
                  >
                    <div className="relative overflow-hidden rounded-lg bg-white shadow-sm">
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="w-full h-40 object-cover"
                      />
                      
                      {/* 削除ボタン */}
                      <button
                        type="button"
                        onClick={() => deleteImage(layout.id, image.id)}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                        title="削除"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {/* キャプション */}
                    <input
                      type="text"
                      placeholder="キャプション（省略可）"
                      value={image.caption || ''}
                      onChange={(e) => updateImageCaption(layout.id, image.id, e.target.value)}
                      className="w-full mt-2 px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:border-blue-400"
                    />
                  </div>
                ))}
              </div>

              {/* 追加画像ボタン */}
              <div className="mt-3">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => {
                    const files = e.target.files
                    if (files && files.length > 0) {
                      handleSimpleImageAdd(files)
                    }
                  }}
                  className="hidden"
                  id={`add-more-${layout.id}`}
                />
                <label
                  htmlFor={`add-more-${layout.id}`}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded cursor-pointer transition-colors"
                >
                  <PlusIcon className="w-4 h-4" />
                  さらに画像を追加
                </label>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ヒント */}
      {layouts.length > 0 && (
        <div className="text-xs text-gray-500 text-center">
          💡 画像をドラッグして並び替えることもできます
        </div>
      )}
    </div>
  )
}