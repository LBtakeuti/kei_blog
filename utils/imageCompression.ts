export async function compressImage(file: File, maxWidth: number = 1200, quality: number = 0.8): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      const img = new Image()
      
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        
        if (!ctx) {
          reject(new Error('Canvas context not available'))
          return
        }
        
        // Calculate new dimensions while maintaining aspect ratio
        let width = img.width
        let height = img.height
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }
        
        canvas.width = width
        canvas.height = height
        
        // Draw and compress image
        ctx.drawImage(img, 0, 0, width, height)
        
        // Convert to compressed format
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const reader = new FileReader()
              reader.onloadend = () => {
                resolve(reader.result as string)
              }
              reader.readAsDataURL(blob)
            } else {
              reject(new Error('Image compression failed'))
            }
          },
          'image/jpeg',
          quality
        )
      }
      
      img.onerror = () => {
        reject(new Error('Image loading failed'))
      }
      
      img.src = e.target?.result as string
    }
    
    reader.onerror = () => {
      reject(new Error('File reading failed'))
    }
    
    reader.readAsDataURL(file)
  })
}

export function calculateStorageSize(data: any): number {
  const jsonString = JSON.stringify(data)
  return new Blob([jsonString]).size
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}