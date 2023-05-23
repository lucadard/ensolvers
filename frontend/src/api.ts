import axios from 'axios'
import { Note } from './types'

axios.defaults.baseURL = 'http://localhost:3000/'

export const getNotes = async (): Promise<Note[]> => {
  const { data } = await axios.get<Note[]>('notes')
  return data
}

export const getNoteById = async (id: string): Promise<Note> => {
  const { data } = await axios.get<Note>(`/${id}`)
  return data
}

export const editNote = async (id: Note['id'], note: Partial<Omit<Note, 'id'>>): Promise<Note> => {
  const { data } = await axios.patch<Note>(`notes/${id}`, { ...note })
  return data
}

export const removeNote = async (id: Note['id']) => {
  const { data } = await axios.delete(`notes/${id}`)
  return data
}

export const createNote = async (note: Partial<Omit<Note, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Note> => {
  const { data } = await axios.post<Note>('notes', note)
  return data
}
