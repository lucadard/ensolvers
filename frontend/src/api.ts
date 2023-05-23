import axios from 'axios'
import { ApiNote, Note } from './types'

axios.defaults.baseURL = 'http://localhost:3000/'

function noteParser (noteData: ApiNote): Note {
  return {
    ...noteData,
    createdAt: new Date(noteData.createdAt),
    updatedAt: new Date(noteData.updatedAt)
  }
}

export const getNotes = async (): Promise<Note[]> => {
  const { data } = await axios.get<ApiNote[]>('notes')
  return data.map(apiNote => noteParser(apiNote))
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
