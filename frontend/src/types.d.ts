export type Note = {
  id: string
  title: string
  content: string
  archieved: boolean
  createdAt: Date
  updatedAt: Date
}

export type ApiNote = {
  id: string
  title: string
  content: string
  archieved: boolean
  createdAt: string
  updatedAt: string
}
