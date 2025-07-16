'use client'

import { useState, useRef, DragEvent } from 'react'
import { PhotoIcon, TrashIcon, PlusIcon, Squares2X2Icon, RectangleGroupIcon, ViewColumnsIcon, SquaresPlusIcon } from '@heroicons/react/24/outline'
import { ImageData, ImageLayout } from '@/types/image'
import { compressImage } from '@/utils/imageCompression'

interface ImageEditorProps {
  layouts: ImageLayout[]
  onLayoutsChange: (layouts: ImageLayout[]) => void
}

// レイアウトテンプレート
const LAYOUT_TEMPLATES = [
  { id: '1col', name: '1列', columns: 1 as const, icon: RectangleGroupIcon },
  { id: '2col', name: '2列', columns: 2 as const, icon: ViewColumnsIcon },
  { id: '3col', name: '3列', columns: 3 as const, icon: Squares2X2Icon },
  { id: '4col', name: '4列', columns: 4 as const, icon: SquaresPlusIcon },
]

export default function ImageEditor({ layouts, onLayoutsChange }: ImageEditorProps) {
  const [draggedImage, setDraggedImage] = useState<{ layoutId: string; imageId: string } | null>(null)
  const [draggedOverLayout, setDraggedOverLayout] = useState<string | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<typeof LAYOUT_TEMPLATES[0] | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (files: FileList | null, layoutId?: string) => {
    if (!files) return

    const newImages: ImageData[] = []
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      
      try {
        // 画像を圧縮
        const compressedSrc = await compressImage(file, 800, 0.7)
        
        const imageData: ImageData = {
          id: Date.now() + i + '',
          src: compressedSrc,
          alt: file.name,
          caption: ''
        }
        newImages.push(imageData)
      } catch (error) {
        console.error('画像の圧縮に失敗しました:', error)
        alert(`画像 ${file.name} の処理に失敗しました`)
      }
    }

    if (layoutId) {
      // 既存レイアウトに追加
      const updatedLayouts = layouts.map(layout => 
        layout.id === layoutId 
          ? { ...layout, images: [...layout.images, ...newImages] }
          : layout
      )
      onLayoutsChange(updatedLayouts)
    } else if (selectedTemplate) {
      // 新しいレイアウトを作成
      const newLayout: ImageLayout = {
        id: Date.now() + '',
        images: newImages,
        columns: selectedTemplate.columns,
        position: layouts.length
      }
      onLayoutsChange([...layouts, newLayout])
      setSelectedTemplate(null)
    }
  }

  const addNewLayout = (template: typeof LAYOUT_TEMPLATES[0]) => {
    setSelectedTemplate(template)
    fileInputRef.current?.click()
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

  // ドラッグ&ドロップハンドラー
  const handleDragStart = (e: DragEvent, layoutId: string, imageId: string) => {
    setDraggedImage({ layoutId, imageId })
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDragEnter = (layoutId: string) => {
    setDraggedOverLayout(layoutId)
  }

  const handleDragLeave = () => {
    setDraggedOverLayout(null)
  }

  const handleDrop = (e: DragEvent, targetLayoutId: string, targetIndex?: number) => {
    e.preventDefault()
    if (!draggedImage) return

    const { layoutId: sourceLayoutId, imageId } = draggedImage

    // 画像を取得
    const sourceLayout = layouts.find(l => l.id === sourceLayoutId)
    const image = sourceLayout?.images.find(img => img.id === imageId)
    if (!image) return

    // 画像を移動
    const updatedLayouts = layouts.map(layout => {
      if (layout.id === sourceLayoutId) {
        // ソースから削除
        return {
          ...layout,
          images: layout.images.filter(img => img.id !== imageId)
        }
      } else if (layout.id === targetLayoutId) {
        // ターゲットに追加
        const newImages = [...layout.images]
        if (targetIndex !== undefined) {
          newImages.splice(targetIndex, 0, image)
        } else {
          newImages.push(image)
        }
        return { ...layout, images: newImages }
      }
      return layout
    })

    onLayoutsChange(updatedLayouts)
    setDraggedImage(null)
    setDraggedOverLayout(null)
  }

  const handleLayoutDrop = (e: DragEvent, fromIndex: number, toIndex: number) => {
    e.preventDefault()
    if (fromIndex === toIndex) return

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
      {/* ヘッダー部分 */}
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold text-[#121416]">画像レイアウト</h3>
        
        {/* レイアウトテンプレート選択 */}
        <div className="flex flex-wrap gap-3">
          <span className="text-sm text-[#6a7581] self-center">レイアウトを追加:</span>
          {LAYOUT_TEMPLATES.map((template) => {
            const Icon = template.icon
            return (
              <button
                key={template.id}
                type="button"
                onClick={() => addNewLayout(template)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-[#dde0e3] rounded-lg hover:bg-gray-50 hover:border-blue-400 transition-all group"
              >
                <Icon className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
                <span className="text-sm font-medium">{template.name}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* レイアウト一覧 */}
      <div className="space-y-4">
        {layouts.map((layout, layoutIndex) => (
          <div
            key={layout.id}
            className={`border-2 rounded-xl p-4 transition-all ${
              draggedOverLayout === layout.id 
                ? 'border-blue-400 bg-blue-50' 
                : 'border-[#dde0e3] bg-white'
            }`}
            onDragOver={handleDragOver}
            onDragEnter={() => handleDragEnter(layout.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, layout.id)}
          >
            {/* レイアウトヘッダー */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-600">
                  レイアウト {layoutIndex + 1}
                </span>
                
                {/* 列数変更ボタン */}
                <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                  {LAYOUT_TEMPLATES.map((template) => {
                    const Icon = template.icon
                    return (
                      <button
                        key={template.id}
                        type="button"
                        onClick={() => updateColumns(layout.id, template.columns)}
                        className={`p-1.5 rounded transition-all ${
                          layout.columns === template.columns
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                        title={template.name}
                      >
                        <Icon className="w-4 h-4" />
                      </button>
                    )
                  })}
                </div>
              </div>

              <button
                type="button"
                onClick={() => deleteLayout(layout.id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="レイアウトを削除"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>

            {/* 画像グリッド */}
            <div className={`grid gap-3 mb-3 ${
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
                  className="relative group cursor-move"
                >
                  <div className="relative overflow-hidden rounded-lg bg-gray-100">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all" />
                    
                    {/* 削除ボタン */}
                    <button
                      type="button"
                      onClick={() => deleteImage(layout.id, image.id)}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                      title="画像を削除"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                    
                    {/* ドラッグインジケーター */}
                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium">
                        ドラッグして移動
                      </div>
                    </div>
                  </div>
                  
                  {/* キャプション入力 */}
                  <input
                    type="text"
                    placeholder="キャプションを追加..."
                    value={image.caption || ''}
                    onChange={(e) => updateImageCaption(layout.id, image.id, e.target.value)}
                    className="w-full mt-2 px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 transition-colors"
                  />
                </div>
              ))}

              {/* 画像追加ボタン */}
              <div className="relative">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleFileChange(e.target.files, layout.id)}
                  className="hidden"
                  id={`add-image-${layout.id}`}
                />
                <label
                  htmlFor={`add-image-${layout.id}`}
                  className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all group"
                >
                  <PlusIcon className="w-8 h-8 text-gray-400 group-hover:text-blue-500" />
                  <span className="mt-2 text-sm text-gray-500 group-hover:text-blue-600">
                    画像を追加
                  </span>
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 空の状態 */}
      {layouts.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
          <PhotoIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-700 mb-2">
            画像レイアウトを作成しましょう
          </h4>
          <p className="text-sm text-gray-500 mb-6">
            上のテンプレートから選んで、記事に画像を追加できます
          </p>
        </div>
      )}

      {/* 隠しファイル入力 */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => handleFileChange(e.target.files)}
        className="hidden"
      />
    </div>
  )
}