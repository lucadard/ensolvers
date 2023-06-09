import { createContext, useContext, ReactNode, useState, useEffect } from 'react'
import { Category, Note, User } from '../types'
import { getCategories, getNotes } from '../api'
import useLocalStorage from '../hooks/useLocalStorage'
import jwt from 'jwt-decode'

type State = {
  user?: User
  setUserToken: (token: string | undefined) => void
  notes: Note[]
  categories: Category[]
  updateNote: (id: string, data: Partial<Note>, opt?: { delete: boolean }) => void
  addNote: (newNote: Note) => void
  addCategory: (newCategory: Category) => void
}
type DataProviderProps = { children: ReactNode }

const DataStateContext = createContext<State | undefined
>(undefined)

function DataProvider ({ children }: DataProviderProps) {
  const [user, setUser] = useState<User | undefined>(undefined)
  const { storedValue: userToken, setValue: setUserToken } = useLocalStorage<string | undefined>('token', undefined)
  const [notes, setNotes] = useState<Note[]>([])
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    getNotes().then(setNotes).catch(console.error)
    getCategories().then(setCategories).catch(console.error)
  }, [])

  useEffect(() => {
    setUser(userToken ? jwt<User>(userToken) : undefined)
  }, [userToken])

  const value = {
    user,
    setUserToken: (token: string | undefined) => setUserToken(token),
    notes,
    setNotes,
    updateNote: (id: string, data: Partial<Note>, opt?: { delete: boolean }) => {
      setNotes(prev => {
        const noteIndex = prev.findIndex(note => note.id === id)
        const notesCopy = [...prev]
        opt?.delete
          ? notesCopy.splice(noteIndex, 1)
          : notesCopy.splice(noteIndex, 1, { ...prev[noteIndex], ...data })
        return notesCopy
      })
    },
    addNote: (newNote: Note) => {
      setNotes(prev => [...prev, newNote])
    },
    categories,
    setCategories,
    addCategory: (newCategory: Category) => {
      if (categories.some(cat => cat.id === newCategory.id)) return
      setCategories(prev => [...prev, newCategory])
    }
  }
  return (
    <DataStateContext.Provider value={value}>
      {children}
    </DataStateContext.Provider>
  )
}

function useData () {
  const context = useContext(DataStateContext)
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}

export { DataProvider, useData }
