import axios from 'axios'
import { ApiNote, Category, Note } from './types'

axios.defaults.baseURL = import.meta.env.VITE_API_URL

function noteParser (noteData: ApiNote): Note {
  return {
    ...noteData,
    id: noteData.id + '',
    categories: noteData.categories?.map(({ category }) => category) ?? [],
    createdAt: new Date(noteData.createdAt),
    updatedAt: new Date(noteData.updatedAt)
  }
}

export const getNotes = async (): Promise<Note[]> => {
  const { data } = await axios.get<ApiNote[]>('notes')
  return data.map(apiNote => noteParser(apiNote))
}

export const getCategories = async (): Promise<Category[]> => {
  const { data } = await axios.get<Category[]>('categories')
  return data
}

export const getNoteById = async (id: string): Promise<Note> => {
  const { data } = await axios.get<ApiNote>(`/${id}`)
  return noteParser(data)
}

export const editNote = async (id: Note['id'], note: Partial<Omit<Note, 'id'>>): Promise<Note> => {
  const { data } = await axios.patch<ApiNote>(`notes/${id}`, { ...note })
  return noteParser(data)
}

export const removeNote = async (id: Note['id']) => {
  const { data } = await axios.delete(`notes/${id}`)
  return data
}

export const createNote = async (note: Partial<Omit<Note, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Note> => {
  const { data } = await axios.post<ApiNote>('notes', note)
  return noteParser(data)
}

export const createCategory = async (categoryName: string): Promise<Category> => {
  const { data: categoryData } = await axios
    .post<Category>('categories', { name: categoryName })
  return categoryData
}

export const addCategoryToNote = async (noteId: string, categoryId: number): Promise<Note> => {
  const { data: noteData } = await axios
    .patch<ApiNote>('notes/addCategory', { id: noteId, categoryId })
  return noteParser(noteData)
}

export const removeCategoryFromNote = async (noteId: string, categoryId: number): Promise<Note> => {
  const { data: noteData } = await axios
    .patch<ApiNote>('notes/removeCategory', { id: noteId, categoryId })
  return noteParser(noteData)
}

export const sendLogin = async (email: string, password: string): Promise<string | undefined> => {
  try {
    const { data } = await axios.post<{ accessToken: string }>('auth/login', { email, password })
    return data.accessToken
  } catch (err) {
    console.error(err)
    return undefined
  }
}

export const sendSignup = async (email: string, password: string): Promise<string | undefined> => {
  try {
    const { data } = await axios.post<{ accessToken: string }>('auth/signup', { email, password })
    return data.accessToken
  } catch (err) {
    console.error(err)
    return undefined
  }
}
