'use client'

import { useState, useRef } from 'react'
import { PhotoIcon, TrashIcon, PlusIcon, ChevronUpIcon, ChevronDownIcon, EyeIcon } from '@heroicons/react/24/outline'
import { ImageData, ImageLayout } from '@/types/image'

interface ImageEditorProps {
  layouts: ImageLayout[]
  onLayoutsChange: (layouts: ImageLayout[]) => void
}

export default function ImageEditor({ layouts, onLayoutsChange }: ImageEditorProps) {
  const [draggedItem, setDraggedItem] = useState<{ layoutId: string; imageId: string } | null>(null)
  const [previewMode, setPreviewMode] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (files: FileList | null, layoutId?: string) => {
    if (!files) return

    const newImages: ImageData[] = []
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const reader = new FileReader()
      
      await new Promise((resolve) => {
        reader.onloadend = () => {
          const imageData: ImageData = {
            id: Date.now() + i + '',
            src: reader.result as string,
            alt: file.name,
            caption: ''
          }
          newImages.push(imageData)
          resolve(null)
        }
        reader.readAsDataURL(file)
      })
    }

    if (layoutId) {
      // 既存レイアウトに追加
      const updatedLayouts = layouts.map(layout => 
        layout.id === layoutId 
          ? { ...layout, images: [...layout.images, ...newImages] }
          : layout
      )
      onLayoutsChange(updatedLayouts)
    } else {
      // 新しいレイアウトを作成
      const newLayout: ImageLayout = {
        id: Date.now() + '',
        images: newImages,
        columns: 2,
        position: layouts.length
      }
      onLayoutsChange([...layouts, newLayout])
    }
  }

  const addNewLayout = () => {
    const newLayout: ImageLayout = {
      id: Date.now() + '',
      images: [],
      columns: 2,
      position: layouts.length
    }
    onLayoutsChange([...layouts, newLayout])
  }

  const deleteLayout = (layoutId: string) => {
    const updatedLayouts = layouts.filter(layout => layout.id !== layoutId)
    onLayoutsChange(updatedLayouts)
  }

  const deleteImage = (layoutId: string, imageId: string) => {
    const updatedLayouts = layouts.map(layout => 
      layout.id === layoutId 
        ? { ...layout, images: layout.images.filter(img => img.id !== imageId) }
        : layout
    )
    onLayoutsChange(updatedLayouts)
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

  const moveLayout = (fromIndex: number, toIndex: number) => {
    const updatedLayouts = [...layouts]
    const [movedLayout] = updatedLayouts.splice(fromIndex, 1)
    updatedLayouts.splice(toIndex, 0, movedLayout)
    
    // 位置を更新
    const finalLayouts = updatedLayouts.map((layout, index) => ({
      ...layout,
      position: index
    }))
    onLayoutsChange(finalLayouts)
  }

  const moveLayoutUp = (index: number) => {
    if (index > 0) {
      moveLayout(index, index - 1)
    }
  }

  const moveLayoutDown = (index: number) => {
    if (index < layouts.length - 1) {
      moveLayout(index, index + 1)
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h3 className="text-base sm:text-lg font-semibold text-[#121416]">画像レイアウト</h3>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setPreviewMode(!previewMode)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
              previewMode 
                ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <EyeIcon className="w-4 h-4" />
            {previewMode ? 'プレビュー中' : 'プレビュー'}
          </button>
          <button
            type="button"
            onClick={addNewLayout}
            className="flex items-center gap-2 px-3 py-2 bg-[#dce7f3] text-[#121416] rounded-lg hover:bg-[#c5d5e8] transition-colors text-sm"
          >
            <PlusIcon className="w-4 h-4" />
            レイアウト追加
          </button>
        </div>
      </div>

      {layouts.map((layout, layoutIndex) => (
        <div key={layout.id} className={`border border-[#dde0e3] rounded-xl p-3 sm:p-4 ${
          previewMode ? 'bg-white' : 'bg-gray-50'
        }`}>
          {!previewMode && (
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                <span className="font-medium text-[#121416] text-sm sm:text-base">レイアウト {layoutIndex + 1}</span>
                <div className="flex items-center gap-2">
                  <label className="text-xs sm:text-sm text-[#6a7581]">列数:</label>
                  <select
                    value={layout.columns}
                    onChange={(e) => updateColumns(layout.id, parseInt(e.target.value) as 1 | 2 | 3 | 4)}
                    className="px-3 py-1.5 border border-[#dde0e3] rounded-md text-sm bg-white focus:outline-none focus:border-blue-500"
                    style={{ 
                      fontFamily: "'Noto Sans', 'Noto Sans JP', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
                      fontWeight: 500,
                      letterSpacing: '0.025em'
                    }}
                  >
                    <option value={1}>1列</option>
                    <option value={2}>2列</option>
                    <option value={3}>3列</option>
                    <option value={4}>4列</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => moveLayoutUp(layoutIndex)}
                    disabled={layoutIndex === 0}
                    className={`p-1 rounded text-xs ${
                      layoutIndex === 0 
                        ? 'text-gray-300 cursor-not-allowed' 
                        : 'text-gray-600 hover:bg-gray-200'
                    }`}
                    title="上に移動"
                  >
                    <ChevronUpIcon className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveLayoutDown(layoutIndex)}
                    disabled={layoutIndex === layouts.length - 1}
                    className={`p-1 rounded text-xs ${
                      layoutIndex === layouts.length - 1 
                        ? 'text-gray-300 cursor-not-allowed' 
                        : 'text-gray-600 hover:bg-gray-200'
                    }`}
                    title="下に移動"
                  >
                    <ChevronDownIcon className="w-4 h-4" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => deleteLayout(layout.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  title="レイアウトを削除"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          <div className={`grid gap-4 mb-4 ${layout.columns === 1 ? 'grid-cols-1' : layout.columns === 2 ? 'grid-cols-2' : layout.columns === 3 ? 'grid-cols-3' : 'grid-cols-4'}`}>
            {layout.images.map((image, imageIndex) => (
              <div key={image.id} className="relative group">
                <img
                  src={image.src}
                  alt={image.alt}
                  className={`w-full object-cover rounded-lg ${
                    previewMode ? 'h-auto max-h-96' : 'h-32 sm:h-40'
                  }`}
                />
                {!previewMode && (
                  <button
                    type="button"
                    onClick={() => deleteImage(layout.id, image.id)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    title="画像を削除"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                )}
                {image.caption && (
                  <div className="mt-2 text-sm text-gray-600 text-center italic">
                    {image.caption}
                  </div>
                )}
                {!previewMode && (
                  <input
                    type="text"
                    placeholder="キャプション（任意）"
                    value={image.caption || ''}
                    onChange={(e) => updateImageCaption(layout.id, image.id, e.target.value)}
                    className="w-full mt-2 px-3 py-2 text-sm border border-[#dde0e3] rounded-lg focus:outline-none focus:border-blue-500"
                  />
                )}
              </div>
            ))}
          </div>

          {!previewMode && (
            <div className="flex justify-center">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleFileChange(e.target.files, layout.id)}
                className="hidden"
                id={`image-upload-${layout.id}`}
              />
              <label
                htmlFor={`image-upload-${layout.id}`}
                className="flex items-center gap-2 px-6 py-3 border-2 border-dashed border-[#dde0e3] rounded-lg cursor-pointer hover:bg-white hover:border-blue-300 transition-colors"
              >
                <PhotoIcon className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-[#6a7581] font-medium">画像を追加</span>
              </label>
            </div>
          )}
        </div>
      ))}

      {layouts.length === 0 && !previewMode && (
        <div className="text-center py-12 border-2 border-dashed border-[#dde0e3] rounded-xl bg-gray-50">
          <PhotoIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-[#121416] mb-2">画像レイアウトを追加</h4>
          <p className="text-[#6a7581] mb-6">記事に画像を追加してレイアウトを作成しましょう</p>
          <button
            type="button"
            onClick={addNewLayout}
            className="px-6 py-3 bg-[#dce7f3] text-[#121416] rounded-lg hover:bg-[#c5d5e8] transition-colors font-medium"
          >
            最初のレイアウトを追加
          </button>
        </div>
      )}

      {previewMode && layouts.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          画像レイアウトがまだありません
        </div>
      )}
    </div>
  )
}