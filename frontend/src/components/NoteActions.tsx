import { useState } from 'react'
import { Category, Note } from '../types'
import { editNote, createNote, createCategory, removeCategoryFromNote, addCategoryToNote } from '../api'
import { useLocation } from 'wouter'
import Button from './Button'
import { useData } from '../context/DataContext'

type NoteFormProps = {
  defaultFormData?: Partial<Note>
  // formAction: (newData: Partial<Note>) => void
  formAction: (newData: any) => void // for some reason Pick<Note, 'title' | 'content'>) is not compatible with Partial<Note>
}

function CategoryList ({ noteId, noteCategories = [], setNoteCategories }: { noteId: string, noteCategories?: Category[], setNoteCategories: (newCategories: Category[]) => void }) {
  const { addCategory: cat } = useData()
  const [newCategory, setNewCategory] = useState('')

  const isNoteCreation = !noteId

  async function addCategory (noteId: string, name: string) {
    try {
      const newCategory = await createCategory(name)
      if (!isNoteCreation) await addCategoryToNote(noteId, newCategory.id)
      cat(newCategory)
      setNoteCategories([...noteCategories, newCategory])
      setNewCategory('')
    } catch (err) { console.error(err) }
  }

  async function removeCategory (id: string, categoryId: number) {
    try {
      if (!isNoteCreation) await removeCategoryFromNote(id, categoryId)
      setNoteCategories(noteCategories.filter(cat => cat.id !== categoryId))
    } catch (err) { console.error(err) }
  }

  return (
    <div>
      <ul className='flex flex-wrap gap-3 p-4'>
        {noteCategories.map(category =>
          <li
            key={category.id}
            className='flex w-min gap-2 rounded-full border bg-transparent p-2 px-4 text-lg outline-none'
          >
            <p>🏷️</p>
            <p className='whitespace-nowrap'>{category.name}</p>
            <span
              onClick={async () => await removeCategory(noteId, category.id)}
              className='scale-75 cursor-pointer'
            >╳
            </span>
          </li>)}
      </ul>
      <div className='flex items-center gap-2'>
        <button
          onClick={async () => await addCategory(noteId, newCategory)}
          className='ml-4 grid aspect-square h-10 w-10 place-content-center rounded-full border bg-gray-500/50'
        >
          ➕
        </button>
        <input
          placeholder='Category'
          className='rounded-full border bg-transparent p-2 px-4 text-lg outline-none'
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
      </div>
    </div>

  )
}

function NoteForm ({ defaultFormData, formAction }: NoteFormProps) {
  const { updateNote } = useData()

  const [formData, setFormData] = useState<Partial<Note>>({
    ...defaultFormData
  })

  function handleFormSubmit (e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    formAction(formData)
  }

  return (
    <div className='flex max-h-[500px] flex-col'>
      <input
        className='bg-transparent px-4 py-3 pt-4 text-2xl outline-none'
        value={formData.title ?? ''}
        placeholder='Title'
        autoComplete='off'
        autoFocus
        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
      />
      <textarea
        className='min-h-[100px] resize-none px-4 py-3 text-lg outline-none'
        value={formData.content ?? ''}
        placeholder='Note'
        ref={(e) => {
          if (!e) return
          e.style.height = `${e.scrollHeight}px`
        }}
        onChange={(e) => {
          e.currentTarget.style.height = '100px'
          e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`
          setFormData(prev => ({ ...prev, content: e.target.value }))
        }}
      />
      <CategoryList
        noteId={defaultFormData?.id ?? ''}
        noteCategories={formData?.categories}
        setNoteCategories={(categories: Category[]) => {
          setFormData(prev => {
            defaultFormData?.id && updateNote(defaultFormData?.id, { categories })
            return { ...prev, categories }
          })
        }}
      />
      <div className='mt-auto grid grid-cols-3 items-center p-4'>
        <Button onClick={handleFormSubmit}>{formData.id ? 'Save' : 'Create'}</Button>
        {defaultFormData &&
          <p className='col-span-2 col-start-2 text-end'>
            Last updated: {defaultFormData?.updatedAt?.toLocaleString('en-US')}
          </p>}
      </div>
    </div>
  )
}

export function EditNote ({ data }: { data: Note }) {
  const { updateNote } = useData()

  async function handleEditNote (newFormData: Partial<Note>) {
    try {
      const editedData = await editNote(data.id, newFormData)
      updateNote(data.id, editedData)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <NoteForm
      defaultFormData={data}
      formAction={handleEditNote}
    />
  )
}

export function CreateNote () {
  const { addNote } = useData()
  const [,setLocation] = useLocation()

  async function handleCreateNote (newFormData: Pick<Note, 'title' | 'content' | 'categories'>) {
    try {
      const createdData = await createNote(newFormData)
      addNote(createdData)
    } catch (err) {
      console.error(err)
    }
    setLocation('/')
  }

  return (
    <NoteForm
      formAction={handleCreateNote}
    />
  )
}
