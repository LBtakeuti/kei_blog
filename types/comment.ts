export interface Comment {
  id: number
  postId: number
  author: string
  content: string
  date: string
  email?: string
}