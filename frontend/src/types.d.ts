export type Note = {
  id: string
  title: string
  content: string
  archieved: boolean
  createdAt: Date
  updatedAt: Date
  categories: Category[]
}

type Category = {
  id: number
  name: string
}

type User = {
  id: string
  email: string
}

export type ApiNote = {
  id: string
  title: string
  content: string
  archieved: boolean
  createdAt: string
  updatedAt: string
  categories: Array<{ category: Category }>
}
