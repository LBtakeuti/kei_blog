'use client'

import { useState, useRef } from 'react'
import { PhotoIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline'
import { ImageData, ImageLayout } from '@/types/image'

interface ImageEditorProps {
  layouts: ImageLayout[]
  onLayoutsChange: (layouts: ImageLayout[]) => void
}

export default function ImageEditor({ layouts, onLayoutsChange }: ImageEditorProps) {
  const [draggedItem, setDraggedItem] = useState<{ layoutId: string; imageId: string } | null>(null)
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-[#121416]">画像レイアウト</h3>
        <button
          type="button"
          onClick={addNewLayout}
          className="flex items-center gap-2 px-3 py-2 bg-[#dce7f3] text-[#121416] rounded-lg hover:bg-[#c5d5e8] transition-colors"
        >
          <PlusIcon className="w-4 h-4" />
          レイアウト追加
        </button>
      </div>

      {layouts.map((layout, layoutIndex) => (
        <div key={layout.id} className="border border-[#dde0e3] rounded-xl p-4 bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <span className="font-medium text-[#121416]">レイアウト {layoutIndex + 1}</span>
              <div className="flex items-center gap-2">
                <label className="text-sm text-[#6a7581]">列数:</label>
                <select
                  value={layout.columns}
                  onChange={(e) => updateColumns(layout.id, parseInt(e.target.value) as 1 | 2 | 3 | 4)}
                  className="px-2 py-1 border border-[#dde0e3] rounded text-sm"
                >
                  <option value={1}>1列</option>
                  <option value={2}>2列</option>
                  <option value={3}>3列</option>
                  <option value={4}>4列</option>
                </select>
              </div>
            </div>
            <button
              type="button"
              onClick={() => deleteLayout(layout.id)}
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>

          <div className={`grid gap-4 mb-4 ${layout.columns === 1 ? 'grid-cols-1' : layout.columns === 2 ? 'grid-cols-2' : layout.columns === 3 ? 'grid-cols-3' : 'grid-cols-4'}`}>
            {layout.images.map((image, imageIndex) => (
              <div key={image.id} className="relative group">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => deleteImage(layout.id, image.id)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <TrashIcon className="w-3 h-3" />
                </button>
                <input
                  type="text"
                  placeholder="キャプション（任意）"
                  value={image.caption || ''}
                  onChange={(e) => updateImageCaption(layout.id, image.id, e.target.value)}
                  className="w-full mt-2 px-2 py-1 text-xs border border-[#dde0e3] rounded"
                />
              </div>
            ))}
          </div>

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
              className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-[#dde0e3] rounded-lg cursor-pointer hover:bg-white transition-colors"
            >
              <PhotoIcon className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-[#6a7581]">画像を追加</span>
            </label>
          </div>
        </div>
      ))}

      {layouts.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed border-[#dde0e3] rounded-xl">
          <PhotoIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-[#6a7581] mb-4">画像レイアウトを追加してください</p>
          <button
            type="button"
            onClick={addNewLayout}
            className="px-4 py-2 bg-[#dce7f3] text-[#121416] rounded-lg hover:bg-[#c5d5e8] transition-colors"
          >
            最初のレイアウトを追加
          </button>
        </div>
      )}
    </div>
  )
}