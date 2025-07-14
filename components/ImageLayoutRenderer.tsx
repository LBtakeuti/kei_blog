'use client'

import { ImageLayout } from '@/types/image'

interface ImageLayoutRendererProps {
  layouts: ImageLayout[]
  className?: string
}

export default function ImageLayoutRenderer({ layouts, className = '' }: ImageLayoutRendererProps) {
  if (!layouts || layouts.length === 0) {
    return null
  }

  const getColumnClass = (columns: number) => {
    return columns === 1 ? 'grid-cols-1' : columns === 2 ? 'grid-cols-2' : columns === 3 ? 'grid-cols-3' : 'grid-cols-4'
  }

  return (
    <div className={`space-y-8 ${className}`}>
      {layouts
        .sort((a, b) => a.position - b.position)
        .map((layout) => (
          <div key={layout.id} className="w-full">
            <div className={`grid gap-4 ${getColumnClass(layout.columns)}`}>
              {layout.images.map((image) => (
                <div key={image.id} className="group">
                  <div className="relative overflow-hidden rounded-lg">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  {image.caption && (
                    <p className="mt-2 text-sm text-[#6a7581] text-center italic">
                      {image.caption}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
    </div>
  )
}