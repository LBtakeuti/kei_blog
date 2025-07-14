export interface ImageData {
  id: string
  src: string
  alt: string
  caption?: string
}

export interface ImageLayout {
  id: string
  images: ImageData[]
  columns: 1 | 2 | 3 | 4
  position: number // コンテンツ内での位置
}

export interface ContentBlock {
  id: string
  type: 'text' | 'images'
  content: string | ImageLayout
  position: number
}